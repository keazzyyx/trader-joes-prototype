import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { FlyerButton } from "@/components/layout/FlyerDrawer";
import { WaxSeal } from "@/components/art/WaxSeal";

export function DropsFooterCta() {
  return (
    <section aria-labelledby="drops-cta" className="mx-auto max-w-[1200px] px-4 pt-16 pb-24 sm:px-6">
      <div className="tex-kraft relative grid gap-8 border-2 border-ink px-6 py-10 shadow-[8px_8px_0_var(--color-board)] sm:px-10 md:grid-cols-[1fr_auto] md:items-center">
        <WaxSeal className="absolute -top-8 right-1 size-20 sm:-right-3 rotate-12 sm:size-24" />
        <div>
          <h2 id="drops-cta" className="font-wonk text-[34px] leading-[1.02] font-semibold sm:text-[46px]">
            Want to hear a day before everyone else?
          </h2>
          <p className="mt-4 max-w-[54ch] text-[17px] leading-relaxed text-ink/80">
            Crew Club members get word on every drop the day before it lands, plus a heads-up when something&rsquo;s back
            in stock at their store. No points. No card to scan. Takes about a minute.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Link href="/crew-club" className={buttonClass("red")}>
            Join the Crew Club
          </Link>
          <FlyerButton from="drops_footer" className={buttonClass("outline")}>
            Just send me the Flyer
          </FlyerButton>
        </div>
      </div>
    </section>
  );
}
