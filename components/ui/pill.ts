import type { Tone } from "@/lib/hero";

/**
 * The one CTA: a pill, 64px tall, display face, caps. Red with cream text
 * everywhere except on red sections, where the fill becomes ink.
 */
export function pill(on: Tone = "cream", extra = "", fill: "auto" | "cream" = "auto") {
  const fillClass =
    fill === "cream"
      ? "bg-cream text-ink hover:bg-ink hover:text-cream"
      : on === "red"
        ? "bg-ink text-cream hover:bg-cream hover:text-ink"
        : "bg-red text-cream hover:bg-ink";
  return (
    "display inline-flex min-h-16 shrink-0 items-center justify-center rounded-full px-8 text-[22px] leading-none " +
    "transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none " +
    fillClass +
    " " +
    extra
  );
}

/** A plain text link-style button in the display face. */
export const textButton = "display inline-flex min-h-12 items-center text-[26px] leading-none underline decoration-[3px] underline-offset-[6px] hover:decoration-red";
