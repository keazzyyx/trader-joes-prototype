"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

/** A number that counts from its previous value to the new one when it changes. */
export function Ticker({ value, format = (n: number) => Math.round(n).toLocaleString("en-US"), className = "" }: { value: number; format?: (n: number) => string; className?: string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current === value) return;
    if (reduce) {
      setShown(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, { duration: 0.7, ease: [0.2, 0.8, 0.2, 1], onUpdate: (v) => setShown(v) });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);
  return (
    <span className={`tabular-nums ${className}`} aria-live="polite">
      {format(shown)}
    </span>
  );
}
