import { db, type DropAlertRow } from "@/lib/db";
import { ApiError, handle, isEmail, json, normalize, visitorFrom } from "@/lib/api";
import { DROPS } from "@/lib/data/drops";
import { STORES } from "@/lib/data/stores";

const shape = (r: DropAlertRow) => ({ id: r.id, dropId: r.drop_id, email: r.email, storeId: r.store_id ?? null, visitorId: r.visitor_id, createdAt: r.created_at });

export const GET = handle(async (req) => {
  const sql = db();
  const url = new URL(req.url);
  if (url.searchParams.has("mine")) {
    const rows = (await sql`select drop_id from drop_alerts where visitor_id = ${visitorFrom(req)}`) as { drop_id: string }[];
    return rows.map((r) => r.drop_id);
  }
  const count = url.searchParams.get("count");
  if (count) {
    const storeId = url.searchParams.get("store");
    const rows = (storeId
      ? await sql`select count(*)::int as n from drop_alerts where drop_id = ${count} and store_id = ${storeId} and demo = false and visitor_id not in (select visitor_id from internal_visitors)`
      : await sql`select count(*)::int as n from drop_alerts where drop_id = ${count} and demo = false and visitor_id not in (select visitor_id from internal_visitors)`) as { n: number }[];
    return { count: rows[0]?.n ?? 0 };
  }
  const demo = url.searchParams.has("demo");
  const rows = (await sql`select * from drop_alerts where (demo = false or ${demo}) and visitor_id not in (select visitor_id from internal_visitors) order by created_at desc limit 500`) as DropAlertRow[];
  return rows.map(shape);
});

export const POST = handle(async (req) => {
  const sql = db();
  const { dropId, email, storeId } = await json<{ dropId?: unknown; email?: unknown; storeId?: unknown }>(req);
  if (!isEmail(email)) throw new ApiError(400, "That email looks a little off.");
  if (typeof dropId !== "string" || !DROPS.some((d) => d.id === dropId)) throw new ApiError(400, "Unknown drop");
  const store = typeof storeId === "string" && STORES.some((s) => s.id === storeId) ? storeId : null;
  const rows = (await sql`
    insert into drop_alerts (drop_id, email, visitor_id, store_id)
    values (${dropId}, ${normalize(email)}, ${visitorFrom(req)}, ${store})
    on conflict (drop_id, email) do update set store_id = coalesce(excluded.store_id, drop_alerts.store_id)
    returning *`) as DropAlertRow[];
  return shape(rows[0]);
});
