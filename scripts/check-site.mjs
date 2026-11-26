// Loads every page of a running copy of the site in a real browser, at a laptop and a phone
// size, and reports anything broken. It also proves the promise the /upwork pages make:
// that nothing on them gives a way to reach Zuhayr outside Upwork, and no link leaves them.
//
// Usage: npm run build && npm start, then: npm run check [base]
//        (base defaults to http://localhost:3000)
import { chromium } from "playwright-core";
import { readFile } from "node:fs/promises";

const base = (process.argv[2] ?? process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");

const slugs = [...(await readFile("src/constants/projects.ts", "utf8")).matchAll(/^\s+slug: "([^"]+)"/gm)].map((m) => m[1]);
const focuses = [...(await readFile("src/constants/focus.ts", "utf8")).matchAll(/^\s+slug: "([^"]+)"/gm)].map((m) => m[1]);

const pages = ["/", "/work", ...slugs.map((slug) => `/work/${slug}`), "/how-i-work", "/experience", "/talk"];
const upworkPages = [...pages.map((path) => (path === "/" ? "/upwork" : `/upwork${path}`)), ...focuses.map((slug) => `/upwork/${slug}`)];
const routes = [...pages, ...upworkPages, "/no-such-page", "/upwork/no-such-page"];

/** Anything that would let a client reach him outside Upwork, as it could appear in a page's HTML. */
const CONTACT = [
  /mailto:/i,
  /\btel:/i,
  /@gmail|gmail\.com/i,
  /zuhayrtariq4/i,
  /\+92|304[\s-]?1420123/,
  /wa\.link|wa\.me|whatsapp/i,
  /linkedin/i,
  /github\.com/i,
  /@zuhayrtariq|twitter\.com\//i,
  /cv\.pdf|résumé/i,
  /name="(email|phone)"/i,
];

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-gpu", "--ignore-gpu-blocklist"] });
let problems = 0;
const fail = (where, what) => {
  problems++;
  console.log(`FAIL ${where}\n     ${[].concat(what).join("\n     ")}`);
};

/** Waits until the server answers, for when it is restarted while the check runs. */
const serverUp = async () => {
  for (let i = 0; i < 60; i++) {
    if (await fetch(base + "/robots.txt").then((r) => r.ok, () => false)) return;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Nothing is answering at ${base}.`);
};
const unreachable = (text) => /ERR_CONNECTION|ERR_EMPTY_RESPONSE|Failed to fetch|fetch failed|ECONNREFUSED/i.test(text);

/** One page at one size. Returns what is wrong with it, as a list of sentences. */
const visit = async (route, width, height) => {
  const missing = route.includes("no-such");
  const inUpwork = route.startsWith("/upwork");
  const phone = width < 700;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: phone, hasTouch: phone });
  try {
    // The analytics script may load, but these visits are not counted as visitors.
    await context.route(/\/_vercel\/(insights\/(view|event)|speed-insights\/vitals)/, (r) => r.fulfill({ status: 200, body: "" }));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(`page error: ${e.message.slice(0, 200)}`));
    page.on("console", (m) => {
      const text = m.text();
      if (m.type() === "error" && !/_vercel\//.test(text + m.location().url) && !(missing && /404/.test(text))) errors.push(`console: ${text.slice(0, 200)}`);
    });
    page.on("response", (r) => {
      if (r.status() >= 400 && !/_vercel\//.test(r.url()) && !(missing && r.url() === base + route)) errors.push(`http ${r.status()}: ${r.url().replace(base, "")}`);
    });

    const response = await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += height * 0.9) {
      await page.evaluate((to) => window.scrollTo({ top: to, behavior: "instant" }), y);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(500);

    const seen = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      h1: document.querySelectorAll("h1").length,
      links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
      text: document.body.innerText,
      forms: [...document.querySelectorAll("form")].map((f) => [...f.querySelectorAll("[name]")].map((el) => el.getAttribute("name")).join(",")),
    }));

    const expected = missing ? 404 : 200;
    if (response.status() !== expected) errors.push(`status ${response.status()}, expected ${expected}`);
    if (seen.h1 !== 1) errors.push(`${seen.h1} h1 elements`);
    if (seen.overflow > 0) errors.push(`scrolls sideways by ${seen.overflow}px`);

    if (inUpwork) {
      // Every link is to Upwork, to a live product or employer, or to another page of this copy.
      const leaving = seen.links.filter((href) => href.startsWith("/") && !href.startsWith("/upwork") && !href.startsWith("/_next/"));
      if (leaving.length) errors.push(`links that leave the Upwork copy: ${[...new Set(leaving)].join(", ")}`);
      const contact = CONTACT.filter((pattern) => pattern.test(seen.text) || seen.links.some((href) => pattern.test(href)));
      errors.push(...contact.map((pattern) => `the page shows something matching ${pattern}`));
      if (seen.forms.some((names) => /email|phone/.test(names))) errors.push("a form asks for an email or a phone number");
    }
    return [...new Set(errors)];
  } finally {
    await context.close();
  }
};

/** Runs a check again if the server went away under it, which a restart in another terminal can do. */
const steady = async (check) => {
  for (let attempt = 0; ; attempt++) {
    const errors = await check().catch((e) => [String(e.message ?? e).slice(0, 200)]);
    if (attempt === 3 || !errors.some(unreachable)) return errors;
    await serverUp();
  }
};

for (const route of routes) {
  // The page as it is served, before any script runs.
  if (route.startsWith("/upwork")) {
    const found = await steady(async () => {
      const html = await (await fetch(base + route)).text();
      return CONTACT.filter((pattern) => pattern.test(html)).map((pattern) => `the HTML matches ${pattern}`);
    });
    if (found.length) fail(`${route} (served HTML)`, found);
  }

  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
    const errors = await steady(() => visit(route, width, height));
    if (errors.length) fail(`${route} at ${width}px`, errors);
    else console.log(`ok   ${route} at ${width}px`);
  }
}

await browser.close();
console.log(problems ? `\n${problems} problems` : `\nAll ${routes.length} pages are clean at both sizes, and the Upwork copy gives no way to reach him outside Upwork.`);
process.exit(problems ? 1 : 0);
