"use client";
import { useEffect, useState } from "react";
import { Ticker } from "@/components/ui/Ticker";
import { Headline } from "@/components/ui/Reveal";
import { fmtPct, type Insights, type Ranked } from "@/lib/insights";

const REFRESH_MS = 5000;

/** The manager page. Everything here is computed from real rows and refreshed every 5 seconds. */
export function InsightsClient() {
  const [data, setData] = useState<Insights | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/insights", { cache: "no-store" })
        .then((r) => r.json())
        .then((j) => {
          if (!alive) return;
          if (j.error) setError(j.error);
          else {
            setData(j);
            setError(null);
          }
        })
        .catch(() => alive && setError("Can’t reach the database."));
    load();
    const t = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (!data) {
    return (
      <section className="min-h-[60vh] bg-cream px-5 pt-36 sm:px-8">
        <p className="label">{error ?? "Loading real numbers…"}</p>
      </section>
    );
  }

  const d = data;
  const sec = "px-5 py-20 sm:px-8 sm:py-28";

  return (
    <>
      <section className={`bg-cream ${sec} pt-36 sm:pt-40`}>
        <p className="label">For Trader Joe’s</p>
        <Headline as="h1" lines={["What this site", "learns"]} className="mt-3 text-[18vw] sm:text-[13vw]" />
        <p className="mt-6 max-w-[48ch] text-[18px] leading-snug">
          Every number below is a real visitor doing a real thing on this site. No demo rows, no one on the team. It refreshes every five seconds.
        </p>
      </section>

      <section className={`bg-yellow ${sec}`} aria-labelledby="learned">
        <Headline id="learned" lines={["Learned so far"]} className="text-[13vw] sm:text-[8vw]" />
        {d.findings.ready ? (
          <ol className="mt-10 grid gap-8">
            {d.findings.lines.map((l, i) => (
              <li key={i} className="display max-w-[22ch] text-[9vw] leading-[0.95] sm:text-[4.2vw]">
                {l}
              </li>
            ))}
            {d.findings.lines.length === 0 && <li className="text-[18px]">Enough visitors, but nobody has signed up yet. The first finding appears with the first signup.</li>}
          </ol>
        ) : (
          <p className="mt-8 max-w-[44ch] text-[20px] leading-snug">
            Not enough data yet ({d.findings.have} of {d.findings.needed} visitors). Findings are only written once fifteen different people have been through.
          </p>
        )}
      </section>

      <section className={`bg-cream ${sec}`} aria-label="Big numbers">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-3">
          <Big label="Shoppers TJ’s can now reach" value={d.reachableEmails} />
          <Big label="Crew members" value={d.crewMembers} />
          <Big label="Unique visitors" value={d.uniqueVisitors} />
          <Big label="Signup rate" value={d.signupRate * 100} format={(n) => `${Math.round(n)}%`} empty={d.uniqueVisitors === 0} />
          <Big label="Median scan to signup" value={d.medianScanToSignupMs == null ? null : d.medianScanToSignupMs / 1000} format={(n) => `${n.toFixed(1)}s`} />
          <Big label="Shelf tag conversion" value={d.tagConversion == null ? null : d.tagConversion * 100} format={(n) => `${Math.round(n)}%`} />
        </div>
      </section>

      <Bars tone="green" title={["Most-wanted", "drops"]} rows={d.mostWanted} unit="alerts" empty="Drop alerts appear here, ranked by product, as soon as someone sets one." soWhat={d.mostWanted[0] ? `Stock more ${d.mostWanted[0].name}: ${d.mostWanted[0].count} ${d.mostWanted[0].count === 1 ? "person" : "people"} asked before it landed.` : null} />

      <Bars tone="cream" title={["Where delivery", "should start"]} rows={d.deliveryStores} unit="waiting" empty="Delivery waitlist signups appear here, ranked by store." soWhat={d.deliveryStores[0] ? `Start at ${d.deliveryStores[0].name}: ${d.deliveryStores[0].count} ${d.deliveryStores[0].count === 1 ? "neighbor is" : "neighbors are"} already waiting.` : null} />

      <section className={`on-red bg-red text-cream ${sec}`} aria-labelledby="dropoff">
        <Headline id="dropoff" lines={["Crew Club", "drop-off"]} className="text-[13vw] sm:text-[8vw]" />
        {d.crew.visited === 0 ? (
          <p className="mt-8 text-[18px] opacity-90">The funnel appears here once someone opens the Crew Club page.</p>
        ) : (
          <>
            <p className="display mt-8 max-w-[24ch] text-[9vw] leading-[0.95] sm:text-[4.4vw]">
              {d.crew.visited} started, {d.crew.email} gave an email, {d.crew.store} picked a store, {d.crew.finished} finished.
            </p>
            <div className="mt-8 grid max-w-[720px] gap-3">
              {[
                ["Opened the page", d.crew.visited],
                ["Gave an email", d.crew.email],
                ["Picked a store", d.crew.store],
                ["Finished", d.crew.finished],
              ].map(([l, v]) => (
                <div key={l as string} className="grid grid-cols-[140px_1fr_48px] items-center gap-3 sm:grid-cols-[200px_1fr_60px]">
                  <span className="label">{l}</span>
                  <span className="block h-6 bg-cream" style={{ width: `${Math.max(2, ((v as number) / Math.max(1, d.crew.visited)) * 100)}%` }} />
                  <span className="display text-right text-[26px]">{v as number}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <Bars tone="yellow" title={["Favorite", "aisles"]} rows={d.aisles} unit="picks" empty="The aisles Crew members pick appear here." soWhat={d.aisles[0] ? `Lead the next Flyer with ${d.aisles[0].name.toLowerCase()}: it’s the aisle members pick most.` : null} />

      <section className={`bg-cream ${sec}`} aria-labelledby="channels">
        <Headline id="channels" lines={["Where shoppers", "came from"]} className="text-[13vw] sm:text-[8vw]" />
        {d.channels.length === 0 ? (
          <p className="mt-8 text-[18px]">Visits by source appear here: utm_source when the link carries one, otherwise the referring site, otherwise direct.</p>
        ) : (
          <div className="mt-10 max-w-[860px]">
            <div className="label grid grid-cols-[minmax(0,1fr)_52px_64px_56px] gap-2 opacity-60 sm:grid-cols-[1fr_120px_120px_120px] sm:gap-3">
              <span>Source</span>
              <span className="text-right">Visits</span>
              <span className="text-right">Signups</span>
              <span className="text-right">Rate</span>
            </div>
            {d.channels.map((c) => (
              <div key={c.source} className="grid grid-cols-[minmax(0,1fr)_52px_64px_56px] items-baseline gap-2 py-3 sm:grid-cols-[1fr_120px_120px_120px] sm:gap-3">
                <span className="display min-w-0 truncate text-[22px] sm:text-[32px]">{c.source}</span>
                <span className="display text-right text-[22px] tabular-nums sm:text-[32px]">{c.visits}</span>
                <span className="display text-right text-[22px] tabular-nums sm:text-[32px]">{c.signups}</span>
                <span className="display text-right text-[22px] tabular-nums text-red sm:text-[32px]">{fmtPct(c.rate)}</span>
              </div>
            ))}
          </div>
        )}
        <p className="label mt-12 opacity-50">Refreshed {new Date(d.generatedAt).toLocaleTimeString()}. Internal browsers and demo rows are excluded from everything on this page.</p>
      </section>
    </>
  );
}

function Big({ label, value, format, empty }: { label: string; value: number | null; format?: (n: number) => string; empty?: boolean }) {
  return (
    <div>
      <p className="label">{label}</p>
      {value == null || empty ? (
        <p className="display text-[18vw] leading-[0.85] opacity-30 sm:text-[7vw]">—</p>
      ) : (
        <Ticker value={value} format={format} className="display block text-[18vw] leading-[0.85] sm:text-[7vw]" />
      )}
    </div>
  );
}

function Bars({ tone, title, rows, unit, empty, soWhat }: { tone: "green" | "cream" | "yellow"; title: string[]; rows: Ranked[]; unit: string; empty: string; soWhat: string | null }) {
  const bg = { green: "on-red bg-green text-cream", cream: "bg-cream text-ink", yellow: "bg-yellow text-ink" }[tone];
  const bar = tone === "green" ? "bg-cream" : "bg-red";
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className={`${bg} px-5 py-20 sm:px-8 sm:py-28`}>
      <Headline lines={title} className="text-[13vw] sm:text-[8vw]" />
      {rows.length === 0 ? (
        <p className="mt-8 max-w-[48ch] text-[18px] opacity-90">{empty}</p>
      ) : (
        <>
          {soWhat && <p className="display mt-8 max-w-[24ch] text-[9vw] leading-[0.95] sm:text-[4.2vw]">{soWhat}</p>}
          <ol className="mt-10 grid max-w-[900px] gap-4">
            {rows.slice(0, 8).map((r) => (
              <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4 gap-y-1 sm:grid-cols-[220px_minmax(0,1fr)_auto] sm:items-center sm:gap-x-4">
                <span className="display min-w-0 truncate text-[22px] sm:text-[26px]">{r.name}</span>
                <span className="display whitespace-nowrap text-right text-[26px] tabular-nums sm:order-last">
                  <Ticker value={r.count} /> <span className="label">{unit}</span>
                </span>
                <span className={`col-span-2 block h-7 ${bar} sm:col-span-1`} style={{ width: `${Math.max(3, (r.count / max) * 100)}%` }} />
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
