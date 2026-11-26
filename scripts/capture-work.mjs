// Captures a screenshot of each case-study project's live site into public/work.
// Usage: node scripts/capture-work.mjs [slug ...]
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const SITES = {
  "starling-mx": "https://www.starlingmx.com",
  yip: "https://www.getyip.app",
  runes: "https://www.runepage.app",
  "zfit-ai": "https://zfit-ai.vercel.app",
  hypecaster: "https://hypecaster.ai",
  analytra: "https://analytra.io",
  "the-ticket-zone": "https://the-ticket-zone.vercel.app",
  "contract-monitoring": "https://zee-contracts-dashboard.vercel.app/",
};

const only = process.argv.slice(2);
await mkdir("public/work", { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
});

for (const [slug, url] of Object.entries(SITES)) {
  if (only.length && !only.includes(slug)) continue;
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  } catch {
    console.log(`${slug}: network never went idle, capturing anyway`);
  }
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `public/work/${slug}.jpg`, type: "jpeg", quality: 82 });
  console.log(`${slug}: saved`);
  await page.close();
}

await browser.close();
