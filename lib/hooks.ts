"use client";
import { useEffect, useState } from "react";

/** Fixed at build time so server HTML and the first client render agree. */
export const BUILD_TIME = new Date(process.env.NEXT_PUBLIC_BUILD_TIME ?? "2026-09-24T17:00:00Z");

/** Current time on the client, ticking every `intervalMs`. Starts at BUILD_TIME to keep hydration stable. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date>(BUILD_TIME);
  const [live, setLive] = useState(false);
  useEffect(() => {
    setNow(new Date());
    setLive(true);
    if (!intervalMs) return;
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return { now, live };
}

/**
 * Reads async store data and re-reads whenever the store changes (in this tab or another).
 * Returns `undefined` until the first read resolves.
 */
export function useStoreValue<T>(read: () => Promise<T>, deps: unknown[] = []) {
  const [value, setValue] = useState<T | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    const load = () => read().then((v) => alive && setValue(v));
    load();
    const onChange = () => load();
    window.addEventListener("tj:store", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      alive = false;
      window.removeEventListener("tj:store", onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}
