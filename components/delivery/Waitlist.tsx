"use client";
import { useEffect, useId, useState } from "react";
import { STORES, storeById } from "@/lib/data/stores";
import { isEmail, store } from "@/lib/store";
import { track } from "@/lib/analytics";
import { useStoreValue } from "@/lib/hooks";
import { pill } from "@/components/ui/pill";
import { Headline } from "@/components/ui/Reveal";
import { Arrow } from "@/components/art/Doodles";

export function Waitlist() {
  const id = useId();
  const [storeId, setStoreId] = useState(STORES[0].id);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const real = useStoreValue(() => store.waitlist.countFor(storeId), [storeId]) ?? 0;
  const mine = useStoreValue(() => store.waitlist.mine()) ?? [];
  const joined = mine.includes(storeId);
  const s = storeById(storeId)!;
  const count = real;

  useEffect(() => {
    setEmail(store.knownEmail() ?? "");
    store.members.current().then((m) => m && setStoreId(m.storeId));
  }, []);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) return setError("That email doesn’t look quite right. Mind checking it?");
    try {
      await store.waitlist.join({ storeId, email });
      track("delivery_waitlist_joined", { store_id: storeId, store_name: s.name, city: s.city, waitlist_position: count + 1 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t save that. Try again in a moment.");
    }
  }

  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="on-red scroll-mt-4 bg-ink px-5 py-24 text-cream sm:px-8 sm:py-36">
      <Headline id="waitlist-title" lines={["Want it at your store?", "Get on the list."]} className="text-[13vw] sm:text-[8.5vw]" />
      <p className="mt-6 max-w-[46ch] text-[19px] leading-snug opacity-90">
        We’d start with the stores that have the most neighbors waiting. Adding your name is free and doesn’t commit you to anything.
      </p>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div aria-live="polite">
          <p className="display text-[26vw] leading-[0.85] text-yellow tabular-nums sm:text-[14vw]">{count.toLocaleString("en-US")}</p>
          <p className="mt-3 max-w-[24ch] text-[19px] leading-snug">{count === 1 ? "neighbor" : "neighbors"} near {s.name} {count === 1 ? "is" : "are"} already waiting</p>
        </div>
        <div className="max-w-[640px]">
          <label htmlFor={`${id}-store`} className="label">
            Your store
          </label>
          <div className="relative mt-2">
            <select id={`${id}-store`} value={storeId} onChange={(e) => setStoreId(e.target.value)} className="field bg-cream pr-16">
              {STORES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.city})
                </option>
              ))}
            </select>
            <Arrow className="pointer-events-none absolute top-1/2 right-4 h-6 w-auto -translate-y-1/2 rotate-90 text-ink" />
          </div>
          <p className="mt-2 text-[15px] opacity-75">
            {s.address}, {s.city}
          </p>
          {joined ? (
            <div className="mt-8" aria-live="polite">
              <p className="display text-[9vw] leading-[0.92] sm:text-[3.6vw]">You’re on the {s.name} list.</p>
              <p className="mt-3 text-[17px] leading-relaxed opacity-85">We’ll email you once, when delivery is real at {s.address}. No spam in between. Promise.</p>
            </div>
          ) : (
            <form onSubmit={join} noValidate className="mt-6 grid gap-3">
              <label htmlFor={`${id}-email`} className="label">
                Your email
              </label>
              <input
                id={`${id}-email`}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                placeholder="you@example.com"
                aria-invalid={!!error}
                aria-describedby={`${id}-help`}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="field bg-cream"
              />
              <p id={`${id}-help`} className={`text-[15px] ${error ? "font-semibold text-yellow" : "opacity-75"}`}>
                {error ?? "We only use it to tell you delivery has started."}
              </p>
              <button type="submit" className={pill("ink", "mt-2 justify-self-start")}>
                Join the {s.name} waitlist
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
