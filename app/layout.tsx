import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RouteWipe } from "@/components/layout/RouteWipe";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Trader Joe’s: about 4,000 products and no coupons",
    template: "%s | Trader Joe’s (student prototype)",
  },
  description:
    "A student marketing prototype for BENI 370 at USF. Sign up for the Fearless Flyer, get seasonal drop alerts, and join the (fictional) Crew Club. Not affiliated with Trader Joe’s.",
};

export const viewport: Viewport = {
  themeColor: "#FFFDF8",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <RouteWipe />
        </Providers>
      </body>
    </html>
  );
}
