import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { DROPS } from "@/lib/data/drops";
import { STORES, resolveStore } from "@/lib/data/stores";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ store?: string }> };

export const metadata: Metadata = { title: "Shelf talker", robots: { index: false } };

/** A letter-size shelf talker with a real QR code to the tag page. Print it, tape it to the empty shelf. */
export default async function PrintPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { store } = await searchParams;
  const drop = DROPS.find((d) => d.id === slug);
  if (!drop) notFound();
  const shop = resolveStore(store) ?? STORES[0];
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const target = `${proto}://${host}/tag/${drop.id}?store=${shop.id}&utm_source=shelf`;
  const svg = await QRCode.toString(target, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#151515", light: "#0000" } });

  return (
    <div className="bg-cream text-ink print:bg-cream">
      <style>{`@page { size: letter portrait; margin: 0.5in; } @media print { .no-print { display: none } }`}</style>
      <div className="no-print flex items-center justify-between px-6 py-4 text-[14px]">
        <span>
          Shelf talker for <strong>{drop.name}</strong> at <strong>{shop.name}</strong>. Letter size.
        </span>
        <a href={target} className="underline underline-offset-4">
          Open the tag page
        </a>
      </div>
      <section className="mx-auto flex min-h-[10in] w-full max-w-[7.5in] flex-col px-[0.5in] py-[0.6in]">
        <p className="display text-[28px] leading-none text-red">Trader Joe’s</p>
        <h1 className="display mt-6 text-[150px] leading-[0.85]">Sold out?</h1>
        <p className="display mt-6 max-w-[11ch] text-[64px] leading-[0.92]">{drop.name}</p>
        <p className="mt-8 max-w-[26ch] text-[22px] leading-snug">Scan and we’ll tell you the day it’s back at this store.</p>
        <div className="mt-auto flex items-end justify-between gap-8 pt-10">
          <div className="w-[3.2in]" dangerouslySetInnerHTML={{ __html: svg }} aria-label={`QR code to ${target}`} role="img" />
          <div className="text-right">
            <p className="display text-[40px] leading-none">{shop.name}</p>
            <p className="mt-2 text-[16px]">
              {shop.address}, {shop.city}
            </p>
            <p className="mt-6 text-[12px] opacity-70">Student prototype, BENI 370 at USF. Not affiliated with Trader Joe’s.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
