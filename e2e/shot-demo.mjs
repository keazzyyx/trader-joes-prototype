import { base, launch } from "./common.mjs";
const b = await launch();
const p = await b.newPage({ viewport: { width: 375, height: 812 } });
await p.goto(base + "/?demo=1&internal=1", { waitUntil: "networkidle" }); await p.waitForTimeout(1200);
await p.screenshot({ path: "e2e/shots/demo-home-375.png" });
await p.goto(base + "/insights", { waitUntil: "networkidle" }); await p.waitForTimeout(1500);
const h = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 300) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(250); }
await p.waitForTimeout(900); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
const heads = await p.evaluate(() => [...document.querySelectorAll("section h2")].map((h) => h.textContent?.replace(/\s+/g, " ").trim()));
await p.screenshot({ path: "e2e/shots/insights-375.png", fullPage: true });
await p.goto(base + "/?demo=0&internal=0", { waitUntil: "networkidle" });
console.log(JSON.stringify(heads));
await b.close();
