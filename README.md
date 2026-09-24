# Trader Joe's: marketing site prototype

Student prototype for **BENI 370 at the University of San Francisco**. Not affiliated with Trader Joe's.

The site has one job: turn visitors into **Fearless Flyer** subscribers and **Crew Club** members, and warm them up
for **delivery** and **seasonal drops**. Every page ends in one of those conversions.

Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 · Framer Motion. No environment variables.

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
| `/` | Chalkboard hero that draws itself on, pinned Flyer signup card, four shelf tags, the famous-regulars shelf, Customer Choice Awards, red signup band | Fearless Flyer |
| `/drops` | Seasonal drops in an editorial grid: in stores now, live countdowns to upcoming drops, stamped "Gone until next year" items. Filter chips (All / This week / Coming up / Sold out) with layout animation | Drop alerts, Crew Club |
| `/crew-club` | The anti-loyalty program. Three-step signup (email, home store, three favorite aisles) that ends with a kraft membership card that flips to show the member number and a wax seal. Remembered on return visits | Crew Club |
| `/delivery` | Honest "coming soon" page for older, hesitant shoppers. Four-step scroll walkthrough with a sticky illustration, plain-language Q&A, and a store-by-store waitlist with a live neighbor counter | Delivery waitlist |
| `/debug` | Hidden (not linked, `noindex`). Everything in the store plus every tracked event and a funnel chart, for demoing in class. Can download everything as JSON or reset to seed data | — |

The **Get the Fearless Flyer** pill in the header opens a slide-in signup drawer from any page.

## Conversion events

`lib/analytics.ts` exports `track(event, props)`. Each call:

1. builds a GA4 Measurement Protocol–shaped payload (`client_id`, `timestamp_micros`, `events[{ name, params }]`, with `session_id`, `engagement_time_msec`, `page_location`, `page_title` added to params),
2. `console.log`s it as `[track] <event>`,
3. pushes `{ event, ...props }` onto `window.dataLayer` (so dropping in GTM/gtag later just works),
4. appends it to a local log that `/debug` reads.

| Event | Fired when | Key params |
| --- | --- | --- |
| `flyer_signup_submitted` | Any Flyer form is submitted (hero card, drawer, red band) | `source`, `method`, `subscriber_id` |
| `drop_alert_set` | "Notify me" is confirmed on a drop card | `drop_id`, `drop_name`, `drop_status`, `days_until` |
| `crew_club_completed` | The third Crew Club step is finished and the card prints | `member_id`, `store_id`, `store_name`, `categories`, `has_birth_month` |
| `delivery_waitlist_joined` | Someone joins a store's delivery waitlist | `store_id`, `store_name`, `city`, `waitlist_position` |
| `shelf_section_viewed` | The famous-regulars shelf on `/` scrolls into view (once per page view) | `section`, `items` |
| `cta_drawer_opened` | The Fearless Flyer drawer opens | `cta_location` (header, shelf, awards, footer, …) |

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

- **Colors** (the Tailwind palette is reset to only these): paper `#FFFDF8`, ink `#1F1A17`, TJ red `#C8102E`, deep red
  `#A20C25`, chalkboard `#24352C`, chalk `#F3EFE6`, kraft `#D9B98A`, kraft deep `#B8925E`. Product packaging
  illustrations are the only exception.
- **Type**: Fraunces (variable, `SOFT` and `WONK` axes via the `font-wonk` / `font-soft` utilities) for display, Work
  Sans for body. Both loaded with `next/font/google`.
- **Textures** are inline SVG noise (`tex-paper`, `tex-kraft`, `tex-board`, `wood-frame` utilities in `app/globals.css`).
- **Motion**: one orchestrated moment per section. `MotionConfig reducedMotion="user"` plus CSS fallbacks turn every
  transform animation into a plain fade when `prefers-reduced-motion` is set. Route changes get a 340ms chalkboard
  eraser wipe (`components/layout/RouteWipe.tsx`).

## Project layout

```
app/                 routes (/, /drops, /crew-club, /delivery, /debug)
components/art/      SVG illustration: packaging, stamp, wax seal, thumbtack, Flyer masthead
components/layout/   header, footer, Flyer drawer, route wipe
components/home|drops|crew|delivery/   page sections
lib/store.ts         typed data layer (localStorage today)
lib/seed.ts          demo data
lib/analytics.ts     track() and the event log
lib/data/            stores, seasonal drops, categories
```
