// Tells Bing and the other IndexNow search engines that the site's pages have changed,
// so they recrawl now and not whenever they next come by. ChatGPT search draws on Bing's index.
// Usage: npm run indexnow   (run it after a deploy; it reads the live sitemap)
const HOST = "www.zuhayrr.com";
// Proves ownership: the same key is served at https://www.zuhayrr.com/<key>.txt from /public.
const KEY = "649a89e5ed1f7be9109122fa751ca629";

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((res) => {
  if (!res.ok) throw new Error(`Could not read the sitemap (${res.status}).`);
  return res.text();
});
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urlList.length) throw new Error("The sitemap lists no pages.");

const key = await fetch(`https://${HOST}/${KEY}.txt`).then((res) => (res.ok ? res.text() : ""));
if (key.trim() !== KEY) {
  throw new Error(`https://${HOST}/${KEY}.txt is not live yet. Deploy first, then run this again.`);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
if (!res.ok) throw new Error(`IndexNow refused the submission (${res.status} ${await res.text()}).`);
console.log(`submitted ${urlList.length} pages to IndexNow (${res.status})`);
