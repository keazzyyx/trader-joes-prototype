"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { store } from "@/lib/store";
import { WipeLink } from "./Wipe";

const DEMO_KEY = "tj.demo";
const INSIGHTS_KEY = "tj.sawInsights";
const hasWindow = () => typeof window !== "undefined";

export const isDemo = () => hasWindow() && localStorage.getItem(DEMO_KEY) === "1";
export function setDemo(on: boolean) {
  if (!hasWindow()) return;
  if (on) localStorage.setItem(DEMO_KEY, "1");
  else localStorage.removeItem(DEMO_KEY);
  window.dispatchEvent(new CustomEvent("tj:demo"));
}

const STEPS = [
  { n: 1, label: "Sign up", href: "/" },
  { n: 2, label: "Set a drop alert", href: "/drops" },
  { n: 3, label: "Join the Crew", href: "/crew-club" },
  { n: 4, label: "Join the waitlist", href: "/delivery" },
  { n: 5, label: "See it in Insights", href: "/insights" },
];

/** With ?demo=1: a slim bar pinned to the bottom with the five demo steps, ticking off as this browser completes them. */
export function DemoBar() {
  const pathname = usePathname();
  const [on, setOn] = useState(false);
  const [done, setDone] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    const sync = () => setOn(isDemo());
    sync();
    window.addEventListener("tj:demo", sync);
    return () => window.removeEventListener("tj:demo", sync);
  }, []);

  useEffect(() => {
    if (pathname === "/insights" && hasWindow()) localStorage.setItem(INSIGHTS_KEY, "1");
  }, [pathname]);

  useEffect(() => {
    if (!on) return;
    let alive = true;
    const check = async () => {
      const [sub, alerts, member, wait] = await Promise.all([store.subscribers.isSubscribed(), store.dropAlerts.mine(), store.members.current(), store.waitlist.mine()]);
      if (alive) setDone([sub, alerts.length > 0, !!member, wait.length > 0, localStorage.getItem(INSIGHTS_KEY) === "1"]);
    };
    check();
    window.addEventListener("tj:store", check);
    return () => {
      alive = false;
      window.removeEventListener("tj:store", check);
    };
  }, [on, pathname]);

  // Reserve room at the bottom of the page while the bar is pinned.
  useEffect(() => {
    document.body.style.paddingBottom = on ? "52px" : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [on]);

  if (!on) return null;
  return (
    <nav aria-label="Demo steps" className="fixed inset-x-0 bottom-0 z-[85] bg-ink text-cream">
      <ol className="no-scrollbar flex items-center gap-4 overflow-x-auto px-3 py-2 sm:justify-center sm:gap-8 sm:px-6">
        {STEPS.map((s, i) => (
          <li key={s.n} className="shrink-0">
            <WipeLink href={s.href} className={`display inline-flex min-h-9 items-center gap-1.5 text-[15px] leading-none sm:text-[18px] ${done[i] ? "text-yellow" : pathname === s.href ? "text-cream" : "text-cream/60 hover:text-cream"}`}>
              <span aria-hidden className={`grid size-5 place-items-center text-[12px] sm:size-6 sm:text-[14px] ${done[i] ? "bg-yellow text-ink" : "bg-cream/20"}`}>
                {done[i] ? "✓" : s.n}
              </span>
              <span>{done[i] ? <span className="sr-only">Done: </span> : null}{s.label}</span>
            </WipeLink>
          </li>
        ))}
        <li className="ml-auto shrink-0">
          <button type="button" onClick={() => setDemo(false)} className="label min-h-10 opacity-60 hover:opacity-100">
            Hide
          </button>
        </li>
      </ol>
    </nav>
  );
}
