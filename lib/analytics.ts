/**
 * Conversion tracking. `track()` builds a GA4 Measurement Protocol-shaped payload,
 * logs it, pushes a gtag-style object onto window.dataLayer, and keeps a local
 * log so /debug can replay the funnel in class. Swap the console.log for a real
 * `fetch("https://www.google-analytics.com/mp/collect?...")` or gtag() later.
 */
import { store } from "./store";

export type TrackEvent =
  | "flyer_signup_submitted"
  | "drop_alert_set"
  | "crew_club_completed"
  | "delivery_waitlist_joined"
  | "shelf_section_viewed"
  | "cta_drawer_opened";

export type TrackParams = Record<string, string | number | boolean | string[] | null | undefined>;

export type Ga4Payload = {
  client_id: string;
  timestamp_micros: number;
  events: { name: TrackEvent; params: TrackParams & { session_id: string; engagement_time_msec: number; page_location: string; page_title: string } }[];
};

const LOG_KEY = "tj.events";
const SESSION_KEY = "tj.session";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function sessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Math.floor(Date.now() / 1000).toString();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function track(event: TrackEvent, props: TrackParams = {}): Ga4Payload | null {
  if (typeof window === "undefined") return null;
  const payload: Ga4Payload = {
    client_id: store.visitorId(),
    timestamp_micros: Date.now() * 1000,
    events: [
      {
        name: event,
        params: {
          ...props,
          session_id: sessionId(),
          engagement_time_msec: Math.round(performance.now()),
          page_location: window.location.href,
          page_title: document.title,
        },
      },
    ],
  };

  console.log(`[track] ${event}`, payload);
  (window.dataLayer ??= []).push({ event, ...props });

  try {
    const log = readEventLog();
    localStorage.setItem(LOG_KEY, JSON.stringify([payload, ...log].slice(0, 500)));
    window.dispatchEvent(new CustomEvent("tj:track", { detail: payload }));
  } catch {
    /* storage full or blocked; the console line above still fires */
  }
  return payload;
}

export function readEventLog(): Ga4Payload[] {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) ?? "[]") as Ga4Payload[];
  } catch {
    return [];
  }
}

export function clearEventLog() {
  localStorage.removeItem(LOG_KEY);
  window.dispatchEvent(new CustomEvent("tj:track"));
}
