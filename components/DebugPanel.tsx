"use client";
import { useCallback, useEffect, useState } from "react";
import { store, type DropAlert, type Member, type Subscriber, type WaitlistEntry } from "@/lib/store";
import { clearEventLog, readEventLog, type Ga4Payload, type TrackEvent } from "@/lib/analytics";
import { DROPS } from "@/lib/data/drops";
import { storeById } from "@/lib/data/stores";
import { categoryLabel } from "@/lib/data/categories";
import { buttonClass } from "@/components/ui/button";

type Data = {
  subscribers: Subscriber[];
  dropAlerts: DropAlert[];
  members: Member[];
  waitlist: WaitlistEntry[];
  events: Ga4Payload[];
  visitor: string;
};

const FUNNEL: { event: TrackEvent; label: string }[] = [
  { event: "shelf_section_viewed", label: "Saw the product shelf" },
  { event: "cta_drawer_opened", label: "Opened the Flyer drawer" },
  { event: "flyer_signup_submitted", label: "Signed up for the Flyer" },
  { event: "drop_alert_set", label: "Set a drop alert" },
  { event: "crew_club_completed", label: "Finished Crew Club" },
  { event: "delivery_waitlist_joined", label: "Joined a delivery waitlist" },
];

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const dropName = (id: string) => DROPS.find((d) => d.id === id)?.name ?? id;

export function DebugPanel() {
  const [data, setData] = useState<Data | null>(null);

  const load = useCallback(async () => {
    const [subscribers, dropAlerts, members, waitlist] = await Promise.all([
      store.subscribers.list(),
      store.dropAlerts.list(),
      store.members.list(),
      store.waitlist.list(),
    ]);
    setData({ subscribers, dropAlerts, members, waitlist, events: readEventLog(), visitor: store.visitorId() });
  }, []);

  useEffect(() => {
    load();
    const on = () => load();
    for (const e of ["tj:store", "tj:track", "storage"]) window.addEventListener(e, on);
    return () => {
      for (const e of ["tj:store", "tj:track", "storage"]) window.removeEventListener(e, on);
    };
  }, [load]);

  if (!data) return <div className="min-h-[60vh]" />;

  const mine = (r: { visitorId: string }) => r.visitorId === data.visitor;
  const counts = Object.fromEntries(FUNNEL.map((f) => [f.event, data.events.filter((e) => e.events[0]?.name === f.event).length]));
  const max = Math.max(1, ...Object.values(counts));

  function download() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `tj-prototype-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-10 pb-24 sm:px-6">
      <h1 className="font-wonk text-[44px] leading-none font-semibold sm:text-[60px]">Back office</h1>
      <p className="mt-3 max-w-[60ch] text-[17px] text-ink/75">
        Everything the prototype has stored in this browser, and every conversion event it fired. Rows you created are
        marked in red. The rest is seeded demo data.
      </p>
      <p className="mt-2 text-[14px] text-ink/60">
        Visitor id <code className="rounded bg-chalk px-1.5 py-0.5">{data.visitor}</code>
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className={buttonClass("ink")} onClick={download}>
          Download everything as JSON
        </button>
        <button type="button" className={buttonClass("outline")} onClick={() => clearEventLog()}>
          Clear the event log
        </button>
        <button
          type="button"
          className={buttonClass("outline")}
          onClick={async () => {
            await store.reset();
            clearEventLog();
            load();
          }}
        >
          Reset to seed data
        </button>
      </div>

      <section className="mt-12" aria-labelledby="funnel">
        <h2 id="funnel" className="font-wonk text-[30px] font-semibold">
          Funnel, this browser
        </h2>
        <div className="mt-4 grid gap-2">
          {FUNNEL.map((f) => (
            <div key={f.event} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[280px_1fr_48px]">
              <span className="text-[15px]">
                {f.label} <code className="text-[12px] text-ink/55">{f.event}</code>
              </span>
              <span className="col-span-2 row-start-2 h-5 bg-chalk sm:col-span-1 sm:row-start-auto">
                <span className="block h-full bg-red transition-[width] duration-500" style={{ width: `${(counts[f.event] / max) * 100}%` }} />
              </span>
              <span className="text-right font-semibold tabular-nums">{counts[f.event]}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 grid gap-4 sm:grid-cols-4">
        {[
          ["Flyer subscribers", data.subscribers.length],
          ["Drop alerts", data.dropAlerts.length],
          ["Crew Club members", data.members.length],
          ["Delivery waitlist", data.waitlist.length],
        ].map(([k, v]) => (
          <div key={k} className="border-2 border-ink px-4 py-3">
            <p className="text-[14px] text-ink/65">{k}</p>
            <p className="font-wonk text-[36px] leading-none font-semibold tabular-nums">{v}</p>
          </div>
        ))}
      </div>

      <Table
        title="Fearless Flyer subscribers"
        head={["Email", "Source", "When"]}
        rows={data.subscribers.map((r) => ({ mine: mine(r), cells: [r.email, r.source, when(r.createdAt)] }))}
      />
      <Table
        title="Drop alerts"
        head={["Drop", "Email", "When"]}
        rows={data.dropAlerts.map((r) => ({ mine: mine(r), cells: [dropName(r.dropId), r.email, when(r.createdAt)] }))}
      />
      <Table
        title="Crew Club members"
        head={["Number", "Email", "Store", "Favorites", "Joined"]}
        rows={data.members.map((r) => ({
          mine: mine(r),
          cells: [r.memberNumber, r.email, storeById(r.storeId)?.name ?? r.storeId, r.categories.map(categoryLabel).join(", "), when(r.createdAt)],
        }))}
      />
      <Table
        title="Delivery waitlist"
        head={["Store", "Email", "When"]}
        rows={data.waitlist.map((r) => ({ mine: mine(r), cells: [storeById(r.storeId)?.name ?? r.storeId, r.email, when(r.createdAt)] }))}
      />

      <section className="mt-14" aria-labelledby="events">
        <h2 id="events" className="font-wonk text-[30px] font-semibold">
          Tracked events <span className="text-ink/50">({data.events.length})</span>
        </h2>
        <p className="mt-1 text-[15px] text-ink/65">GA4 Measurement Protocol payloads, newest first. Also logged to the console as they fire.</p>
        {data.events.length === 0 ? (
          <p className="mt-4 text-[16px] text-ink/70">Nothing yet. Go sign up for something, then come back.</p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {data.events.map((p, i) => {
              const e = p.events[0];
              return (
                <li key={`${p.timestamp_micros}-${i}`}>
                  <details className="border-2 border-ink/15 open:border-ink">
                    <summary className="flex min-h-12 cursor-pointer flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2">
                      <code className="font-semibold text-red-deep">{e.name}</code>
                      <span className="text-[14px] text-ink/60">{new Date(p.timestamp_micros / 1000).toLocaleTimeString()}</span>
                      <span className="text-[14px] text-ink/60">{new URL(e.params.page_location).pathname}</span>
                    </summary>
                    <pre className="overflow-x-auto bg-ink px-4 py-3 text-[13px] leading-relaxed text-chalk">{JSON.stringify(p, null, 2)}</pre>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Table({ title, head, rows }: { title: string; head: string[]; rows: { mine: boolean; cells: string[] }[] }) {
  return (
    <section className="mt-14">
      <h2 className="font-wonk text-[30px] font-semibold">
        {title} <span className="text-ink/50">({rows.length})</span>
      </h2>
      <div className="mt-4 max-h-[420px] overflow-auto border-2 border-ink">
        <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
          <thead className="sticky top-0 bg-chalk">
            <tr>
              {head.map((h) => (
                <th key={h} className="border-b-2 border-ink px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={r.mine ? "bg-red/10 font-semibold text-red-deep" : i % 2 ? "bg-chalk/50" : ""}>
                {r.cells.map((c, j) => (
                  <td key={j} className="border-b border-ink/10 px-3 py-2 align-top">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
