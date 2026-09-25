import { Headline } from "@/components/ui/Reveal";
import { Drift } from "@/components/ui/Drift";
import { Signup } from "@/components/ui/Signup";
import { OrangeChicken } from "@/components/art/Famous";
import { Arrow } from "@/components/art/Doodles";

export function Hero() {
  return (
    <section aria-label="Welcome" className="relative overflow-x-clip bg-cream px-5 pt-36 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
      <div className="relative">
        <Headline as="h1" lines={["About 4,000", "products.", "No coupons.", "Just the hunt."]} className="relative z-10 text-[16vw] sm:text-[14.5vw]" />
        <Drift amount={18} className="absolute -right-[4vw] bottom-[-12vw] z-0 w-[46vw] sm:right-0 sm:bottom-[-7vw] sm:w-[27vw]">
          <OrangeChicken />
        </Drift>
      </div>
      <p className="relative z-10 mt-[16vw] max-w-[40ch] text-[17px] leading-snug sm:mt-16 sm:text-[18px]">
        No sales to wait for, no app to scan. The price on the tag is the price. The Fearless Flyer tells you what just landed. Once a month, free.
      </p>
      <div className="relative mt-6 max-w-[860px]">
        <Signup source="hero" on="cream" />
        <Arrow className="absolute -top-14 right-0 hidden h-12 w-auto text-red lg:block" />
      </div>
    </section>
  );
}
