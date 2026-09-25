"use client";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { BagelSeasoning, CauliflowerGnocchi, ChiliOnionCrunch, CookieButter, OrangeChicken, UnexpectedCheddar } from "@/components/art/Famous";
import { Headline } from "@/components/ui/Reveal";
import { Drift } from "@/components/ui/Drift";
import { Smiley } from "@/components/art/Doodles";
import { track } from "@/lib/analytics";

const ITEMS = [
  { id: "ebtb", name: "Everything but the Bagel Seasoning", price: "$2.49", Art: BagelSeasoning, w: "w-[92%]", top: "sm:mt-0" },
  { id: "orange-chicken", name: "Mandarin Orange Chicken", price: "$5.49", Art: OrangeChicken, w: "w-[108%] max-w-none", top: "sm:mt-28" },
  { id: "cookie-butter", name: "Speculoos Cookie Butter", price: "$3.99", Art: CookieButter, w: "w-[94%]", top: "sm:mt-10" },
  { id: "cauli-gnocchi", name: "Cauliflower Gnocchi", price: "$2.99", Art: CauliflowerGnocchi, w: "w-[104%] max-w-none", top: "sm:mt-32" },
  { id: "unexpected-cheddar", name: "Unexpected Cheddar", price: "$9.99/lb", Art: UnexpectedCheddar, w: "w-[112%] max-w-none", top: "sm:mt-0" },
  { id: "chili-onion-crunch", name: "Chili Onion Crunch", price: "$4.49", Art: ChiliOnionCrunch, w: "w-[90%]", top: "sm:mt-24" },
];

export function Products() {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  useEffect(() => {
    if (inView) track("shelf_section_viewed", { section: "famous_regulars", items: ITEMS.map((i) => i.id) });
  }, [inView]);

  return (
    <section aria-labelledby="shelf-title" className="relative overflow-x-clip bg-cream px-5 py-24 sm:px-8 sm:py-36">
      <Headline id="shelf-title" lines={["The ones people", "drive across", "town for"]} className="text-[13vw] sm:text-[9vw]" />
      <p className="mt-6 max-w-[40ch] text-[17px] leading-snug">Six regulars that never leave. Everything else rotates, and the Flyer is how you hear about it.</p>
      <Smiley className="absolute top-[7vw] right-[6vw] hidden size-[8vw] text-red lg:block" />
      <ul ref={ref} className="mt-16 grid grid-cols-2 gap-x-4 gap-y-14 overflow-x-clip sm:mt-24 sm:grid-cols-3 sm:gap-x-6" aria-label="Famous regulars">
        {ITEMS.map(({ id, name, price, Art, w, top }, i) => (
          <li key={id} className={`${top} ${i % 2 ? "justify-self-end" : ""}`}>
            <Drift amount={10 + (i % 3) * 4} className={`mx-auto ${w}`}>
              <Art />
            </Drift>
            <p className="label mt-4 text-center">{name}</p>
            <p className="display mt-1 text-center text-[28px] leading-none">{price}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
