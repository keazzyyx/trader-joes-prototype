"use client";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STORES, storeById } from "@/lib/data/stores";
import { isEmail, store } from "@/lib/store";
import { track } from "@/lib/analytics";
import { useStoreValue } from "@/lib/hooks";
import { buttonClass } from "@/components/ui/button";
import { Check } from "@/components/ui/Check";

/** A stable, believable baseline per store so each neighborhood has its own number. */
function baseline(storeId: string) {
  let h = 0;
  for (const c of storeId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 140 + (h % 360);
}

export function Waitlist() {
  const id = useId();
  const [storeId, setStoreId] = useState(STORES[0].id);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [drift, setDrift] = useState({ storeId: "", n: 0 });
  const real = useStoreValue(() => store.waitlist.countFor(storeId), [storeId]) ?? 0;
  const mine = useStoreValue(() => store.waitlist.mine()) ?? [];
  const joined = mine.includes(storeId);
  const s = storeById(storeId)!;
  const count = baseline(storeId) + real + (drift.storeId === storeId ? drift.n : 0);

  useEffect(() => {
    setEmail(store.knownEmail() ?? "");
    store.members.current().then((m) => m && setStoreId(m.storeId));
  }, []);

  // Neighbors keep trickling in while you read. Fake, but it’s a prototype.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      t = setTimeout(() => {
        setDrift((d) => ({ storeId, n: d.storeId === storeId ? d.n + 1 : 1 }));
        tick();
      }, 3500 + Math.random() * 5000);
    };
    tick();
    return () => clearTimeout(t);
  }, [storeId]);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) return setError(true);
    await store.waitlist.join({ storeId, email });
    track("delivery_waitlist_joined", { store_id: storeId, store_name: s.name, city: s.city, waitlist_position: count + 1 });
  }

  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="scroll-mt-28 border-y-[10px] border-kraft-deep">
      <div className="tex-board on-dark">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_480px] lg:items-center">
          <div>
            <h2 id="waitlist-title" className="font-wonk chalk-text text-[38px] leading-[1.02] font-semibold sm:text-[54px]">
              Want it at your store? Get on the list.
            </h2>
            <p className="mt-5 max-w-[46ch] text-[19px] leading-relaxed text-chalk/85">
              We&rsquo;d start with the stores that have the most neighbors waiting. Adding your name is free and
              doesn&rsquo;t commit you to anything.
            </p>
            <div className="mt-8 flex items-baseline gap-4" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={count}
                  initial={{ y: -24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 24, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="font-wonk chalk-text text-[72px] leading-none font-semibold tabular-nums sm:text-[96px]"
                >
                  {count.toLocaleString("en-US")}
                </motion.span>
              </AnimatePresence>
              <span className="max-w-[18ch] text-[18px] leading-snug text-chalk/85">
                neighbors near {s.name} are already waiting
              </span>
            </div>
          </div>

          <div className="tex-paper border-2 border-ink px-5 py-7 text-ink shadow-[6px_6px_0_var(--color-kraft-deep)] sm:px-8">
            <label htmlFor={`${id}-store`} className="text-[17px] font-semibold">
              Your store
            </label>
            <select
              id={`${id}-store`}
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="mt-2 min-h-14 w-full rounded-[6px] border-2 border-ink bg-paper px-3 text-[18px]"
            >
              {STORES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.city})
                </option>
              ))}
            </select>
            <p className="mt-2 text-[15px] text-ink/65">
              {s.address}, {s.city}
            </p>

            <AnimatePresence mode="wait" initial={false}>
              {joined ? (
                <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6" aria-live="polite">
                  <p className="flex items-start gap-3 text-[20px] leading-snug font-semibold">
                    <span className="text-red">
                      <Check className="size-7" />
                    </span>
                    You&rsquo;re on the {s.name} list.
                  </p>
                  <p className="mt-2 text-[17px] leading-relaxed text-ink/80">
                    We&rsquo;ll email you once, when delivery is real at {s.address}. No spam in between. Promise.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={join} noValidate exit={{ opacity: 0 }} className="mt-6 grid gap-2">
                  <label htmlFor={`${id}-email`} className="text-[17px] font-semibold">
                    Your email
                  </label>
                  <input
                    id={`${id}-email`}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    placeholder="you@example.com"
                    aria-invalid={error}
                    aria-describedby={`${id}-help`}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(false);
                    }}
                    className={`min-h-14 rounded-[6px] border-2 bg-paper px-4 text-[18px] ${error ? "border-red" : "border-ink"}`}
                  />
                  <p id={`${id}-help`} className={`text-[15px] ${error ? "font-medium text-red-deep" : "text-ink/65"}`}>
                    {error ? "That email doesn’t look quite right. Mind checking it?" : "We only use it to tell you delivery has started."}
                  </p>
                  <button type="submit" className={buttonClass("red", "mt-3 min-h-14 text-[17px]")}>
                    Join the {s.name} waitlist
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
