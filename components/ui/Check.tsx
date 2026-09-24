"use client";
import { motion } from "framer-motion";

/** Hand-drawn checkmark in a circle that draws itself. */
export function Check({ className = "size-5", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <motion.path
        d="M12 2.6c5.3.2 9.4 4.3 9.3 9.5-.1 5.2-4.4 9.4-9.6 9.3C6.5 21.3 2.5 17 2.7 11.8 2.9 7.3 6 3.6 10.4 2.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, delay, ease: "easeOut" }}
      />
      <motion.path
        d="M7.4 12.4l3.1 3.1 6.3-7.1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.35, ease: "easeOut" }}
      />
    </svg>
  );
}
