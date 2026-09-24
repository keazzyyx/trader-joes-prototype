"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { isEmail, store, type Member } from "@/lib/store";
import { track } from "@/lib/analytics";
import { searchStores, storeById } from "@/lib/data/stores";
import { CATEGORIES } from "@/lib/data/categories";
import { buttonClass } from "@/components/ui/button";
import { Check } from "@/components/ui/Check";
import { FlyerButton } from "@/components/layout/FlyerDrawer";
import { MemberCard } from "./MemberCard";

const STEPS = ["Your email", "Your store", "Three favorites"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function CrewSignup() {
  const [member, setMember] = useState<Member | null | undefined>(undefined);
  const [fresh, setFresh] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [email, setEmail] = useState("");
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [cats, setCats] = useState<string[]>([]);

  useEffect(() => {
    store.members.current().then(setMember);
    setEmail(store.knownEmail() ?? "");
  }, []);

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  async function finish() {
    if (!storeId || cats.length !== 3) return;
    const m = await store.members.create({ email, birthMonth, storeId, categories: cats });
    track("crew_club_completed", {
      member_id: m.id,
      store_id: storeId,
      store_name: storeById(storeId)?.name,
      categories: cats,
      has_birth_month: birthMonth !== null,
    });
    setFresh(true);
    setMember(m);
    requestAnimationFrame(() => document.getElementById("join")?.scrollIntoView({ block: "start" }));
  }

  async function startOver() {
    await store.members.forgetCurrent();
    setMember(null);
    setFresh(false);
    setStep(0);
    setStoreId(null);
    setCats([]);
  }

  if (member === undefined) return <div className="min-h-[520px]" aria-busy="true" />;

  if (member) {
    const s = storeById(member.storeId);
    return (
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_460px] lg:gap-16">
        <div aria-live="polite">
          <h2 className="font-wonk text-[38px] leading-[1.02] font-semibold sm:text-[52px]">
            {fresh ? "You’re in. Here’s your card." : "Welcome back. Your card’s right here."}
          </h2>
          <p className="mt-4 max-w-[48ch] text-[18px] leading-relaxed text-ink/80">
            {fresh
              ? `We’ll tell you about drops a day early, and ping you when something’s back on the shelf at ${s?.name ?? "your store"}. First note lands before the next drop.`
              : `You’re watching ${s?.name ?? "your store"} for back-in-stock alerts. Nothing to scan, nothing to do. We’ll write when there’s news.`}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/drops" className={buttonClass("red")}>
              See what&rsquo;s dropping next
            </Link>
            <FlyerButton from="crew_club_card" className={buttonClass("outline")}>
              Add the Fearless Flyer too
            </FlyerButton>
          </div>
          <button type="button" onClick={startOver} className="mt-6 min-h-11 text-[15px] text-ink/60 underline underline-offset-4 hover:text-ink">
            Not you? Start a new card
          </button>
        </div>
        <MemberCard member={member} autoFlip={fresh} />
      </div>
    );
  }

  const canNext = [isEmail(email), !!storeId, cats.length === 3][step];

  return (
    <div className="mx-auto max-w-[760px]">
      <Progress step={step} />
      <div className="tex-paper relative mt-8 overflow-hidden border-2 border-ink px-5 py-8 shadow-[6px_6px_0_var(--color-kraft-deep)] sm:px-10 sm:py-10">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.22 }}
          >
            {step === 0 && <StepEmail email={email} setEmail={setEmail} birthMonth={birthMonth} setBirthMonth={setBirthMonth} onNext={() => go(1)} />}
            {step === 1 && <StepStore storeId={storeId} setStoreId={setStoreId} />}
            {step === 2 && <StepCats cats={cats} setCats={setCats} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-dashed border-ink/30 pt-6">
          {step < 2 ? (
            <button type="button" disabled={!canNext} onClick={() => go(step + 1)} className={buttonClass("red")}>
              {step === 0 ? "Next, pick your store" : `Next, pick three favorites`}
            </button>
          ) : (
            <button type="button" disabled={!canNext} onClick={finish} className={buttonClass("red")}>
              Print my Crew Club card
            </button>
          )}
          {step > 0 && (
            <button type="button" onClick={() => go(step - 1)} className="min-h-11 px-2 text-[15px] font-medium text-ink/70 underline underline-offset-4 hover:text-ink">
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <ol className="relative grid grid-cols-3" aria-label="Signup progress">
      <svg aria-hidden viewBox="0 0 600 12" preserveAspectRatio="none" className="absolute top-[13px] left-[16.66%] h-3 w-[66.66%]">
        <path d="M2 6c90-5 190 4 300 0s210-3 296 1" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-ink/30" vectorEffect="non-scaling-stroke" />
        <motion.path
          d="M2 6c90-5 190 4 300 0s210-3 296 1"
          fill="none"
          stroke="var(--color-red)"
          strokeWidth="4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ pathLength: step / 2 }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </svg>
      {STEPS.map((label, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <li key={label} className="relative flex flex-col items-center gap-2 text-center" aria-current={current ? "step" : undefined}>
            <motion.span
              animate={{ scale: current ? 1.1 : 1 }}
              className={`grid size-8 place-items-center rounded-full border-2 text-[15px] font-bold ${
                done || current ? "border-red bg-red text-paper" : "border-ink/40 bg-paper text-ink/60"
              }`}
            >
              {done ? <Check className="size-5" /> : i + 1}
            </motion.span>
            <span className={`text-[14px] sm:text-[15px] ${current ? "font-semibold text-ink" : "text-ink/65"}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function StepEmail({
  email,
  setEmail,
  birthMonth,
  setBirthMonth,
  onNext,
}: {
  email: string;
  setEmail: (v: string) => void;
  birthMonth: number | null;
  setBirthMonth: (v: number | null) => void;
  onNext: () => void;
}) {
  const id = useId();
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (isEmail(email)) onNext();
      }}
    >
      <h3 className="font-wonk text-[30px] leading-tight font-semibold">Where should we write to you?</h3>
      <p className="mt-2 text-[16px] text-ink/70">One email per drop, tops. Usually fewer.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_200px]">
        <div className="grid gap-2">
          <label htmlFor={`${id}-e`} className="text-[15px] font-medium">
            Email
          </label>
          <input
            id={`${id}-e`}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-h-12 rounded-[6px] border-2 border-ink bg-paper px-4 text-[16px]"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-b`} className="text-[15px] font-medium">
            Birthday month <span className="font-normal text-ink/55">(optional)</span>
          </label>
          <select
            id={`${id}-b`}
            value={birthMonth ?? ""}
            onChange={(e) => setBirthMonth(e.target.value ? Number(e.target.value) : null)}
            className="min-h-12 rounded-[6px] border-2 border-ink bg-paper px-3 text-[16px]"
          >
            <option value="">Rather not say</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-3 text-[14px] text-ink/60">The month gets you a small birthday item at the register. We don&rsquo;t need the year.</p>
      <button type="submit" className="sr-only">
        Next
      </button>
    </form>
  );
}

function StepStore({ storeId, setStoreId }: { storeId: string | null; setStoreId: (v: string) => void }) {
  const id = useId();
  const [q, setQ] = useState("");
  const results = searchStores(q);
  return (
    <div>
      <h3 className="font-wonk text-[30px] leading-tight font-semibold">Which store is yours?</h3>
      <p className="mt-2 text-[16px] text-ink/70">Back-in-stock alerts come from this one.</p>
      <label htmlFor={`${id}-q`} className="mt-6 block text-[15px] font-medium">
        Search by neighborhood, city or street
      </label>
      <input
        id={`${id}-q`}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Try Rockridge, or Masonic"
        className="mt-2 min-h-12 w-full rounded-[6px] border-2 border-ink bg-paper px-4 text-[16px]"
      />
      <div role="radiogroup" aria-label="Stores" className="mt-4 grid max-h-[340px] gap-2 overflow-y-auto pr-1">
        {results.length === 0 && <p className="py-4 text-[16px] text-ink/70">No store matches that. Try a city name.</p>}
        {results.map((s) => {
          const on = s.id === storeId;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setStoreId(s.id)}
              className={`flex min-h-14 items-center justify-between gap-3 rounded-[6px] border-2 px-4 py-2.5 text-left transition-colors ${
                on ? "border-red bg-red/5" : "border-ink/20 hover:border-ink"
              }`}
            >
              <span>
                <span className="block text-[16px] font-semibold">{s.name}</span>
                <span className="block text-[14px] text-ink/65">
                  {s.address}, {s.city}
                </span>
              </span>
              <span className={on ? "text-red" : "text-transparent"}>{on && <Check className="size-6" />}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepCats({ cats, setCats }: { cats: string[]; setCats: (v: string[]) => void }) {
  const full = cats.length === 3;
  return (
    <div>
      <h3 className="font-wonk text-[30px] leading-tight font-semibold">Pick three aisles you care about.</h3>
      <p className="mt-2 text-[16px] text-ink/70" aria-live="polite">
        {cats.length === 0 ? "We’ll lead with these in your emails." : full ? "That’s three. Perfect." : `${cats.length} of 3 picked.`}
      </p>
      <div className="mt-6 flex flex-wrap gap-2.5" role="group" aria-label="Favorite categories">
        {CATEGORIES.map((c) => {
          const on = cats.includes(c.id);
          const disabled = !on && full;
          return (
            <motion.button
              key={c.id}
              type="button"
              aria-pressed={on}
              disabled={disabled}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCats(on ? cats.filter((x) => x !== c.id) : [...cats, c.id])}
              className={`inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 text-[15px] font-semibold transition-colors ${
                on ? "border-ink bg-ink text-paper" : "border-ink/30 bg-paper hover:border-ink"
              } disabled:opacity-40`}
            >
              {on && (
                <svg viewBox="0 0 16 16" className="size-4 text-kraft" aria-hidden fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5l3.2 3L13 4.5" />
                </svg>
              )}
              {c.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
