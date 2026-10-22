/** Fire-and-forget tracking calls that only exist on the Neon backend. Local mode does nothing. */
import { store } from "./store";

const live = () => process.env.NEXT_PUBLIC_DATA_BACKEND !== "local" && typeof window !== "undefined";

function send(path: string, method: string, body?: unknown) {
  if (!live()) return Promise.resolve();
  return fetch(`/api/${path}`, {
    method,
    headers: { "content-type": "application/json", "x-visitor-id": store.visitorId() },
    body: body === undefined ? undefined : JSON.stringify(body),
    keepalive: true,
  }).then(() => undefined, () => undefined);
}

export const recordPageView = (path: string, referrer: string | null, utmSource: string | null) => send("page-views", "POST", { path, referrer, utmSource });
export const markInternal = (on: boolean) => send("internal", on ? "POST" : "DELETE");
