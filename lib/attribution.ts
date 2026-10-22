/** Client-side attribution: where this visitor came from, and whether this browser is one of ours. */
const UTM_KEY = "tj.utm_source";
const INTERNAL_KEY = "tj.internal";

const hasWindow = () => typeof window !== "undefined";

/** Reads ?utm_source= from the URL once per visit and remembers it for the rest of the session. */
export function captureUtm(search: string) {
  if (!hasWindow()) return null;
  const utm = new URLSearchParams(search).get("utm_source")?.trim().toLowerCase().slice(0, 60) || null;
  try {
    if (utm) sessionStorage.setItem(UTM_KEY, utm);
    return utm ?? sessionStorage.getItem(UTM_KEY);
  } catch {
    return utm;
  }
}

export function utmSource(): string | null {
  if (!hasWindow()) return null;
  try {
    return sessionStorage.getItem(UTM_KEY);
  } catch {
    return null;
  }
}

export function isInternal(): boolean {
  if (!hasWindow()) return false;
  try {
    return localStorage.getItem(INTERNAL_KEY) === "1";
  } catch {
    return false;
  }
}

export function setInternal(on: boolean) {
  if (!hasWindow()) return;
  try {
    if (on) localStorage.setItem(INTERNAL_KEY, "1");
    else localStorage.removeItem(INTERNAL_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("tj:internal"));
}

/** Referrer domain, or null for direct and same-site navigation. */
export function referrerDomain(): string | null {
  if (!hasWindow() || !document.referrer) return null;
  try {
    const host = new URL(document.referrer).hostname;
    return host === window.location.hostname ? null : host;
  } catch {
    return null;
  }
}
