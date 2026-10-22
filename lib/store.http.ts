/**
 * The DataStore backed by the Next.js API routes (which talk to Neon).
 * Identity is the same anonymous visitor id the local store used, sent as a header.
 */
import type { DataStore, DropAlert, Member, Subscriber, WaitlistEntry } from "./store";
import { STORE_KEYS } from "./keys";
import type { Ga4Payload } from "./analytics";

const VISITOR_HEADER = "x-visitor-id";

const hasWindow = () => typeof window !== "undefined" && !!window.localStorage;

function visitorId(): string {
  if (!hasWindow()) return "server";
  let id = window.localStorage.getItem(STORE_KEYS.visitor);
  if (!id) {
    id = `v_${crypto.randomUUID()}`;
    window.localStorage.setItem(STORE_KEYS.visitor, id);
  }
  return id;
}

function remember(email: string) {
  if (hasWindow()) window.localStorage.setItem(STORE_KEYS.email, email.trim().toLowerCase());
}

function changed() {
  if (hasWindow()) window.dispatchEvent(new CustomEvent("tj:store"));
}

export class StoreError extends Error {}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/${path}`, {
    ...init,
    headers: { "content-type": "application/json", [VISITOR_HEADER]: visitorId(), ...(init.headers ?? {}) },
  });
  const body = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok) throw new StoreError(body?.error ?? `Request failed (${res.status})`);
  return body as T;
}

const post = <T>(path: string, data: unknown) => call<T>(path, { method: "POST", body: JSON.stringify(data) });

export const httpStore: DataStore = {
  visitorId,
  knownEmail: () => (hasWindow() ? window.localStorage.getItem(STORE_KEYS.email) : null),
  forgetEmail: () => {
    if (hasWindow()) {
      window.localStorage.removeItem(STORE_KEYS.email);
      changed();
    }
  },

  subscribers: {
    async add(input) {
      const row = await post<Subscriber>("subscribers", input);
      remember(row.email);
      changed();
      return row;
    },
    list: () => call<Subscriber[]>("subscribers"),
    isSubscribed: async () => (await call<{ subscribed: boolean }>("subscribers?mine=1")).subscribed,
  },

  dropAlerts: {
    async add(input) {
      const row = await post<DropAlert>("drop-alerts", input);
      remember(row.email);
      changed();
      return row;
    },
    list: () => call<DropAlert[]>("drop-alerts"),
    mine: () => call<string[]>("drop-alerts?mine=1"),
    countFor: async (dropId, storeId) => (await call<{ count: number }>(`drop-alerts?count=${encodeURIComponent(dropId)}${storeId ? `&store=${encodeURIComponent(storeId)}` : ""}`)).count,
  },

  members: {
    async create(input) {
      const row = await post<Member>("members", input);
      remember(row.email);
      changed();
      return row;
    },
    list: () => call<Member[]>("members"),
    current: () => call<Member | null>("members?mine=1"),
    async forgetCurrent() {
      await call("members?mine=1", { method: "DELETE" });
      changed();
    },
  },

  waitlist: {
    async join(input) {
      const row = await post<WaitlistEntry>("waitlist", input);
      remember(row.email);
      changed();
      return row;
    },
    list: () => call<WaitlistEntry[]>("waitlist"),
    countFor: async (storeId) => (await call<{ count: number }>(`waitlist?count=${encodeURIComponent(storeId)}`)).count,
    mine: () => call<string[]>("waitlist?mine=1"),
    position: async (storeId) => (await call<{ position: number | null }>(`waitlist?position=${encodeURIComponent(storeId)}`)).position,
  },

  events: {
    async add(payload: Ga4Payload) {
      const e = payload.events[0];
      // Fire and forget: analytics must never block or break a conversion.
      post("events", { name: e.name, sessionId: e.params.session_id, page: e.params.page_location, params: e.params, utmSource: e.params.utm_source ?? null }).catch(() => {});
    },
    list: (scope) => call<Ga4Payload[]>(scope === "mine" ? "events?mine=1" : "events"),
    async clear() {
      await call("events?mine=1", { method: "DELETE" });
      changed();
    },
  },

  async reset(token) {
    await call(`reset?token=${encodeURIComponent(token ?? "")}`, { method: "POST" });
    if (hasWindow()) window.localStorage.removeItem(STORE_KEYS.email);
    changed();
  },
};
