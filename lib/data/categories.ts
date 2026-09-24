export const CATEGORIES = [
  { id: "frozen", label: "Frozen aisle" },
  { id: "snacks", label: "Snacks" },
  { id: "cheese", label: "Cheese case" },
  { id: "produce", label: "Produce" },
  { id: "bakery", label: "Bread & bakery" },
  { id: "sweets", label: "Sweets" },
  { id: "dips", label: "Dips & spreads" },
  { id: "pantry", label: "Pantry" },
  { id: "coffee", label: "Coffee & tea" },
  { id: "wine", label: "Wine & beer" },
  { id: "flowers", label: "Flowers" },
  { id: "seasonal", label: "Seasonal stuff" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
