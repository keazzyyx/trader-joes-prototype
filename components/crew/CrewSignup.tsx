"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { isEmail, store, type Member } from "@/lib/store";
import { track } from "@/lib/analytics";
import { searchStores, storeById } from "@/lib/data/stores";
import { CATEGORIES, categoryLabel } from "@/lib/data/categories";
import { pill } from "@/components/ui/pill";
import { Headline } from "@/components/ui/Reveal";
import { WipeLink } from "@/components/layout/Wipe";
import { SignupCta } from "@/components/layout/SignupCta";
import { Arrow, Smiley } from "@/components/art/Doodles";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Three stacked full-bleed steps. Each unlocks the next; the last one prints the membership. */
export function CrewSignup() {
  const reduce = useReducedMotion();
  const [member, setMember] = useState<Member | null | undefined>(undefined);
  const [fresh, setFresh] = useState(false);
  const [email, setEmail] = useState("");
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [cats, setCats] = useState<string[]>([]);
  const doneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    store.members.current().then(setMember);
    setEmail(store.knownEmail() ?? "");
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

  async function finish() {
    if (!isEmail(email) || !storeId || cats.length !== 3) return;
    const m = await store.members.create({ email, birthMonth, storeId, categories: cats });
    track("crew_club_completed", { member_id: m.id, store_id: storeId, store_name: storeById(storeId)?.name, categories: cats, has_birth_month: birthMonth !== null });
    setFresh(true);
    setMember(m);
    requestAnimationFrame(() => doneRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
  }

  async function startOver() {
    await store.members.forgetCurrent();
    setMember(null);
    setFresh(false);
    setStoreId(null);
    setCats([]);
  }

  if (member === undefined) return <section id="join" className="min-h-[60vh] bg-cream" aria-busy="true" />;

  if (member) {
    const s = storeById(member.storeId);
    return (
      <section id="join" ref={doneRef} aria-labelledby="welcome-title" className="on-red relative overflow-x-clip bg-red px-5 py-28 text-cream sm:px-8 sm:py-36">
        <p className="label">{fresh ? "You’re in. Member number" : "Welcome back. Member number"}</p>
        <p className="display mt-3 text-[20vw] leading-[0.85]" aria-live="polite">
          {member.memberNumber}
        </p>
        <Headline id="welcome-title" lines={["Welcome", "to the crew"]} className="mt-6 text-[16vw] sm:text-[12vw]" />
        <Smiley className="absolute top-[8vw] right-[4vw] size-[16vw] text-cream sm:size-[9vw]" />
        <p className="mt-8 max-w-[48ch] text-[17px] leading-snug opacity-90">
          {fresh
            ? `We’ll tell you about drops a day early, and ping you when something’s back on the shelf at ${s?.name ?? "your store"}. First note lands before the next drop.`
            : `You’re watching ${s?.name ?? "your store"} for back-in-stock alerts. Nothing to scan, nothing to do. We’ll write when there’s news.`}
        </p>
        <p className="mt-3 text-[15px] opacity-80">
          Keeps an eye on {member.categories.map(categoryLabel).join(", ")}.
          {member.birthMonth ? ` Birthday treat goes out in ${MONTHS[member.birthMonth - 1]}.` : ""}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <WipeLink href="/drops" className={pill("red")}>
            See what’s dropping next
          </WipeLink>
          <SignupCta from="crew_club_done" className="display inline-flex min-h-16 items-center text-[26px] underline decoration-[3px] underline-offset-[6px]">
            Add the Fearless Flyer too
          </SignupCta>
        </div>
        <button type="button" onClick={startOver} className="mt-10 min-h-11 text-[14px] font-semibold uppercase underline underline-offset-4 opacity-80">
          Not you? Start a new card
        </button>
      </section>
    );
  }

  const ok1 = isEmail(email);
  const ok2 = ok1 && !!storeId;
  const ok3 = ok2 && cats.length === 3;

  return (
    <div id="join">
      <StepEmail email={email} setEmail={setEmail} birthMonth={birthMonth} setBirthMonth={setBirthMonth} ok={ok1} onNext={() => scrollTo("step-2")} />
      <StepStore storeId={storeId} setStoreId={setStoreId} locked={!ok1} ok={ok2} onNext={() => scrollTo("step-3")} />
      <StepCats cats={cats} setCats={setCats} locked={!ok2} ok={ok3} onFinish={finish} />
    </div>
  );
}

function StepShell({ id, tone, step, title, children, locked }: { id: string; tone: "cream" | "green" | "yellow"; step: string; title: string[]; children: React.ReactNode; locked?: boolean }) {
  const bg = { cream: "bg-cream text-ink", green: "on-red bg-green text-cream", yellow: "bg-yellow text-ink" }[tone];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${bg} scroll-mt-4 px-5 py-24 sm:px-8 sm:py-32`}>
      <div className={locked ? "opacity-40" : ""}>
        <p className="label">{step}</p>
        <Headline id={`${id}-title`} lines={title} className="mt-3 text-[13vw] sm:text-[8vw]" />
        <fieldset disabled={locked} className="mt-10 min-w-0 border-0 p-0">
          {children}
        </fieldset>
      </div>
    </section>
  );
}

function StepEmail({ email, setEmail, birthMonth, setBirthMonth, ok, onNext }: { email: string; setEmail: (v: string) => void; birthMonth: number | null; setBirthMonth: (v: number | null) => void; ok: boolean; onNext: () => void }) {
  const id = useId();
  return (
    <StepShell id="step-1" tone="cream" step="Step one of three" title={["Where should", "we write to you?"]}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (ok) onNext();
        }}
        className="grid max-w-[860px] gap-6"
      >
        <p className="text-[16px] opacity-80">One email per drop, tops. Usually fewer.</p>
        <div>
          <label htmlFor={`${id}-e`} className="sr-only">
            Email
          </label>
          <input id={`${id}-e`} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field bg-yellow" />
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-b`} className="label">
            Birthday month (optional)
          </label>
          <div className="relative max-w-[360px]">
            <select id={`${id}-b`} value={birthMonth ?? ""} onChange={(e) => setBirthMonth(e.target.value ? Number(e.target.value) : null)} className="field bg-yellow pr-16">
              <option value="">Rather not say</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <Arrow className="pointer-events-none absolute top-1/2 right-4 h-6 w-auto -translate-y-1/2 rotate-90 text-ink" />
          </div>
          <p className="text-[14px] opacity-70">The month gets you a small birthday item at the register. We don’t need the year.</p>
        </div>
        <button type="submit" disabled={!ok} className={pill("cream", "justify-self-start")}>
          Next, pick your store
        </button>
      </form>
    </StepShell>
  );
}

function StepStore({ storeId, setStoreId, locked, ok, onNext }: { storeId: string | null; setStoreId: (v: string) => void; locked: boolean; ok: boolean; onNext: () => void }) {
  const id = useId();
  const [q, setQ] = useState("");
  const results = searchStores(q);
  return (
    <StepShell id="step-2" tone="green" step="Step two of three" title={["Which store", "is yours?"]} locked={locked}>
      <p className="text-[16px] opacity-85">Back-in-stock alerts come from this one.</p>
      <label htmlFor={`${id}-q`} className="sr-only">
        Search by neighborhood, city or street
      </label>
      <input id={`${id}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: Rockridge, Masonic, Palo Alto" className="field mt-6 max-w-[520px] bg-cream" />
      <div role="radiogroup" aria-label="Stores" className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.length === 0 && <p className="text-[16px]">No store matches that. Try a city name.</p>}
        {results.map((s) => {
          const on = s.id === storeId;
          return (
            <button key={s.id} type="button" role="radio" aria-checked={on} onClick={() => setStoreId(s.id)} className="group min-h-12 text-left">
              <span className={`display block text-[30px] leading-none ${on ? "text-yellow underline decoration-[4px] underline-offset-[6px]" : "group-hover:text-yellow"}`}>{s.name}</span>
              <span className="mt-1 block text-[14px] opacity-75">
                {s.address}, {s.city}
              </span>
            </button>
          );
        })}
      </div>
      <button type="button" disabled={!ok} onClick={onNext} className={pill("green", "mt-12")}>
        Next, pick three favorites
      </button>
    </StepShell>
  );
}

function StepCats({ cats, setCats, locked, ok, onFinish }: { cats: string[]; setCats: (v: string[]) => void; locked: boolean; ok: boolean; onFinish: () => void }) {
  const full = cats.length === 3;
  return (
    <StepShell id="step-3" tone="yellow" step="Step three of three" title={["Pick three aisles", "you care about"]} locked={locked}>
      <p className="text-[16px] opacity-80" aria-live="polite">
        {cats.length === 0 ? "We’ll lead with these in your emails." : full ? "That’s three. Perfect." : `${cats.length} of 3 picked.`}
      </p>
      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4" role="group" aria-label="Favorite categories">
        {CATEGORIES.map((c) => {
          const on = cats.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              disabled={!on && full}
              onClick={() => setCats(on ? cats.filter((x) => x !== c.id) : [...cats, c.id])}
              className={`display min-h-12 text-[9vw] leading-none sm:text-[3.6vw] ${on ? "text-red underline decoration-[4px] underline-offset-[8px]" : "hover:text-red disabled:opacity-40"}`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
      <button type="button" disabled={!ok} onClick={onFinish} className={pill("yellow", "mt-12")}>
        Join the Crew
      </button>
    </StepShell>
  );
}
