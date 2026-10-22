import { base, launch } from "./common.mjs";
const b = await launch();
const out = {}; const errs = [];
// present at 1920x1080
const big = await b.newPage({ viewport: { width: 1920, height: 1080 } });
big.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errs.push("present: " + m.text().slice(0, 120)));
await big.goto(base + "/present", { waitUntil: "networkidle" }); await big.waitForTimeout(1500);
const target = await big.evaluate(() => document.querySelector("[role=img][aria-label^='QR code to ']")?.getAttribute("aria-label")?.replace("QR code to ", ""));
out.qrTarget = target;
out.presentBefore = await big.evaluate(() => [...document.querySelectorAll(".tabular-nums")].map((e) => e.textContent).slice(0, 4));
out.presentHeadline = await big.evaluate(() => document.querySelector("h1")?.innerText.replace(/\n/g, " "));
await big.screenshot({ path: "e2e/shots/present-1920.png" });
// "scan": follow the QR target on a phone
const phone = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const p = await phone.newPage();
p.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errs.push("phone: " + m.text().slice(0, 120)));
await p.goto(target, { waitUntil: "networkidle" }); await p.waitForTimeout(1000);
await p.getByLabel("Your email").fill("classmate@usfca.edu");
await p.getByRole("button", { name: /Tell me when/ }).click(); await p.waitForTimeout(1500);
out.phoneDone = await p.getByText("You’re on the list.").count();
await p.screenshot({ path: "e2e/shots/tag-375-after.png" });
// counters move within 5s
await big.waitForTimeout(6500);
out.presentAfter = await big.evaluate(() => [...document.querySelectorAll(".tabular-nums")].map((e) => e.textContent).slice(0, 4));
await big.screenshot({ path: "e2e/shots/present-1920-after.png" });
// insights at 1440 and 375
for (const w of [1440, 375]) {
  const q = await b.newPage({ viewport: { width: w, height: w === 375 ? 812 : 900 } });
  q.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errs.push(`insights${w}: ` + m.text().slice(0, 120)));
  await q.goto(base + "/insights", { waitUntil: "networkidle" }); await q.waitForTimeout(1800);
  const h = await q.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) { await q.evaluate((y) => window.scrollTo(0, y), y); await q.waitForTimeout(80); }
  await q.waitForTimeout(800); await q.evaluate(() => window.scrollTo(0, 0));
  out[`insights${w}`] = {
    overflow: await q.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
    learned: await q.evaluate(() => document.querySelector("[aria-labelledby=learned] p, [aria-labelledby=learned] ol")?.textContent?.slice(0, 90)),
    bigs: await q.evaluate(() => [...document.querySelectorAll("[aria-label='Big numbers'] .display")].map((e) => e.textContent).slice(0, 6)),
    soWhat: await q.evaluate(() => [...document.querySelectorAll("section p.display")].map((e) => e.textContent?.slice(0, 80))),
    channels: await q.evaluate(() => [...document.querySelectorAll("[aria-labelledby=channels] .grid")].length),
  };
  await q.screenshot({ path: `e2e/shots/insights-${w}.png`, fullPage: true });
  await q.close();
}
// footer link present on a site page
const f = await b.newPage({ viewport: { width: 1440, height: 900 } });
await f.goto(base + "/drops", { waitUntil: "networkidle" });
out.footerLink = await f.getByRole("link", { name: /see what this site learns/ }).count();
out.errors = errs;
console.log(JSON.stringify(out, null, 1));
await b.close();
