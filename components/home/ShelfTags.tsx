"use client";
import { motion } from "framer-motion";
import { RoughRect } from "@/components/art/RoughRect";

type Tag = {
  title: string;
  body: string;
  tone: "kraft" | "paper" | "board" | "red";
  settle: number;
  icon: React.ReactNode;
};

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const TAGS: Tag[] = [
  {
    title: "No coupons. Not one.",
    body: "Nobody’s clipping anything. We skip the sales circus and keep the everyday price low instead.",
    tone: "kraft",
    settle: -2.5,
    icon: (
      <svg viewBox="0 0 48 48" className="size-12" aria-hidden>
        <path {...stroke} d="M8 14h32v20H8zM8 20c3 0 3 8 0 8M40 20c-3 0-3 8 0 8" strokeDasharray="4 3" />
        <path {...stroke} d="M6 40L42 8" strokeWidth={3} />
      </svg>
    ),
  },
  {
    title: "About 4,000 things. Not 40,000.",
    body: "A normal supermarket carries ten times more. We’d rather carry one great salsa than nine okay ones.",
    tone: "paper",
    settle: 1.8,
    icon: (
      <svg viewBox="0 0 48 48" className="size-12" aria-hidden>
        <path {...stroke} d="M6 20h36M6 36h36" />
        <path {...stroke} d="M10 20v-8h6v8M19 20v-10h7v10M29 20v-6h9v6M11 36v-9h8v9M23 36v-11h5v11M31 36v-7h8v7" />
      </svg>
    ),
  },
  {
    title: "Our name’s on most of the labels.",
    body: "Most of what’s here is Trader Joe’s brand. We taste it, argue about it, and only then put it on a shelf.",
    tone: "board",
    settle: -1.2,
    icon: (
      <svg viewBox="0 0 48 48" className="size-12" aria-hidden>
        <path {...stroke} d="M8 10h22l10 14-10 14H8z" />
        <circle cx="30" cy="24" r="2.5" fill="currentColor" />
        <path {...stroke} d="M13 20h10M13 27h7" />
      </svg>
    ),
  },
  {
    title: "Didn’t love it? Bring it back.",
    body: "Even if you ate half. You get your money back, and nobody gives you a look about it.",
    tone: "red",
    settle: 2.4,
    icon: (
      <svg viewBox="0 0 48 48" className="size-12" aria-hidden>
        <path {...stroke} d="M14 16h18a9 9 0 0 1 0 18H16" />
        <path {...stroke} d="M20 9l-7 7 7 7" />
      </svg>
    ),
  },
];

const toneClass: Record<Tag["tone"], string> = {
  kraft: "tex-kraft text-ink",
  paper: "bg-chalk text-ink",
  board: "tex-board chalk-text",
  red: "bg-red text-paper",
};

export function ShelfTags() {
  return (
    <section aria-labelledby="different-title" className="mx-auto max-w-[1200px] px-4 pt-24 pb-10 sm:px-6 sm:pt-32">
      <div className="max-w-[640px]">
        <h2 id="different-title" className="font-wonk text-[40px] leading-[1.02] font-semibold sm:text-[56px]">
          Why it feels different in here.
        </h2>
        <p className="mt-4 text-[18px] leading-relaxed text-ink/75">
          Four things we do on purpose. They&rsquo;re also why we can&rsquo;t give you a points card.
        </p>
      </div>

      <motion.ul
        className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ staggerChildren: 0.12 }}
      >
        {TAGS.map((tag, i) => (
          <motion.li
            key={tag.title}
            variants={{
              hidden: { opacity: 0, y: 70, rotate: tag.settle * -5 },
              shown: { opacity: 1, y: 0, rotate: tag.settle, transition: { type: "spring", stiffness: 120, damping: 11, mass: 0.9 } },
            }}
            style={{ transformOrigin: "22px 18px" }}
            className={`relative drop-shadow-[0_12px_14px_rgb(31_26_23/0.28)] ${i % 2 ? "lg:mt-10" : ""}`}
          >
            {/* the string it hangs from */}
            <svg aria-hidden viewBox="0 0 40 40" className="absolute -top-7 left-[10px] h-10 w-10 text-ink/55">
              <path d="M12 38C8 26 14 14 22 2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div className={`relative px-6 pt-10 pb-7 ${toneClass[tag.tone]}`} style={{ clipPath: "polygon(0 14px, 14px 0, 100% 0, 100% 100%, 0 100%)", backgroundImage: "var(--noise)" }}>
              <span aria-hidden className="absolute top-3.5 left-4 size-3.5 rounded-full border-2 border-current bg-paper/80 opacity-70" />
              <RoughRect seed={i + 1} className="m-2 !h-[calc(100%-16px)] !w-[calc(100%-16px)] opacity-60" strokeWidth={1.5} />
              <div className={tag.tone === "paper" ? "text-red" : ""}>{tag.icon}</div>
              <h3 className="font-wonk mt-4 text-[25px] leading-[1.08] font-semibold">{tag.title}</h3>
              <p className={`mt-3 text-[16px] leading-relaxed ${tag.tone === "board" ? "text-chalk/85" : tag.tone === "red" ? "text-paper/90" : "text-ink/80"}`}>{tag.body}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
