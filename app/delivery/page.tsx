import type { Metadata } from "next";
import { Steps } from "@/components/delivery/Steps";
import { Waitlist } from "@/components/delivery/Waitlist";
import { Headline } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { pill } from "@/components/ui/pill";
import { SignupCta } from "@/components/layout/SignupCta";
import { Signup } from "@/components/ui/Signup";
import { Boat } from "@/components/art/Doodles";

export const metadata: Metadata = {
  title: "Delivery, someday",
  description: "Trader Joe’s has never delivered. Here’s how it could work, in plain language, and a waitlist for your store.",
};

const QUESTIONS = [
  { q: "Do I need a smartphone or an app?", a: "No. A regular website works, and so does a phone call to your store. If you can read this page, you can order." },
  { q: "Will it cost more than shopping in the store?", a: "Same shelf prices. There would be a small delivery fee for doorstep drop-off. Picking up yourself would be free." },
  { q: "What if they pick the wrong thing?", a: "You get a call or text before any swap. And anything you’re not happy with gets refunded in full, no questions." },
  { q: "Do I have to tip?", a: "No. Crew members are paid by us. You’re welcome to say thank you." },
  { q: "When is this actually happening?", a: "We don’t know yet, honestly. That’s what the waitlist is for. The stores with the most people waiting go first." },
];

export default function DeliveryPage() {
  return (
    <>
      <section className="relative overflow-x-clip bg-cream px-5 pt-36 pb-20 sm:px-8 sm:pt-40 sm:pb-28">
        <Headline as="h1" lines={["Coming soon", "to your door"]} className="text-[18vw] sm:text-[14.5vw]" />
        <Boat className="absolute right-[2vw] bottom-[6vw] hidden h-[12vw] w-auto text-red lg:block" />
        <p className="mt-10 max-w-[46ch] text-[20px] leading-snug">
          We’ve never delivered. In more than fifty years, Trader Joe’s has never brought groceries to anyone’s door. We like the store too much. But plenty of you have asked, so here’s how we’d do it if we did it right.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <a href="#waitlist" className={pill("cream")}>
            Put my name on the waitlist
          </a>
          <span className="text-[16px] opacity-75">Nothing to pay. Nothing to download.</span>
        </div>
      </section>

      <Steps />

      <section aria-labelledby="questions-title" className="bg-cream px-5 py-24 sm:px-8 sm:py-36">
        <Headline id="questions-title" lines={["Fair questions,", "straight answers"]} className="text-[13vw] sm:text-[8.5vw]" />
        <dl className="mt-16 grid gap-12 sm:mt-24 lg:grid-cols-2 lg:gap-x-16">
          {QUESTIONS.map(({ q, a }) => (
            <div key={q}>
              <dt className="display text-[9vw] leading-[0.95] sm:text-[3.4vw]">{q}</dt>
              <dd className="mt-3 max-w-[52ch] text-[19px] leading-snug">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Marquee tone="red" items={["Same prices", "No app", "No tipping", "Full refund", "Same prices", "No app", "No tipping", "Full refund"]} />

      <Waitlist />

      <section className="bg-cream px-5 py-24 sm:px-8 sm:py-36">
        <Headline lines={["Until then, the Flyer", "is the closest thing", "to delivery we’ve got."]} className="text-[12vw] sm:text-[7vw]" />
        <div className="mt-10 max-w-[860px]">
          <Signup source="delivery" on="cream" />
        </div>
        <SignupCta from="delivery_bottom" className="sr-only">
          Send me the Flyer
        </SignupCta>
      </section>
    </>
  );
}
