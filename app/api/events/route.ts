import { db, type EventRow } from "@/lib/db";
import { ApiError, handle, json, visitorFrom } from "@/lib/api";

const NAMES = new Set(["flyer_signup_submitted", "drop_alert_set", "crew_club_completed", "delivery_waitlist_joined", "shelf_section_viewed", "cta_drawer_opened", "crew_cta_clicked"]);

/** Returns GA4-shaped payloads, newest first, so /debug can render them the same way it renders the local log. */
export const GET = handle(async (req) => {
  const sql = db();
  const mine = new URL(req.url).searchParams.has("mine");
  const rows = (mine
    ? await sql`select * from events where client_id = ${visitorFrom(req)} order by created_at desc limit 500`
    : await sql`select * from events order by created_at desc limit 1000`) as EventRow[];
  return rows.map((r) => ({
    client_id: r.client_id,
    timestamp_micros: new Date(r.created_at).getTime() * 1000,
    events: [{ name: r.name, params: { ...r.params, session_id: r.session_id, page_location: r.page } }],
  }));
});

export const POST = handle(async (req) => {
  const sql = db();
  const body = await json<{ name?: unknown; sessionId?: unknown; page?: unknown; params?: unknown }>(req);
  if (typeof body.name !== "string" || !NAMES.has(body.name)) throw new ApiError(400, "Unknown event");
  const params = body.params && typeof body.params === "object" ? (body.params as Record<string, unknown>) : {};
  await sql`insert into events (name, client_id, session_id, page, params)
    values (${body.name}, ${visitorFrom(req)}, ${typeof body.sessionId === "string" ? body.sessionId : null}, ${typeof body.page === "string" ? body.page.slice(0, 500) : null}, ${JSON.stringify(params)}::jsonb)`;
  return { ok: true };
});

export const DELETE = handle(async (req) => {
  const sql = db();
  await sql`delete from events where client_id = ${visitorFrom(req)}`;
  return { ok: true };
});
