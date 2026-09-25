# Design notes: paputmenorca.com, read at 1440 and 390

Screenshots taken 2026-09-24 with Playwright: home, /delivery, /sobre-paput, /fiestas, at both widths, fold and full page. Computed styles were read off the DOM for type sizes and button geometry.

## How sections stack

- The page is one column of full-width bands. Almost everything sits on the cream base (`rgb(244,243,230)`), and colored bands interrupt it: a photo hero at the top, a yellow "join the team" band near the bottom, a dark green footer.
- Sections are tall because of padding, not because of content: 60px top/bottom on the intro, 40px around the marquee, and bands of 480 to 650px with a single headline and one or two lines in them.
- Nothing is boxed. The only "containers" on the whole site are the polaroid photo frames on /sobre-paput and the two rounded photos in the intro, and those are picture frames, not UI cards. Text never sits inside a panel.
- /fiestas is a list page: each event is a row of headline plus meta on the left and a photo on the right, separated by a 1px rule. Rows, not cards.
- /delivery is nearly all type: a hand-lettered "DELIVERY", a yellow pill, one big illustration, then four all-caps headline blocks with a line of small text under each, then another illustration. No sticky elements, no columns.

## Type

- One display face for every heading: Roc Grotesk 900, always in caps. Hero at 160px / 128px line height (about 11vw at 1440), section headlines at 60 to 75px, product names at 35px. Lines are set tight and left-aligned; the hero is centered over the photo.
- Body is the same family at 400, 20 to 22px, line height about 1.1. It's used in short bursts: one sentence under a headline, a two-line description under a burger. There is no paragraph longer than three lines anywhere.
- A hand-lettered script ("Nazare") is used only for tiny eyebrow words above a section ("NUESTRAS BURGERS", "DELIVERY", "EVENTOS"), and for the marquee.
- Nothing is italic, nothing is serif, no tracking added.
- At 390 the hero drops to about 72px, section heads to about 44px, and body stays 16 to 18px. Everything stays left-aligned except the hero.

## Product images

- Burgers are photographic cutouts on transparent backgrounds. They float straight on the cream with no frame, no shadow, no shape behind them.
- Desktop: three across, each about 400 by 300px, the middle one larger, name and one-line description centered underneath, a yellow pill under the row.
- Mobile: the same items become one-at-a-time slides, still floating.
- Images are oversized relative to the text: the burger is bigger than the headline next to it.

## The marquee

- Three rows of "A POC A POC LIFE" in the script face at 100px, each row separated by a mascot glyph. Rows alternate filled green / outlined green, and the whole block is tilted a few degrees so the text runs off both edges.
- It does not animate: `animation: none` on the rows. The movement is implied by the tilt and the repetition. It sits between the burger row and the merch section, with 40px padding around it, and is the only decorative section on the page.

## Nav and CTA

- Top bar: wordmark in the display face on the left, yellow pill "HACER PEDIDO" plus a hamburger on the right. It's a cream strip, not transparent over the photo, and it isn't sticky (scrolling away from the top loses it).
- The one CTA is a pill: 60px tall, radius 100px, 20px 25px padding, 18px 900-weight caps. Yellow fill with green text on cream sections; the same pill in green with yellow text on the yellow band; an outlined green version on the yellow "join us" band. Same shape everywhere, fill swaps to keep contrast.
- The CTA is repeated: in the nav, under the hero, under the burgers, under the merch, on /delivery three times. Everything funnels to "order".

## Color per section

- Cream is the base and most sections use it. Green (`rgb(10,70,53)`) is the text color on cream, and the fill of the footer with yellow text. Yellow (`rgb(255,198,45)`) is the pill and the "join the team" band, with green text and a giant green line-drawn pair of eyes bleeding off the bottom edge.
- Each colored band is one flat color. No gradients, no textures, no shadows anywhere (the cookie bar is the one drop shadow, and it's a plugin).
- Doodles are all the same green line weight: the map illustration, the car, the mascot in the marquee, the eyes. They're big, placed at the edge of a band, and there's at most one per section.

## What I'm carrying over, and what I'm changing

Carrying over: one display face in caps for every heading, huge sizes, tight left-aligned setting; body text short and rare; full-bleed flat bands with big vertical padding; cutouts floating with nothing behind them, oversized against the type; one pill CTA shape with the fill swapped for contrast; doodles as the only decoration, big and edge-placed; a green footer.

Changing for this brief: Trader Joe's palette (red, cream, green, yellow, ink) instead of green/yellow/cream; Anton instead of Roc Grotesk; the marquee becomes a single row that actually scrolls, in a red band with cream text; product images are flat SVG cutouts, not photos; no photo hero; the nav is transparent over the hero instead of a cream strip; the CTA scrolls to the nearest signup input instead of opening a drawer.
