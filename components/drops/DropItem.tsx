"use client";
import { useEffect, useId, useState } from "react";
import { Package } from "@/components/art/Package";
import { Drift } from "@/components/ui/Drift";
import { GoneStamp } from "@/components/ui/GoneStamp";
import { pill, textButton } from "@/components/ui/pill";
import { shortDate, type Drop, type DropStatus } from "@/lib/data/drops";
import { storeById } from "@/lib/data/stores";
import { isEmail, store } from "@/lib/store";
import { useStoreValue } from "@/lib/hooks";
import { knownStore } from "@/lib/prefs";
import { track } from "@/lib/analytics";
import { Countdown } from "./Countdown";

const DAY = 86_400_000;

export function DropItem({ drop, status, now, live, onList, index }: { drop: Drop; status: DropStatus; now: Date; live: boolean; onList: boolean; index: number }) {
  const right = index % 2 === 1;
  const gone = status.kind === "gone";
  const [justSet, setJustSet] = useState(false);
  const done = onList || justSet;
  const waiting = useStoreValue(() => store.dropAlerts.countFor(drop.id), [drop.id, done]) ?? 0;

  return (
    <article aria-labelledby={`${drop.id}-name`} className={`flex flex-col ${right ? "items-end text-right sm:mt-40" : "items-start"}`}>
      <div className="relative w-[72%] sm:w-[78%]">
        <Drift amount={12 + (index % 3) * 3} className={gone || (done && !gone) ? "opacity-50" : ""}>
          <Package art={drop.art} />
        </Drift>
        {gone && <GoneStamp listed={done} listedText="On the list" />}
      </div>
      <div className={`mt-6 w-full sm:w-[86%] ${right ? "ml-auto" : ""}`}>
        <Status status={status} now={now} live={live} right={right} />
        <h3 id={`${drop.id}-name`} className="display mt-3 text-[11vw] leading-[0.9] sm:text-[4.6vw]">
          {drop.name}
        </h3>
        <p className={`mt-3 max-w-[40ch] text-[16px] leading-snug opacity-85 ${right ? "ml-auto" : ""}`}>{drop.blurb}</p>
        <p className="display mt-2 text-[30px] leading-none text-red">{drop.price}</p>
        {waiting >= 5 && <p className="label mt-2">{waiting.toLocaleString("en-US")} people waiting</p>}
        <Notify drop={drop} status={status} done={done} onDone={() => setJustSet(true)} now={now} right={right} />
      </div>
    </article>
  );
}

function Status({ status, now, live, right }: { status: DropStatus; now: Date; live: boolean; right: boolean }) {
  if (status.kind === "now") {
    const days = Math.ceil((status.endsAt.getTime() - now.getTime()) / DAY);
    return <p className="label text-red">In stores now. {days <= 21 ? `Only about ${days} days left.` : `Around until ${shortDate(status.endsAt)}.`}</p>;
  }
  if (status.kind === "upcoming") {
    return (
      <div>
        <p className="label">Drops {shortDate(status.startsAt)}</p>
        <Countdown to={status.startsAt} now={now} live={live} className={`mt-1 text-[32px] leading-none ${right ? "text-right" : ""}`} />
      </div>
    );
  }
  return <p className="label opacity-70">Back around {shortDate(status.returnsAt)}, if history repeats.</p>;
}

function Notify({ drop, status, done, onDone, now, right }: { drop: Drop; status: DropStatus; done: boolean; onDone: () => void; now: Date; right: boolean }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [known, setKnown] = useState<string | null>(null);
  const [shop, setShop] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const read = () => {
      setKnown(store.knownEmail());
      setShop(knownStore());
    };
    read();
    window.addEventListener("tj:store", read);
    return () => window.removeEventListener("tj:store", read);
  }, []);

  const shopName = shop ? storeById(shop)?.name : undefined;
  const cta = status.kind === "upcoming" ? "Notify me when it drops" : status.kind === "gone" ? "Notify me when it’s back" : "Remind me before it’s gone";
  const success =
    status.kind === "upcoming" ? `We’ll email you the morning of ${shortDate(status.startsAt)}.` : status.kind === "gone" ? "One email when it’s back. That’s it." : "We’ll nudge you a week before it leaves.";

  async function submit(addr: string, oneTap: boolean) {
    if (!isEmail(addr)) return setError("That email looks a little off.");
    setBusy(true);
    try {
      await store.dropAlerts.add({ dropId: drop.id, email: addr, storeId: shop });
      const target = status.kind === "now" ? status.endsAt : status.kind === "upcoming" ? status.startsAt : status.returnsAt;
      track("drop_alert_set", { drop_id: drop.id, drop_name: drop.name, drop_status: status.kind, days_until: Math.round((target.getTime() - now.getTime()) / DAY), store_id: shop, source: "drops", one_tap: oneTap });
      onDone();
      setOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t save that. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="mt-5" aria-live="polite">
        <p className="display text-[30px] leading-none">You’re on the list.</p>
        <p className="mt-1 text-[15px] opacity-80">{success}</p>
      </div>
    );
  }

  // One tap after the first time: the remembered email submits straight away.
  if (known && !open) {
    return (
      <div className={`mt-5 flex flex-col gap-2 ${right ? "items-end" : "items-start"}`} aria-live="polite">
        <button type="button" disabled={busy} onClick={() => submit(known, true)} className={pill("cream")}>
          {shopName ? `Notify me at ${shopName}` : "Notify me"}
        </button>
        <p className="text-[13px] opacity-70">
          As {known}.{" "}
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => {
              store.forgetEmail();
              setKnown(null);
            }}
          >
            Not you?
          </button>
        </p>
        {error && <p className="text-[15px] font-semibold text-red">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-5" aria-live="polite">
      {open ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(email, false);
          }}
          noValidate
          className={`flex flex-col gap-3 ${right ? "items-end" : "items-start"}`}
        >
          <label htmlFor={`${id}-e`} className="sr-only">
            Where should we send it?
          </label>
          <input
            id={`${id}-e`}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            value={email}
            placeholder="you@example.com"
            aria-invalid={!!error}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="field bg-yellow"
          />
          {error && <p className="text-[15px] font-semibold text-red">{error}</p>}
          <div className={`flex flex-wrap items-center gap-4 ${right ? "flex-row-reverse" : ""}`}>
            <button type="submit" disabled={busy} className={pill("cream")}>
              {status.kind === "upcoming" ? "Notify me when it drops" : "Put me on the list"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="min-h-11 text-[15px] font-semibold uppercase underline underline-offset-4">
              Never mind
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={textButton}>
          {cta}
        </button>
      )}
    </div>
  );
}
