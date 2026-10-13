import { db } from "@/lib/db";
import { ApiError, handle } from "@/lib/api";

/** Wipes every table. Requires RESET_TOKEN to be set and passed as ?token=; refuses otherwise. */
export const POST = handle(async (req) => {
  const token = process.env.RESET_TOKEN;
  if (!token) throw new ApiError(403, "Reset is disabled: RESET_TOKEN is not set.");
  if (new URL(req.url).searchParams.get("token") !== token) throw new ApiError(403, "Wrong reset token.");
  const sql = db();
  await sql`truncate subscribers, drop_alerts, members, waitlist, events`;
  return { ok: true };
});
