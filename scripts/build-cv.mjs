// Renders scripts/cv.html to public/cv.pdf, the résumé the site links to.
// Usage: npm run cv   (add --preview=out.png to also save a picture of the page)
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(here, "cv.html");
const out = path.join(here, "..", "public", "cv.pdf");
const preview = process.argv.find((arg) => arg.startsWith("--preview="))?.split("=")[1];

const browser = await chromium.launch({ channel: "chrome", headless: true });
// US Letter at 96 pixels to the inch, so the preview and the measurements match the printed page.
const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 2 });
await page.emulateMedia({ media: "print" });
await page.goto(pathToFileURL(source).href, { waitUntil: "networkidle" });

const report = await page.evaluate(async () => {
  await document.fonts.ready;
  const last = document.body.lastElementChild.getBoundingClientRect().bottom;
  const padding = parseFloat(getComputedStyle(document.body).paddingBottom);
  return {
    fonts: ["Imbue", "Atkinson Hyperlegible Next"].filter((family) => !document.fonts.check(`12px "${family}"`)),
    // How far the content runs past the bottom margin, in pixels. Negative means room to spare.
    over: Math.round(last + padding - document.body.getBoundingClientRect().bottom),
  };
});

if (preview) await page.screenshot({ path: preview, fullPage: true });

// Without its fonts, or on two pages, the file would still be written and look wrong. Stop instead.
if (report.fonts.length) {
  await browser.close();
  throw new Error(`Fonts did not load: ${report.fonts.join(", ")}. The CV needs a connection to Google Fonts to build.`);
}
if (report.over > 0) {
  await browser.close();
  throw new Error(`The CV runs ${report.over}px past one page. Cut some text in scripts/cv.html.`);
}

await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, tagged: true });
await browser.close();
console.log(`saved ${path.relative(process.cwd(), out)} (${-report.over}px of the page to spare)`);
