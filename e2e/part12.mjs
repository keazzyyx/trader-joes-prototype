import { base, launch } from "./common.mjs";
const b = await launch();
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const events = []; const errs = []; const bad = [];
p.on("console", (m) => { if (m.text().startsWith("[track]")) events.push(m.text().split(" ")[1]); if (m.type() === "error" && !m.text().includes("404")) errs.push(m.text().slice(0, 140)); });
p.on("pageerror", (e) => errs.push(e.message));
p.on("response", (r) => { if (r.url().includes("/api/") && r.status() >= 400) bad.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
const out = {};
// 1. internal flag + badge, utm capture, page view
await p.goto(base + "/?internal=1&utm_source=test", { waitUntil: "networkidle" }); await p.waitForTimeout(1200);
out.badge = await p.getByText("Internal", { exact: true }).count();
// 2. tag page: first time = email field; measure scan-to-signup
await p.goto(base + "/tag/mini-hold-the-cone?store=masonic&utm_source=class", { waitUntil: "networkidle" }); await p.waitForTimeout(1200);
out.tagHeadline = await p.evaluate(() => document.querySelector("h1")?.textContent);
out.tagStatus = await p.evaluate(() => document.querySelector(".label.text-red")?.textContent);
out.stampBefore = await p.evaluate(() => [...document.querySelectorAll("p.display.text-red")].map((e) => e.textContent).find((t) => /Gone|list/i.test(t || "")));
await p.screenshot({ path: "shots/tag-before.png" });
await p.getByLabel("Your email").fill("kartikey@usfca.edu");
await p.getByRole("button", { name: "Tell me when it’s back" }).click(); await p.waitForTimeout(1500);
out.stampAfter = await p.evaluate(() => [...document.querySelectorAll("p.display.text-red")].map((e) => e.textContent).find((t) => /Gone|list/i.test(t || "")));
out.notification = await p.getByText("Mini Hold the Cone! is back at Masonic Ave.").count();
out.crewLink = await p.getByRole("link", { name: /join the Crew/ }).count();
await p.screenshot({ path: "shots/tag-after.png" });
// 3. second tag page: one tap
await p.goto(base + "/tag/hot-cross-buns?store=rockridge", { waitUntil: "networkidle" }); await p.waitForTimeout(1000);
out.oneTapLabel = await p.getByRole("button", { name: /Notify me at/ }).textContent();
await p.getByRole("button", { name: /Notify me at/ }).click(); await p.waitForTimeout(1200);
out.oneTapDone = await p.getByText("You’re on the list.").count();
// 4. drops: one-tap on a sold-out card, stamp flips to ON THE LIST
await p.goto(base + "/drops", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
await p.getByRole("button", { name: /Sold out/ }).click(); await p.waitForTimeout(600);
const btn = p.getByRole("button", { name: /Notify me at/ }).first();
await btn.scrollIntoViewIfNeeded(); out.dropsOneTapLabel = await btn.textContent(); await btn.click(); await p.waitForTimeout(1200);
out.dropsStamp = await p.evaluate(() => [...document.querySelectorAll("p.display.text-red")].map((e) => e.textContent?.trim()).filter((t) => /list|Gone/i.test(t || "")).slice(0, 3));
await p.screenshot({ path: "shots/drops-onelist.png" });
// 5. crew: step events
await p.goto(base + "/crew-club", { waitUntil: "networkidle" });
await p.locator("#step-1").scrollIntoViewIfNeeded();
await p.getByLabel("Email", { exact: true }).fill("kartikey@usfca.edu");
await p.getByRole("button", { name: "Next, pick your store" }).click(); await p.waitForTimeout(400);
await p.getByLabel(/Search by neighborhood/).fill("rock"); await p.getByRole("radio", { name: /Rockridge/ }).click();
await p.getByRole("button", { name: "Next, pick three favorites" }).click(); await p.waitForTimeout(400);
for (const c of ["Frozen aisle", "Cheese case", "Seasonal stuff"]) await p.getByRole("button", { name: c }).click();
await p.getByRole("button", { name: "Join the Crew" }).click(); await p.waitForTimeout(1500);
// 6. delivery: low count copy
await p.goto(base + "/delivery", { waitUntil: "networkidle" }); await p.locator("#waitlist").scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
out.lowCount = await p.evaluate(() => document.querySelector("#waitlist .text-yellow")?.textContent);
// 7. print page
await p.goto(base + "/tag/mini-hold-the-cone/print?store=masonic", { waitUntil: "networkidle" });
out.qr = await p.evaluate(() => ({ svg: !!document.querySelector("svg path"), target: document.querySelector("a[href*='/tag/']")?.getAttribute("href") }));
// 8. internal off
await p.goto(base + "/?internal=0", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
out.badgeAfterOff = await p.getByText("Internal", { exact: true }).count();
out.events = [...new Set(events)].sort(); out.errors = errs; out.apiFailures = bad;
console.log(JSON.stringify(out, null, 1));
await b.close();
