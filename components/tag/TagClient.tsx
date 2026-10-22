"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Package } from "@/components/art/Package";
import { GoneStamp } from "@/components/ui/GoneStamp";
import { Countdown } from "@/components/drops/Countdown";
import { pill } from "@/components/ui/pill";
import { WipeLink } from "@/components/layout/Wipe";
import { DROPS, dropStatus, shortDate } from "@/lib/data/drops";
import type { Store } from "@/lib/data/stores";
import { useNow, useStoreValue } from "@/lib/hooks";
import { isEmail, store } from "@/lib/store";
import { track } from "@/lib/analytics";
import { rememberStore } from "@/lib/prefs";

const DAY = 86_400_000;

/** Milliseconds since the page loaded, i.e. scan-to-signup. Lives outside the component so React sees it as an event-time call. */
const elapsedSince = (startedAt: number) => Math.round(performance.now() - startedAt);

/** What a shopper sees after scanning the QR on an empty shelf. One screen, one ask. */
export function TagClient({ slug, shop }: { slug: string; shop: Store }) {
  const drop = DROPS.find((d) => d.id === slug)!;
  const { now, live } = useNow(1000);
  const status = dropStatus(drop, now);
  const id = useId();
  const loadedAt = useRef<number>(0);
  const [email, setEmail] = useState("");
  const [known, setKnown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [listed, setListed] = useState(false);
  const mine = useStoreValue(() => store.dropAlerts.mine()) ?? [];
  const already = mine.includes(drop.id);
  const done = listed || already;
  const waiting = useStoreValue(() => store.dropAlerts.countFor(drop.id, shop.id), [drop.id, shop.id, done]) ?? 0;

  useEffect(() => {
    loadedAt.current = performance.now();
    rememberStore(shop.id);
    const k = store.knownEmail();
    setKnown(k);
    if (k) setEmail(k);
  }, [shop.id]);

  const gone = status.kind === "gone";
  const when = status.kind === "gone" ? status.returnsAt : status.kind === "upcoming" ? status.startsAt : status.endsAt;
  const cta = gone ? "Tell me when it’s back" : status.kind === "upcoming" ? "Tell me when it drops" : "Remind me before it’s gone";

  async function submit(addr: string) {
    if (!isEmail(addr)) return setError("That email looks a little off. Mind checking it?");
    setBusy(true);
    try {
      await store.dropAlerts.add({ dropId: drop.id, email: addr, storeId: shop.id });
      track("drop_alert_set", {
        drop_id: drop.id,
        drop_name: drop.name,
        drop_status: status.kind,
        days_until: Math.round((when.getTime() - now.getTime()) / DAY),
        store_id: shop.id,
        store_name: shop.name,
        source: "tag",
        one_tap: !!known,
        scan_to_signup_ms: elapsedSince(loadedAt.current),
      });
      setListed(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t save that. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex min-h-dvh flex-col bg-cream px-5 pt-6 pb-8 sm:mx-auto sm:max-w-[520px]">
      <p className="display text-[22px] leading-none text-red">Trader Joe’s</p>

      <div className="relative mx-auto mt-4 w-[62%] max-w-[260px]">
        <div className={done || gone ? "opacity-50" : ""}>
          <Package art={drop.art} />
        </div>
        {(gone || done) && <GoneStamp listed={done} />}
      </div>

      <div className="mt-4" aria-live="polite">
        {done ? (
          <>
            <h1 className="display text-[14vw] leading-[0.9] sm:text-[56px]">You’re on the list.</h1>
            <p className="mt-2 text-[17px] leading-snug">
              One email the day {drop.name} is back at {shop.name}. Nothing in between.
            </p>
          </>
        ) : (
          <>
            <h1 className="display text-[15vw] leading-[0.9] sm:text-[60px]">{drop.name}</h1>
            <p className="label mt-3 text-red">
              {gone ? `Sold out at ${shop.name}` : status.kind === "upcoming" ? `Not at ${shop.name} yet` : `In stores now at ${shop.name}`}
            </p>
            {status.kind === "upcoming" ? (
              <Countdown to={status.startsAt} now={now} live={live} className="mt-1 text-[36px] leading-none" />
            ) : (
              <p className="mt-1 text-[17px]">{gone ? `Back around ${shortDate(when)}.` : `Around until ${shortDate(when)}.`}</p>
            )}
          </>
        )}
      </div>

      {!done && (
        <form
          className="mt-6 grid gap-3"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit(email);
          }}
        >
          {known ? (
            <>
              <button type="button" disabled={busy} onClick={() => submit(known)} className={pill("cream", "min-h-[72px] text-[24px]")}>
                Notify me at {shop.name}
              </button>
              <p className="text-[14px] opacity-75">
                As {known}.{" "}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => {
                    store.forgetEmail();
                    setKnown(null);
                    setEmail("");
                  }}
                >
                  Not you?
                </button>
              </p>
            </>
          ) : (
            <>
              <label htmlFor={`${id}-e`} className="sr-only">
                Your email
              </label>
              <input
                id={`${id}-e`}
                data-signup
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                aria-invalid={!!error}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="field bg-yellow"
              />
              <button type="submit" disabled={busy} className={pill("cream", "min-h-[72px] text-[24px]")}>
                {cta}
              </button>
            </>
          )}
          {error && <p className="text-[15px] font-semibold text-red">{error}</p>}
        </form>
      )}

      <AnimatePresence>
        {done && (
          <motion.div
            key="preview"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-6"
          >
            <p className="label opacity-60">Preview</p>
            <div className="mt-2 bg-ink px-5 py-4 text-cream" role="img" aria-label={`Phone notification preview: ${drop.name} is back at ${shop.name}.`}>
              <p className="label flex justify-between text-cream/70">
                <span>Trader Joe’s</span>
                <span>now</span>
              </p>
              <p className="mt-1 text-[18px] leading-snug">
                {drop.name} is back at {shop.name}.
              </p>
            </div>
            {waiting >= 5 && (
              <p className="display mt-6 text-[11vw] leading-[0.9] sm:text-[40px]">
                {waiting.toLocaleString("en-US")} people at {shop.name} are waiting.
              </p>
            )}
            <p className="mt-6 text-[16px]">
              Hear about every drop a day early:{" "}
              <WipeLink href="/crew-club" className="font-semibold underline underline-offset-4">
                join the Crew.
              </WipeLink>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-auto pt-10 text-[12px] opacity-60">Student prototype for BENI 370 at USF. Not affiliated with Trader Joe’s.</p>
    </section>
  );
}
