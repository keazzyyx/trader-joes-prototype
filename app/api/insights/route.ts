import { db } from "@/lib/db";
import { handle } from "@/lib/api";
import { DROPS } from "@/lib/data/drops";
import { storeById } from "@/lib/data/stores";
import { categoryLabel } from "@/lib/data/categories";
import { fmtPct, type AskRate, type Channel, type Insights, type Ranked } from "@/lib/insights";

export const dynamic = "force-dynamic";

const MIN_VISITORS = 15;
type N = { n: number };

/**
 * Everything /insights shows, computed in Postgres. Internal browsers and demo rows are left out of every number.
 * Visitor-level rates use distinct visitor ids so a repeat signup never counts twice.
 */
export const GET = handle(async () => {
  const sql = db();

  // Visitors and who converted (any form).
  const [{ n: uniqueVisitors }] = (await sql`select count(distinct visitor_id)::int as n from page_views where visitor_id not in (select visitor_id from internal_visitors)`) as N[];
  const [{ n: convertedVisitors }] = (await sql`
    select count(distinct visitor_id)::int as n from (
      select visitor_id from subscribers where demo = false
      union select visitor_id from drop_alerts where demo = false
      union select visitor_id from members where demo = false
      union select visitor_id from waitlist where demo = false
    ) c where visitor_id not in (select visitor_id from internal_visitors)`) as N[];
  const [{ n: reachableEmails }] = (await sql`
    select count(distinct email)::int as n from (
      select email, visitor_id from subscribers where demo = false
      union select email, visitor_id from drop_alerts where demo = false
      union select email, visitor_id from members where demo = false
      union select email, visitor_id from waitlist where demo = false
    ) e where visitor_id not in (select visitor_id from internal_visitors)`) as N[];
  const [{ n: crewMembers }] = (await sql`select count(*)::int as n from members where demo = false and visitor_id not in (select visitor_id from internal_visitors)`) as N[];

  // Scan-to-signup: tag alerts carry the milliseconds from page load to submit.
  const [{ med }] = (await sql`
    select percentile_cont(0.5) within group (order by (params->>'scan_to_signup_ms')::numeric) as med
    from events where name = 'drop_alert_set' and params ? 'scan_to_signup_ms' and client_id not in (select visitor_id from internal_visitors)`) as { med: string | null }[];
  const [{ n: tagVisits }] = (await sql`select count(distinct visitor_id)::int as n from page_views where path like '/tag/%' and path not like '%/print' and visitor_id not in (select visitor_id from internal_visitors)`) as N[];
  const [{ n: tagAlerts }] = (await sql`select count(distinct client_id)::int as n from events where name = 'drop_alert_set' and params->>'source' = 'tag' and client_id not in (select visitor_id from internal_visitors)`) as N[];

  // Which ask converts best: visitors who saw the ask's page vs visitors who took it.
  const seen = async (paths: string[]) => {
    const [{ n }] = (await sql`select count(distinct visitor_id)::int as n from page_views where path = any(${paths}) and visitor_id not in (select visitor_id from internal_visitors)`) as N[];
    return n;
  };
  const seenTag = async () => {
    const [{ n }] = (await sql`select count(distinct visitor_id)::int as n from page_views where (path in ('/', '/drops') or (path like '/tag/%' and path not like '%/print')) and visitor_id not in (select visitor_id from internal_visitors)`) as N[];
    return n;
  };
  const took = async (table: "subscribers" | "drop_alerts" | "members" | "waitlist") => {
    const q = {
      subscribers: sql`select count(distinct visitor_id)::int as n from subscribers where demo = false and visitor_id not in (select visitor_id from internal_visitors)`,
      drop_alerts: sql`select count(distinct visitor_id)::int as n from drop_alerts where demo = false and visitor_id not in (select visitor_id from internal_visitors)`,
      members: sql`select count(distinct visitor_id)::int as n from members where demo = false and visitor_id not in (select visitor_id from internal_visitors)`,
      waitlist: sql`select count(distinct visitor_id)::int as n from waitlist where demo = false and visitor_id not in (select visitor_id from internal_visitors)`,
    }[table];
    const [{ n }] = (await q) as N[];
    return n;
  };
  const rate = (c: number, s: number) => (s > 0 ? c / s : 0);
  const askSeen = { flyer: await seen(["/", "/drops", "/delivery"]), drop_alert: await seenTag(), crew: await seen(["/crew-club"]), waitlist: await seen(["/delivery"]) };
  const askTook = { flyer: await took("subscribers"), drop_alert: await took("drop_alerts"), crew: await took("members"), waitlist: await took("waitlist") };
  const asks: AskRate[] = (
    [
      ["flyer", "The Flyer"],
      ["drop_alert", "Drop alerts"],
      ["crew", "Crew Club"],
      ["waitlist", "Delivery waitlist"],
    ] as const
  ).map(([ask, label]) => ({ ask, label, seen: askSeen[ask], converted: askTook[ask], rate: rate(askTook[ask], askSeen[ask]) }));

  // Channels: first touch per visitor, utm_source, else referrer domain, else direct.
  const channelRows = (await sql`
    with first as (
      select distinct on (visitor_id) visitor_id, coalesce(nullif(utm_source, ''), nullif(referrer, ''), 'direct') as source
      from page_views where visitor_id not in (select visitor_id from internal_visitors) order by visitor_id, id
    ), conv as (
      select visitor_id from subscribers where demo = false
      union select visitor_id from drop_alerts where demo = false
      union select visitor_id from members where demo = false
      union select visitor_id from waitlist where demo = false
    )
    select source, count(*)::int as visits, count(conv.visitor_id)::int as signups
    from first left join conv using (visitor_id) group by source order by visits desc limit 12`) as { source: string; visits: number; signups: number }[];
  const channels: Channel[] = channelRows.map((r) => ({ source: r.source, visits: r.visits, signups: r.signups, rate: rate(r.signups, r.visits) }));

  const wanted = (await sql`select drop_id as id, count(*)::int as count from drop_alerts where demo = false and visitor_id not in (select visitor_id from internal_visitors) group by drop_id order by count desc`) as { id: string; count: number }[];
  const mostWanted: Ranked[] = wanted.map((w) => ({ id: w.id, name: DROPS.find((d) => d.id === w.id)?.name ?? w.id, count: w.count }));
  const stores = (await sql`select store_id as id, count(*)::int as count from waitlist where demo = false and visitor_id not in (select visitor_id from internal_visitors) group by store_id order by count desc`) as { id: string; count: number }[];
  const deliveryStores: Ranked[] = stores.map((s) => ({ id: s.id, name: storeById(s.id)?.name ?? s.id, count: s.count }));

  const step = async (n: number) => {
    const [{ n: c }] = (await sql`select count(distinct client_id)::int as n from events where name = 'crew_step_completed' and (params->>'step')::int = ${n} and client_id not in (select visitor_id from internal_visitors)`) as N[];
    return c;
  };
  const crew = { visited: askSeen.crew, email: await step(1), store: await step(2), finished: crewMembers };

  const aisleRows = (await sql`select c as id, count(*)::int as count from members, unnest(categories) c where demo = false and visitor_id not in (select visitor_id from internal_visitors) group by c order by count desc`) as { id: string; count: number }[];
  const aisles: Ranked[] = aisleRows.map((a) => ({ id: a.id, name: categoryLabel(a.id), count: a.count }));

  // Plain-English findings, only once 15 unique visitors have been through.
  const lines: string[] = [];
  const ready = uniqueVisitors >= MIN_VISITORS;
  if (ready) {
    const ranked = [...asks].filter((a) => a.seen > 0).sort((a, b) => b.rate - a.rate);
    const best = ranked[0];
    const flyer = asks.find((a) => a.ask === "flyer")!;
    const against = best && best.ask !== "flyer" ? flyer : ranked[1];
    if (best && against && best.rate > 0) {
      const x = against.rate > 0 ? (best.rate / against.rate).toFixed(1) : null;
      lines.push(x && x !== "1.0" ? `${best.label} convert ${x}x better than ${against.label.toLowerCase()} (${fmtPct(best.rate)} vs ${fmtPct(against.rate)}).` : `${best.label} convert best (${fmtPct(best.rate)} of visitors who saw the ask).`);
    }
    const ch = [...channels].filter((c) => c.visits >= 3).sort((a, b) => b.rate - a.rate);
    if (ch[0] && ch[0].signups > 0) {
      const name = (s: string) => (s === "direct" ? "Direct visits" : s === "shelf" ? "Shelf tag scans" : s === "class" ? "The class QR" : `Visits from ${s}`);
      lines.push(`${name(ch[0].source)} bring the most signups per visit: ${fmtPct(ch[0].rate)} of ${ch[0].visits} visits signed up${ch[1] ? `, against ${fmtPct(ch[1].rate)} for ${name(ch[1].source).toLowerCase()}` : ""}.`);
    }
    const parts: string[] = [];
    if (mostWanted[0]) parts.push(`stock more ${mostWanted[0].name} (${mostWanted[0].count} ${mostWanted[0].count === 1 ? "person" : "people"} asked before it landed)`);
    if (deliveryStores[0]) parts.push(`start delivery at ${deliveryStores[0].name} (${deliveryStores[0].count} waiting)`);
    if (parts.length) lines.push(`What Trader Joe’s should do: ${parts.join(", and ")}.`);
  }

  const out: Insights = {
    generatedAt: new Date().toISOString(),
    uniqueVisitors,
    reachableEmails,
    crewMembers,
    convertedVisitors,
    signupRate: rate(convertedVisitors, uniqueVisitors),
    medianScanToSignupMs: med == null ? null : Math.round(Number(med)),
    tagVisits,
    tagAlerts,
    tagConversion: tagVisits > 0 ? tagAlerts / tagVisits : null,
    asks,
    channels,
    mostWanted,
    deliveryStores,
    crew,
    aisles,
    findings: { ready, needed: MIN_VISITORS, have: uniqueVisitors, lines },
  };
  return out;
});
