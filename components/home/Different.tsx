import { Headline } from "@/components/ui/Reveal";
import { Reveal } from "@/components/ui/Reveal";

const POINTS = [
  { big: "No coupons. Not one.", small: "Nobody’s clipping anything. We skip the sales circus and keep the everyday price low instead." },
  { big: "About 4,000 things. Not 40,000.", small: "A normal supermarket carries ten times more. We’d rather carry one great salsa than nine okay ones." },
  { big: "Our name’s on most of the labels.", small: "Most of what’s here is Trader Joe’s brand. We taste it, argue about it, and only then put it on a shelf." },
  { big: "Didn’t love it? Bring it back.", small: "Even if you ate half. You get your money back, and nobody gives you a look about it." },
];

export function Different() {
  return (
    <section aria-labelledby="different-title" className="on-red bg-green px-5 py-24 text-cream sm:px-8 sm:py-36">
      <Headline id="different-title" lines={["Why it feels", "different in here"]} className="text-[13vw] sm:text-[9vw]" />
      <ol className="mt-16 grid gap-14 sm:mt-24 sm:gap-20">
        {POINTS.map((p, i) => (
          <li key={p.big} className={i % 2 ? "sm:ml-auto sm:text-right" : ""}>
            <p className="display max-w-[13em] text-[10vw] sm:text-[5.6vw]">
              <Reveal>{p.big}</Reveal>
            </p>
            <p className={`mt-3 max-w-[42ch] text-[16px] leading-snug opacity-85 sm:text-[17px] ${i % 2 ? "sm:ml-auto" : ""}`}>{p.small}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
