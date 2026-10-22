import { db, type WaitlistRow } from "@/lib/db";
import { ApiError, handle, isEmail, json, normalize, visitorFrom } from "@/lib/api";
import { STORES } from "@/lib/data/stores";

const shape = (r: WaitlistRow) => ({ id: r.id, storeId: r.store_id, email: r.email, visitorId: r.visitor_id, createdAt: r.created_at });

export const GET = handle(async (req) => {
  const sql = db();
  const url = new URL(req.url);
  if (url.searchParams.has("mine")) {
    const rows = (await sql`select store_id from waitlist where visitor_id = ${visitorFrom(req)}`) as { store_id: string }[];
    return rows.map((r) => r.store_id);
  }
  const pos = url.searchParams.get("position");
  if (pos) {
    const rows = (await sql`
      select count(*)::int as n from waitlist w
      where w.store_id = ${pos} and w.demo = false
        and w.created_at <= (select created_at from waitlist where store_id = ${pos} and visitor_id = ${visitorFrom(req)} limit 1)`) as { n: number }[];
    const n = rows[0]?.n ?? 0;
    return { position: n > 0 ? n : null };
  }
  const count = url.searchParams.get("count");
  if (count) {
    const rows = (await sql`select count(*)::int as n from waitlist where store_id = ${count} and demo = false and visitor_id not in (select visitor_id from internal_visitors)`) as { n: number }[];
    return { count: rows[0]?.n ?? 0 };
  }
  const demo = url.searchParams.has("demo");
  const rows = (await sql`select * from waitlist where (demo = false or ${demo}) and visitor_id not in (select visitor_id from internal_visitors) order by created_at desc limit 500`) as WaitlistRow[];
  return rows.map(shape);
});

export const POST = handle(async (req) => {
  const sql = db();
  const { storeId, email } = await json<{ storeId?: unknown; email?: unknown }>(req);
  if (!isEmail(email)) throw new ApiError(400, "That email doesn’t look quite right.");
  if (typeof storeId !== "string" || !STORES.some((s) => s.id === storeId)) throw new ApiError(400, "Pick a store");
  const rows = (await sql`
    insert into waitlist (store_id, email, visitor_id)
    values (${storeId}, ${normalize(email)}, ${visitorFrom(req)})
    on conflict (store_id, email) do update set email = excluded.email
    returning *`) as WaitlistRow[];
  return shape(rows[0]);
});
