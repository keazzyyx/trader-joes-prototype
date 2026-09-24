/** Red push pin, seen from slightly above. */
export function Thumbtack({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden>
      <ellipse cx="24" cy="36" rx="9" ry="3" fill="#1f1a17" opacity=".28" />
      <path d="M22 26l3 11" stroke="#1f1a17" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="21" cy="24" rx="12" ry="5" fill="#a20c25" />
      <path d="M13 23c0-6 3.5-12 8-12s8 6 8 12c-3 2.4-13 2.4-16 0z" fill="#c8102e" />
      <ellipse cx="21" cy="10.5" rx="7.5" ry="4" fill="#c8102e" />
      <ellipse cx="21" cy="9.4" rx="7" ry="3.2" fill="#fffdf8" opacity=".16" />
      <ellipse cx="18" cy="8.6" rx="2.4" ry="1.1" fill="#fffdf8" opacity=".75" />
    </svg>
  );
}
