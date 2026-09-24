"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Package } from "@/components/art/Package";
import { Stamp } from "@/components/art/Stamp";
import { Check } from "@/components/ui/Check";
import { buttonClass } from "@/components/ui/button";
import { shortDate, type Drop, type DropStatus } from "@/lib/data/drops";
import { isEmail, store } from "@/lib/store";
import { track } from "@/lib/analytics";
import { Countdown } from "./Countdown";

const DAY = 86_400_000;
const TAPE = ["left-1/2 -translate-x-1/2 rotate-[-3deg]", "left-6 rotate-[-8deg]", "right-6 rotate-[6deg]", "left-1/3 rotate-[2deg]"];

export function DropCard({
  drop,
  status,
  now,
  live,
  onList,
  feature,
}: {
  drop: Drop;
  status: DropStatus;
  now: Date;
  live: boolean;
  onList: boolean;
  feature: boolean;
}) {
  const gone = status.kind === "gone";
  const bg = status.kind === "upcoming" ? "tex-kraft" : gone ? "bg-chalk" : "tex-paper";

  return (
    <article
      aria-labelledby={`${drop.id}-name`}
      className={`relative flex h-full flex-col border-2 border-ink ${bg} shadow-[5px_5px_0_var(--color-ink)] ${
        feature ? "sm:flex-row" : ""
      }`}
      style={gone ? { backgroundImage: "var(--noise)" } : undefined}
    >
      {/* masking tape */}
      <span
        aria-hidden
        className={`absolute -top-3 z-10 h-6 w-24 bg-kraft/80 shadow-[0_1px_2px_rgb(31_26_23/0.2)] ${TAPE[drop.id.length % TAPE.length]}`}
        style={{ backgroundImage: "var(--fiber)" }}
      />

      <div
        className={`relative flex items-end justify-center overflow-hidden px-6 pt-8 ${
          feature ? `sm:w-[46%] sm:items-center sm:border-r-2 sm:border-ink sm:py-8 ${status.kind === "now" ? "tex-kraft" : status.kind === "upcoming" ? "bg-paper/40" : ""}` : ""
        }`}
      >
        <div className={`${feature ? "h-[230px] w-[184px] sm:h-[280px] sm:w-[224px]" : "h-[190px] w-[152px]"} ${gone ? "opacity-55 grayscale-[70%]" : ""}`}>
          <Package art={drop.art} />
        </div>
        {gone && (
          <motion.div
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, scale: 2.6, rotate: -32 }}
            whileInView={{ opacity: 0.94, scale: 1, rotate: -12 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ type: "spring", stiffness: 700, damping: 26, mass: 0.8 }}
          >
            <Stamp lines={["GONE UNTIL", "NEXT YEAR"]} className={feature ? "w-[250px]" : "w-[200px]"} />
          </motion.div>
        )}
      </div>

      <div className={`flex flex-1 flex-col px-5 pt-4 pb-5 sm:px-6 ${feature ? "sm:justify-center sm:py-8" : ""}`}>
        <StatusLine status={status} now={now} live={live} />
        <h3 id={`${drop.id}-name`} className={`font-wonk mt-3 leading-[1.05] font-semibold ${feature ? "text-[32px] sm:text-[40px]" : "text-[25px]"}`}>
          {drop.name}
        </h3>
        <p className="mt-2 text-[16px] leading-relaxed text-ink/75">{drop.blurb}</p>
        <p className="font-wonk mt-3 text-[20px] font-semibold text-red-deep">{drop.price}</p>
        <div className={feature ? "mt-auto pt-6 sm:mt-0" : "mt-auto pt-5"}>
          <NotifyMe drop={drop} status={status} onList={onList} now={now} />
        </div>
      </div>
    </article>
  );
}

function StatusLine({ status, now, live }: { status: DropStatus; now: Date; live: boolean }) {
  if (status.kind === "now") {
    const days = Math.ceil((status.endsAt.getTime() - now.getTime()) / DAY);
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-2 rounded-[3px] bg-board px-2.5 py-1.5 text-[14px] font-semibold text-chalk">
          <span aria-hidden className="size-2 rounded-full bg-kraft" />
          In stores now
        </span>
        <span className="text-[14px] text-ink/65">{days <= 21 ? `Only about ${days} days left` : `Around until ${shortDate(status.endsAt)}`}</span>
      </div>
    );
  }
  if (status.kind === "upcoming") {
    return (
      <div className="inline-flex flex-col gap-2 self-start rounded-[3px] bg-board px-3 pt-2 pb-2.5">
        <span className="text-[14px] font-semibold text-kraft">Drops {shortDate(status.startsAt)}</span>
        <Countdown to={status.startsAt} now={now} live={live} />
      </div>
    );
  }
  return <span className="text-[14px] font-medium text-ink/65">Back around {shortDate(status.returnsAt)}, if history repeats.</span>;
}

function NotifyMe({ drop, status, onList, now }: { drop: Drop; status: DropStatus; onList: boolean; now: Date }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [justSet, setJustSet] = useState(false);
  const done = onList || justSet;

  const cta =
    status.kind === "upcoming" ? "Notify me when it drops" : status.kind === "gone" ? "Notify me when it’s back" : "Remind me before it’s gone";
  const success =
    status.kind === "upcoming"
      ? `We’ll email you the morning of ${shortDate(status.startsAt)}.`
      : status.kind === "gone"
        ? "One email when it’s back. That’s it."
        : "We’ll nudge you a week before it leaves.";

  function openForm() {
    setEmail(store.knownEmail() ?? "");
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) return setError(true);
    await store.dropAlerts.add({ dropId: drop.id, email });
    const target = status.kind === "now" ? status.endsAt : status.kind === "upcoming" ? status.startsAt : status.returnsAt;
    track("drop_alert_set", {
      drop_id: drop.id,
      drop_name: drop.name,
      drop_status: status.kind,
      days_until: Math.round((target.getTime() - now.getTime()) / DAY),
    });
    setJustSet(true);
    setOpen(false);
  }

  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="rounded-[6px] border-2 border-board bg-board px-4 py-3 text-chalk"
          >
            <p className="flex items-center gap-2 text-[16px] font-semibold">
              <Check className="size-6 text-kraft" />
              You&rsquo;re on the list
            </p>
            <p className="mt-1 text-[14px] text-chalk/80">{success}</p>
          </motion.div>
        ) : open ? (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0 }}
            className="grid gap-2 overflow-visible"
          >
            <label htmlFor={`${id}-e`} className="text-[15px] font-medium">
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
              aria-invalid={error}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              className={`min-h-12 w-full rounded-[6px] border-2 bg-paper px-4 text-[16px] ${error ? "border-red" : "border-ink"}`}
            />
            {error && <p className="text-[14px] font-medium text-red-deep">That email looks a little off.</p>}
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className={buttonClass("red")}>
                {status.kind === "upcoming" ? "Notify me when it drops" : "Put me on the list"}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="min-h-11 px-2 text-[15px] font-medium text-ink/70 underline underline-offset-4 hover:text-ink">
                Never mind
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.button key="cta" type="button" onClick={openForm} exit={{ opacity: 0 }} className={buttonClass(status.kind === "upcoming" ? "red" : "ink", "w-full sm:w-auto")}>
            {cta}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
