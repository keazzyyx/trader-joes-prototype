"use client";
import { MotionConfig } from "framer-motion";
import { FlyerDrawerProvider } from "./FlyerDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <FlyerDrawerProvider>{children}</FlyerDrawerProvider>
    </MotionConfig>
  );
}
