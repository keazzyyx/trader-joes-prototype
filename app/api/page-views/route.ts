import { db } from "@/lib/db";
import { ApiError, handle, json, visitorFrom } from "@/lib/api";

/** One row per visitor per path; repeat visits to the same page are ignored. */
export const POST = handle(async (req) => {
  const sql = db();
  const { path, referrer, utmSource } = await json<{ path?: unknown; referrer?: unknown; utmSource?: unknown }>(req);
  if (typeof path !== "string" || !path.startsWith("/") || path.length > 200) throw new ApiError(400, "Bad path");
  await sql`insert into page_views (visitor_id, path, referrer, utm_source)
    values (${visitorFrom(req)}, ${path}, ${typeof referrer === "string" ? referrer.slice(0, 200) : null}, ${typeof utmSource === "string" ? utmSource.slice(0, 60) : null})
    on conflict (visitor_id, path) do nothing`;
  return { ok: true };
});
