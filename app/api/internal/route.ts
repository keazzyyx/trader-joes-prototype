import { db } from "@/lib/db";
import { handle, visitorFrom } from "@/lib/api";

/** ?internal=1 adds this browser's visitor id; ?internal=0 removes it. Counts exclude listed visitors. */
export const POST = handle(async (req) => {
  await db()`insert into internal_visitors (visitor_id) values (${visitorFrom(req)}) on conflict do nothing`;
  return { ok: true };
});

export const DELETE = handle(async (req) => {
  await db()`delete from internal_visitors where visitor_id = ${visitorFrom(req)}`;
  return { ok: true };
});
