"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Member } from "@/lib/store";
import { storeById } from "@/lib/data/stores";
import { categoryLabel } from "@/lib/data/categories";
import { WaxSeal } from "@/components/art/WaxSeal";
import { FlyerMasthead } from "@/components/art/FlyerMasthead";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Kraft-paper membership card. Flips to show the member number and the wax seal. */
export function MemberCard({ member, autoFlip = false }: { member: Member; autoFlip?: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();
  const store = storeById(member.storeId);
  const since = new Date(member.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  useEffect(() => {
    if (!autoFlip) return;
    const t = setTimeout(() => setFlipped(true), 1100);
    return () => clearTimeout(t);
  }, [autoFlip]);

  const face = "tex-kraft absolute inset-0 overflow-hidden rounded-[10px] border-2 border-ink/80 shadow-[0_24px_40px_-22px_rgb(31_26_23/0.8)] [backface-visibility:hidden]";

  return (
    <div className="mx-auto w-full max-w-[460px]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show the front of your card" : "Flip your card to see your member number"}
        className="block w-full rounded-[12px] [perspective:1400px]"
      >
        <motion.div
          className="relative aspect-[1.6/1] w-full [transform-style:preserve-3d]"
          animate={reduce ? undefined : { rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
        >
          {/* front */}
          <div className={face} style={reduce ? { opacity: flipped ? 0 : 1, transition: "opacity .2s" } : undefined}>
            <div className="flex h-full flex-col justify-between p-5 text-left sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-wonk text-[15px] leading-none font-bold text-red-deep">Trader Joe&rsquo;s</p>
                  <p className="font-wonk mt-1 text-[36px] leading-none font-bold text-ink sm:text-[44px]">Crew Club</p>
                </div>
                <FlyerMasthead className="hidden w-[110px] shrink-0 text-ink/70 sm:block" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-[13px] leading-snug text-ink sm:text-[14px]">
                <div>
                  <p className="text-ink/60">Home store</p>
                  <p className="font-semibold">{store ? `${store.name}, ${store.city}` : "Your store"}</p>
                </div>
                <div>
                  <p className="text-ink/60">Member since</p>
                  <p className="font-semibold">{since}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-ink/60">Keeps an eye on</p>
                  <p className="font-semibold">{member.categories.map(categoryLabel).join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* back */}
          <div
            className={face}
            style={reduce ? { opacity: flipped ? 1 : 0, transition: "opacity .2s" } : { transform: "rotateY(180deg)" }}
          >
            <div className="flex h-full flex-col justify-between p-5 text-left sm:p-6">
              <div>
                <p className="text-[13px] text-ink/65">Member number</p>
                <p className="font-wonk mt-1 text-[30px] leading-none font-bold tabular-nums text-ink sm:text-[38px]">{member.memberNumber}</p>
              </div>
              <div className="max-w-[62%] text-[13px] leading-snug text-ink/80 sm:text-[14px]">
                <p>No barcode. There&rsquo;s nothing to scan and nothing to redeem.</p>
                {member.birthMonth && <p className="mt-1">Birthday treat goes out in {MONTHS[member.birthMonth - 1]}.</p>}
              </div>
            </div>
            <motion.div
              className="absolute right-3 bottom-2 sm:right-5 sm:bottom-4"
              initial={false}
              animate={flipped ? { scale: 1, opacity: 1, rotate: -8 } : { scale: 1.8, opacity: 0, rotate: -30 }}
              transition={{ delay: flipped ? 0.45 : 0, type: "spring", stiffness: 520, damping: 20 }}
            >
              <WaxSeal className="size-[92px] sm:size-[112px]" />
            </motion.div>
          </div>
        </motion.div>
      </button>
      <p className="mt-3 text-center text-[14px] text-ink/60">Tap the card to flip it.</p>
    </div>
  );
}
