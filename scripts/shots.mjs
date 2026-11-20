// Local review screenshots: node scripts/shots.mjs <name> [scrollY ...] [--mobile] [--width=px] [--reduced] [--path=/x] [--wait=ms] [--mouse=x,y]
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}`))?.split("=")[1];
const mobile = args.includes("--mobile");
const [name, ...rest] = args.filter((a) => !a.startsWith("--"));
const stops = rest.length ? rest : ["0"];
const wait = Number(flag("wait") ?? 3600);
const mouse = flag("mouse")?.split(",").map(Number);

// --nogpu puts Chrome on its software rasterizer, to review the fallback for machines without a GPU.
const browser = await chromium.launch({
  channel: "chrome",
  args: args.includes("--nogpu") ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] : ["--enable-gpu", "--use-angle=metal", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({
  viewport: mobile ? { width: 390, height: 844 } : { width: Number(flag("width") ?? 1440), height: flag("width") ? 1024 : 900 },
  deviceScaleFactor: mobile ? 2 : 1,
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: args.includes("--reduced") ? "reduce" : "no-preference",
});
page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
page.on("console", (m) => m.type() === "error" && console.log("CONSOLE:", m.text().slice(0, 300)));
await page.goto(`http://localhost:3000${flag("path") ?? "/"}`, { waitUntil: "networkidle" });
if (mouse) await page.mouse.move(mouse[0], mouse[1], { steps: 8 });
await page.waitForTimeout(wait);

for (const stop of stops) {
  const y = stop.startsWith("#")
    ? await page.evaluate((sel) => document.querySelector(sel).getBoundingClientRect().top + window.scrollY, stop.split("+")[0]) + Number(stop.split("+")[1] ?? 0)
    : Number(stop);
  // Step the scroll so scrubbed timelines pass through their triggers as they would by hand.
  const from = await page.evaluate(() => window.scrollY);
  for (let i = 1; i <= 12; i++) {
    await page.evaluate((to) => window.scrollTo(0, to), from + ((y - from) * i) / 12);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(stop === stops[0] && y === 0 ? 0 : 1500);
  const file = `.shots/${name}-${String(stop).replace(/[#+]/g, "")}${mobile ? "-m" : ""}.png`;
  await page.screenshot({ path: file });
  console.log(file);
}
await browser.close();
