import type { Metadata } from "next";
import { Receipt } from "@/components/crew/Receipt";
import { CrewSignup } from "@/components/crew/CrewSignup";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Crew Club",
  description: "A loyalty program with no points, no tiers and no discounts. Just early word on drops, a birthday item and back-in-stock alerts.",
};

const PERKS = [
  {
    title: "Early word on drops",
    body: "The day before a seasonal thing lands, you hear about it. Pumpkin people, this is your moment.",
  },
  {
    title: "Something on your birthday",
    body: "Tell a Crew member at the register it’s your birthday month. They’ll hand you a small something. Could be flowers. Could be cookies.",
  },
  {
    title: "Back-in-stock alerts, for your store",
    body: "When your favorite frozen thing comes back to your store, you get one email. Not a region. Your store.",
  },
];

export default function CrewClubPage() {
  return (
    <>
      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 pt-10 pb-16 sm:px-6 sm:pt-16 lg:grid-cols-[1fr_400px] lg:gap-16">
        <div>
          <h1 className="font-wonk text-[48px] leading-[0.96] font-semibold sm:text-[76px]">
            A loyalty program with <span className="text-red">no points.</span>
          </h1>
          <p className="mt-6 max-w-[50ch] text-[19px] leading-relaxed text-ink/80">
            No tiers, no discounts, no plastic card on your keychain. Our prices are already the price, so there&rsquo;s
            nothing to unlock. Crew Club just means you hear things first.
          </p>
          <a href="#join" className={buttonClass("red", "mt-8")}>
            Start my Crew Club card
          </a>
          <p className="mt-4 text-[14px] text-ink/60">Crew Club is made up for this class project. Trader Joe&rsquo;s really doesn&rsquo;t have a loyalty program.</p>
        </div>
        <Receipt />
      </section>

      <section aria-labelledby="perks-title" className="tex-board on-dark chalk-text border-y-[10px] border-kraft-deep">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="perks-title" className="font-wonk text-[36px] leading-[1.02] font-semibold sm:text-[50px]">
            What you actually get
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x-2 md:divide-dashed md:divide-chalk/25">
            {PERKS.map((p) => (
              <div key={p.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
                <h3 className="font-wonk text-[26px] leading-tight font-semibold text-kraft">{p.title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-chalk/85">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="join" aria-labelledby="join-title" className="mx-auto max-w-[1200px] scroll-mt-28 px-4 pt-20 pb-24 sm:px-6 sm:pt-24">
        <div className="mx-auto mb-10 max-w-[760px] text-center">
          <h2 id="join-title" className="font-wonk text-[38px] leading-[1.02] font-semibold sm:text-[52px]">
            Join in about a minute.
          </h2>
          <p className="mt-3 text-[18px] text-ink/75">Three quick questions. Then you get a card you never have to show anyone.</p>
        </div>
        <CrewSignup />
      </section>
    </>
  );
}
