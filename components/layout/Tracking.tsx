"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureUtm, isInternal, referrerDomain, setInternal } from "@/lib/attribution";
import { markInternal, recordPageView } from "@/lib/tracking";
import { setDemo } from "./DemoBar";

/** Records one page view per route, handles ?internal= and ?utm_source=, and shows the INTERNAL badge. */
export function Tracking() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [internal, setInternalState] = useState(false);

  useEffect(() => {
    const flag = search.get("internal");
    if (flag === "1" || flag === "0") {
      setInternal(flag === "1");
      markInternal(flag === "1");
    }
    const demo = search.get("demo");
    if (demo === "1" || demo === "0") setDemo(demo === "1");
    setInternalState(isInternal());
    const utm = captureUtm(search.toString());
    recordPageView(pathname, referrerDomain(), utm);
  }, [pathname, search]);

  useEffect(() => {
    const on = () => setInternalState(isInternal());
    window.addEventListener("tj:internal", on);
    return () => window.removeEventListener("tj:internal", on);
  }, []);

  if (!internal) return null;
  return (
    <p aria-live="polite" className="display pointer-events-none fixed top-[76px] right-3 z-[90] bg-yellow px-3 py-1.5 text-[15px] leading-none text-ink sm:top-[90px]">
      Internal
    </p>
  );
}
