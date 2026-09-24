/** A Fearless Flyer-style masthead: engraved rules, a banner, a little woodcut ship. */
export function FlyerMasthead({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 96" className={className} role="img" aria-label="The Fearless Flyer">
      <g fill="none" stroke="currentColor">
        <path d="M4 10h352M4 14h352" strokeWidth={1.2} />
        <path d="M4 82h352M4 86h352" strokeWidth={1.2} />
      </g>
      {/* little woodcut sailing ship, hatched */}
      <g transform="translate(18 24)" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round">
        <path d="M2 40c10 6 34 6 46 0l-4 8H7z" fill="currentColor" />
        <path d="M24 4v36M24 6c-10 6-14 18-14 30h14M24 8c9 6 14 16 16 28H24" />
        <path d="M13 30h9M14 25h9M16 20h7M27 30h9M27 25h8M27 20h6" strokeWidth={0.9} />
        <path d="M24 4l8 3-8 3" fill="currentColor" />
        <path d="M-4 52c6-3 10 3 16 0s10 3 16 0 10 3 16 0 10 3 16 0" strokeWidth={1} />
      </g>
      <text x="198" y="46" textAnchor="middle" className="font-wonk" fontSize="15" letterSpacing="0.5" fill="currentColor" fontStyle="italic">
        The
      </text>
      <text x="198" y="72" textAnchor="middle" className="font-wonk" fontSize="30" fontWeight="700" fill="currentColor">
        Fearless Flyer
      </text>
      <g fill="currentColor">
        <path d="M150 42h-44l6-3h38zM246 42h44l-6-3h-38z" />
        <circle cx="198" cy="22" r="2" />
        <path d="M182 22h10M204 22h10" stroke="currentColor" strokeWidth={1} />
      </g>
    </svg>
  );
}
