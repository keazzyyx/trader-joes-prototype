import { WipeLink } from "./Wipe";
import { Boat } from "@/components/art/Doodles";

export function Footer() {
  return (
    <footer className="on-red bg-green text-cream">
      <div className="px-5 pt-20 pb-12 sm:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="display text-[16vw] leading-[0.85] sm:text-[9vw]">Trader Joe’s</p>
            <p className="mt-6 max-w-[40ch] text-[16px] opacity-85">
              Groceries, flowers, questionable snack decisions. About 4,000 of them, and we tasted every one.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid gap-2 text-[15px] font-semibold uppercase sm:grid-cols-2 sm:gap-x-10">
              {[
                ["/", "The store, explained"],
                ["/drops", "Seasonal drops"],
                ["/crew-club", "Crew Club"],
                ["/delivery", "Delivery (someday)"],
              ].map(([href, label]) => (
                <li key={href}>
                  <WipeLink href={href} className="inline-flex min-h-10 items-center underline-offset-4 hover:underline">
                    {label}
                  </WipeLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <WipeLink href="/insights" className="display mt-14 inline-flex min-h-14 items-center text-[26px] leading-none text-yellow underline decoration-[3px] underline-offset-[6px] sm:text-[32px]">
          For Trader Joe’s: see what this site learns
        </WipeLink>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[60ch] text-[15px] font-semibold">
            Student prototype for BENI 370 at the University of San Francisco. Not affiliated with Trader Joe’s.
          </p>
          <p className="max-w-[44ch] text-[14px] opacity-75">
            Prices and seasonal dates are for demonstration. Crew Club and delivery don’t exist. Your email stays in your own browser.
          </p>
        </div>
      </div>
      <Boat className="ml-auto block h-[24vw] w-auto -mb-[4vw] mr-[4vw] text-yellow sm:h-[14vw]" />
    </footer>
  );
}
