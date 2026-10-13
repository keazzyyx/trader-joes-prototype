import { db, type DropAlertRow } from "@/lib/db";
import { ApiError, handle, isEmail, json, normalize, visitorFrom } from "@/lib/api";
import { DROPS } from "@/lib/data/drops";

const shape = (r: DropAlertRow) => ({ id: r.id, dropId: r.drop_id, email: r.email, visitorId: r.visitor_id, createdAt: r.created_at });

export const GET = handle(async (req) => {
  const sql = db();
  const url = new URL(req.url);
  if (url.searchParams.has("mine")) {
    const rows = (await sql`select drop_id from drop_alerts where visitor_id = ${visitorFrom(req)}`) as { drop_id: string }[];
    return rows.map((r) => r.drop_id);
  }
  const count = url.searchParams.get("count");
  if (count) {
    const rows = (await sql`select count(*)::int as n from drop_alerts where drop_id = ${count} and demo = false`) as { n: number }[];
    return { count: rows[0]?.n ?? 0 };
  }
  const demo = url.searchParams.has("demo");
  const rows = (await sql`select * from drop_alerts where demo = false or ${demo} order by created_at desc limit 500`) as DropAlertRow[];
  return rows.map(shape);
});

export const POST = handle(async (req) => {
  const sql = db();
  const { dropId, email } = await json<{ dropId?: unknown; email?: unknown }>(req);
  if (!isEmail(email)) throw new ApiError(400, "That email looks a little off.");
  if (typeof dropId !== "string" || !DROPS.some((d) => d.id === dropId)) throw new ApiError(400, "Unknown drop");
  const rows = (await sql`
    insert into drop_alerts (drop_id, email, visitor_id)
    values (${dropId}, ${normalize(email)}, ${visitorFrom(req)})
    on conflict (drop_id, email) do update set email = excluded.email
    returning *`) as DropAlertRow[];
  return shape(rows[0]);
});
