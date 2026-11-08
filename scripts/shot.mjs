// Usage: node scripts/shot.mjs <url> <out.png> [width] [height] [--full] [--wait=ms] [--scroll=px] [--reduced]
import { chromium } from "playwright-core";

const [url, out, width = "1440", height = "900", ...flags] = process.argv.slice(2);
const has = (f) => flags.some((x) => x === f || x.startsWith(`${f}=`));
const val = (f, d) => Number(flags.find((x) => x.startsWith(`${f}=`))?.split("=")[1] ?? d);

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  deviceScaleFactor: 1,
  reducedMotion: has("--reduced") ? "reduce" : "no-preference",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
if (has("--scroll")) await page.evaluate((y) => window.scrollTo(0, y), val("--scroll", 0));
await page.waitForTimeout(val("--wait", 2500));
await page.screenshot({ path: out, fullPage: has("--full") });
await browser.close();

if (errors.length) console.log("PAGE ERRORS:\n" + errors.join("\n"));
console.log("saved", out);
