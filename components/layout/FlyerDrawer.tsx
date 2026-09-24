"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { track } from "@/lib/analytics";
import { FlyerSignup } from "@/components/ui/FlyerSignup";
import { FlyerMasthead } from "@/components/art/FlyerMasthead";

type Ctx = { open: (from: string) => void };
const DrawerCtx = createContext<Ctx>({ open: () => {} });
export const useFlyerDrawer = () => useContext(DrawerCtx);

export function FlyerDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((from: string) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    track("cta_drawer_opened", { cta_location: from });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("button, input, a[href]");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  return (
    <DrawerCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60]" role="presentation">
            <motion.button
              aria-label="Close"
              tabIndex={-1}
              className="absolute inset-0 cursor-default bg-ink/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="flyer-drawer-title"
              className="tex-paper absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col overflow-y-auto border-l-2 border-ink shadow-[-12px_0_40px_-20px_rgb(31_26_23/0.6)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="flex items-center justify-end p-3">
                <button
                  onClick={close}
                  className="grid size-11 place-items-center rounded-full text-ink hover:bg-chalk"
                  aria-label="Close the Flyer signup"
                >
                  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                    <path d="M5.5 5.8c4.4 4 8.6 8.3 12.8 12.6M18.2 5.6C14 9.8 9.9 14 5.8 18.3" />
                  </svg>
                </button>
              </div>
              <div className="px-6 pb-10 sm:px-8">
                <FlyerMasthead className="w-full text-ink" />
                <h2 id="flyer-drawer-title" className="font-wonk mt-6 text-[34px] leading-[1.02] font-semibold">
                  New stuff, reviewed by people who ate it.
                </h2>
                <p className="mt-4 text-[17px] leading-relaxed text-ink/80">
                  The Fearless Flyer is our newsletter. It tells you what just showed up on the shelves, what&rsquo;s
                  leaving, and which frozen thing we can&rsquo;t stop buying. Once a month or so. No coupons, because we
                  don&rsquo;t do those.
                </p>
                <div className="mt-7">
                  <FlyerSignup source="drawer" autoFocus stacked />
                </div>
                <p className="mt-6 border-t border-dashed border-ink/30 pt-4 text-[14px] text-ink/65">
                  Unsubscribe in one click, any time. We won&rsquo;t sell your email. We sell groceries.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DrawerCtx.Provider>
  );
}

/** Any element that should open the drawer. */
export function FlyerButton({ from, className, children }: { from: string; className?: string; children: React.ReactNode }) {
  const { open } = useFlyerDrawer();
  return (
    <button type="button" onClick={() => open(from)} className={className}>
      {children}
    </button>
  );
}
