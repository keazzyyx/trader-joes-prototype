/* Four big line drawings for the delivery walkthrough. Stroke-only, current color. */
const s = { fill: "none", stroke: "currentColor", strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function ListDoodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <path {...s} d="M46 24c30-4 78-4 108 2-2 50-2 100 2 150-36 6-78 6-112 0 4-50 4-100 2-152z" />
      {[60, 92, 124, 156].map((y, i) => (
        <g key={y}>
          <path {...s} d={`M66 ${y - 8}l8 9 14-16`} strokeWidth={i === 3 ? 0 : 6} />
          <path {...s} d={`M100 ${y}c14-3 28-3 44 0`} />
        </g>
      ))}
      <path {...s} d="M160 118l26-34 12 8-26 34zM150 132l8-14 12 8-14 10z" />
    </svg>
  );
}

export function BasketDoodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <path {...s} d="M28 90h144l-18 84H46z" />
      {[52, 76, 100, 124, 148].map((x) => (
        <path key={x} {...s} d={`M${x} 96l${(x - 100) * 0.12} 72`} strokeWidth={4} />
      ))}
      <path {...s} d="M40 128h120" strokeWidth={4} />
      <path {...s} d="M60 90c0-40 80-40 80 0" />
      <path {...s} d="M74 86c-2-18 6-30 18-28M114 86c2-16-4-28-14-30" strokeWidth={4} />
      <path {...s} d="M92 52c6-14 20-16 30-6M126 60c8-2 14 4 14 12" strokeWidth={4} />
    </svg>
  );
}

export function DoorDoodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <path {...s} d="M54 26h92v150H54z" />
      <path {...s} d="M70 42h60v50H70zM70 106h60v56H70z" strokeWidth={4} />
      <path {...s} d="M124 132c3 0 5 2 5 5" strokeWidth={8} />
      <path {...s} d="M20 176h160M30 186h140" />
      <path {...s} d="M138 136h40l6 40h-52z" />
      <path {...s} d="M148 136l6-10h22l6 10" strokeWidth={4} />
      <path {...s} d="M158 126c-2-12 4-20 10-20s10 8 6 20" strokeWidth={4} />
    </svg>
  );
}

export function RefundDoodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <path {...s} d="M100 36c36 0 62 26 62 60s-26 62-62 62-62-28-62-62 26-60 62-60z" />
      <path {...s} d="M82 82c2 3 2 7 0 10M118 82c2 3 2 7 0 10" strokeWidth={8} />
      <path {...s} d="M76 112c12 14 36 14 48 0" />
      <path {...s} d="M30 60c-12 20-14 50 0 76M170 60c12 20 14 50 0 76" strokeWidth={4} />
      <path {...s} d="M24 150c10 20 30 30 56 30" strokeWidth={4} />
      <path {...s} d="M70 172c6 4 10 8 14 14-6 1-12 4-18 8" strokeWidth={4} />
    </svg>
  );
}
