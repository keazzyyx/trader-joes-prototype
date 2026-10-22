import type { Metadata } from "next";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { DROPS } from "@/lib/data/drops";
import { PresentLive } from "@/components/present/PresentLive";
import { WipeLink } from "@/components/layout/Wipe";
import { pill } from "@/components/ui/pill";

export const metadata: Metadata = { title: "Scan it. Sign up. Watch it land.", robots: { index: false } };
export const dynamic = "force-dynamic";

/** The presenter screen: a giant QR to a shelf tag, and today's live numbers from the room. */
export default async function PresentPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  const drop = DROPS.find((d) => d.id === product) ?? DROPS.find((d) => d.id === "mini-hold-the-cone")!;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const target = `${proto}://${host}/tag/${drop.id}?store=masonic&utm_source=class`;
  const svg = await QRCode.toString(target, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#151515", light: "#0000" } });

  return (
    <section className="flex min-h-dvh flex-col bg-cream px-6 py-6 text-ink lg:px-12 lg:py-10">
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_38vw] lg:gap-16">
        <div>
          <p className="display text-[28px] leading-none text-red lg:text-[2vw]">Trader Joe’s, a student prototype</p>
          <h1 className="display mt-4 text-[13vw] leading-[0.88] lg:text-[8.6vw]">
            Scan it.
            <br />
            Sign up.
            <br />
            Watch it land.
          </h1>
          <p className="mt-6 max-w-[40ch] text-[18px] leading-snug lg:text-[1.4vw]">
            That QR is what sits on an empty shelf. {drop.name} is sold out at Masonic Ave. Scan it and the numbers on this screen move.
          </p>
          <div className="mt-10 lg:mt-12">
            <PresentLive />
          </div>
          <WipeLink href="/insights" className={pill("cream", "mt-10 min-h-[72px] px-10 text-[26px] lg:text-[1.8vw]")}>
            See what we learned
          </WipeLink>
        </div>
        <div className="mx-auto w-full max-w-[520px] lg:max-w-none">
          <div dangerouslySetInnerHTML={{ __html: svg }} role="img" aria-label={`QR code to ${target}`} className="w-full" />
          <p className="label mt-4 text-center opacity-60">{target.replace(/^https?:\/\//, "")}</p>
        </div>
      </div>
    </section>
  );
}
