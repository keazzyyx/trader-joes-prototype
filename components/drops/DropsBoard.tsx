"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { DROPS, dropStatus, shortDate, type Drop, type DropStatus } from "@/lib/data/drops";
import { useNow, useStoreValue } from "@/lib/hooks";
import { store } from "@/lib/store";
import { DropCard } from "./DropCard";
import { Countdown } from "./Countdown";

type Filter = "all" | "week" | "upcoming" | "gone";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "week", label: "This week" },
  { id: "upcoming", label: "Coming up" },
  { id: "gone", label: "Sold out" },
];

const WEEK = 7 * 86_400_000;
const rank = { now: 0, upcoming: 1, gone: 2 } as const;

function matches(f: Filter, s: DropStatus, now: Date) {
  if (f === "all") return true;
  if (f === "week") return s.kind === "now" || (s.kind === "upcoming" && s.startsAt.getTime() - now.getTime() <= WEEK);
  if (f === "upcoming") return s.kind === "upcoming";
  return s.kind === "gone";
}

function when(s: DropStatus) {
  return s.kind === "now" ? s.endsAt : s.kind === "upcoming" ? s.startsAt : s.returnsAt;
}

export function DropsBoard() {
  const { now, live } = useNow(1000);
  const [filter, setFilter] = useState<Filter>("all");
  const mine = useStoreValue(() => store.dropAlerts.mine()) ?? [];

  // Status only changes at day boundaries; key the memo on the date so the countdown tick doesn’t reshuffle.
  const dayKey = now.toDateString();
  const withStatus = useMemo(() => {
    const d = new Date(now);
    return DROPS.map((drop) => ({ drop, status: dropStatus(drop, d) })).sort(
      (a, b) => rank[a.status.kind] - rank[b.status.kind] || when(a.status).getTime() - when(b.status).getTime(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayKey]);

  const visible = withStatus.filter((x) => matches(filter, x.status, now));
  const next = withStatus.find((x) => x.status.kind === "upcoming") as { drop: Drop; status: Extract<DropStatus, { kind: "upcoming" }> } | undefined;

  return (
    <>
      <section className="mx-auto grid max-w-[1200px] gap-10 px-4 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1fr_380px] lg:items-end">
        <div>
          <h1 className="font-wonk text-[46px] leading-[0.98] font-semibold sm:text-[72px]">Here for a good time, not a long time.</h1>
          <p className="mt-5 max-w-[52ch] text-[18px] leading-relaxed text-ink/75">
            Seasonal stuff shows up, sells out, and disappears until next year. Set an alert on anything below and
            we&rsquo;ll tell you before it lands, so you&rsquo;re not the one staring at an empty shelf in November.
          </p>
        </div>
        {next && (
          <div className="wood-frame tex-board on-dark relative rotate-[1.2deg] rounded-[4px] px-6 py-5">
            <p className="text-[15px] text-chalk/75">Next thing to hit the shelves</p>
            <p className="font-wonk chalk-text mt-1 text-[28px] leading-tight font-semibold">{next.drop.name}</p>
            <p className="mt-1 text-[15px] font-semibold text-kraft">{shortDate(next.status.startsAt)}</p>
            <div className="mt-3">
              <Countdown to={next.status.startsAt} now={now} live={live} />
            </div>
          </div>
        )}
      </section>

      <section aria-label="Seasonal drops" className="mx-auto max-w-[1200px] px-4 pt-12 pb-8 sm:px-6">
        <div role="group" aria-label="Filter drops" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = withStatus.filter((x) => matches(f.id, x.status, now)).length;
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={`relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 border-ink px-4 text-[15px] font-semibold transition-colors ${
                  on ? "text-paper" : "bg-paper text-ink hover:bg-chalk"
                }`}
              >
                {on && <motion.span layoutId="chip-fill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                <span className="relative">{f.label}</span>
                <span className={`relative text-[13px] tabular-nums ${on ? "text-kraft" : "text-ink/55"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <LayoutGroup>
          <motion.ul layout className="mt-10 grid grid-flow-dense gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map(({ drop, status }, i) => {
                // The first card of each status group gets the wide editorial treatment.
                const feature = visible.length > 2 && (i === 0 || visible[i - 1].status.kind !== status.kind);
                return (
                  <motion.li
                    key={drop.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    className={feature ? "sm:col-span-2" : ""}
                    style={{ rotate: `${[-0.6, 0.4, -0.2, 0.7, -0.4][i % 5]}deg` }}
                  >
                    <DropCard drop={drop} status={status} now={now} live={live} onList={mine.includes(drop.id)} feature={feature} />
                  </motion.li>
                );
              })}
              <motion.li key="missing" layout transition={{ type: "spring", stiffness: 260, damping: 30 }}>
                <div className="tex-board on-dark flex h-full min-h-[280px] flex-col justify-between border-2 border-ink px-6 py-7 shadow-[5px_5px_0_var(--color-kraft-deep)]">
                  <div>
                    <p className="font-wonk chalk-text text-[30px] leading-[1.05] font-semibold">Missing a favorite?</p>
                    <p className="mt-3 text-[16px] leading-relaxed text-chalk/80">
                      Crew Club members get a back-in-stock alert from their own store the day a thing comes back. No
                      refreshing this page every morning.
                    </p>
                  </div>
                  <Link href="/crew-club" className={buttonClass("chalk", "mt-6 self-start")}>
                    Get back-in-stock alerts
                  </Link>
                </div>
              </motion.li>
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
        {visible.length === 0 && (
          <p className="mt-10 text-[18px] text-ink/70">Nothing in this pile right now. Check back tomorrow, the shelves move fast.</p>
        )}
      </section>
    </>
  );
}
