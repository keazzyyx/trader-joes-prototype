"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HEX, heroTone } from "@/lib/hero";

type Ctx = { go: (href: string) => void };
const WipeCtx = createContext<Ctx>({ go: () => {} });

const IN_MS = 300;

/**
 * Route change: a flat sheet in the destination's hero color rises from the
 * bottom, the route swaps underneath, the sheet lifts away. Reduced motion
 * skips the sheet entirely.
 */
export function WipeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [wipe, setWipe] = useState<{ color: string; phase: "in" | "out" } | null>(null);
  const pending = useRef<string | null>(null);

  const go = useCallback(
    (href: string) => {
      const [path] = href.split("#");
      if (reduce || path === pathname || !path) {
        router.push(href);
        return;
      }
      pending.current = path;
      setWipe({ color: HEX[heroTone(path)], phase: "in" });
      setTimeout(() => router.push(href), IN_MS);
    },
    [reduce, pathname, router],
  );

  useEffect(() => {
    if (pending.current && pathname === pending.current) {
      pending.current = null;
      window.scrollTo(0, 0);
      setWipe((w) => (w ? { ...w, phase: "out" } : w));
    }
  }, [pathname]);

  return (
    <WipeCtx.Provider value={{ go }}>
      {children}
      <AnimatePresence>
        {wipe && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[80]"
            style={{ background: wipe.color }}
            initial={{ y: "100%" }}
            animate={{ y: wipe.phase === "in" ? "0%" : "-100%" }}
            transition={{ duration: wipe.phase === "in" ? IN_MS / 1000 : 0.36, ease: [0.7, 0, 0.3, 1] }}
            onAnimationComplete={() => wipe.phase === "out" && setWipe(null)}
          />
        )}
      </AnimatePresence>
    </WipeCtx.Provider>
  );
}

export const useWipe = () => useContext(WipeCtx);

/** A next/link that goes through the wipe. Modifier-clicks still open normally. */
export function WipeLink({ href, children, className, ...rest }: React.ComponentProps<typeof Link> & { href: string }) {
  const { go } = useWipe();
  return (
    <Link
      href={href}
      className={className}
      {...rest}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(href);
      }}
    >
      {children}
    </Link>
  );
}
