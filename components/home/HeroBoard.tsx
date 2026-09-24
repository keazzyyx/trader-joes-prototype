"use client";
import { motion } from "framer-motion";
import { ChalkHeadline } from "./ChalkHeadline";
import { Thumbtack } from "@/components/art/Thumbtack";
import { FlyerMasthead } from "@/components/art/FlyerMasthead";
import { FlyerSignup } from "@/components/ui/FlyerSignup";

export function HeroBoard() {
  return (
    <section aria-label="Welcome" className="mx-auto max-w-[1200px] px-3 pt-3 sm:px-6 sm:pt-6">
      <div className="relative grid items-start gap-0 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        {/* the board */}
        <div className="wood-frame tex-board on-dark relative rounded-[6px] px-4 pt-5 pb-10 sm:px-10 sm:pt-10 sm:pb-12 lg:col-span-2 lg:min-h-[520px] lg:pr-[440px]">
          <ChalkHeadline />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.6 }}
            className="font-soft chalk-text mt-3 hidden max-w-[34ch] text-[21px] leading-snug sm:block"
          >
            No sales to wait for, no app to scan. The price on the tag is the price. Go find something good.
          </motion.p>
          {/* chalk tray */}
          <div aria-hidden className="absolute inset-x-6 -bottom-[14px] h-[6px] rounded-b bg-kraft-deep/80" />
          <div aria-hidden className="absolute bottom-[-10px] left-[14%] h-[5px] w-10 rotate-[-4deg] rounded-full bg-chalk/90" />
          <div aria-hidden className="absolute bottom-[-10px] left-[20%] h-[5px] w-6 rotate-[6deg] rounded-full bg-kraft" />
        </div>

        {/* the Flyer card, pinned to the board */}
        <motion.div
          initial={{ opacity: 0, y: -40, rotate: -7 }}
          animate={{ opacity: 1, y: 0, rotate: -1.6 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 170, damping: 16 }}
          className="relative z-10 mx-auto -mt-8 w-[calc(100%-18px)] max-w-[420px] lg:absolute lg:top-10 lg:right-10 lg:mt-0 lg:w-[380px]"
        >
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 1.4 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.05, type: "spring", stiffness: 500, damping: 20 }}
            className="absolute -top-5 left-1/2 z-10 size-11 -translate-x-1/2"
          >
            <Thumbtack className="size-11" />
          </motion.div>
          <div className="tex-paper relative rounded-[3px] border border-ink/15 px-5 pt-7 pb-5 shadow-[0_22px_30px_-18px_rgb(31_26_23/0.7),0_2px_0_rgb(31_26_23/0.08)] sm:px-6">
            <FlyerMasthead className="mx-auto w-full max-w-[300px] text-ink" />
            <p className="mt-3 text-[16px] leading-snug text-ink/85">
              Our newsletter. What just landed, what&rsquo;s leaving, and what we&rsquo;d buy twice. Written by people who
              actually ate it.
            </p>
            <div className="mt-4">
              <FlyerSignup source="hero" stacked />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
