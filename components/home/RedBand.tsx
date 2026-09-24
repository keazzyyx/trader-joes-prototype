import { FlyerSignup } from "@/components/ui/FlyerSignup";
import { FlyerMasthead } from "@/components/art/FlyerMasthead";

export function RedBand() {
  return (
    <section aria-labelledby="band-title" className="relative mt-28 bg-red text-paper sm:mt-36" style={{ backgroundImage: "var(--noise)" }}>
      <div aria-hidden className="h-2 bg-red-deep" />
      <div aria-hidden className="mt-1.5 h-[3px] bg-red-deep" />
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_460px]">
        <div>
          <FlyerMasthead className="w-[240px] text-paper/90" />
          <h2 id="band-title" className="font-wonk mt-6 text-[42px] leading-[1] font-semibold sm:text-[60px]">
            You scrolled all the way down. Might as well get the Flyer.
          </h2>
          <p className="mt-5 max-w-[46ch] text-[18px] leading-relaxed text-paper/90">
            New products, honest reviews, the occasional pun we&rsquo;re not proud of. Roughly once a month. Free,
            obviously. We don&rsquo;t charge for mail.
          </p>
        </div>
        <div className="on-dark rounded-[4px] border-2 border-paper/70 p-5 sm:p-7">
          <FlyerSignup source="band" tone="red" stacked />
        </div>
      </div>
      <div aria-hidden className="mb-1.5 h-[3px] bg-red-deep" />
      <div aria-hidden className="h-2 bg-red-deep" />
    </section>
  );
}
