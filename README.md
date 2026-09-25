# Trader Joe's: marketing site prototype

Student prototype for **BENI 370 at the University of San Francisco**. Not affiliated with Trader Joe's.

The site has one job: turn visitors into **Fearless Flyer** subscribers and **Crew Club** members, and warm them up
for **delivery** and **seasonal drops**. Every page ends in one of those conversions.

Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 · Framer Motion. No environment variables.

The visual direction is a poster, not an app: full-bleed flat color bands, one condensed display face in caps, product
cutouts floating on the color with nothing behind them. It was built from notes taken off paputmenorca.com; see
[DESIGN_NOTES.md](DESIGN_NOTES.md) for what was observed and what was carried over.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
vercel deploy      # or: vercel deploy --prod
```

## Routes

| Route | What it does | Converts to |
| --- | --- | --- |
| `/` | Data-driven cream hero: the next upcoming drop's name, "is back in", and a live countdown that flips digit by digit ("lands today" on the day; a fallback line if nothing is coming). "Tell me when" subscribes and sets a drop alert in one go. Then a red "The Crew hears first" section, a yellow marquee, the four "why it's different" statements on green, the six regulars as cutouts on cream, the 2026 Customer Choice Awards on yellow, a red signup band | Fearless Flyer, drop alert, Crew Club |
| `/drops` | Green hero, then the eleven seasonal items as cutouts in a two-column staggered layout: in stores now, live countdowns in the display face, "GONE" stamped across sold-out items. Text-link filters (All / This week / Coming up / Sold out). "Notify me" expands an inline email field | Drop alerts, Crew Club |
| `/crew-club` | Yellow hero, "No points. No tiers. No discounts." Three stacked full-bleed steps (email, home store, three favorite aisles), each unlocking the next. Finishing prints a red full-bleed section with the member number at 20vw. Remembered on return visits | Crew Club |
| `/delivery` | Cream hero, "Coming soon to your door", then four full-bleed alternating color sections with a line drawing and one sentence each, a plain-language Q&A, and a store waitlist with a live neighbor counter | Delivery waitlist |
| `/debug` | Hidden (not linked, `noindex`). Everything in the store plus every tracked event and a funnel chart, for demoing in class. Can download everything as JSON or reset to seed data | — |

The **Get the Fearless Flyer** pill in the header scrolls to the nearest Flyer input on the page and focuses it.

## Conversion events

`lib/analytics.ts` exports `track(event, props)`. Each call:

1. builds a GA4 Measurement Protocol–shaped payload (`client_id`, `timestamp_micros`, `events[{ name, params }]`, with `session_id`, `engagement_time_msec`, `page_location`, `page_title` added to params),
2. `console.log`s it as `[track] <event>`,
3. pushes `{ event, ...props }` onto `window.dataLayer` (so dropping in GTM/gtag later just works),
4. appends it to a local log that `/debug` reads.

| Event | Fired when | Key params |
| --- | --- | --- |
| `flyer_signup_submitted` | Any Flyer form is submitted (hero, red band, drops, delivery) | `source`, `method`, `subscriber_id` |
| `drop_alert_set` | "Notify me" is confirmed on a drop card, or the home hero's "Tell me when" is submitted (which also fires `flyer_signup_submitted`) | `drop_id`, `drop_name`, `drop_status`, `days_until`, `source` |
| `crew_club_completed` | The third Crew Club step is finished and the card prints | `member_id`, `store_id`, `store_name`, `categories`, `has_birth_month` |
| `delivery_waitlist_joined` | Someone joins a store's delivery waitlist | `store_id`, `store_name`, `city`, `waitlist_position` |
| `shelf_section_viewed` | The famous-regulars shelf on `/` scrolls into view (once per page view) | `section`, `items` |
| `crew_cta_clicked` | The cream "Join the Crew" pill on the home page's red section | `cta_location` |
| `cta_drawer_opened` | The header pill (or any "send me the Flyer" text link) scrolls to a signup input. The name is kept from the first version so the funnel history stays comparable | `cta_location`, `action: "scroll_to_signup"` |

To send to GA4 for real, replace the `console.log` in `track()` with a `gtag("event", name, params)` call or a POST to
`https://www.google-analytics.com/mp/collect?measurement_id=…&api_secret=…`.

## Data layer

Components never touch `localStorage` directly. They import `store` from `lib/store.ts`, which implements this
interface:

```ts
interface DataStore {
  visitorId(): string;
  knownEmail(): string | null;
  subscribers: { add; list; isSubscribed };
  dropAlerts:  { add; list; mine; countFor };
  members:     { create; list; current; forgetCurrent };
  waitlist:    { join; list; countFor; mine };
  reset(): Promise<void>;
}
```

Every method is `async` already, so a network-backed version drops in without changing any component. On first load
the local store seeds itself from `lib/seed.ts` (30 subscribers, 34 drop alerts, 7 members, 42 waitlist entries) so
the site and `/debug` never look empty. Writes dispatch a `tj:store` window event; `useStoreValue()` in `lib/hooks.ts`
re-reads on that event.

### Swapping localStorage for Supabase

1. Create tables that mirror the types in `lib/store.ts`:

   ```sql
   create table subscribers   (id uuid primary key default gen_random_uuid(), email text unique not null, source text not null, visitor_id text not null, created_at timestamptz default now());
   create table drop_alerts   (id uuid primary key default gen_random_uuid(), drop_id text not null, email text not null, visitor_id text not null, created_at timestamptz default now(), unique (drop_id, email));
   create table members       (id uuid primary key default gen_random_uuid(), member_number text unique not null, email text not null, birth_month int, store_id text not null, categories text[] not null, visitor_id text unique not null, created_at timestamptz default now());
   create table waitlist      (id uuid primary key default gen_random_uuid(), store_id text not null, email text not null, visitor_id text not null, created_at timestamptz default now(), unique (store_id, email));
   ```

   Turn on Row Level Security. Allow `insert` for the `anon` role, and limit `select` to rows where
   `visitor_id = auth.uid()::text` (use Supabase anonymous sign-ins so every browser gets a real `auth.uid()`).
   Counts like `countFor` should come from a `security definer` function or a view that exposes only aggregates.

2. `npm install @supabase/supabase-js` and add `lib/store.supabase.ts`:

   ```ts
   import { createClient } from "@supabase/supabase-js";
   import type { DataStore } from "./store";

   const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

   export const supabaseStore: DataStore = {
     visitorId: () => /* auth.uid() from sb.auth.getSession(), cached */,
     knownEmail: () => localStorage.getItem("tj.email"),
     subscribers: {
       async add({ email, source }) {
         const { data, error } = await sb.from("subscribers")
           .upsert({ email, source, visitor_id: supabaseStore.visitorId() }, { onConflict: "email" })
           .select().single();
         if (error) throw error;
         return { id: data.id, email: data.email, source: data.source, createdAt: data.created_at, visitorId: data.visitor_id };
       },
       // list, isSubscribed ...
     },
     // dropAlerts, members, waitlist, reset ...
   };
   ```

3. In `lib/store.ts`, change the last export to `export const store: DataStore = supabaseStore;`. No component changes.
   After a write, dispatch `window.dispatchEvent(new CustomEvent("tj:store"))` (or subscribe to Supabase Realtime and
   dispatch from there) so open pages refresh.

4. Add the two `NEXT_PUBLIC_SUPABASE_*` variables in Vercel. The site stays a static export; Supabase is called from
   the browser.

## Design system

- **Colors**, and nothing else: red `#C8102E`, cream `#F6EFE3`, green `#1F5F3F`, yellow `#F2C230`, ink `#151515`.
  Every section is one of these as a full-bleed background; text is ink or cream. Product cutouts are the only exception.
  The Tailwind palette is reset to these five in `app/globals.css`.
- **Type**: Anton in caps for every headline (`display` utility), Work Sans for body. Both loaded with `next/font/google`.
  Hero headlines run 14.5 to 20vw, section titles 8 to 9vw, body 16 to 20px.
- **No boxes**: no cards, borders, rounded panels, shadows, gradients or textures anywhere. Inputs are flat fills from the
  palette (`field` utility). The one CTA is a pill in the display face (`components/ui/pill.ts`): red with cream text,
  ink on red sections.
- **Cutouts**: the six regulars (`components/art/Famous.tsx`) and the eleven drop packs (`components/art/Package.tsx`)
  are inline SVG with flat fills and a thick ink outline, so they read as cut out and dropped on the color.
- **Doodles**: smiley, boat, eye, arrow, star (`components/art/Doodles.tsx`) and the four delivery drawings
  (`components/art/StepDoodles.tsx`), stroke-only in the current text color.
- **Motion**, and only this: marquees scroll (CSS); cutouts drift under 20px on scroll (`Drift`); headlines slide up
  under a mask once per section (`Reveal`); route changes are a flat color wipe from the bottom in the destination hero
  color (`components/layout/Wipe.tsx`, `lib/hero.ts`). `prefers-reduced-motion` turns all of it off.

## Project layout

```
app/                 routes (/, /drops, /crew-club, /delivery, /debug)
components/art/      cutouts (Famous, Package) and doodles
components/ui/       pill, inline Signup, Marquee, Reveal, Drift
components/layout/   header, footer, route wipe, header CTA
components/home|drops|crew|delivery/   page sections
lib/hero.ts          hero color per route (nav contrast + wipe color)
lib/store.ts         typed data layer (localStorage today)
lib/seed.ts          demo data
lib/analytics.ts     track() and the event log
lib/data/            stores, seasonal drops, categories
DESIGN_NOTES.md      what was read off paputmenorca.com before building
```
