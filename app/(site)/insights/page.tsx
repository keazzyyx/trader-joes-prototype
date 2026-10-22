import type { Metadata } from "next";
import { InsightsClient } from "@/components/insights/InsightsClient";

export const metadata: Metadata = {
  title: "What this site learns",
  description: "What Trader Joe’s learns from this prototype: which ask converts, where shoppers come from, what to stock and where to start delivery.",
};

export default function InsightsPage() {
  return <InsightsClient />;
}
