/* Usage: npm run db:migrate | npm run db:seed. Reads DATABASE_URL from .env.local (or the environment). */
import { existsSync, readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { SEED } from "../lib/seed";
import { seedDatabase } from "../lib/seed-db";

// Load .env.local the way Next does, so the script and the app read the same connection string.
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run `vercel env pull .env.local` or add it to .env.local.");
  process.exit(1);
}
const sql = neon(url);
const cmd = process.argv[2];

if (cmd === "migrate") {
  const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
  // The HTTP driver runs one statement per call, so split on blank-line-separated statements.
  for (const stmt of schema.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean)) {
    await sql.query(stmt);
  }
  console.log("Schema applied.");
} else if (cmd === "seed") {
  await seedDatabase(sql, SEED);
  const [{ n }] = (await sql`select count(*)::int as n from subscribers`) as { n: number }[];
  console.log(`Seeded. ${n} subscribers in the table.`);
} else {
  console.error("Usage: tsx scripts/db.ts migrate|seed");
  process.exit(1);
}
