import { HeroBoard } from "@/components/home/HeroBoard";
import { ShelfTags } from "@/components/home/ShelfTags";
import { ProductShelf } from "@/components/home/ProductShelf";
import { Awards } from "@/components/home/Awards";
import { RedBand } from "@/components/home/RedBand";

export default function Home() {
  return (
    <>
      <HeroBoard />
      <ShelfTags />
      <ProductShelf />
      <Awards />
      <RedBand />
    </>
  );
}
