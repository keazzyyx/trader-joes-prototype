/**
 * The data layer. Components only ever talk to `store` (and the types below),
 * never to localStorage directly. To move to Supabase, write another object that
 * satisfies `DataStore` and export it instead; see README "Swapping the data layer".
 */
import { SEED } from "./seed";

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
  /** Wipes everything and reseeds the demo data. */
  reset(): Promise<void>;
}

/* ---------- localStorage implementation ---------- */

const KEYS = {
  visitor: "tj.visitor",
  email: "tj.email",
  subscribers: "tj.subscribers",
  dropAlerts: "tj.dropAlerts",
  members: "tj.members",
  waitlist: "tj.waitlist",
  seeded: "tj.seeded.v1",
} as const;

export const STORE_KEYS = KEYS;

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

  async reset() {
    if (!hasWindow()) return;
    for (const k of [KEYS.subscribers, KEYS.dropAlerts, KEYS.members, KEYS.waitlist, KEYS.seeded, KEYS.email]) {
      window.localStorage.removeItem(k);
    }
    ensureSeeded();
  },
};

/** The one import components use. Swap this line to change backends. */
export const store: DataStore = localStore;

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
