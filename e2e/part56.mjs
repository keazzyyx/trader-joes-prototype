import { base, launch } from "./common.mjs";
const b = await launch();
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const errs = []; const bad = [];
p.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errs.push(m.text().slice(0, 140)));
p.on("pageerror", (e) => errs.push(e.message));
p.on("response", (r) => r.url().includes("/api/") && r.status() >= 400 && bad.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`));
const steps = () => p.evaluate(() => [...document.querySelectorAll("nav[aria-label='Demo steps'] li a")].map((a) => (a.querySelector("span")?.textContent === "✓" ? "✓" : "·") + a.textContent?.replace(/^[✓\d]\s*/, "").replace("Done: ", "")));
const out = {};
await p.goto(base + "/?demo=1&internal=1", { waitUntil: "networkidle" }); await p.waitForTimeout(1200);
out.bar0 = await steps();
await p.screenshot({ path: "e2e/shots/demo-home-375.png" });
// 1 sign up (hero)
await p.getByLabel("Your email").first().fill("demo@usfca.edu");
await p.getByRole("button", { name: "Tell me when" }).click(); await p.waitForTimeout(1500);
out.flyerPreview = await p.getByText("The Fearless Flyer", { exact: true }).count();
out.previewLabels = await p.getByText("Preview", { exact: true }).count();
await p.screenshot({ path: "e2e/shots/flyer-preview-375.png", fullPage: false });
out.bar1 = await steps();
// 2 drop alert (one tap on drops)
await p.goto(base + "/drops", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
const n = p.getByRole("button", { name: /Notify me/ }).first(); await n.scrollIntoViewIfNeeded(); await n.click(); await p.waitForTimeout(1200);
out.bar2 = await steps();
// 3 crew
await p.goto(base + "/crew-club", { waitUntil: "networkidle" }); await p.locator("#step-1").scrollIntoViewIfNeeded();
await p.getByLabel("Email", { exact: true }).fill("demo@usfca.edu");
await p.getByLabel(/Birthday month/).selectOption("3");
await p.getByRole("button", { name: "Next, pick your store" }).click(); await p.waitForTimeout(400);
await p.getByLabel(/Search by neighborhood/).fill("masonic"); await p.getByRole("radio", { name: /Masonic/ }).click();
await p.getByRole("button", { name: "Next, pick three favorites" }).click(); await p.waitForTimeout(400);
for (const c of ["Frozen aisle", "Cheese case", "Seasonal stuff"]) await p.getByRole("button", { name: c }).click();
await p.getByRole("button", { name: "Join the Crew" }).click(); await p.waitForTimeout(1600);
out.whatNext = await p.evaluate(() => [...document.querySelectorAll("[aria-label='What happens next'] li")].map((l) => l.textContent?.trim().slice(0, 70)));
await p.screenshot({ path: "e2e/shots/crew-next-375.png" });
out.bar3 = await steps();
// 4 waitlist
await p.goto(base + "/delivery", { waitUntil: "networkidle" }); await p.locator("#waitlist").scrollIntoViewIfNeeded();
await p.getByLabel("Your store", { exact: true }).selectOption("sf-masonic");
await p.getByRole("button", { name: /Join the Masonic Ave waitlist/ }).click(); await p.waitForTimeout(1200);
out.position = await p.evaluate(() => [...document.querySelectorAll("#waitlist .display")].map((e) => e.textContent).find((t) => /#\d/.test(t || "")));
await p.locator("#waitlist").screenshot({ path: "e2e/shots/waitlist-position-375.png" });
out.bar4 = await steps();
// 5 insights
await p.goto(base + "/insights", { waitUntil: "networkidle" }); await p.waitForTimeout(1800);
out.bar5 = await steps();
out.insightsOverflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
await p.screenshot({ path: "e2e/shots/insights-375.png", fullPage: true });
// demo off, internal off
await p.goto(base + "/?demo=0&internal=0", { waitUntil: "networkidle" }); await p.waitForTimeout(600);
out.barAfterOff = await p.locator("nav[aria-label='Demo steps']").count();
out.errors = errs; out.apiFailures = bad;
console.log(JSON.stringify(out, null, 1));
await b.close();
