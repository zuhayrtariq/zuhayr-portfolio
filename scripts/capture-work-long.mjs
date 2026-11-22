// Captures a tall scroll of each featured project's live site into public/work/<slug>-long.webp,
// for the browser frames in the work section. Usage: node scripts/capture-work-long.mjs [slug ...]
import { chromium } from "playwright-core";
import sharp from "sharp";

const SITES = {
  "starling-mx": "https://www.starlingmx.com",
  yip: "https://www.getyip.app",
  "zfit-ai": "https://zfit-ai.vercel.app",
  hypecaster: "https://hypecaster.ai",
  analytra: "https://analytra.io",
};
const WIDTH = 1440;
const MAX_HEIGHT = 3400;

const only = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: WIDTH, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
  reducedMotion: "reduce",
});

for (const [slug, url] of Object.entries(SITES)) {
  if (only.length && !only.includes(slug)) continue;
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  } catch {
    console.log(`${slug}: network never went idle, capturing anyway`);
  }
  await page.waitForTimeout(2500);
  // Walk the page so lazy images and scroll-triggered sections have rendered, then go back to the top.
  const full = await page.evaluate(() => document.documentElement.scrollHeight);
  const height = Math.min(full, MAX_HEIGHT);
  for (let y = 0; y < height + 900; y += 450) {
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await page.waitForTimeout(350);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  const png = await page.screenshot({ fullPage: true, clip: { x: 0, y: 0, width: WIDTH, height }, type: "png" });
  await sharp(png).resize({ width: 1280 }).webp({ quality: 74 }).toFile(`public/work/${slug}-long.webp`);
  console.log(`${slug}: ${WIDTH}x${height} of ${full}`);
  await page.close();
}

await browser.close();
