"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Between routes, a chalkboard eraser swipes across and leaves the new page behind.
 * 340ms total. Reduced motion gets a plain 180ms fade.
 */
export function RouteWipe() {
  const pathname = usePathname();
  const first = useRef(true);
  const reduce = useReducedMotion();
  const [wipe, setWipe] = useState<string | null>(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setWipe(pathname);
  }, [pathname]);

  return (
    <AnimatePresence>
      {wipe && (
        <motion.div
          key={wipe}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[80]"
          initial={reduce ? { opacity: 1 } : { x: "0%" }}
          animate={reduce ? { opacity: 0 } : { x: "112%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.18 : 0.34, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => setWipe(null)}
        >
          <div className="tex-board absolute inset-0" />
          {/* dusty leading edge */}
          <div
            className="absolute inset-y-0 -right-[10vw] w-[10vw]"
            style={{
              backgroundImage: "var(--chalk-noise), var(--chalk-noise)",
              backgroundColor: "rgb(243 239 230 / 0.35)",
              maskImage: "linear-gradient(90deg, #000 0%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(90deg, #000 0%, transparent 100%)",
            }}
          />
          <svg className="absolute inset-y-0 -right-[3vw] h-full w-[4vw]" viewBox="0 0 20 100" preserveAspectRatio="none">
            <path
              d="M0 0h8c3 4-2 8 2 12s-3 9 1 13 4 8 0 12 3 9-1 13 4 8 0 12 3 8 0 12 4 9 0 16H0z"
              fill="var(--color-board)"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
