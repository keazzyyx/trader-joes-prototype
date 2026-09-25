export function countdownParts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
const pad = (n: number) => n.toString().padStart(2, "0");

/** Live countdown, set in the display face. */
export function Countdown({ to, now, live, className = "" }: { to: Date; now: Date; live: boolean; className?: string }) {
  const { d, h, m, s } = countdownParts(to.getTime() - now.getTime());
  const u = "label ml-1 mr-4 align-baseline";
  return (
    <p className={`display tabular-nums ${className}`} aria-label={`${d} days, ${h} hours and ${m} minutes to go`}>
      <span aria-hidden>
        {d}
        <span className={u}>d</span>
        {pad(h)}
        <span className={u}>h</span>
        {pad(m)}
        <span className={u}>m</span>
        <span className={live ? "" : "opacity-0"}>{pad(s)}</span>
        <span className={u}>s</span>
      </span>
    </p>
  );
}
