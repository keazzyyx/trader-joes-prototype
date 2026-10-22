"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * The rotated red word across a cutout. Flips over (like a card) when the shopper gets on the list.
 * Reduced motion: a plain swap.
 */
export function GoneStamp({ listed, listedText = "You’re on the list", className = "" }: { listed: boolean; listedText?: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 grid place-items-center [perspective:900px] ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={listed ? "listed" : "gone"}
          className={`display text-center leading-[0.9] text-red ${listed ? "text-[13vw] sm:text-[5.5vw]" : "text-[22vw] sm:text-[11vw]"}`}
          style={{ rotate: -16 }}
          initial={reduce ? { opacity: 0 } : { rotateX: 90, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { rotateX: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { rotateX: -90, opacity: 0 }}
          transition={{ duration: reduce ? 0.15 : 0.32, ease: [0.3, 0.7, 0.3, 1] }}
        >
          {listed ? listedText : "Gone"}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
