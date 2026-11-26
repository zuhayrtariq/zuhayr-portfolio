// Tests what the site's AI is allowed to say to a client who came from Upwork, without a key.
// It runs the real /api/talk route against a stand-in for the Anthropic API. The stand-in "model"
// is made to leak an email address, a phone number and social profiles, and the test reads what
// the route lets through for each audience.
//
// Usage: start the built site pointed at the stand-in, then run this:
//   ANTHROPIC_API_KEY=stand-in ANTHROPIC_BASE_URL=http://127.0.0.1:4010/v1 npm start
//   npm run check:ai [base]        (base defaults to http://localhost:3000)
import http from "node:http";

const base = (process.argv[2] ?? process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const sse = (events) => events.map((e) => `event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join("");
const pieces = (text) => text.match(/.{1,7}/gs); // awkward chunks, so addresses and sentences are split across deltas

const LEAK = "Sure. My email is zuhayr.tariq@gmail.com, or zuhayrtariq4 at gmail dot com if that's easier. You can also WhatsApp me on +92 304 1420123. I built Yip alone, front end to back end. I deploy with GitHub Actions.";
const CLEAN = "I built Yip alone. It has more than 48,000 listings, and I shipped it in 2026. Next.js runs the front end, e.g. the search. My record is 100% job success across 18 jobs";
const SOCIAL = "You can find me on LinkedIn. My GitHub has the code. Or call 0304-1420123! The work is on this site.";

const reply = (body) => {
  const last = body.messages.at(-1);
  const hasToolResult = Array.isArray(last.content) && last.content.some((c) => c.type === "tool_result");
  const question = JSON.stringify(body.messages.findLast((m) => m.role === "user" && !(Array.isArray(m.content) && m.content.some((c) => c.type === "tool_result")))?.content ?? "");
  const start = { type: "message_start", message: { id: "msg_standin", type: "message", role: "assistant", model: body.model, content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 1 } } };
  const textBlock = (index, text) => [
    { type: "content_block_start", index, content_block: { type: "text", text: "" } },
    ...pieces(text).map((t) => ({ type: "content_block_delta", index, delta: { type: "text_delta", text: t } })),
    { type: "content_block_stop", index },
  ];
  const end = (reason) => [{ type: "message_delta", delta: { stop_reason: reason, stop_sequence: null }, usage: { output_tokens: 40 } }, { type: "message_stop" }];
  if (hasToolResult) return [start, ...textBlock(0, "Or email me at z@example.com."), ...end("end_turn")];
  if (/hire/i.test(question))
    return [start, ...textBlock(0, "I'd be glad to. Message me on Upwork and we'll set up a call."),
      { type: "content_block_start", index: 1, content_block: { type: "tool_use", id: "toolu_standin", name: "start_project", input: {} } },
      { type: "content_block_delta", index: 1, delta: { type: "input_json_delta", partial_json: "{\"topic\": \"a booking app\"}" } },
      { type: "content_block_stop", index: 1 }, ...end("tool_use")];
  const text = /email/i.test(question) ? LEAK : /linkedin/i.test(question) ? SOCIAL : CLEAN;
  return [start, ...textBlock(0, text), ...end("end_turn")];
};

let systemSeen = "";
const standin = http.createServer((req, res) => {
  let raw = "";
  req.on("data", (d) => (raw += d));
  req.on("end", () => {
    const body = JSON.parse(raw || "{}");
    systemSeen = JSON.stringify(body.system ?? "");
    res.writeHead(200, { "Content-Type": "text/event-stream" });
    res.end(sse(reply(body)));
  });
}).listen(4010);

const ask = async (audience, question) => {
  const res = await fetch(base + "/api/talk", { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}` }, body: JSON.stringify({ audience, messages: [{ id: "q", role: "user", parts: [{ type: "text", text: question }] }] }) });
  let text = "", tools = 0, spoke = false;
  for (const line of (await res.text()).split("\n")) {
    if (!line.startsWith("data:")) continue;
    try {
      const c = JSON.parse(line.slice(5));
      if (c.type === "text-start" && spoke) text += " ";
      if (c.type === "text-delta") { text += c.delta; spoke = true; }
      if (c.type === "tool-output-available") tools++;
      if (c.type === "error") text += ` [ERROR ${c.errorText}]`;
    } catch {}
  }
  return { status: res.status, text: text.replace(/\s+/g, " ").trim(), tools, system: systemSeen };
};

let bad = 0;
const expect = (name, ok, detail) => { if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${name}\n       ${detail}`); };
const KEEP = "Upwork asks us to keep contact there until a contract starts, so message me on Upwork.";
const LEAKY = /@|gmail|at gmail dot|\+92|1420123|whatsapp|linkedin|my github/i;

let r = await ask("direct", "What's your email?");
expect("direct: the model's words pass through as they are", r.text === LEAK, r.text);
expect("direct: the model is given his contact details", /zuhayrtariq4@gmail\.com/.test(r.system), `system prompt mentions the email: ${/zuhayrtariq4@gmail\.com/.test(r.system)}`);

r = await ask("upwork", "What's your email?");
expect("upwork: a reply that leaks an email, a spoken email and a phone number", !LEAKY.test(r.text) && r.text === `Sure. ${KEEP} I built Yip alone, front end to back end. I deploy with GitHub Actions.`, r.text);
expect("upwork: the model is given no contact details at all", !/gmail|\+92|1420123|wa\.link|linkedin\.com|github\.com\/zuhayr|cv\.pdf/i.test(r.system) && /never give an email address/.test(r.system), `system prompt: ${r.system.length} chars, contact details found: ${/gmail|\+92|1420123|wa\.link|linkedin\.com|github\.com\/zuhayr/i.test(r.system)}`);

r = await ask("upwork", "Are you on LinkedIn?");
expect("upwork: social profiles and a local phone number", !LEAKY.test(r.text) && r.text === `${KEEP} The work is on this site.`, r.text);

r = await ask("upwork", "Tell me about Yip.");
expect("upwork: an ordinary answer comes out word for word", r.text === CLEAN, r.text);

r = await ask("upwork", "I want to hire you.");
expect("upwork: the tool still runs, and text after it is checked too", r.tools === 1 && !LEAKY.test(r.text) && r.text === `I'd be glad to. Message me on Upwork and we'll set up a call. ${KEEP}`, `${r.text}  (tool results: ${r.tools})`);

standin.close();
console.log(bad ? `${bad} failed` : "the contact check holds");
process.exit(bad ? 1 : 0);
