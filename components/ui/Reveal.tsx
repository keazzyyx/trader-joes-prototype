"use client";
import { motion } from "framer-motion";

const line = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const } },
};

/**
 * A headline line that slides up from under a mask once, when it scrolls into view.
 * The observer watches the mask, not the translated text (which starts fully clipped).
 */
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.06em] ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delayChildren: delay }}
    >
      <motion.span className="block" variants={line}>
        {children}
      </motion.span>
    </motion.span>
  );
}

/** Split a headline into lines and reveal them with a small stagger. */
export function Headline({ lines, className = "", as: Tag = "h2", id }: { lines: string[]; className?: string; as?: "h1" | "h2" | "h3" | "p"; id?: string }) {
  return (
    <Tag id={id} className={`display ${className}`}>
      {lines.map((l, i) => (
        <Reveal key={l + i} delay={i * 0.08}>
          {l}
        </Reveal>
      ))}
    </Tag>
  );
}
