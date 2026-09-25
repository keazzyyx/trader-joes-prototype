"use client";
import { useReducedMotion } from "framer-motion";
import { WipeLink } from "@/components/layout/Wipe";

/** "OR JOIN THE CREW": plain words in the display face. Scrolls to an in-page id, or wipes to a route. */
export function JoinCrewLink({ href, from, className = "" }: { href: string; from: string; className?: string }) {
  const reduce = useReducedMotion();
  const cls = `display inline-flex min-h-16 items-center text-[26px] leading-none hover:text-red ${className}`;
  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        data-from={from}
        className={cls}
        onClick={(e) => {
          const el = document.querySelector(href);
          if (!el) return;
          e.preventDefault();
          el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }}
      >
        Or join the Crew
      </a>
    );
  }
  return (
    <WipeLink href={href} className={cls}>
      Or join the Crew
    </WipeLink>
  );
}
