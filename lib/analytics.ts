/**
 * Conversion tracking. `track()` builds a GA4 Measurement Protocol-shaped payload,
 * logs it, pushes a gtag-style object onto window.dataLayer, and hands it to the
 * data layer (Neon in production, localStorage in local mode) so /debug can replay
 * the funnel in class. Add a gtag() call or a Measurement Protocol POST here later.
 */
import { store } from "./store";

export type TrackEvent =
  | "flyer_signup_submitted"
  | "drop_alert_set"
  | "crew_club_completed"
  | "delivery_waitlist_joined"
  | "shelf_section_viewed"
  | "cta_drawer_opened"
  | "crew_cta_clicked";

export type TrackParams = Record<string, string | number | boolean | string[] | null | undefined>;

export type Ga4Payload = {
  client_id: string;
  timestamp_micros: number;
  events: { name: TrackEvent; params: TrackParams & { session_id: string; engagement_time_msec: number; page_location: string; page_title: string } }[];
};

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
  store.events.add(payload).catch(() => {}).finally(() => window.dispatchEvent(new CustomEvent("tj:track", { detail: payload })));
  return payload;
}
