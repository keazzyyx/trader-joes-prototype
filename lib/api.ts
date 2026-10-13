import { NextResponse } from "next/server";

/** The browser's anonymous id travels in a header. Rows are scoped to it for "mine" queries. */
export const VISITOR_HEADER = "x-visitor-id";

export function visitorFrom(req: Request) {
  const v = req.headers.get(VISITOR_HEADER)?.trim();
  if (!v || v.length > 80) throw new ApiError(400, "Missing visitor id");
  return v;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const isEmail = (v: unknown): v is string => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const normalize = (email: string) => email.trim().toLowerCase();

/** Wraps a handler so thrown ApiErrors become JSON responses and anything else is a 500 with a plain message. */
export function handle(fn: (req: Request) => Promise<unknown>) {
  return async (req: Request) => {
    try {
      const data = await fn(req);
      return NextResponse.json(data ?? null);
    } catch (e) {
      if (e instanceof ApiError) return NextResponse.json({ error: e.message }, { status: e.status });
      console.error(e);
      const msg = e instanceof Error ? e.message : "Something went wrong";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  };
}

export async function json<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new ApiError(400, "Expected a JSON body");
  }
}
