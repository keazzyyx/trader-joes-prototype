export type Store = {
  id: string;
  /** Short name people actually use: "Masonic Ave", "Rockridge". */
  name: string;
  address: string;
  city: string;
  neighborhood: string;
};

/** Trader Joe’s locations around the SF Bay Area. */
export const STORES: Store[] = [
  { id: "sf-masonic", name: "Masonic Ave", address: "3 Masonic Ave", city: "San Francisco", neighborhood: "Laurel Heights" },
  { id: "sf-bay-st", name: "Bay St", address: "401 Bay St", city: "San Francisco", neighborhood: "North Beach" },
  { id: "sf-9th-st", name: "9th St", address: "555 9th St", city: "San Francisco", neighborhood: "SoMa" },
  { id: "sf-market", name: "Market St", address: "2280 Market St", city: "San Francisco", neighborhood: "Castro" },
  { id: "sf-4th-st", name: "4th St", address: "10 4th St", city: "San Francisco", neighborhood: "Union Square" },
  { id: "sf-stonestown", name: "Stonestown", address: "265 Winston Dr", city: "San Francisco", neighborhood: "Stonestown" },
  { id: "oak-rockridge", name: "Rockridge", address: "5727 College Ave", city: "Oakland", neighborhood: "Rockridge" },
  { id: "oak-lakeshore", name: "Lakeshore", address: "3250 Lakeshore Ave", city: "Oakland", neighborhood: "Grand Lake" },
  { id: "berkeley", name: "University Ave", address: "1885 University Ave", city: "Berkeley", neighborhood: "Downtown Berkeley" },
  { id: "emeryville", name: "Emeryville", address: "5700 Christie Ave", city: "Emeryville", neighborhood: "Powell St Plaza" },
  { id: "el-cerrito", name: "El Cerrito", address: "225 El Cerrito Plaza", city: "El Cerrito", neighborhood: "El Cerrito Plaza" },
  { id: "alameda", name: "Alameda", address: "2217 South Shore Center", city: "Alameda", neighborhood: "South Shore" },
  { id: "san-mateo", name: "San Mateo", address: "1820 S Grant St", city: "San Mateo", neighborhood: "Hayward Park" },
  { id: "menlo-park", name: "Menlo Park", address: "720 Menlo Ave", city: "Menlo Park", neighborhood: "Downtown" },
  { id: "palo-alto", name: "Palo Alto", address: "855 El Camino Real", city: "Palo Alto", neighborhood: "Town & Country" },
  { id: "mountain-view", name: "Mountain View", address: "590 Showers Dr", city: "Mountain View", neighborhood: "San Antonio" },
  { id: "san-jose-coleman", name: "Coleman Ave", address: "635 Coleman Ave", city: "San Jose", neighborhood: "The Alameda" },
  { id: "san-rafael", name: "San Rafael", address: "337 3rd St", city: "San Rafael", neighborhood: "Downtown" },
  { id: "walnut-creek", name: "Walnut Creek", address: "1372 N Main St", city: "Walnut Creek", neighborhood: "Downtown" },
  { id: "lafayette", name: "Lafayette", address: "3649 Mt Diablo Blvd", city: "Lafayette", neighborhood: "Downtown" },
];

export const storeById = (id: string | undefined) => STORES.find((s) => s.id === id);

export function searchStores(query: string): Store[] {
  const q = query.trim().toLowerCase();
  if (!q) return STORES;
  return STORES.filter((s) =>
    [s.name, s.address, s.city, s.neighborhood].some((f) => f.toLowerCase().includes(q)),
  );
}
