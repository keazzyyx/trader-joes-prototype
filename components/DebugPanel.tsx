"use client";
import { useCallback, useEffect, useState } from "react";
import { store, type DropAlert, type Member, type Subscriber, type WaitlistEntry } from "@/lib/store";
import { clearEventLog, readEventLog, type Ga4Payload, type TrackEvent } from "@/lib/analytics";
import { DROPS } from "@/lib/data/drops";
import { storeById } from "@/lib/data/stores";
import { categoryLabel } from "@/lib/data/categories";
import { pill } from "@/components/ui/pill";

type Data = { subscribers: Subscriber[]; dropAlerts: DropAlert[]; members: Member[]; waitlist: WaitlistEntry[]; events: Ga4Payload[]; visitor: string };

const FUNNEL: { event: TrackEvent; label: string }[] = [
  { event: "shelf_section_viewed", label: "Saw the product shelf" },
  { event: "cta_drawer_opened", label: "Hit the header CTA" },
  { event: "flyer_signup_submitted", label: "Signed up for the Flyer" },
  { event: "drop_alert_set", label: "Set a drop alert" },
  { event: "crew_cta_clicked", label: "Hit the Crew CTA on home" },
  { event: "crew_club_completed", label: "Finished Crew Club" },
  { event: "delivery_waitlist_joined", label: "Joined a delivery waitlist" },
];

const when = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const dropName = (id: string) => DROPS.find((d) => d.id === id)?.name ?? id;

export function DebugPanel() {
  const [data, setData] = useState<Data | null>(null);
  const load = useCallback(async () => {
    const [subscribers, dropAlerts, members, waitlist] = await Promise.all([store.subscribers.list(), store.dropAlerts.list(), store.members.list(), store.waitlist.list()]);
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

  if (!data) return <div className="min-h-[60vh] bg-cream" />;

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
    <div className="bg-cream px-5 pt-36 pb-24 sm:px-8 sm:pt-40">
      <h1 className="display text-[16vw] leading-[0.85] sm:text-[10vw]">Back office</h1>
      <p className="mt-6 max-w-[60ch] text-[17px] leading-snug">
        Everything the prototype has stored in this browser, and every conversion event it fired. Rows you created are in red. The rest is seeded demo data.
      </p>
      <p className="label mt-3 opacity-70">Visitor id {data.visitor}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button type="button" className={pill("cream")} onClick={download}>
          Download everything as JSON
        </button>
        <button type="button" className="display min-h-16 text-[22px] underline decoration-[3px] underline-offset-[6px]" onClick={() => clearEventLog()}>
          Clear the event log
        </button>
        <button
          type="button"
          className="display min-h-16 text-[22px] underline decoration-[3px] underline-offset-[6px]"
          onClick={async () => {
            await store.reset();
            clearEventLog();
            load();
          }}
        >
          Reset to seed data
        </button>
      </div>

      <section className="mt-20" aria-labelledby="funnel">
        <h2 id="funnel" className="display text-[10vw] sm:text-[5vw]">
          Funnel, this browser
        </h2>
        <div className="mt-8 grid gap-4">
          {FUNNEL.map((f) => (
            <div key={f.event} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 sm:grid-cols-[320px_1fr_60px]">
              <span className="text-[15px]">
                {f.label} <span className="label opacity-60">{f.event}</span>
              </span>
              <span className="col-span-2 row-start-2 h-6 bg-yellow sm:col-span-1 sm:row-start-auto">
                <span className="block h-full bg-red transition-[width] duration-500" style={{ width: `${(counts[f.event] / max) * 100}%` }} />
              </span>
              <span className="display text-right text-[28px] tabular-nums">{counts[f.event]}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-20 grid gap-8 sm:grid-cols-4">
        {[
          ["Flyer subscribers", data.subscribers.length],
          ["Drop alerts", data.dropAlerts.length],
          ["Crew Club members", data.members.length],
          ["Delivery waitlist", data.waitlist.length],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="label opacity-70">{k}</p>
            <p className="display text-[16vw] leading-[0.85] sm:text-[6vw]">{v}</p>
          </div>
        ))}
      </div>

      <Table title="Fearless Flyer subscribers" head={["Email", "Source", "When"]} rows={data.subscribers.map((r) => ({ mine: mine(r), cells: [r.email, r.source, when(r.createdAt)] }))} />
      <Table title="Drop alerts" head={["Drop", "Email", "When"]} rows={data.dropAlerts.map((r) => ({ mine: mine(r), cells: [dropName(r.dropId), r.email, when(r.createdAt)] }))} />
      <Table
        title="Crew Club members"
        head={["Number", "Email", "Store", "Favorites", "Joined"]}
        rows={data.members.map((r) => ({ mine: mine(r), cells: [r.memberNumber, r.email, storeById(r.storeId)?.name ?? r.storeId, r.categories.map(categoryLabel).join(", "), when(r.createdAt)] }))}
      />
      <Table title="Delivery waitlist" head={["Store", "Email", "When"]} rows={data.waitlist.map((r) => ({ mine: mine(r), cells: [storeById(r.storeId)?.name ?? r.storeId, r.email, when(r.createdAt)] }))} />

      <section className="mt-20" aria-labelledby="events">
        <h2 id="events" className="display text-[10vw] sm:text-[5vw]">
          Tracked events <span className="opacity-50">({data.events.length})</span>
        </h2>
        <p className="mt-2 text-[15px] opacity-75">GA4 Measurement Protocol payloads, newest first. Also logged to the console as they fire.</p>
        {data.events.length === 0 ? (
          <p className="mt-6 text-[17px]">Nothing yet. Go sign up for something, then come back.</p>
        ) : (
          <ul className="mt-8 grid gap-4">
            {data.events.map((p, i) => {
              const e = p.events[0];
              return (
                <li key={`${p.timestamp_micros}-${i}`}>
                  <details>
                    <summary className="flex min-h-12 cursor-pointer flex-wrap items-baseline gap-x-5 gap-y-1 list-none [&::-webkit-details-marker]:hidden">
                      <span className="display text-[24px] text-red">{e.name}</span>
                      <span className="label opacity-60">{new Date(p.timestamp_micros / 1000).toLocaleTimeString()}</span>
                      <span className="label opacity-60">{new URL(e.params.page_location).pathname}</span>
                    </summary>
                    <pre className="mt-3 overflow-x-auto bg-ink px-5 py-4 text-[13px] leading-relaxed text-cream">{JSON.stringify(p, null, 2)}</pre>
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
    <section className="mt-20">
      <h2 className="display text-[10vw] sm:text-[5vw]">
        {title} <span className="opacity-50">({rows.length})</span>
      </h2>
      <div className="mt-6 max-h-[440px] overflow-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-[15px]">
          <thead className="sticky top-0 bg-cream">
            <tr>
              {head.map((h) => (
                <th key={h} className="label py-2 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={r.mine ? "font-semibold text-red" : i % 2 ? "bg-yellow" : ""}>
                {r.cells.map((c, j) => (
                  <td key={j} className="py-2 pr-4 align-top">
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
