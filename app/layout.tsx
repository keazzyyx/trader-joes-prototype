import type { Metadata, Viewport } from "next";
import { Anton, Work_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Tracking } from "@/components/layout/Tracking";
import { DemoBar } from "@/components/layout/DemoBar";
import { Suspense } from "react";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400", display: "swap" });
const workSans = Work_Sans({ variable: "--font-work-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Trader Joe’s: about 4,000 products and no coupons",
    template: "%s | Trader Joe’s (student prototype)",
  },
  description:
    "A student marketing prototype for BENI 370 at USF. Sign up for the Fearless Flyer, get seasonal drop alerts, and join the (fictional) Crew Club. Not affiliated with Trader Joe’s.",
};

export const viewport: Viewport = { themeColor: "#F6EFE3", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${workSans.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          {children}
          <Suspense fallback={null}>
            <Tracking />
          </Suspense>
          <DemoBar />
        </Providers>
      </body>
    </html>
  );
}
