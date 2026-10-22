import { db } from "@/lib/db";
import { handle } from "@/lib/api";
import type { PresentStats } from "@/lib/insights";

export const dynamic = "force-dynamic";
type N = { n: number };

/** Today's activity from the class QR (utm_source=class), in store time. Internal browsers are left out. */
export const GET = handle(async () => {
  const sql = db();
  const [{ since }] = (await sql`select (date_trunc('day', now() at time zone 'America/Los_Angeles') at time zone 'America/Los_Angeles') as since`) as { since: string }[];
  const count = async (name: string) => {
    const [{ n }] = (await sql`select count(distinct client_id)::int as n from events where name = ${name} and utm_source = 'class' and created_at >= ${since} and client_id not in (select visitor_id from internal_visitors)`) as N[];
    return n;
  };
  const [{ med }] = (await sql`
    select percentile_cont(0.5) within group (order by (params->>'scan_to_signup_ms')::numeric) as med
    from events where name = 'drop_alert_set' and params ? 'scan_to_signup_ms' and utm_source = 'class' and created_at >= ${since} and client_id not in (select visitor_id from internal_visitors)`) as { med: string | null }[];
  const [{ n: scans }] = (await sql`select count(distinct visitor_id)::int as n from page_views where utm_source = 'class' and path like '/tag/%' and created_at >= ${since} and visitor_id not in (select visitor_id from internal_visitors)`) as N[];
  const out: PresentStats = {
    generatedAt: new Date().toISOString(),
    since,
    alerts: await count("drop_alert_set"),
    flyerSignups: await count("flyer_signup_submitted"),
    crewMembers: await count("crew_club_completed"),
    medianScanToSignupMs: med == null ? null : Math.round(Number(med)),
    scans,
  };
  return out;
});
