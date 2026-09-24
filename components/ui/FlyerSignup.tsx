"use client";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { isEmail, store, type Source } from "@/lib/store";
import { track } from "@/lib/analytics";
import { buttonClass } from "./button";
import { Check } from "./Check";

type Tone = "paper" | "red";

/**
 * The Fearless Flyer signup. Used in the hero card, the drawer and the red band,
 * so the conversion copy and success state stay identical everywhere.
 */
export function FlyerSignup({
  source,
  tone = "paper",
  autoFocus = false,
  stacked = false,
  onDone,
}: {
  source: Source;
  tone?: Tone;
  autoFocus?: boolean;
  stacked?: boolean;
  onDone?: () => void;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const [already, setAlready] = useState(false);

  useEffect(() => {
    const known = store.knownEmail();
    if (known) setEmail(known);
    store.subscribers.isSubscribed().then((yes) => {
      if (yes) {
        setAlready(true);
        setState("done");
      }
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setState("error");
      return;
    }
    const sub = await store.subscribers.add({ email, source });
    track("flyer_signup_submitted", { method: "email", source, subscriber_id: sub.id });
    setState("done");
    onDone?.();
  }

  const onRed = tone === "red";
  const label = onRed ? "text-paper" : "text-ink";
  const input =
    "w-full min-h-12 rounded-[6px] border-2 px-4 text-[16px] bg-paper text-ink placeholder:text-ink/45 " +
    (state === "error" ? "border-red" : "border-ink") +
    " focus-visible:outline-offset-2";

  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 font-soft text-xl leading-snug ${onRed ? "text-paper" : "text-ink"}`}
          >
            <span className={onRed ? "text-paper" : "text-red"}>
              <Check className="size-7 shrink-0" />
            </span>
            <span>
              {already ? "You’re already on the list. Next Flyer lands Tuesday." : "You’re on the list. Next Flyer lands Tuesday."}
              <span className={`mt-1 block font-body text-[15px] ${onRed ? "text-paper/85" : "text-ink/70"}`}>
                {already
                  ? "Nothing else to do here. Go poke around the seasonal drops."
                  : "Look for the one with the little woodcut ship in the corner."}
              </span>
            </span>
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -6 }} className="grid gap-2">
            <label htmlFor={`${id}-email`} className={`text-[15px] font-medium ${label}`}>
              Your email
            </label>
            <div className={stacked ? "grid gap-3" : "flex flex-col gap-3 sm:flex-row"}>
              <input
                id={`${id}-email`}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                autoFocus={autoFocus}
                aria-invalid={state === "error"}
                aria-describedby={state === "error" ? `${id}-err` : undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                className={input}
              />
              <button type="submit" className={buttonClass(onRed ? "paper" : "red", "shrink-0")}>
                Send me the Flyer
              </button>
            </div>
            {state === "error" && (
              <p id={`${id}-err`} className={`text-[14px] font-medium ${onRed ? "text-paper" : "text-red-deep"}`}>
                That email looks a little off. Mind checking it?
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
