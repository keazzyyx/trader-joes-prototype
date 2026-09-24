/**
 * A wobbly, hand-inked rectangle outline that stretches to fill its parent.
 * `seed` changes the wobble so repeated tags don’t look stamped from one mold.
 */
export function RoughRect({ seed = 0, className = "", strokeWidth = 2 }: { seed?: number; className?: string; strokeWidth?: number }) {
  const j = (n: number) => (Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1;
  const w = (n: number, amt = 1.4) => (j(n) * amt).toFixed(2);
  const d = `M${2 + +w(1)} ${3 + +w(2)} C 30 ${1 + +w(3)}, 70 ${3 + +w(4)}, ${98 + +w(5)} ${2 + +w(6)}
    C ${99 + +w(7)} 30, ${97 + +w(8)} 70, ${98 + +w(9)} ${97 + +w(10)}
    C 70 ${99 + +w(11)}, 30 ${97 + +w(12)}, ${2 + +w(13)} ${98 + +w(14)}
    C ${1 + +w(15)} 70, ${3 + +w(16)} 30, ${3 + +w(17)} ${1 + +w(18)}`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    </svg>
  );
}
