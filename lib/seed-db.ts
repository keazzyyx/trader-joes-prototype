import type { NeonQueryFunction } from "@neondatabase/serverless";
import type { SEED as SeedShape } from "./seed";

/** Loads the demo rows, flagged demo = true. Idempotent: conflicts on the unique keys are skipped. */
export async function seedDatabase(sql: NeonQueryFunction<false, false>, seed: typeof SeedShape) {
  for (const s of seed.subscribers) {
    await sql`insert into subscribers (id, email, source, visitor_id, created_at, demo) values (gen_random_uuid(), ${s.email}, ${s.source}, ${s.visitorId}, ${s.createdAt}, true) on conflict (email) do nothing`;
  }
  for (const a of seed.dropAlerts) {
    await sql`insert into drop_alerts (drop_id, email, visitor_id, created_at, demo) values (${a.dropId}, ${a.email}, ${a.visitorId}, ${a.createdAt}, true) on conflict (drop_id, email) do nothing`;
  }
  for (const m of seed.members) {
    await sql`insert into members (member_number, email, birth_month, store_id, categories, visitor_id, created_at, demo) values (${m.memberNumber}, ${m.email}, ${m.birthMonth}, ${m.storeId}, ${m.categories}, ${m.visitorId}, ${m.createdAt}, true) on conflict (visitor_id) do nothing`;
  }
  for (const w of seed.waitlist) {
    await sql`insert into waitlist (store_id, email, visitor_id, created_at, demo) values (${w.storeId}, ${w.email}, ${w.visitorId}, ${w.createdAt}, true) on conflict (store_id, email) do nothing`;
  }
}
