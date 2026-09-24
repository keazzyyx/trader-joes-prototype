import type { Metadata } from "next";
import { DropsBoard } from "@/components/drops/DropsBoard";
import { DropsFooterCta } from "@/components/drops/DropsFooterCta";

export const metadata: Metadata = {
  title: "Seasonal drops",
  description: "Pumpkin everything, peppermint everything, and when it all lands. Set an alert so you don’t miss it.",
};

export default function DropsPage() {
  return (
    <>
      <DropsBoard />
      <DropsFooterCta />
    </>
  );
}
