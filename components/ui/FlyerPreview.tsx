"use client";
import { DROPS, dropStatus, shortDate } from "@/lib/data/drops";
import { useNow } from "@/lib/hooks";

/** A mini Fearless Flyer email built from the real drops data. Shown after a Flyer signup. */
export function FlyerPreview({ on = "cream" }: { on?: "cream" | "red" }) {
  const { now } = useNow(0);
  const items = DROPS.map((d) => ({ d, s: dropStatus(d, now) }));
  const landing = items.filter((x) => x.s.kind === "upcoming").sort((a, b) => +(a.s.kind === "upcoming" ? a.s.startsAt : 0) - +(b.s.kind === "upcoming" ? b.s.startsAt : 0)).slice(0, 2);
  const inStores = items.filter((x) => x.s.kind === "now").slice(0, 2);
  const leaving = items.filter((x) => x.s.kind === "now").sort((a, b) => +(a.s.kind === "now" ? a.s.endsAt : 0) - +(b.s.kind === "now" ? b.s.endsAt : 0))[0];
  const sections = [
    { h: "Landing soon", rows: landing.map((x) => [x.d.name, `${x.s.kind === "upcoming" ? shortDate(x.s.startsAt) : ""}, ${x.d.price}`]) },
    { h: "In stores now", rows: inStores.map((x) => [x.d.name, x.d.price]) },
    { h: "Leaving first", rows: leaving ? [[leaving.d.name, leaving.s.kind === "now" ? `gone after ${shortDate(leaving.s.endsAt)}` : ""]] : [] },
  ].filter((s) => s.rows.length);
  const fg = on === "red" ? "text-cream" : "text-ink";
  return (
    <div className={`mt-8 max-w-[560px] ${fg}`} aria-label="Preview of the Fearless Flyer email">
      <p className="label opacity-60">Preview</p>
      <div className="mt-2 bg-ink px-5 py-5 text-cream">
        <p className="label flex justify-between text-cream/70">
          <span>From Trader Joe’s</span>
          <span>{now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </p>
        <p className="display mt-2 text-[34px] leading-none">The Fearless Flyer</p>
        {sections.map((s) => (
          <div key={s.h} className="mt-4">
            <p className="label text-yellow">{s.h}</p>
            {s.rows.map(([a, b]) => (
              <p key={a} className="mt-1 flex items-baseline justify-between gap-4 text-[15px]">
                <span className="font-semibold">{a}</span>
                <span className="whitespace-nowrap opacity-80">{b}</span>
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
