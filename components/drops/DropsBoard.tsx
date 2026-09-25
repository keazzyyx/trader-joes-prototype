"use client";
import { useMemo, useState } from "react";
import { DROPS, dropStatus, shortDate, type DropStatus } from "@/lib/data/drops";
import { useNow, useStoreValue } from "@/lib/hooks";
import { store } from "@/lib/store";
import { Headline } from "@/components/ui/Reveal";
import { DropItem } from "./DropItem";
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
const when = (s: DropStatus) => (s.kind === "now" ? s.endsAt : s.kind === "upcoming" ? s.startsAt : s.returnsAt);

function matches(f: Filter, s: DropStatus, now: Date) {
  if (f === "all") return true;
  if (f === "week") return s.kind === "now" || (s.kind === "upcoming" && s.startsAt.getTime() - now.getTime() <= WEEK);
  if (f === "upcoming") return s.kind === "upcoming";
  return s.kind === "gone";
}

export function DropsBoard() {
  const { now, live } = useNow(1000);
  const [filter, setFilter] = useState<Filter>("all");
  const mine = useStoreValue(() => store.dropAlerts.mine()) ?? [];
  const dayKey = now.toDateString();
  const withStatus = useMemo(() => {
    const d = new Date(now);
    return DROPS.map((drop) => ({ drop, status: dropStatus(drop, d) })).sort((a, b) => rank[a.status.kind] - rank[b.status.kind] || when(a.status).getTime() - when(b.status).getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayKey]);
  const visible = withStatus.filter((x) => matches(filter, x.status, now));
  const next = withStatus.find((x) => x.status.kind === "upcoming");

  return (
    <>
      <section className="on-red bg-green px-5 pt-36 pb-20 text-cream sm:px-8 sm:pt-40 sm:pb-28">
        <Headline as="h1" lines={["This week’s", "drops"]} className="text-[20vw] sm:text-[15vw]" />
        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[44ch] text-[17px] leading-snug opacity-90">
            Seasonal stuff shows up, sells out, and disappears until next year. Set an alert on anything below and we’ll tell you before it lands, so you’re not the one staring at an empty shelf in November.
          </p>
          {next && next.status.kind === "upcoming" && (
            <div className="lg:text-right">
              <p className="label text-yellow">Next to land: {next.drop.name}, {shortDate(next.status.startsAt)}</p>
              <Countdown to={next.status.startsAt} now={now} live={live} className="mt-1 text-[12vw] leading-none sm:text-[5vw]" />
            </div>
          )}
        </div>
      </section>

      <section aria-label="Seasonal drops" className="overflow-x-clip bg-cream px-5 py-20 sm:px-8 sm:py-28">
        <nav aria-label="Filter drops" className="flex flex-wrap gap-x-8 gap-y-2">
          {FILTERS.map((f) => {
            const count = withStatus.filter((x) => matches(f.id, x.status, now)).length;
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={`display inline-flex min-h-12 items-baseline gap-2 text-[28px] leading-none sm:text-[34px] ${on ? "underline decoration-red decoration-[4px] underline-offset-[8px]" : "opacity-55 hover:opacity-100"}`}
              >
                {f.label}
                <span className="label">{count}</span>
              </button>
            );
          })}
        </nav>
        {visible.length === 0 ? (
          <p className="display mt-20 text-[9vw] sm:text-[5vw]">Nothing in this pile right now.</p>
        ) : (
          <ul className="mt-16 grid gap-x-10 gap-y-24 sm:mt-24 sm:grid-cols-2 sm:gap-y-32">
            {visible.map(({ drop, status }, i) => (
              <li key={drop.id}>
                <DropItem drop={drop} status={status} now={now} live={live} onList={mine.includes(drop.id)} index={i} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
