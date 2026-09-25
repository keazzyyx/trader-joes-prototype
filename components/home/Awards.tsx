import { Headline, Reveal } from "@/components/ui/Reveal";
import { Star } from "@/components/art/Doodles";

/** 17th annual Customer Choice Awards, 2026. */
const WINNERS: { category: string; winner: string; price?: string }[] = [
  { category: "Overall favorite", winner: "Steamed Pork & Ginger Soup Dumplings", price: "$3.49" },
  { category: "New product", winner: "Protein Pancakes" },
  { category: "Beverage", winner: "Spiced Cider" },
  { category: "Snack", winner: "Garlic Butter Irish Potato Chips" },
  { category: "Sweet treat", winner: "Sublime Ice Cream Sandwiches" },
  { category: "Lunch & dinner", winner: "Butter Chicken with Basmati Rice" },
  { category: "Breakfast", winner: "Hashbrowns", price: "$2.99" },
  { category: "Cheese", winner: "Goat Cheese" },
  { category: "Produce", winner: "Teeny Tiny Avocados" },
  { category: "Bath & body", winner: "Bio Nut Body Butter" },
];

const HALL_OF_FAME = ["Mandarin Orange Chicken", "Chili & Lime Rolled Corn Tortilla Chips"];

export function Awards() {
  return (
    <section aria-labelledby="awards-title" className="relative bg-yellow px-5 py-24 text-ink sm:px-8 sm:py-36">
      <p className="label">The 17th annual, as voted by the people who shop here</p>
      <Headline id="awards-title" lines={["Customer Choice", "Awards 2026"]} className="mt-3 text-[13vw] sm:text-[9vw]" />
      <p className="mt-6 max-w-[44ch] text-[17px] leading-snug">
        Every year we ask shoppers to pick favorites. This year soup dumplings took the top spot, and a tiny avocado beat everything else in produce.
      </p>
      <Star className="absolute top-[6vw] right-[5vw] hidden size-[9vw] text-red lg:block" />
      <ol className="mt-16 sm:mt-24">
        {WINNERS.map((w, i) => (
          <li key={w.category} className="grid gap-x-8 py-4 sm:grid-cols-[6ch_1fr] sm:items-baseline sm:py-3">
            <span className="display text-[24px] leading-none text-red sm:text-[3vw]">{i + 1}</span>
            <div>
              <p className="label">{w.category}</p>
              <p className="display text-[9vw] leading-[0.95] sm:text-[4.4vw]">
                <Reveal>
                  {w.winner}
                  {w.price && <span className="ml-3 text-red">{w.price}</span>}
                </Reveal>
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-12 text-[16px]">
        <span className="label mr-2">Hall of Fame:</span>
        {HALL_OF_FAME.join(", ")}
      </p>
    </section>
  );
}
