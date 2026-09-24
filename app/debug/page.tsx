import type { Metadata } from "next";
import { DebugPanel } from "@/components/DebugPanel";

export const metadata: Metadata = {
  title: "Debug",
  robots: { index: false, follow: false },
};

export default function DebugPage() {
  return <DebugPanel />;
}
