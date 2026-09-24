export function countdownParts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

const pad = (n: number) => n.toString().padStart(2, "0");

/** Live d/h/m/s readout on a little chalk tag. */
export function Countdown({ to, now, live }: { to: Date; now: Date; live: boolean }) {
  const { d, h, m, s } = countdownParts(to.getTime() - now.getTime());
  const unit = "text-[12px] font-medium text-chalk/70 ml-0.5 mr-2";
  return (
    <p className="font-wonk chalk-text tabular-nums text-[22px] leading-none font-semibold" aria-label={`${d} days, ${h} hours and ${m} minutes to go`}>
      <span aria-hidden>
        {d}
        <span className={unit}>d</span>
        {pad(h)}
        <span className={unit}>h</span>
        {pad(m)}
        <span className={unit}>m</span>
        <span className={live ? "" : "opacity-0"}>{pad(s)}</span>
        <span className={unit}>s</span>
      </span>
    </p>
  );
}
