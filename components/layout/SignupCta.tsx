"use client";
import { useReducedMotion } from "framer-motion";
import { track } from "@/lib/analytics";

/** The header pill. Scrolls to the nearest Flyer input on the page and focuses it. */
export function SignupCta({ from, className, children, ariaLabel }: { from: string; className?: string; children: React.ReactNode; ariaLabel?: string }) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={() => {
        track("cta_drawer_opened", { cta_location: from, action: "scroll_to_signup" });
        const input = document.querySelector<HTMLInputElement>("[data-signup]");
        if (!input) return;
        input.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        input.focus({ preventScroll: true });
      }}
    >
      {children}
    </button>
  );
}
