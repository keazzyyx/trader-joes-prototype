/** Button looks. Letterpress-ish: solid fill, ink edge, a small hard offset that presses in on click. */
export type ButtonTone = "red" | "ink" | "chalk" | "paper" | "outline";

const base =
  "inline-flex items-center justify-center gap-2 font-body font-semibold leading-none select-none " +
  "transition-[transform,box-shadow,background-color,color] duration-150 ease-out " +
  "active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-60 disabled:pointer-events-none " +
  "min-h-12 px-5 text-[15px] rounded-[6px] border-2";

const tones: Record<ButtonTone, string> = {
  red: "bg-red text-paper border-ink shadow-[3px_3px_0_var(--color-ink)] hover:bg-red-deep active:shadow-[1px_1px_0_var(--color-ink)]",
  ink: "bg-ink text-paper border-ink shadow-[3px_3px_0_var(--color-red)] hover:bg-board active:shadow-[1px_1px_0_var(--color-red)]",
  chalk: "bg-chalk text-board border-chalk shadow-[3px_3px_0_var(--color-kraft-deep)] hover:bg-paper active:shadow-[1px_1px_0_var(--color-kraft-deep)]",
  paper: "bg-paper text-red-deep border-ink shadow-[3px_3px_0_var(--color-ink)] hover:bg-chalk active:shadow-[1px_1px_0_var(--color-ink)]",
  outline: "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper shadow-none",
};

export const buttonClass = (tone: ButtonTone = "red", extra = "") => `${base} ${tones[tone]} ${extra}`;

export const pillClass =
  "inline-flex items-center justify-center rounded-full bg-red text-paper font-semibold leading-none " +
  "px-4 min-h-10 text-[14px] whitespace-nowrap border-2 border-red hover:bg-red-deep hover:border-red-deep " +
  "transition-colors active:scale-[0.98]";
