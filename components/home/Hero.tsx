"use client";
import { motion } from "framer-motion";
import { Signup } from "@/components/ui/Signup";

const LINES = ["No coupons.", "No cards.", "Just the hunt."];

/** Full-viewport cream hero: one headline that slides up under a mask on load, then the signup. */
export function Hero() {
  return (
    <section aria-label="Welcome" className="flex min-h-dvh flex-col justify-end bg-cream px-5 pt-32 pb-10 sm:px-8 sm:pb-14">
      <h1 className="display text-[14vw] leading-[0.88]">
        {LINES.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>
      <Signup source="hero" on="cream" variant="rule" className="mt-8 max-w-[900px] sm:mt-10" />
    </section>
  );
}
