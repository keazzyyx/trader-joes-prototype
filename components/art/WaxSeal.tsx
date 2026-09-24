/** Red wax seal with a pressed "TJ" monogram and a ribbon of drips. */
export function WaxSeal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <path
        d="M60 6c9 0 12 6 20 8s14-1 18 6 1 12 5 19 10 9 9 17-7 10-7 18 6 13 1 19-12 4-18 9-7 13-15 14-11-5-19-4-13 7-20 3-5-11-11-16-14-5-17-12 4-12 2-19-9-11-6-18 10-8 13-15-1-13 5-18 14 0 20-5 8-10 20-10z"
        fill="#a20c25"
      />
      <circle cx="60" cy="60" r="36" fill="#c8102e" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="#a20c25" strokeWidth="4" />
      <circle cx="60" cy="60" r="29" fill="none" stroke="#a20c25" strokeWidth="1.5" strokeDasharray="2 3" />
      <text x="60" y="71" textAnchor="middle" fontSize="30" fontWeight="700" fill="#a20c25" className="font-wonk" fontStyle="italic">
        TJ
      </text>
      <text x="60" y="70" textAnchor="middle" fontSize="30" fontWeight="700" fill="#f3efe6" opacity=".2" className="font-wonk" fontStyle="italic">
        TJ
      </text>
      <ellipse cx="46" cy="40" rx="12" ry="5" fill="#fffdf8" opacity=".18" transform="rotate(-30 46 40)" />
    </svg>
  );
}
