"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Text where each character flips like a departures board when it changes. Reduced motion just swaps. */
export function FlipText({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-flex flex-wrap ${className}`} aria-label={text} role="text">
      {text.split("").map((ch, i) => (
        <span key={i} className="relative inline-block overflow-hidden [perspective:400px]" aria-hidden>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={ch + i}
              className="inline-block origin-center"
              initial={reduce ? false : { rotateX: -90, y: "-0.4em", opacity: 0 }}
              animate={{ rotateX: 0, y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { rotateX: 90, y: "0.4em", opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.3, 0.7, 0.3, 1], delay: reduce ? 0 : (i % 6) * 0.03 }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
