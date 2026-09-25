import type { Metadata } from "next";
import { CrewSignup } from "@/components/crew/CrewSignup";
import { Headline, Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { pill } from "@/components/ui/pill";
import { Eye } from "@/components/art/Doodles";

export const metadata: Metadata = {
  title: "Crew Club",
  description: "A loyalty program with no points, no tiers and no discounts. Just early word on drops, a birthday item and back-in-stock alerts.",
};

const PERKS = [
  { big: "Early word on drops", small: "The day before a seasonal thing lands, you hear about it. Pumpkin people, this is your moment." },
  { big: "Something on your birthday", small: "Tell a Crew member at the register it’s your birthday month. They’ll hand you a small something. Could be flowers. Could be cookies." },
  { big: "Back-in-stock alerts, for your store", small: "When your favorite frozen thing comes back to your store, you get one email. Not a region. Your store." },
];

export default function CrewClubPage() {
  return (
    <>
      <section className="relative overflow-x-clip bg-yellow px-5 pt-36 pb-20 text-ink sm:px-8 sm:pt-40 sm:pb-28">
        <Headline as="h1" lines={["No points.", "No tiers.", "No discounts."]} className="text-[18vw] sm:text-[14.5vw]" />
        <Eye className="absolute right-[-4vw] bottom-[8vw] hidden h-[14vw] w-auto text-ink lg:block" />
        <p className="mt-10 max-w-[46ch] text-[17px] leading-snug">
          No plastic card on your keychain either. Our prices are already the price, so there’s nothing to unlock. Crew Club just means you hear things first.
        </p>
        <a href="#join" className={pill("yellow", "mt-8")}>
          Join the Crew
        </a>
        <p className="mt-5 text-[14px] opacity-70">Crew Club is made up for this class project. Trader Joe’s really doesn’t have a loyalty program.</p>
      </section>

      <Marquee tone="red" items={["No points", "No tiers", "No discounts", "No points", "No tiers", "No discounts"]} />

      <section aria-labelledby="perks-title" className="on-red bg-green px-5 py-24 text-cream sm:px-8 sm:py-36">
        <Headline id="perks-title" lines={["What you", "actually get"]} className="text-[13vw] sm:text-[9vw]" />
        <ol className="mt-16 grid gap-14 sm:mt-24 sm:gap-20">
          {PERKS.map((p, i) => (
            <li key={p.big} className={i % 2 ? "sm:ml-auto sm:text-right" : ""}>
              <p className="display max-w-[13em] text-[10vw] sm:text-[5.6vw]">
                <Reveal>{p.big}</Reveal>
              </p>
              <p className={`mt-3 max-w-[42ch] text-[16px] leading-snug opacity-85 ${i % 2 ? "sm:ml-auto" : ""}`}>{p.small}</p>
            </li>
          ))}
        </ol>
      </section>

      <CrewSignup />
    </>
  );
}
