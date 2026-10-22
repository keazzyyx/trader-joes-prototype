import { neon } from "@neondatabase/serverless";

/** One Neon HTTP client per process. Only ever imported from route handlers and scripts, never from components. */
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Put your Neon connection string in .env.local (see README).");
  return neon(url);
}

/** Row shapes as Postgres returns them (snake_case, Date objects). */
export type SubscriberRow = { id: string; email: string; source: string; visitor_id: string; created_at: string };
export type DropAlertRow = { id: string; drop_id: string; email: string; store_id: string | null; visitor_id: string; created_at: string };
export type MemberRow = { id: string; member_number: string; email: string; birth_month: number | null; store_id: string; categories: string[]; visitor_id: string; created_at: string };
export type WaitlistRow = { id: string; store_id: string; email: string; visitor_id: string; created_at: string };
export type EventRow = { id: number; name: string; client_id: string; session_id: string | null; page: string | null; params: Record<string, unknown>; created_at: string };
