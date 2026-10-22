"use client";
import { useEffect, useState } from "react";
import { Ticker } from "@/components/ui/Ticker";
import type { PresentStats } from "@/lib/insights";

/** Today's class-QR activity, refreshed every 5 seconds. */
export function PresentLive() {
  const [stats, setStats] = useState<PresentStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/present", { cache: "no-store" })
        .then((r) => r.json())
        .then((j) => {
          if (!alive) return;
          if (j.error) setError(j.error);
          else {
            setStats(j);
            setError(null);
          }
        })
        .catch(() => alive && setError("Can’t reach the database"));
    load();
    const t = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const items: { label: string; value: number | null; format?: (n: number) => string }[] = [
    { label: "Alerts set", value: stats?.alerts ?? 0 },
    { label: "Flyer signups", value: stats?.flyerSignups ?? 0 },
    { label: "Crew members", value: stats?.crewMembers ?? 0 },
    { label: "Median scan to signup", value: stats?.medianScanToSignupMs ?? null, format: (n) => `${(n / 1000).toFixed(1)}s` },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-8 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.label}>
            <p className="label">{it.label}</p>
            {it.value == null ? (
              <p className="display text-[64px] leading-[0.9] opacity-40 lg:text-[5vw]">—</p>
            ) : (
              <Ticker value={it.value} format={it.format} className="display block text-[64px] leading-[0.9] lg:text-[5vw]" />
            )}
          </div>
        ))}
      </div>
      <p className="label mt-6 opacity-60">
        {error ? error : stats ? `Today, from the class QR. ${stats.scans} ${stats.scans === 1 ? "scan" : "scans"} so far. Updates every 5 seconds.` : "Loading…"}
      </p>
    </div>
  );
}
