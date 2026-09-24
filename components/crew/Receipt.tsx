"use client";
import { motion } from "framer-motion";

const LINES: [string, string, string?][] = [
  ["Points", "0"],
  ["Tiers", "0"],
  ["Member-only prices", "0", "The price is already the price."],
  ["Early word on drops", "Yes"],
  ["A birthday item", "Yes"],
  ["Back-in-stock alerts", "Yes", "For your store, not some warehouse."],
];

/** The pitch as a receipt that prints out of the register. */
export function Receipt() {
  return (
    <div
      className="relative mx-auto w-full max-w-[380px] rotate-[1.5deg]"
      style={{ filter: "drop-shadow(0 1px 1px rgb(31 26 23 / 0.25)) drop-shadow(0 16px 18px rgb(31 26 23 / 0.2))" }}
    >
    {/* register slot */}
    <div aria-hidden className="absolute -top-2 -inset-x-1.5 z-10 sm:-inset-x-3 h-3 rounded-full bg-ink" />
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      transition={{ duration: 1.3, ease: [0.3, 0.1, 0.3, 1], delay: 0.2 }}
    >
      <div
        className="tex-paper px-6 pt-7 pb-10 text-ink"
        style={{
          maskImage: "linear-gradient(#000,#000), conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg)",
          maskSize: "100% calc(100% - 10px), 16px 10px",
          maskPosition: "top, bottom",
          maskRepeat: "no-repeat, repeat-x",
          WebkitMaskImage: "linear-gradient(#000,#000), conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg)",
          WebkitMaskSize: "100% calc(100% - 10px), 16px 10px",
          WebkitMaskPosition: "top, bottom",
          WebkitMaskRepeat: "no-repeat, repeat-x",
        }}
      >
        <p className="font-wonk text-center text-[26px] leading-none font-bold text-red">Trader Joe&rsquo;s</p>
        <p className="mt-1 text-center text-[14px] text-ink/65">Crew Club, store copy</p>
        <div className="my-4 border-t-2 border-dashed border-ink/40" />
        <dl className="grid gap-3 text-[15px] tabular-nums">
          {LINES.map(([k, v, note]) => (
            <div key={k}>
              <div className="flex items-baseline gap-2">
                <dt className="font-medium">{k}</dt>
                <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-ink/40" />
                <dd className={`font-semibold ${v === "Yes" ? "text-red-deep" : ""}`}>{v}</dd>
              </div>
              {note && <p className="mt-0.5 text-[13px] text-ink/60">{note}</p>}
            </div>
          ))}
        </dl>
        <div className="my-4 border-t-2 border-dashed border-ink/40" />
        <div className="flex items-baseline justify-between text-[17px] font-bold">
          <span>Total cost to you</span>
          <span className="tabular-nums">$0.00</span>
        </div>
        <p className="font-wonk mt-5 text-center text-[17px] italic text-ink/75">Thanks for not collecting anything.</p>
      </div>
    </motion.div>
    </div>
  );
}
