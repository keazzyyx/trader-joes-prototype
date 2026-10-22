/** Small remembered preferences, browser-local. Not identity, not analytics. */
const STORE_KEY = "tj.store";
const hasWindow = () => typeof window !== "undefined";

export function knownStore(): string | null {
  if (!hasWindow()) return null;
  try {
    return localStorage.getItem(STORE_KEY);
  } catch {
    return null;
  }
}

export function rememberStore(storeId: string) {
  if (!hasWindow()) return;
  try {
    localStorage.setItem(STORE_KEY, storeId);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("tj:store"));
}
