/** Shapes shared by /api/insights, /api/present and the pages that render them. */
export type AskRate = { ask: "flyer" | "drop_alert" | "crew" | "waitlist"; label: string; seen: number; converted: number; rate: number };
export type Channel = { source: string; visits: number; signups: number; rate: number };
export type Ranked = { id: string; name: string; count: number };

export type Insights = {
  generatedAt: string;
  uniqueVisitors: number;
  reachableEmails: number;
  crewMembers: number;
  convertedVisitors: number;
  signupRate: number;
  medianScanToSignupMs: number | null;
  tagVisits: number;
  tagAlerts: number;
  tagConversion: number | null;
  asks: AskRate[];
  channels: Channel[];
  mostWanted: Ranked[];
  deliveryStores: Ranked[];
  crew: { visited: number; email: number; store: number; finished: number };
  aisles: Ranked[];
  findings: { ready: boolean; needed: number; have: number; lines: string[] };
};

export type PresentStats = {
  generatedAt: string;
  since: string;
  alerts: number;
  flyerSignups: number;
  crewMembers: number;
  medianScanToSignupMs: number | null;
  scans: number;
};

export const fmtPct = (r: number) => `${Math.round(r * 100)}%`;
export const fmtSeconds = (ms: number | null) => (ms == null ? null : (ms / 1000).toFixed(ms < 10_000 ? 1 : 0));
