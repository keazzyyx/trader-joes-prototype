/** Engraved divider in the Fearless Flyer’s Victorian manner. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 20" className={className} aria-hidden fill="none" stroke="currentColor">
      <path d="M2 10h86M152 10h86" strokeWidth="1.2" />
      <path d="M2 13h70M168 13h70" strokeWidth=".6" />
      <path d="M92 10c6-8 14-8 18 0-4 8-12 8-18 0zM148 10c-6-8-14-8-18 0 4 8 12 8 18 0z" strokeWidth="1.2" />
      <circle cx="120" cy="10" r="4" fill="currentColor" />
      <path d="M120 2v3M120 15v3" strokeWidth="1.2" />
    </svg>
  );
}
