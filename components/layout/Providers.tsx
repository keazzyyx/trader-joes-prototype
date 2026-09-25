"use client";
import { MotionConfig } from "framer-motion";
import { WipeProvider } from "./Wipe";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <WipeProvider>{children}</WipeProvider>
    </MotionConfig>
  );
}
