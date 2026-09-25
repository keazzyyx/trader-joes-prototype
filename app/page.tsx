import { Hero } from "@/components/home/Hero";
import { CrewFirst } from "@/components/home/CrewFirst";
import { Different } from "@/components/home/Different";
import { Products } from "@/components/home/Products";
import { Awards } from "@/components/home/Awards";
import { Closer } from "@/components/home/Closer";
import { Marquee } from "@/components/ui/Marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <CrewFirst />
      <Marquee tone="yellow" items={["No coupons", "No sales", "No membership cards", "No coupons", "No sales", "No membership cards"]} />
      <Different />
      <Products />
      <Marquee tone="ink" items={["The Fearless Flyer", "New stuff every month", "The Fearless Flyer", "New stuff every month"]} speed={34} />
      <Awards />
      <Closer />
    </>
  );
}
