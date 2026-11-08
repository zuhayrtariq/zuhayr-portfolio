// Asks the hero a question in a real browser and screenshots the result.
// Usage: node scripts/ask.mjs "<question>" <out.png> [waitMs] [url]
import { chromium } from "playwright-core";

const [question = "What have you built with voice AI?", out = ".shots/ask.png", wait = "6000", url = "http://localhost:3000"] =
  process.argv.slice(2);

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("response", (r) => r.url().includes("/api/") && console.log("API", r.status(), r.url()));

await page.goto(url, { waitUntil: "domcontentloaded" });
// The hero greets only once the interview frame is on screen, so scroll into it after hydration.
await page.locator("[data-choreographed]").waitFor({ state: "attached", timeout: 60_000 });
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.1));
await page.getByText("Hi, I'm Zuhayr.", { exact: false }).first().waitFor({ timeout: 30_000 });
await page.getByLabel("Ask Zuhayr a question").first().fill(question);
await page.getByRole("button", { name: "Ask", exact: true }).first().click();
await page.waitForTimeout(Number(wait));
await page.screenshot({ path: out });
await browser.close();

if (errors.length) console.log("PAGE ERRORS:\n" + errors.join("\n"));
console.log("saved", out);
