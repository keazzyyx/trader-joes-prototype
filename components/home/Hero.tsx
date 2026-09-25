"use client";
import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DROPS, dropStatus, type Drop } from "@/lib/data/drops";
import { useNow, useStoreValue } from "@/lib/hooks";
import { isEmail, store } from "@/lib/store";
import { track } from "@/lib/analytics";
import { pill } from "@/components/ui/pill";
import { FlipText } from "@/components/ui/FlipText";
import { JoinCrewLink } from "@/components/ui/JoinCrewLink";

const DAY = 86_400_000;
const HOUR = 3_600_000;

/** The soonest future drop (upcoming this season, or returning next year), or null. */
function nextDrop(now: Date): { drop: Drop; at: Date } | null {
  let best: { drop: Drop; at: Date } | null = null;
  for (const drop of DROPS) {
    const s = dropStatus(drop, now);
    if (s.kind === "now") continue;
    const at = s.kind === "upcoming" ? s.startsAt : s.returnsAt;
    if (!best || at < best.at) best = { drop, at };
  }
  return best;
}

function countdownLabel(ms: number) {
  if (ms <= 0) return "Today";
  const days = Math.floor(ms / DAY);
  const hrs = Math.floor((ms % DAY) / HOUR);
  const mins = Math.floor((ms % HOUR) / 60_000);
  if (days === 0) return `${hrs} ${hrs === 1 ? "hr" : "hrs"} ${mins} min`;
  return `${days} ${days === 1 ? "day" : "days"} ${hrs} ${hrs === 1 ? "hr" : "hrs"}`;
}

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export function Hero() {
  const { now } = useNow(60_000);
  const next = useMemo(() => nextDrop(now), [now]);
  const today = !!next && sameDay(next.at, now);

  const line1 = next ? next.drop.name : "Something new";
  const line2 = next ? (today ? "Lands" : "Is back in") : "Lands";
  const line3 = next ? (today ? "Today" : countdownLabel(next.at.getTime() - now.getTime())) : "Every week.";
  // Fit line 1 to the width: one line for ordinary names, two for long ones like the cranberry beverage.
  const len = Math.max(line1.length, 8);
  const line1Size = `clamp(40px, min(14vw, ${((len > 22 ? 360 : 185) / len).toFixed(2)}vw), 200px)`;

  return (
    <section aria-label="Welcome" className="flex min-h-dvh flex-col justify-end bg-cream px-5 pt-32 pb-10 sm:px-8 sm:pb-14">
      <h1 className="display leading-[0.88]">
        <Line i={0} style={{ fontSize: line1Size }}>
          {line1}
        </Line>
        <Line i={1} className="text-[14vw]">
          {line2}
        </Line>
        <Line i={2} className="text-[14vw]">
          <FlipText text={line3.toUpperCase()} />
        </Line>
      </h1>
      <p className="mt-6 text-[17px] sm:text-[18px]">The Flyer tells you when. The Crew hears first.</p>
      <TellMeWhen drop={next?.drop ?? null} at={next?.at ?? null} now={now} />
    </section>
  );
}

function Line({ i, className = "", style, children }: { i: number; className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className}`} style={style}>
      <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 0.65, delay: 0.1 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}>
        {children}
      </motion.span>
    </span>
  );
}

function TellMeWhen({ drop, at, now }: { drop: Drop | null; at: Date | null; now: Date }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  const mine = useStoreValue(() => store.dropAlerts.mine()) ?? [];
  const done = sent || (!!drop && mine.includes(drop.id));

  useEffect(() => {
    const known = store.knownEmail();
    if (known) setEmail(known);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) return setError(true);
    const sub = await store.subscribers.add({ email, source: "hero" });
    track("flyer_signup_submitted", { method: "email", source: "hero", subscriber_id: sub.id, drop_id: drop?.id ?? null });
    if (drop && at) {
      await store.dropAlerts.add({ dropId: drop.id, email });
      track("drop_alert_set", { drop_id: drop.id, drop_name: drop.name, drop_status: "upcoming", days_until: Math.round((at.getTime() - now.getTime()) / DAY), source: "hero" });
    }
    setSent(true);
  }

  return (
    <form onSubmit={submit} noValidate className="mt-8 max-w-[960px] sm:mt-10" aria-live="polite">
      <label htmlFor={`${id}-e`} className="sr-only">
        Your email
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <input
          id={`${id}-e`}
          data-signup
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          disabled={done}
          aria-invalid={error}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false);
          }}
          className="field border-b-[3px] border-current bg-transparent px-0 sm:max-w-[480px]"
        />
        <button type="submit" disabled={done} className={pill("cream", "disabled:opacity-100")}>
          {done ? (
            <>
              <svg viewBox="0 0 24 24" className="size-6" aria-hidden fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12.5l5 5L20 6" />
              </svg>
              <span className="ml-2">You’ll hear first</span>
            </>
          ) : (
            "Tell me when"
          )}
        </button>
        <JoinCrewLink href="#crew" from="hero" className="sm:ml-2" />
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-3 text-[15px] font-semibold">
          That email looks a little off. Mind checking it?
        </p>
      )}
    </form>
  );
}
