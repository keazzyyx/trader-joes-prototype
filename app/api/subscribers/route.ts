import { db, type SubscriberRow } from "@/lib/db";
import { ApiError, handle, isEmail, json, normalize, visitorFrom } from "@/lib/api";

const shape = (r: SubscriberRow) => ({ id: r.id, email: r.email, source: r.source, visitorId: r.visitor_id, createdAt: r.created_at });

export const GET = handle(async (req) => {
  const sql = db();
  const url = new URL(req.url);
  if (url.searchParams.has("mine")) {
    const rows = (await sql`select 1 from subscribers where visitor_id = ${visitorFrom(req)} limit 1`) as unknown[];
    return { subscribed: rows.length > 0 };
  }
  const rows = (await sql`select * from subscribers order by created_at desc limit 500`) as SubscriberRow[];
  return rows.map(shape);
});

export const POST = handle(async (req) => {
  const sql = db();
  const { email, source } = await json<{ email?: unknown; source?: unknown }>(req);
  if (!isEmail(email)) throw new ApiError(400, "That email looks a little off.");
  const src = typeof source === "string" && source.length < 40 ? source : "unknown";
  const rows = (await sql`
    insert into subscribers (email, source, visitor_id)
    values (${normalize(email)}, ${src}, ${visitorFrom(req)})
    on conflict (email) do update set email = excluded.email
    returning *`) as SubscriberRow[];
  return shape(rows[0]);
});
