import type { PackArt } from "@/components/art/Package";

export type Drop = {
  id: string;
  name: string;
  blurb: string;
  price: string;
  /** Season window as month/day (1-indexed months). May wrap past New Year. */
  window: { start: [number, number]; end: [number, number] };
  art: PackArt;
};

export type DropStatus =
  | { kind: "now"; endsAt: Date }
  | { kind: "upcoming"; startsAt: Date }
  | { kind: "gone"; returnsAt: Date };

/** A season that starts within this many days counts as "coming up", further out is "gone until next year". */
const UPCOMING_HORIZON_DAYS = 120;
const DAY = 86_400_000;

export const DROPS: Drop[] = [
  {
    id: "pumpkin-bread-mix",
    name: "Pumpkin Bread & Muffin Baking Mix",
    blurb: "Add eggs, oil and water. Your kitchen smells like October for two days.",
    price: "$3.49",
    window: { start: [8, 25], end: [11, 30] },
    art: { shape: "box", body: "#E07A1F", accent: "#6B3A12", label: "#FFF4E0", title: ["Pumpkin", "Bread Mix"], motif: "pumpkin" },
  },
  {
    id: "pumpkin-cheesecake",
    name: "Pumpkin Cheesecake",
    blurb: "Gingersnap crust, real pumpkin, sized to feed a table or one determined person.",
    price: "$8.99",
    window: { start: [10, 3], end: [11, 30] },
    art: { shape: "tub", body: "#F2E3C4", accent: "#7A3B10", label: "#FFF4E0", title: ["Pumpkin", "Cheesecake"], motif: "slice" },
  },
  {
    id: "apple-cider-donuts",
    name: "Apple Cider Donuts",
    blurb: "Cinnamon sugar all over your fingers and, somehow, your car keys.",
    price: "$4.49",
    window: { start: [9, 5], end: [10, 31] },
    art: { shape: "box", body: "#F6E7C8", accent: "#F6E7C8", label: "#9C2F1E", title: ["Apple Cider", "Donuts"], motif: "donut" },
  },
  {
    id: "pumpkin-joe-joes",
    name: "Pumpkin Joe-Joe’s",
    blurb: "Gingersnap cookies, pumpkin cream in the middle. They go fast. We’re warning you.",
    price: "$4.99",
    window: { start: [9, 1], end: [11, 15] },
    art: { shape: "bag", body: "#D96A1B", accent: "#2E1A0F", label: "#FBE7C6", title: ["Pumpkin", "Joe-Joe’s"], motif: "cookie" },
  },
  {
    id: "maple-leaf-cookies",
    name: "Maple Leaf Cookies",
    blurb: "Maple cream between two leaf-shaped shortbreads. Canada-adjacent.",
    price: "$3.99",
    window: { start: [10, 17], end: [12, 20] },
    art: { shape: "box", body: "#B5391C", accent: "#F5D9A8", label: "#F5D9A8", title: ["Maple Leaf", "Cookies"], motif: "leaf" },
  },
  {
    id: "peppermint-joe-joes",
    name: "Peppermint Joe-Joe’s",
    blurb: "Chocolate cookies, peppermint cream, candy cane bits. The holiday tin people fight over.",
    price: "$5.99",
    window: { start: [11, 1], end: [12, 31] },
    art: { shape: "tin", body: "#B8132E", accent: "#FFFFFF", label: "#1E5B3A", title: ["Peppermint", "Joe-Joe’s"], motif: "stripes" },
  },
  {
    id: "sparkling-cranberry-ginger",
    name: "Sparkling Cranberry Ginger Beverage",
    blurb: "Tart, fizzy, a little spicy. Looks fancy in a glass. Costs about what a bottle of water used to.",
    price: "$3.99",
    window: { start: [11, 7], end: [1, 5] },
    art: { shape: "bottle", body: "#8C1C2C", accent: "#8C1C2C", label: "#F6EFE0", title: ["Cranberry", "Ginger"], motif: "berries" },
  },
  {
    id: "candy-cane-coffee",
    name: "Candy Cane Coffee",
    blurb: "Medium roast with a peppermint note. Your morning, wearing a scarf.",
    price: "$9.99",
    window: { start: [11, 14], end: [12, 31] },
    art: { shape: "bag", body: "#2B4A3A", accent: "#C8102E", label: "#F3EFE6", title: ["Candy Cane", "Coffee"], motif: "stripes" },
  },
  {
    id: "mini-hold-the-cone",
    name: "Mini Hold the Cone!",
    blurb: "Tiny ice cream cones with a chocolate plug at the bottom. Summer in a box of twelve.",
    price: "$4.49",
    window: { start: [5, 10], end: [8, 31] },
    art: { shape: "box", body: "#F4C6CF", accent: "#6B3E26", label: "#FFF3F5", title: ["Mini Hold", "the Cone!"], motif: "cone" },
  },
  {
    id: "watermelon-jerky",
    name: "Soft & Juicy Watermelon Jerky",
    blurb: "Dried watermelon. Chewy, sweet, confusing at first, then you finish the bag.",
    price: "$2.99",
    window: { start: [6, 1], end: [8, 20] },
    art: { shape: "pouch", body: "#E8505B", accent: "#2F7A3A", label: "#FFF2EE", title: ["Watermelon", "Jerky"], motif: "melon" },
  },
  {
    id: "hot-cross-buns",
    name: "Hot Cross Buns",
    blurb: "Currants, orange peel, a frosted cross. Spring’s version of pumpkin season.",
    price: "$4.29",
    window: { start: [3, 1], end: [4, 20] },
    art: { shape: "box", body: "#F3E4C8", accent: "#8A5A2B", label: "#FFF7EA", title: ["Hot Cross", "Buns"], motif: "bun" },
  },
];

/**
 * Drops land at 8am Pacific. Anchored to a fixed UTC offset (not the runtime's local zone) so the
 * build server and the browser agree on the instant, otherwise pre-rendered countdowns mismatch on hydration.
 */
const PACIFIC_OFFSET_H = 7;
function atMonthDay(year: number, [m, d]: [number, number], endOfDay = false) {
  return endOfDay ? new Date(Date.UTC(year, m - 1, d + 1, PACIFIC_OFFSET_H) - 1) : new Date(Date.UTC(year, m - 1, d, 8 + PACIFIC_OFFSET_H));
}

/** Works out where a drop sits in its yearly cycle relative to `now`. */
export function dropStatus(drop: Drop, now: Date = new Date()): DropStatus {
  const y = now.getFullYear();
  for (const year of [y - 1, y, y + 1]) {
    const start = atMonthDay(year, drop.window.start);
    let end = atMonthDay(year, drop.window.end, true);
    if (end < start) end = atMonthDay(year + 1, drop.window.end, true);
    if (now >= start && now <= end) return { kind: "now", endsAt: end };
  }
  let next = atMonthDay(y, drop.window.start);
  if (next <= now) next = atMonthDay(y + 1, drop.window.start);
  const days = (next.getTime() - now.getTime()) / DAY;
  return days <= UPCOMING_HORIZON_DAYS ? { kind: "upcoming", startsAt: next } : { kind: "gone", returnsAt: next };
}

/** Dates are always shown in store time, regardless of where the page was built or is being read. */
export const STORE_TZ = "America/Los_Angeles";
export const shortDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: STORE_TZ });
export const sameStoreDay = (a: Date, b: Date) =>
  a.toLocaleDateString("en-CA", { timeZone: STORE_TZ }) === b.toLocaleDateString("en-CA", { timeZone: STORE_TZ });
