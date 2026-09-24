"use client";
import { useEffect, useState } from "react";

const LINES = ["About 4,000 products.", "No coupons.", "No membership cards.", "Just the hunt."];

/**
 * The hero headline, drawn onto the board: each glyph’s outline strokes on,
 * then the chalk fill settles in. Waits for Fraunces so it never draws the fallback font.
 */
export function ChalkHeadline() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    document.fonts?.ready.then(go);
    const t = setTimeout(go, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <h1 className="relative">
      <span className="sr-only">About 4,000 products. No coupons. No membership cards. Just the hunt.</span>
      <svg viewBox="0 0 760 356" className={`block w-full ${ready ? "chalk-draw" : "opacity-0"}`} aria-hidden>
        <defs>
          <filter id="chalky" x="-2%" y="-5%" width="104%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" result="grain" />
            <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3 0 0 0 2.3" result="holes" />
            <feComposite in="rough" in2="holes" operator="in" />
          </filter>
        </defs>
        <g filter="url(#chalky)" className="font-wonk" fontWeight={600} fontSize={74}>
          {LINES.map((line, i) => (
            <text key={line} x="4" y={70 + i * 86} style={{ ["--d" as string]: `${0.15 + i * 0.32}s` }}>
              {line}
            </text>
          ))}
        </g>
        <path
          className="chalk-underline"
          style={{ ["--d" as string]: "1.55s" }}
          d="M8 334c70-7 150-9 232-6s130 4 196-3"
          fill="none"
          stroke="var(--color-kraft)"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#chalky)"
        />
      </svg>
    </h1>
  );
}
