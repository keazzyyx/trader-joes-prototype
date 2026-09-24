"use client";
import { motion } from "framer-motion";
import { Ornament } from "@/components/art/Ornament";
import { FlyerButton } from "@/components/layout/FlyerDrawer";
import { buttonClass } from "@/components/ui/button";

const WINNERS = [
  ["Favorite overall", "Mandarin Orange Chicken"],
  ["Favorite cheese", "Unexpected Cheddar"],
  ["Favorite snack", "Peanut Butter Filled Pretzels"],
  ["Favorite seasoning", "Everything but the Bagel"],
  ["Favorite condiment", "Chili Onion Crunch"],
  ["Favorite sweet thing", "Dark Chocolate Peanut Butter Cups"],
  ["Favorite frozen thing that isn’t chicken", "Cauliflower Gnocchi"],
  ["Favorite thing in a bucket by the door", "Sunflowers"],
];

export function Awards() {
  return (
    <section aria-labelledby="awards-title" className="mx-auto max-w-[1200px] px-4 pt-24 sm:px-6 sm:pt-32">
      <div className="tex-paper relative border-2 border-ink p-1.5 shadow-[8px_8px_0_var(--color-kraft)]">
        <div className="border border-ink px-5 py-10 sm:px-12 sm:py-14">
          <div className="text-center">
            <p className="font-wonk text-[18px] italic text-ink/80">As voted by the people who shop here</p>
            <h2 id="awards-title" className="font-wonk mt-2 text-[40px] leading-[0.98] font-bold sm:text-[64px]">
              Customer Choice Awards
            </h2>
            <Ornament className="mx-auto mt-5 h-5 w-60 text-ink" />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
            <div className="text-[17px] leading-relaxed text-ink/85">
              <p>
                <span className="font-wonk float-left mt-1 mr-2 text-[64px] leading-[0.8] font-bold text-red">E</span>
                very year we ask shoppers to pick favorites. Every year the orange chicken wins something. We have
                stopped being surprised.
              </p>
              <p className="mt-4 text-[15px] text-ink/65">
                Picks gathered from recent years&rsquo; awards for this prototype. The next results show up in the Flyer
                first.
              </p>
              <FlyerButton from="awards" className={buttonClass("red", "mt-6")}>
                Send me the next results
              </FlyerButton>
            </div>

            <motion.ol
              className="grid gap-1"
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.08 }}
            >
              {WINNERS.map(([category, winner]) => (
                <li key={category} className="grid grid-cols-1 items-end gap-x-3 border-b border-ink/10 py-3 sm:grid-cols-[auto_1fr_auto] sm:border-0 sm:py-2">
                  <span className="text-[15px] text-ink/70 sm:text-[17px]">{category}</span>
                  <motion.span
                    aria-hidden
                    className="mb-[7px] hidden h-0 origin-left border-b-2 border-dotted border-ink/45 sm:block"
                    variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: 0.5, ease: "easeOut" } } }}
                  />
                  <motion.span
                    className="font-wonk text-[21px] leading-tight font-semibold sm:text-right sm:text-[22px]"
                    variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 0.35 } } }}
                  >
                    {winner}
                  </motion.span>
                </li>
              ))}
            </motion.ol>
          </div>
        </div>
      </div>
    </section>
  );
}
