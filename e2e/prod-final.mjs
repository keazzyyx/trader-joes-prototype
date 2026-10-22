import { launch } from "./common.mjs";
const B = "https://trader-joes-prototype.vercel.app";
const b = await launch();
const out = {}; const errs = [];
const big = await b.newPage({ viewport: { width: 1920, height: 1080 } });
big.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errs.push("present: " + m.text().slice(0, 100)));
await big.goto(B + "/present?internal=1", { waitUntil: "networkidle" }); await big.waitForTimeout(2500);
out.qrTarget = await big.evaluate(() => document.querySelector("[role=img][aria-label^='QR code to ']")?.getAttribute("aria-label")?.replace("QR code to ", ""));
out.presentCounters = await big.evaluate(() => [...document.querySelectorAll(".tabular-nums")].map((e) => e.textContent).slice(0, 4));
out.presentStatus = await big.evaluate(() => document.querySelector(".label.mt-6")?.textContent);
await big.screenshot({ path: "e2e/shots/prod-present-1920.png" });
for (const [w, tag] of [[1440, "1440"], [375, "375"]]) {
  const q = await b.newPage({ viewport: { width: w, height: w === 375 ? 812 : 900 } });
  q.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errs.push(`insights${w}: ` + m.text().slice(0, 100)));
  await q.goto(B + "/insights?internal=1", { waitUntil: "networkidle" }); await q.waitForTimeout(2500);
  out["insights" + tag] = { learned: await q.evaluate(() => document.querySelector("[aria-labelledby=learned] p, [aria-labelledby=learned] ol")?.textContent?.slice(0, 70)), overflow: await q.evaluate(() => document.documentElement.scrollWidth > window.innerWidth) };
  await q.screenshot({ path: `e2e/shots/prod-insights-${tag}.png`, fullPage: true });
  await q.close();
}
const p = await b.newPage({ viewport: { width: 375, height: 812 }, isMobile: true });
p.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errs.push("tag: " + m.text().slice(0, 100)));
await p.goto(B + "/tag/mini-hold-the-cone?store=masonic&internal=1", { waitUntil: "networkidle" }); await p.waitForTimeout(1500);
out.tag = { h1: await p.evaluate(() => document.querySelector("h1")?.textContent), status: await p.evaluate(() => document.querySelector(".label.text-red")?.textContent), button: await p.getByRole("button").last().textContent() };
await p.goto(B + "/tag/mini-hold-the-cone/print?store=masonic", { waitUntil: "networkidle" });
out.print = { qr: await p.evaluate(() => !!document.querySelector("svg path")), target: await p.evaluate(() => document.querySelector("a[href*='/tag/']")?.getAttribute("href")) };
await p.goto(B + "/?internal=0", { waitUntil: "networkidle" });
out.errors = errs;
console.log(JSON.stringify(out, null, 1));
await b.close();
