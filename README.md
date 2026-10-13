# Trader Joe's: marketing site prototype

Student prototype for **BENI 370 at the University of San Francisco**. Not affiliated with Trader Joe's.

The site has one job: turn visitors into **Fearless Flyer** subscribers and **Crew Club** members, and warm them up
for **delivery** and **seasonal drops**. Every page ends in one of those conversions.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Neon Postgres behind `/api` route handlers.
One environment variable: `DATABASE_URL`.

The visual direction is a poster, not an app: full-bleed flat color bands, one condensed display face in caps, product
cutouts floating on the color with nothing behind them. It was built from notes taken off paputmenorca.com; see
[DESIGN_NOTES.md](DESIGN_NOTES.md) for what was observed and what was carried over.

## Run it

```bash
npm install
vercel integration add neon   # once: creates the Neon project and sets DATABASE_URL on Vercel
vercel env pull .env.local    # copies DATABASE_URL here for local dev
npm run db:migrate            # creates the tables (db/schema.sql)
npm run db:seed               # loads the demo rows
npm run dev                   # http://localhost:3000
vercel deploy --prod
```

No database yet? `NEXT_PUBLIC_DATA_BACKEND=local npm run dev` runs everything against localStorage instead.

## Routes

| Route | What it does | Converts to |
| --- | --- | --- |
| `/` | Data-driven cream hero: the next upcoming drop's name, "is back in", and a live countdown that flips digit by digit ("lands today" on the day; a fallback line if nothing is coming). "Tell me when" subscribes and sets a drop alert in one go. Then a red "The Crew hears first" section, a yellow marquee, the four "why it's different" statements on green, the six regulars as cutouts on cream, the 2026 Customer Choice Awards on yellow, a red signup band | Fearless Flyer, drop alert, Crew Club |
| `/drops` | Green hero, then the eleven seasonal items as cutouts in a two-column staggered layout: in stores now, live countdowns in the display face, "GONE" stamped across sold-out items. Text-link filters (All / This week / Coming up / Sold out). "Notify me" expands an inline email field | Drop alerts, Crew Club |
| `/crew-club` | Yellow hero, "No points. No tiers. No discounts." Three stacked full-bleed steps (email, home store, three favorite aisles), each unlocking the next. Finishing prints a red full-bleed section with the member number at 20vw. Remembered on return visits | Crew Club |
| `/delivery` | Cream hero, "Coming soon to your door", then four full-bleed alternating color sections with a line drawing and one sentence each, a plain-language Q&A, and a store waitlist with a live neighbor counter | Delivery waitlist |
| `/debug` | Hidden (not linked, `noindex`). Every row from every visitor, every tracked event and a funnel chart, read live from Neon. Can download everything as JSON or reset to seed data | — |

The **Get the Fearless Flyer** pill in the header scrolls to the nearest Flyer input on the page and focuses it.

## Conversion events

`lib/analytics.ts` exports `track(event, props)`. Each call:

1. builds a GA4 Measurement Protocol–shaped payload (`client_id`, `timestamp_micros`, `events[{ name, params }]`, with `session_id`, `engagement_time_msec`, `page_location`, `page_title` added to params),
2. `console.log`s it as `[track] <event>`,
3. pushes `{ event, ...props }` onto `window.dataLayer` (so dropping in GTM/gtag later just works),
4. hands it to `store.events.add()`, which POSTs it to `/api/events` (fire-and-forget) so `/debug` can show the funnel across every visitor.

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

Components never touch storage directly. They import `store` from `lib/store.ts`, which implements this interface:

```ts
interface DataStore {
  visitorId(): string;
  knownEmail(): string | null;
  subscribers: { add; list; isSubscribed };
  dropAlerts:  { add; list; mine; countFor };
  members:     { create; list; current; forgetCurrent };
  waitlist:    { join; list; countFor; mine };
  events:      { add; list; clear };
  reset(): Promise<void>;
}
```

Two implementations satisfy it:

- **`httpStore`** (`lib/store.http.ts`, the default): calls the route handlers in `app/api/*`, which query Neon with
  `@neondatabase/serverless`. The connection string only ever exists on the server.
- **`localStore`** (`lib/store.ts`): localStorage, seeded from `lib/seed.ts`. Picked with `NEXT_PUBLIC_DATA_BACKEND=local`.

Identity is an anonymous visitor id kept in the browser and sent as an `x-visitor-id` header; "my alerts", "my membership"
and "my events" are scoped to it. Emails are unique per table so repeat signups are no-ops. Writes dispatch a `tj:store`
window event and `useStoreValue()` in `lib/hooks.ts` re-reads on it.

### Schema

`db/schema.sql`: `subscribers`, `drop_alerts` (unique on drop + email), `members` (unique on visitor), `waitlist`
(unique on store + email), and `events` (every `track()` call, as GA4-shaped params in `jsonb`). `npm run db:migrate`
applies it; it's idempotent. `npm run db:seed` loads the demo rows and skips anything already there.

### Endpoints

| Route | Methods | Notes |
| --- | --- | --- |
| `/api/subscribers` | GET, GET `?mine`, POST | POST upserts on email |
| `/api/drop-alerts` | GET, GET `?mine`, GET `?count=<dropId>`, POST | drop id must exist in `lib/data/drops.ts` |
| `/api/members` | GET, GET `?mine`, POST, DELETE `?mine` | POST validates store and three categories, mints the member number |
| `/api/waitlist` | GET, GET `?mine`, GET `?count=<storeId>`, POST | |
| `/api/events` | GET, GET `?mine`, POST, DELETE `?mine` | what `/debug` reads |
| `/api/reset` | POST | truncates everything and reseeds. Set `RESET_TOKEN` to require `?token=` |

Every list is capped (500–1000 rows) and every write validates its input server-side; errors come back as `{ error }`.

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
lib/store.ts         DataStore interface + localStorage implementation
lib/store.http.ts    DataStore over the /api routes (default)
lib/db.ts            Neon client, server only
lib/api.ts           route-handler helpers (visitor header, validation, errors)
app/api/             route handlers, one per table
db/schema.sql        Postgres schema
scripts/db.ts        npm run db:migrate / db:seed
lib/seed.ts          demo data
lib/analytics.ts     track() and the event log
lib/data/            stores, seasonal drops, categories
DESIGN_NOTES.md      what was read off paputmenorca.com before building
```
