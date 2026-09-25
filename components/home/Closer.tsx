import { Headline } from "@/components/ui/Reveal";
import { Signup } from "@/components/ui/Signup";

export function Closer() {
  return (
    <section aria-labelledby="closer-title" className="on-red bg-red px-5 py-24 text-cream sm:px-8 sm:py-36">
      <Headline id="closer-title" lines={["You scrolled all", "the way down.", "Get the Flyer."]} className="text-[15vw] sm:text-[11vw]" />
      <p className="mt-6 max-w-[46ch] text-[17px] leading-snug opacity-90">
        New products, honest reviews, the occasional pun we’re not proud of. Roughly once a month. Free, obviously. We don’t charge for mail.
      </p>
      <Signup source="band" on="red" className="mt-10 max-w-[860px]" />
    </section>
  );
}
