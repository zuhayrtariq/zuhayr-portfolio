// Main-thread long tasks on load under 4x CPU throttling, roughly what Lighthouse mobile applies.
//   node scripts/longtasks.mjs [url] [--profile]
import { chromium } from "playwright-core";

const url = process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "http://localhost:3100/";
const profile = process.argv.includes("--profile");

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
if (profile) {
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.setSamplingInterval", { interval: 500 });
  await cdp.send("Profiler.start");
}
await page.addInitScript(() => {
  window.__tasks = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__tasks.push([Math.round(e.startTime), Math.round(e.duration)]);
  }).observe({ type: "longtask", buffered: true });
});
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(7000);
const tasks = await page.evaluate(() => window.__tasks);
console.log("long tasks [start, duration]:", JSON.stringify(tasks));
console.log("blocking total:", tasks.reduce((sum, [, d]) => sum + Math.max(0, d - 50), 0), "ms");

if (profile) {
  const { profile: p } = await cdp.send("Profiler.stop");
  const self = new Map();
  const dt = p.timeDeltas;
  const byId = new Map(p.nodes.map((n) => [n.id, n]));
  p.samples.forEach((id, i) => {
    const n = byId.get(id);
    const f = n.callFrame;
    const key = `${f.functionName || "(anon)"} ${f.url.split("/").pop().slice(0, 28)}:${f.lineNumber}:${f.columnNumber}`;
    self.set(key, (self.get(key) ?? 0) + (dt[i] ?? 0) / 1000);
  });
  const top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 22);
  for (const [k, ms] of top) console.log(String(Math.round(ms)).padStart(6), "ms ", k);
}
await browser.close();
