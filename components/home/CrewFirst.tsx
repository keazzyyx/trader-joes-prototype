"use client";
import { Headline } from "@/components/ui/Reveal";
import { WipeLink } from "@/components/layout/Wipe";
import { pill } from "@/components/ui/pill";
import { track } from "@/lib/analytics";

const LINES = ["Drops a day early.", "A birthday item on us.", "No points, no tiers, nothing to scan."];

export function CrewFirst() {
  return (
    <section id="crew" aria-labelledby="crew-first-title" className="on-red scroll-mt-4 bg-red px-5 py-24 text-cream sm:px-8 sm:py-32">
      <Headline id="crew-first-title" lines={["The Crew", "hears first."]} className="text-[17vw] sm:text-[14.5vw]" />
      <ul className="mt-10 grid gap-2 text-[18px] leading-snug sm:text-[20px]">
        {LINES.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <WipeLink
        href="/crew-club"
        className={pill("red", "mt-10", "cream")}
        onClick={() => track("crew_cta_clicked", { cta_location: "home_crew_first" })}
      >
        Join the Crew
      </WipeLink>
    </section>
  );
}
