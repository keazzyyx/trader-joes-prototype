import type { Tone } from "@/lib/hero";
import { BG, FG } from "@/lib/hero";
import { Smiley } from "@/components/art/Doodles";

/** A band of repeated text that scrolls forever. Stops under reduced motion. */
export function Marquee({ items, tone = "red", speed = 28 }: { items: string[]; tone?: Tone; speed?: number }) {
  const row = items.map((t, i) => (
    <span key={i} className="inline-flex items-center gap-[0.5em] pr-[0.5em]">
      {t}
      <Smiley className="size-[0.7em]" />
    </span>
  ));
  return (
    <div aria-hidden className={`${BG[tone]} ${FG[tone]} overflow-hidden py-4`}>
      <div className="marquee-track display flex w-max whitespace-nowrap text-[9vw] leading-none sm:text-[5.5vw]" style={{ ["--marquee-speed" as string]: `${speed}s` }}>
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0">{row}</div>
      </div>
    </div>
  );
}
