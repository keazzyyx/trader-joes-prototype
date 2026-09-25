import { Headline } from "@/components/ui/Reveal";
import { BasketDoodle, DoorDoodle, ListDoodle, RefundDoodle } from "@/components/art/StepDoodles";

const STEPS = [
  { tone: "green", label: "Step one", big: ["You make a list,", "same as always."], small: "Pick what you want on our website, or call the store and read your list to a real person. You choose a day and a time. That’s the whole first step.", Art: ListDoodle },
  { tone: "cream", label: "Step two", big: ["A Crew member", "does the shopping."], small: "Someone from your own store walks the aisles with your list. They pick bananas the way you would. If something’s out, they call or text before swapping it.", Art: BasketDoodle },
  { tone: "red", label: "Step three", big: ["Pick it up, or we", "bring it to your door."], small: "Drive up during your window and we’ll put the bags in your trunk. Or we carry them to your doorstep. You don’t need to download anything.", Art: DoorDoodle },
  { tone: "yellow", label: "Step four", big: ["Something not right?", "Your money back."], small: "Bruised peach, wrong cheese, you just didn’t like it. Tell us and we refund it in full. No photos, no forms, no arguing.", Art: RefundDoodle },
] as const;

const BG = { green: "on-red bg-green text-cream", cream: "bg-cream text-ink", red: "on-red bg-red text-cream", yellow: "bg-yellow text-ink" };

export function Steps() {
  return (
    <div aria-label="How it would work">
      {STEPS.map(({ tone, label, big, small, Art }) => (
        <section key={label} aria-labelledby={`${label}-t`} className={`${BG[tone]} relative overflow-x-clip px-5 py-24 sm:px-8 sm:py-32`}>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_34vw]">
            <div>
              <p className="label">{label}</p>
              <Headline id={`${label}-t`} lines={[...big]} className="mt-3 text-[12vw] sm:text-[7vw]" />
              <p className="mt-6 max-w-[44ch] text-[19px] leading-snug sm:text-[20px]">{small}</p>
            </div>
            <Art className="mx-auto w-[72vw] max-w-[420px] lg:w-full lg:max-w-none" />
          </div>
        </section>
      ))}
    </div>
  );
}
