import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DROPS } from "@/lib/data/drops";
import { STORES, resolveStore } from "@/lib/data/stores";
import { TagClient } from "@/components/tag/TagClient";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ store?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const drop = DROPS.find((d) => d.id === slug);
  return { title: drop ? `${drop.name}: tell me when it’s back` : "Shelf tag", robots: { index: false } };
}

/** /tag/[product]?store=[store]: the page behind the QR on an empty shelf. */
export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { store } = await searchParams;
  const drop = DROPS.find((d) => d.id === slug);
  if (!drop) notFound();
  const shop = resolveStore(store) ?? STORES[0];
  return <TagClient slug={drop.id} shop={shop} />;
}
