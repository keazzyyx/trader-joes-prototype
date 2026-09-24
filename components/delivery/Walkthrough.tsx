"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { CrewShops, Handoff, OrderAhead, Refund } from "./StepArt";

const STEPS = [
  {
    title: "You make a list, same as always.",
    body: "Pick what you want on our website, or call the store and read your list to a real person. You choose a day and a time. That’s the whole first step.",
    Art: OrderAhead,
  },
  {
    title: "A Crew member does the shopping.",
    body: "Someone from your own store walks the aisles with your list. They pick bananas the way you would. If something’s out, they call or text before swapping it.",
    Art: CrewShops,
  },
  {
    title: "Pick it up, or we bring it to your door.",
    body: "Drive up during your window and we’ll put the bags in your trunk. Or we carry them to your doorstep. You don’t need to download anything.",
    Art: Handoff,
  },
  {
    title: "Something not right? Your money back.",
    body: "Bruised peach, wrong cheese, you just didn’t like it. Tell us and we refund it in full. No photos, no forms, no arguing.",
    Art: Refund,
  },
];

export function Walkthrough() {
  const [active, setActive] = useState(0);
  const { Art } = STEPS[active];

  return (
    <section aria-labelledby="how-title" className="mx-auto max-w-[1200px] px-4 sm:px-6">
      <h2 id="how-title" className="font-wonk max-w-[16ch] text-[38px] leading-[1.02] font-semibold sm:text-[54px]">
        How it would work, in four steps.
      </h2>

      <div className="relative mt-6 grid gap-x-16 lg:mt-10 lg:grid-cols-[1fr_1fr]">
        {/* sticky illustration: top of the screen on phones, left column on desktop */}
        <div className="sticky top-[104px] z-10 -mx-4 bg-paper/95 px-4 py-3 backdrop-blur-[2px] sm:top-[108px] lg:top-28 lg:mx-0 lg:h-[calc(100vh-9rem)] lg:bg-transparent lg:px-0 lg:py-0">
          <div className="tex-kraft relative mx-auto flex h-[210px] max-w-[520px] items-center justify-center border-2 border-ink shadow-[6px_6px_0_var(--color-board)] sm:h-[260px] lg:h-full lg:max-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="h-[88%] w-[88%]"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.25 }}
              >
                <Art />
              </motion.div>
            </AnimatePresence>
            <p className="absolute top-3 left-4 text-[14px] font-semibold text-ink/70" aria-hidden>
              Step {active + 1} of 4
            </p>
          </div>
        </div>

        <ol className="relative">
          {STEPS.map((s, i) => (
            <Step key={s.title} index={i} title={s.title} body={s.body} active={active === i} onEnter={() => setActive(i)} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ index, title, body, active, onEnter }: { index: number; title: string; body: string; active: boolean; onEnter: () => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const seen = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (inView) onEnter();
  }, [inView, onEnter]);

  return (
    <li ref={ref} className="flex min-h-[62vh] items-center py-10 lg:min-h-[78vh]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={seen ? { opacity: active ? 1 : 0.4, y: 0 } : undefined}
        transition={{ duration: 0.4 }}
      >
        <span
          className={`grid size-12 place-items-center rounded-full border-2 text-[20px] font-bold transition-colors ${
            active ? "border-red bg-red text-paper" : "border-ink text-ink"
          }`}
        >
          {index + 1}
        </span>
        <h3 className="font-wonk mt-5 text-[30px] leading-[1.08] font-semibold sm:text-[38px]">{title}</h3>
        <p className="mt-4 max-w-[44ch] text-[19px] leading-relaxed text-ink/85 sm:text-[20px]">{body}</p>
      </motion.div>
    </li>
  );
}
