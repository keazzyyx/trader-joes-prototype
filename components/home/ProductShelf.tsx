"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BagelSeasoning, CauliflowerGnocchi, ChiliOnionCrunch, CookieButter, OrangeChicken, UnexpectedCheddar } from "@/components/art/Famous";
import { FlyerButton } from "@/components/layout/FlyerDrawer";
import { buttonClass } from "@/components/ui/button";
import { track } from "@/lib/analytics";

const ITEMS = [
  { id: "ebtb", name: "Everything but the Bagel Seasoning", price: "$2.49", note: "Goes on eggs, avocado, popcorn, regret.", Art: BagelSeasoning },
  { id: "orange-chicken", name: "Mandarin Orange Chicken", price: "$5.49", note: "Wins an award roughly every year.", Art: OrangeChicken },
  { id: "cookie-butter", name: "Speculoos Cookie Butter", price: "$3.99", note: "Spread it. Or just use a spoon.", Art: CookieButter },
  { id: "cauli-gnocchi", name: "Cauliflower Gnocchi", price: "$2.99", note: "Pan-fry it, don’t boil it. Trust us.", Art: CauliflowerGnocchi },
  { id: "unexpected-cheddar", name: "Unexpected Cheddar", price: "$9.99/lb", note: "Cheddar that thinks it’s parmesan.", Art: UnexpectedCheddar },
  { id: "chili-onion-crunch", name: "Chili Onion Crunch", price: "$4.49", note: "Crispy garlic, onion, chili, oil. Put it on everything.", Art: ChiliOnionCrunch },
];

export function ProductShelf() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  useEffect(() => {
    if (inView) track("shelf_section_viewed", { section: "famous_regulars", items: ITEMS.map((i) => i.id) });
  }, [inView]);

  return (
    <section aria-labelledby="shelf-title" className="pt-20 pb-6 sm:pt-28">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[640px]">
          <h2 id="shelf-title" className="font-wonk text-[40px] leading-[1.02] font-semibold sm:text-[56px]">
            The ones people drive across town for.
          </h2>
          <p className="mt-4 text-[18px] leading-relaxed text-ink/75">
            Six regulars that never leave. Everything else rotates, and the Flyer is how you hear about it.
          </p>
        </div>
        <FlyerButton from="shelf" className={buttonClass("ink", "self-start lg:self-auto")}>
          Tell me what&rsquo;s new
        </FlyerButton>
      </div>

      <div ref={ref} className="relative mx-auto mt-10 max-w-[1260px]">
        <ul
          className="no-scrollbar relative z-10 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pt-6 sm:px-6 xl:justify-between xl:overflow-visible"
          aria-label="Famous regulars"
          tabIndex={0}
        >
          {ITEMS.map(({ id, name, price, note, Art }, i) => (
            <motion.li
              key={id}
              initial={{ opacity: 0, x: 90 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ delay: i * 0.09, type: "spring", stiffness: 140, damping: 18 }}
              className="group flex w-[176px] shrink-0 snap-start flex-col items-center sm:w-[190px]"
            >
              <div className="h-[196px] w-[160px] transition-transform duration-300 ease-[var(--ease-settle)] group-hover:-translate-y-2 group-hover:-rotate-2">
                <Art />
              </div>
              {/* the shelf lip under each item; the full plank is drawn behind */}
              <div aria-hidden className="h-[18px] w-full" />
              <motion.div
                initial={{ rotate: 0 }}
                animate={inView ? { rotate: [0, i % 2 ? 5 : -5, i % 2 ? -1.5 : 1.5] } : undefined}
                transition={{ delay: 0.5 + i * 0.09, duration: 0.8 }}
                style={{ transformOrigin: "50% -8px" }}
                className="relative mt-2 w-[160px]"
              >
                <span aria-hidden className="absolute -top-3 left-6 h-3 w-px bg-ink/50" />
                <span aria-hidden className="absolute -top-3 right-6 h-3 w-px bg-ink/50" />
                <div className="tex-board on-dark rounded-[3px] border-2 border-kraft-deep px-3 pt-2 pb-3 text-center shadow-[0_8px_14px_-10px_rgb(31_26_23/0.8)]">
                  <p className="font-wonk chalk-text text-[28px] leading-none font-semibold">{price}</p>
                  <p className="mt-1.5 text-[14px] leading-tight font-medium text-chalk">{name}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-chalk/70">{note}</p>
                </div>
              </motion.div>
            </motion.li>
          ))}
        </ul>
        {/* the wooden plank */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[222px] z-0 h-[24px]">
          <div
            className="h-[16px] w-full"
            style={{
              background:
                "repeating-linear-gradient(90deg, var(--color-kraft) 0 38px, var(--color-kraft-deep) 38px 40px, var(--color-kraft) 40px 90px, var(--color-kraft-deep) 90px 91px), var(--color-kraft)",
              boxShadow: "inset 0 2px 0 rgb(255 253 248 / 0.5), inset 0 -3px 0 rgb(31 26 23 / 0.18)",
            }}
          />
          <div className="h-[8px] w-full bg-kraft-deep shadow-[0_10px_16px_-8px_rgb(31_26_23/0.55)]" />
        </div>
      </div>
      <p className="mx-auto mt-3 max-w-[1200px] px-4 text-[14px] text-ink/60 sm:px-6 xl:hidden">Swipe along the shelf.</p>
    </section>
  );
}
