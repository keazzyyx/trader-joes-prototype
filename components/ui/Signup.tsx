"use client";
import { useEffect, useId, useState } from "react";
import { isEmail, store, type Source } from "@/lib/store";
import { track } from "@/lib/analytics";
import type { Tone } from "@/lib/hero";
import { pill } from "./pill";

const FIELD: Record<Tone, string> = {
  cream: "bg-yellow",
  yellow: "bg-cream",
  red: "bg-cream",
  green: "bg-cream",
  ink: "bg-cream",
};

/**
 * The Fearless Flyer signup: one input, one button, inline. Same everywhere,
 * so the success copy and the event payload never drift between placements.
 */
export function Signup({
  source,
  on = "cream",
  className = "",
  variant = "fill",
}: {
  source: Source;
  on?: Tone;
  className?: string;
  /** "fill": a flat palette fill. "rule": transparent with a bottom rule in the text color (hero only). */
  variant?: "fill" | "rule";
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done" | "already">("idle");
  const [message, setMessage] = useState("That email looks a little off. Mind checking it?");

  useEffect(() => {
    const known = store.knownEmail();
    if (known) setEmail(known);
    store.subscribers.isSubscribed().then((yes) => yes && setState("already"));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setMessage("That email looks a little off. Mind checking it?");
      return setState("error");
    }
    try {
      const sub = await store.subscribers.add({ email, source });
      track("flyer_signup_submitted", { method: "email", source, subscriber_id: sub.id });
      setState("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Couldn’t save that. Try again in a moment.");
      setState("error");
    }
  }

  const fg = on === "cream" || on === "yellow" ? "text-ink" : "text-cream";

  if (state === "done" || state === "already") {
    return (
      <div className={`${fg} ${className}`} aria-live="polite">
        <p className="display text-[9vw] leading-[0.92] sm:text-[4.6vw]">
          {state === "already" ? "You’re already on the list." : "You’re on the list."} Next Flyer lands Tuesday.
        </p>
        <p className="mt-4 max-w-[46ch] text-[16px] opacity-80">
          {state === "already" ? "Nothing else to do here. Go poke around the seasonal drops." : "Look for the one with the little boat in the corner."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={className} aria-live="polite">
      <label htmlFor={`${id}-e`} className="sr-only">
        Your email
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`${id}-e`}
          data-signup
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? `${id}-err` : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          className={`field sm:max-w-[560px] ${variant === "rule" ? "border-b-[3px] border-current bg-transparent px-0" : FIELD[on]}`}
        />
        <button type="submit" className={pill(on)}>
          Send me the Flyer
        </button>
      </div>
      {state === "error" && (
        <p id={`${id}-err`} className={`mt-3 text-[15px] font-semibold ${fg}`}>
          {message}
        </p>
      )}
    </form>
  );
}
