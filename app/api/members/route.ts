import { db, type MemberRow } from "@/lib/db";
import { ApiError, handle, isEmail, json, normalize, visitorFrom } from "@/lib/api";
import { STORES } from "@/lib/data/stores";
import { CATEGORIES } from "@/lib/data/categories";

const shape = (r: MemberRow) => ({
  id: r.id,
  memberNumber: r.member_number,
  email: r.email,
  birthMonth: r.birth_month,
  storeId: r.store_id,
  categories: r.categories,
  visitorId: r.visitor_id,
  createdAt: r.created_at,
});

export const GET = handle(async (req) => {
  const sql = db();
  if (new URL(req.url).searchParams.has("mine")) {
    const rows = (await sql`select * from members where visitor_id = ${visitorFrom(req)} limit 1`) as MemberRow[];
    return rows[0] ? shape(rows[0]) : null;
  }
  const rows = (await sql`select * from members order by created_at desc limit 500`) as MemberRow[];
  return rows.map(shape);
});

export const POST = handle(async (req) => {
  const sql = db();
  const body = await json<{ email?: unknown; birthMonth?: unknown; storeId?: unknown; categories?: unknown }>(req);
  if (!isEmail(body.email)) throw new ApiError(400, "That email looks a little off.");
  if (typeof body.storeId !== "string" || !STORES.some((s) => s.id === body.storeId)) throw new ApiError(400, "Pick a store");
  const cats = Array.isArray(body.categories) ? body.categories.filter((c): c is string => typeof c === "string" && CATEGORIES.some((k) => k.id === c)) : [];
  if (cats.length !== 3) throw new ApiError(400, "Pick three aisles");
  const birth = typeof body.birthMonth === "number" && body.birthMonth >= 1 && body.birthMonth <= 12 ? body.birthMonth : null;

  const visitor = visitorFrom(req);
  const [{ n }] = (await sql`select count(*)::int as n from members`) as { n: number }[];
  const number = `CC-${new Date().getFullYear().toString().slice(2)}-${(41_200 + n * 7 + Math.floor(Math.random() * 7)).toString().padStart(6, "0")}`;
  const rows = (await sql`
    insert into members (member_number, email, birth_month, store_id, categories, visitor_id)
    values (${number}, ${normalize(body.email)}, ${birth}, ${body.storeId}, ${cats}, ${visitor})
    on conflict (visitor_id) do update
      set email = excluded.email, birth_month = excluded.birth_month, store_id = excluded.store_id, categories = excluded.categories, created_at = now()
    returning *`) as MemberRow[];
  return shape(rows[0]);
});

export const DELETE = handle(async (req) => {
  const sql = db();
  await sql`delete from members where visitor_id = ${visitorFrom(req)}`;
  return { ok: true };
});
