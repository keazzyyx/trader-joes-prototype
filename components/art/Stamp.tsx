/** Distressed red rubber stamp. */
export function Stamp({ lines, className = "" }: { lines: [string, string]; className?: string }) {
  return (
    <svg viewBox="0 0 220 110" className={className} role="img" aria-label={lines.join(" ")}>
      <defs>
        <filter id="stamp-wear">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="11" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 1.9" result="holes" />
          <feComposite in="SourceGraphic" in2="holes" operator="in" />
        </filter>
      </defs>
      <g filter="url(#stamp-wear)" fill="none" stroke="#C8102E">
        <rect x="6" y="6" width="208" height="98" rx="10" strokeWidth="5" />
        <rect x="15" y="15" width="190" height="80" rx="5" strokeWidth="2" />
        <text x="110" y="50" textAnchor="middle" fill="#C8102E" stroke="none" fontSize="23" fontWeight={800} letterSpacing="0.5" className="font-display">
          {lines[0]}
        </text>
        <text x="110" y="79" textAnchor="middle" fill="#C8102E" stroke="none" fontSize="23" fontWeight={800} letterSpacing="0.5" className="font-display">
          {lines[1]}
        </text>
      </g>
    </svg>
  );
}
