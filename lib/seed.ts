import type { DropAlert, Member, Subscriber, WaitlistEntry, Source } from "./store";

/* Deterministic demo data so the site (and /debug) never starts empty. */

const PEOPLE = [
  "maria.alvarez", "dtran", "jen.okafor", "sam.whitfield", "priya.natarajan", "kev.obrien",
  "lucia.moreno", "tomas.berg", "annie.cho", "rgoldstein", "fatima.haddad", "marcus.lee",
  "eleanor.pike", "jlindqvist", "nora.fitz", "ben.akande", "grace.yamamoto", "hector.ruiz",
  "olivia.sandoval", "pete.kowalski", "ines.duarte", "walt.hagen", "mei.lin", "carol.bishop",
  "aaron.feld", "sofia.rossi", "jamal.greene", "helen.marsh", "dev.patel", "ruth.abernathy",
];
const DOMAINS = ["gmail.com", "yahoo.com", "icloud.com", "outlook.com", "sbcglobal.net", "comcast.net", "usfca.edu"];
const SOURCES: Source[] = ["hero", "hero", "drawer", "band", "drops", "crew-club", "footer", "hero", "delivery"];
const DROP_IDS = [
  "peppermint-joe-joes", "peppermint-joe-joes", "peppermint-joe-joes", "pumpkin-cheesecake", "pumpkin-cheesecake",
  "sparkling-cranberry-ginger", "sparkling-cranberry-ginger", "mini-hold-the-cone", "maple-leaf-cookies",
  "candy-cane-coffee", "hot-cross-buns", "watermelon-jerky", "pumpkin-joe-joes",
];
const STORE_IDS = [
  "sf-masonic", "sf-masonic", "sf-stonestown", "sf-stonestown", "sf-stonestown", "oak-rockridge", "oak-lakeshore",
  "berkeley", "walnut-creek", "walnut-creek", "san-mateo", "palo-alto", "lafayette", "san-rafael", "el-cerrito",
];
const CATS = ["frozen", "snacks", "cheese", "produce", "bakery", "sweets", "dips", "pantry", "coffee", "wine", "flowers", "seasonal"];

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}
const r = rng(370);
const pick = <T,>(xs: T[]) => xs[Math.floor(r() * xs.length)];
const email = (i: number) => `${PEOPLE[i % PEOPLE.length]}${i >= PEOPLE.length ? i : ""}@${DOMAINS[i % DOMAINS.length]}`;
const day = (daysAgo: number) => new Date(Date.UTC(2026, 8, 23, 15) - daysAgo * 86_400_000 - Math.floor(r() * 36e6)).toISOString();
const vid = (i: number) => `seed_${i.toString(36)}`;

const subscribers: Subscriber[] = Array.from({ length: 30 }, (_, i) => ({
  id: `seed-sub-${i}`,
  email: email(i),
  source: SOURCES[i % SOURCES.length],
  createdAt: day(i * 1.3),
  visitorId: vid(i),
}));

const dropAlerts: DropAlert[] = Array.from({ length: 34 }, (_, i) => {
  const who = Math.floor(r() * PEOPLE.length);
  return { id: `seed-alert-${i}`, dropId: pick(DROP_IDS), email: email(who), createdAt: day(i * 0.8), visitorId: vid(who) };
});

const members: Member[] = [3, 7, 11, 16, 19, 24, 27].map((who, i) => {
  const cats = [...CATS].sort(() => r() - 0.5).slice(0, 3);
  return {
    id: `seed-member-${i}`,
    memberNumber: `CC-26-${(41_130 + i * 11).toString().padStart(6, "0")}`,
    email: email(who),
    birthMonth: 1 + Math.floor(r() * 12),
    storeId: pick(STORE_IDS),
    categories: cats,
    createdAt: day(i * 3.1),
    visitorId: vid(who),
  };
});

const waitlist: WaitlistEntry[] = Array.from({ length: 42 }, (_, i) => {
  const who = Math.floor(r() * PEOPLE.length);
  return { id: `seed-wait-${i}`, storeId: pick(STORE_IDS), email: email(who), createdAt: day(i * 0.6), visitorId: vid(who) };
});

export const SEED = { subscribers, dropAlerts, members, waitlist };
