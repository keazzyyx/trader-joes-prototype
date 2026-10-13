/**
 * The data layer. Components only ever talk to `store` (and the types below).
 * Two implementations satisfy `DataStore`: `localStore` (this file, localStorage, for
 * offline dev and tests) and `httpStore` (lib/store.http.ts, the API routes backed by Neon).
 * `NEXT_PUBLIC_DATA_BACKEND=local` picks the local one; the default is Neon.
 */
import { SEED } from "./seed";
import { STORE_KEYS } from "./keys";
import type { Ga4Payload } from "./analytics";

export type Source = "hero" | "drawer" | "band" | "drops" | "crew-club" | "delivery" | "footer";

export type Subscriber = { id: string; email: string; source: Source; createdAt: string; visitorId: string };
export type DropAlert = { id: string; dropId: string; email: string; createdAt: string; visitorId: string };
export type Member = {
  id: string;
  memberNumber: string;
  email: string;
  birthMonth: number | null;
  storeId: string;
  categories: string[];
  createdAt: string;
  visitorId: string;
};
export type WaitlistEntry = { id: string; storeId: string; email: string; createdAt: string; visitorId: string };

export type NewSubscriber = Pick<Subscriber, "email" | "source">;
export type NewDropAlert = Pick<DropAlert, "dropId" | "email">;
export type NewMember = Pick<Member, "email" | "birthMonth" | "storeId" | "categories">;
export type NewWaitlistEntry = Pick<WaitlistEntry, "storeId" | "email">;

export interface DataStore {
  /** Stable anonymous id for this browser. Becomes the auth user id with Supabase. */
  visitorId(): string;
  /** The email this visitor has given us most recently, for prefilling forms. */
  knownEmail(): string | null;

  subscribers: {
    add(input: NewSubscriber): Promise<Subscriber>;
    list(): Promise<Subscriber[]>;
    isSubscribed(): Promise<boolean>;
  };
  dropAlerts: {
    add(input: NewDropAlert): Promise<DropAlert>;
    list(): Promise<DropAlert[]>;
    /** Drop ids this visitor has alerts for. */
    mine(): Promise<string[]>;
    countFor(dropId: string): Promise<number>;
  };
  members: {
    create(input: NewMember): Promise<Member>;
    list(): Promise<Member[]>;
    /** This visitor’s membership, if they finished Crew Club signup. */
    current(): Promise<Member | null>;
    forgetCurrent(): Promise<void>;
  };
  waitlist: {
    join(input: NewWaitlistEntry): Promise<WaitlistEntry>;
    list(): Promise<WaitlistEntry[]>;
    countFor(storeId: string): Promise<number>;
    /** Store ids this visitor has joined. */
    mine(): Promise<string[]>;
  };
  events: {
    /** Records a tracked event. Must never throw into the caller. */
    add(payload: Ga4Payload): Promise<void>;
    /** Newest first. "mine" is this visitor; "all" is everyone (the /debug funnel). */
    list(scope: "mine" | "all"): Promise<Ga4Payload[]>;
    /** Forgets this visitor's events. */
    clear(): Promise<void>;
  };
  /** Wipes everything. The Neon store requires the RESET_TOKEN; the local store reseeds demo data. */
  reset(token?: string): Promise<void>;
}

/* ---------- localStorage implementation ---------- */

const KEYS = STORE_KEYS;

const hasWindow = () => typeof window !== "undefined" && !!window.localStorage;

function read<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("tj:store", { detail: { key } }));
  } catch {
    /* Private mode or full storage: the demo keeps working in memory for this page view. */
  }
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const normalize = (email: string) => email.trim().toLowerCase();

function ensureSeeded() {
  if (!hasWindow() || window.localStorage.getItem(KEYS.seeded)) return;
  write(KEYS.subscribers, SEED.subscribers);
  write(KEYS.dropAlerts, SEED.dropAlerts);
  write(KEYS.members, SEED.members);
  write(KEYS.waitlist, SEED.waitlist);
  window.localStorage.setItem(KEYS.seeded, new Date().toISOString());
}

function table<T>(key: string): T[] {
  ensureSeeded();
  return read<T[]>(key, []);
}

function visitorId(): string {
  if (!hasWindow()) return "server";
  let id = window.localStorage.getItem(KEYS.visitor);
  if (!id) {
    id = `v_${uid()}`;
    window.localStorage.setItem(KEYS.visitor, id);
  }
  return id;
}

function remember(email: string) {
  if (hasWindow()) window.localStorage.setItem(KEYS.email, normalize(email));
}

function memberNumber(existing: Member[]) {
  const n = 41_200 + existing.length * 7 + Math.floor(Math.random() * 7);
  const year = new Date().getFullYear().toString().slice(2);
  return `CC-${year}-${n.toString().padStart(6, "0")}`;
}

export const localStore: DataStore = {
  visitorId,
  knownEmail: () => (hasWindow() ? window.localStorage.getItem(KEYS.email) : null),

  subscribers: {
    async add({ email, source }) {
      const rows = table<Subscriber>(KEYS.subscribers);
      const e = normalize(email);
      const existing = rows.find((r) => r.email === e);
      remember(e);
      if (existing) return existing;
      const row: Subscriber = { id: uid(), email: e, source, createdAt: new Date().toISOString(), visitorId: visitorId() };
      write(KEYS.subscribers, [row, ...rows]);
      return row;
    },
    async list() {
      return table<Subscriber>(KEYS.subscribers);
    },
    async isSubscribed() {
      const me = visitorId();
      return table<Subscriber>(KEYS.subscribers).some((r) => r.visitorId === me);
    },
  },

  dropAlerts: {
    async add({ dropId, email }) {
      const rows = table<DropAlert>(KEYS.dropAlerts);
      const e = normalize(email);
      remember(e);
      const existing = rows.find((r) => r.dropId === dropId && r.email === e);
      if (existing) return existing;
      const row: DropAlert = { id: uid(), dropId, email: e, createdAt: new Date().toISOString(), visitorId: visitorId() };
      write(KEYS.dropAlerts, [row, ...rows]);
      return row;
    },
    async list() {
      return table<DropAlert>(KEYS.dropAlerts);
    },
    async mine() {
      const me = visitorId();
      return table<DropAlert>(KEYS.dropAlerts)
        .filter((r) => r.visitorId === me)
        .map((r) => r.dropId);
    },
    async countFor(dropId) {
      return table<DropAlert>(KEYS.dropAlerts).filter((r) => r.dropId === dropId).length;
    },
  },

  members: {
    async create(input) {
      const rows = table<Member>(KEYS.members);
      const row: Member = {
        ...input,
        email: normalize(input.email),
        id: uid(),
        memberNumber: memberNumber(rows),
        createdAt: new Date().toISOString(),
        visitorId: visitorId(),
      };
      remember(row.email);
      write(KEYS.members, [row, ...rows.filter((r) => r.visitorId !== row.visitorId)]);
      return row;
    },
    async list() {
      return table<Member>(KEYS.members);
    },
    async current() {
      const me = visitorId();
      return table<Member>(KEYS.members).find((r) => r.visitorId === me) ?? null;
    },
    async forgetCurrent() {
      const me = visitorId();
      write(
        KEYS.members,
        table<Member>(KEYS.members).filter((r) => r.visitorId !== me),
      );
    },
  },

  waitlist: {
    async join({ storeId, email }) {
      const rows = table<WaitlistEntry>(KEYS.waitlist);
      const e = normalize(email);
      remember(e);
      const existing = rows.find((r) => r.storeId === storeId && r.email === e);
      if (existing) return existing;
      const row: WaitlistEntry = { id: uid(), storeId, email: e, createdAt: new Date().toISOString(), visitorId: visitorId() };
      write(KEYS.waitlist, [row, ...rows]);
      return row;
    },
    async list() {
      return table<WaitlistEntry>(KEYS.waitlist);
    },
    async countFor(storeId) {
      return table<WaitlistEntry>(KEYS.waitlist).filter((r) => r.storeId === storeId).length;
    },
    async mine() {
      const me = visitorId();
      return table<WaitlistEntry>(KEYS.waitlist)
        .filter((r) => r.visitorId === me)
        .map((r) => r.storeId);
    },
  },

  events: {
    async add(payload) {
      const log = read<Ga4Payload[]>(KEYS.events, []);
      write(KEYS.events, [payload, ...log].slice(0, 500));
    },
    async list(scope) {
      const log = read<Ga4Payload[]>(KEYS.events, []);
      return scope === "mine" ? log.filter((p) => p.client_id === visitorId()) : log;
    },
    async clear() {
      write(KEYS.events, []);
    },
  },

  async reset() {
    if (!hasWindow()) return;
    for (const k of [KEYS.subscribers, KEYS.dropAlerts, KEYS.members, KEYS.waitlist, KEYS.seeded, KEYS.email, KEYS.events]) {
      window.localStorage.removeItem(k);
    }
    ensureSeeded();
  },
};

import { httpStore } from "./store.http";

/** The one import components use. */
export const store: DataStore = process.env.NEXT_PUBLIC_DATA_BACKEND === "local" ? localStore : httpStore;

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
