import Link from "next/link";
import { FlyerButton } from "./FlyerDrawer";
import { buttonClass } from "@/components/ui/button";
import { Ornament } from "@/components/art/Ornament";

export function Footer() {
  return (
    <footer className="tex-board on-dark chalk-text mt-auto border-t-[10px] border-kraft-deep">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-wonk text-[34px] leading-none font-bold text-chalk">Trader Joe&rsquo;s</p>
          <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-chalk/80">
            Groceries, flowers, questionable snack decisions. About 4,000 of them, and we tasted every one.
          </p>
          <FlyerButton from="footer" className={buttonClass("chalk", "mt-6")}>
            Send me the Flyer
          </FlyerButton>
        </div>
        <nav aria-label="Footer">
          <p className="font-soft text-[20px] text-kraft">Around here</p>
          <ul className="mt-3 grid gap-1 text-[16px]">
            {[
              ["/", "The store, explained"],
              ["/drops", "Seasonal drops"],
              ["/crew-club", "Crew Club"],
              ["/delivery", "Delivery (someday)"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-10 items-center text-chalk/85 underline-offset-4 hover:text-chalk hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-soft text-[20px] text-kraft">The fine print</p>
          <p className="mt-3 text-[15px] leading-relaxed text-chalk/75">
            Prices and seasonal dates are for demonstration. Crew Club and delivery don&rsquo;t exist. Your email stays
            in your own browser.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-4 pb-10 sm:px-6">
        <Ornament className="mx-auto h-4 w-56 text-kraft/70" />
        <p className="mt-5 text-center text-[15px] font-medium text-chalk">
          Student prototype for BENI 370 at the University of San Francisco. Not affiliated with Trader Joe&rsquo;s.
        </p>
      </div>
    </footer>
  );
}
