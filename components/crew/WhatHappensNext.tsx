"use client";
import { DROPS, dropStatus, shortDate } from "@/lib/data/drops";
import { useNow } from "@/lib/hooks";
import type { Member } from "@/lib/store";
import { storeById } from "@/lib/data/stores";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY = 86_400_000;

/** Three dated lines, from the real drops calendar, so a new member knows what they just signed up for. */
export function WhatHappensNext({ member }: { member: Member }) {
  const { now } = useNow(0);
  const upcoming = DROPS.map((d) => ({ d, s: dropStatus(d, now) }))
    .filter((x) => x.s.kind === "upcoming")
    .sort((a, b) => +(a.s.kind === "upcoming" ? a.s.startsAt : 0) - +(b.s.kind === "upcoming" ? b.s.startsAt : 0));
  const store = storeById(member.storeId)?.name ?? "your store";
  const lines: [string, string][] = [];
  if (upcoming[0] && upcoming[0].s.kind === "upcoming") {
    const at = upcoming[0].s.startsAt;
    lines.push([shortDate(new Date(at.getTime() - DAY)), `Early word: ${upcoming[0].d.name} lands the next day.`]);
  }
  if (upcoming[1] && upcoming[1].s.kind === "upcoming") {
    lines.push([shortDate(new Date(upcoming[1].s.startsAt.getTime() - DAY)), `Early word: ${upcoming[1].d.name}.`]);
  }
  if (member.birthMonth) {
    const m = member.birthMonth - 1;
    const year = now.getMonth() > m ? now.getFullYear() + 1 : now.getFullYear();
    lines.push([`${MONTHS[m].slice(0, 3)} ${year}`, `Your birthday month: a small something at the ${store} register.`]);
  } else {
    lines.push(["Any day", `Back-in-stock alert from ${store}, the day a favorite returns.`]);
  }
  return (
    <div className="mt-10 max-w-[620px]" aria-label="What happens next">
      <p className="label opacity-80">What happens next · Preview</p>
      <ol className="mt-3 grid gap-3">
        {lines.slice(0, 3).map(([when, what]) => (
          <li key={when + what} className="grid grid-cols-[96px_1fr] items-baseline gap-4 sm:grid-cols-[120px_1fr]">
            <span className="display text-[26px] leading-none">{when}</span>
            <span className="text-[17px] leading-snug">{what}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
