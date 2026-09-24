import type { Metadata } from "next";
import { Walkthrough } from "@/components/delivery/Walkthrough";
import { Waitlist } from "@/components/delivery/Waitlist";
import { buttonClass } from "@/components/ui/button";
import { FlyerButton } from "@/components/layout/FlyerDrawer";

export const metadata: Metadata = {
  title: "Delivery, someday",
  description: "Trader Joe’s has never delivered. Here’s how it could work, in plain language, and a waitlist for your store.",
};

const QUESTIONS = [
  {
    q: "Do I need a smartphone or an app?",
    a: "No. A regular website works, and so does a phone call to your store. If you can read this page, you can order.",
  },
  {
    q: "Will it cost more than shopping in the store?",
    a: "Same shelf prices. There would be a small delivery fee for doorstep drop-off. Picking up yourself would be free.",
  },
  {
    q: "What if they pick the wrong thing?",
    a: "You get a call or text before any swap. And anything you’re not happy with gets refunded in full, no questions.",
  },
  {
    q: "Do I have to tip?",
    a: "No. Crew members are paid by us. You’re welcome to say thank you.",
  },
  {
    q: "When is this actually happening?",
    a: "We don’t know yet, honestly. That’s what the waitlist is for. The stores with the most people waiting go first.",
  },
];

export default function DeliveryPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
        <div className="max-w-[820px]">
          <h1 className="font-wonk text-[46px] leading-[0.98] font-semibold sm:text-[76px]">
            We&rsquo;ve never delivered. We&rsquo;re thinking about it.
          </h1>
          <p className="mt-6 max-w-[48ch] text-[20px] leading-relaxed text-ink/85">
            In more than fifty years, Trader Joe&rsquo;s has never brought groceries to anyone&rsquo;s door. We like
            the store too much. But plenty of you have asked, so here&rsquo;s how we&rsquo;d do it if we did it right.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#waitlist" className={buttonClass("red", "min-h-14 text-[17px]")}>
              Put my name on the waitlist
            </a>
            <span className="text-[16px] text-ink/65">Nothing to pay. Nothing to download.</span>
          </div>
        </div>
      </section>

      <Walkthrough />

      <section aria-labelledby="questions-title" className="mx-auto max-w-[900px] px-4 pt-10 pb-24 sm:px-6">
        <h2 id="questions-title" className="font-wonk text-[36px] leading-[1.05] font-semibold sm:text-[48px]">
          Fair questions, straight answers
        </h2>
        <div className="mt-8 border-t-2 border-ink">
          {QUESTIONS.map(({ q, a }) => (
            <details key={q} className="group border-b-2 border-ink/15">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[20px] font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-red transition-transform group-open:rotate-45" aria-hidden fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="max-w-[60ch] pb-6 text-[19px] leading-relaxed text-ink/85">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <Waitlist />

      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <p className="font-wonk max-w-[26ch] text-[30px] leading-[1.1] font-semibold sm:text-[38px]">
            Until then, the Flyer is the closest thing to delivery we&rsquo;ve got.
          </p>
          <FlyerButton from="delivery_bottom" className={buttonClass("red", "min-h-14 text-[17px]")}>
            Send me the Flyer
          </FlyerButton>
        </div>
      </section>
    </>
  );
}
