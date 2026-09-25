/* Hand-drawn accents. Stroke-only, current color, one line weight. */

const s = { fill: "none", stroke: "currentColor", strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function Smiley({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path {...s} d="M50 6c25-1 44 19 44 44S75 95 50 94 6 74 7 50 25 7 50 6z" />
      <path {...s} d="M34 40c1 3 1 6 0 9M66 39c1 3 1 6 0 9" strokeWidth={8} />
      <path {...s} d="M30 62c10 12 30 13 41 0" />
    </svg>
  );
}

export function Boat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <path {...s} d="M12 66c14 4 76 4 96 0l-10 22H24z" />
      <path {...s} d="M58 8v56M58 12c-18 10-26 30-28 50h28M58 16c16 10 24 26 27 46H58" />
      <path {...s} d="M4 92c8-4 12 4 20 0s12 4 20 0 12 4 20 0 12 4 20 0 12 4 20 0 8-4 12 0" strokeWidth={5} />
    </svg>
  );
}

export function Eye({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden>
      <path {...s} d="M6 36C24 10 46 4 60 5s36 6 54 31C96 60 76 66 60 65S24 60 6 36z" />
      <path {...s} d="M60 20c9 0 15 7 15 15s-6 16-15 16-16-7-16-16 7-15 16-15z" />
      <path {...s} d="M58 30c3-1 6 1 6 4" strokeWidth={9} />
      <path {...s} d="M22 14c8-6 16-9 24-10M74 4c8 1 16 4 22 9" strokeWidth={5} />
    </svg>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden>
      <path {...s} d="M6 40c20-30 60-34 106-12" />
      <path {...s} d="M92 12c8 4 14 10 20 16-8 1-16 4-24 8" />
    </svg>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path {...s} d="M50 8l11 28 30 2-23 19 8 29-26-16-26 16 8-29L9 38l30-2z" />
    </svg>
  );
}
