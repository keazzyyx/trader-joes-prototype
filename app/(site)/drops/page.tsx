import type { Metadata } from "next";
import { DropsBoard } from "@/components/drops/DropsBoard";
import { Marquee } from "@/components/ui/Marquee";
import { Headline } from "@/components/ui/Reveal";
import { WipeLink } from "@/components/layout/Wipe";
import { SignupCta } from "@/components/layout/SignupCta";
import { Signup } from "@/components/ui/Signup";
import { pill } from "@/components/ui/pill";

export const metadata: Metadata = {
  title: "Seasonal drops",
  description: "Pumpkin everything, peppermint everything, and when it all lands. Set an alert so you don’t miss it.",
};

export default function DropsPage() {
  return (
    <>
      <DropsBoard />
      <Marquee tone="yellow" items={["In stores now", "Coming up", "Gone until next year", "In stores now", "Coming up", "Gone until next year"]} />
      <section aria-labelledby="drops-cta" className="bg-cream px-5 py-24 sm:px-8 sm:py-36">
        <Headline id="drops-cta" lines={["Want to hear a day", "before everyone else?"]} className="text-[13vw] sm:text-[8.5vw]" />
        <p className="mt-6 max-w-[54ch] text-[17px] leading-snug">
          Crew Club members get word on every drop the day before it lands, plus a heads-up when something’s back in stock at their store. No points. No card to scan. Takes about a minute.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <WipeLink href="/crew-club" className={pill("cream")}>
            Join the Crew Club
          </WipeLink>
          <SignupCta from="drops_footer" className="display inline-flex min-h-16 items-center text-[26px] underline decoration-[3px] underline-offset-[6px]">
            Just send me the Flyer
          </SignupCta>
        </div>
        <Signup source="drops" on="cream" className="mt-16 max-w-[860px]" />
      </section>
    </>
  );
}
