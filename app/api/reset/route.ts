import { db } from "@/lib/db";
import { handle } from "@/lib/api";
import { SEED } from "@/lib/seed";
import { seedDatabase } from "@/lib/seed-db";

/**
 * Wipes every table and reloads the demo rows. It's a class prototype with a public /debug page,
 * so this is deliberately open; set RESET_TOKEN in the environment to require ?token=.
 */
export const POST = handle(async (req) => {
  const token = process.env.RESET_TOKEN;
  if (token && new URL(req.url).searchParams.get("token") !== token) return { error: "Nope" };
  const sql = db();
  await sql`truncate subscribers, drop_alerts, members, waitlist, events`;
  await seedDatabase(sql, SEED);
  return { ok: true };
});
