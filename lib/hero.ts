/** Each route's hero color. The nav reads it for contrast; the route wipe uses it as the wipe color. */
export type Tone = "cream" | "red" | "green" | "yellow" | "ink";

export const HERO: Record<string, Tone> = {
  "/": "cream",
  "/drops": "green",
  "/crew-club": "yellow",
  "/delivery": "cream",
  "/debug": "cream",
};

export const heroTone = (path: string): Tone => HERO[path] ?? "cream";

/** Text color that reads on a given tone. Only ink or cream, ever. */
export const fgFor = (tone: Tone) => (tone === "green" || tone === "red" || tone === "ink" ? "cream" : "ink");

export const BG: Record<Tone, string> = {
  cream: "bg-cream",
  red: "bg-red",
  green: "bg-green",
  yellow: "bg-yellow",
  ink: "bg-ink",
};
export const HEX: Record<Tone, string> = {
  cream: "#f6efe3",
  red: "#c8102e",
  green: "#1f5f3f",
  yellow: "#f2c230",
  ink: "#151515",
};
export const FG: Record<Tone, string> = {
  cream: "text-ink",
  yellow: "text-ink",
  red: "text-cream",
  green: "text-cream",
  ink: "text-cream",
};
