# Design: "Made of light"

## Brief
- **Subject:** Zuhayr Tariq is a full-stack web and AI developer who builds whatever a product needs, end to end, and ships it on the dates he commits to. He is Lead Developer at Starling MX and Top Rated Plus on Upwork.
- **Hero copy:** his name, with a lamp burning behind it. Under it: "Full-stack web and AI developer." and one line of proof. The promise, "You describe it. I build it. It goes live on the date we set.", gets the whole frame to itself on the first scroll. "Full-stack web and AI developer" is also the phrase clients search for, so the page title, description and structured data use it too.
- **Audience:** founders and product teams who opened a shared link from a proposal, a DM or WhatsApp. They are deciding in under a minute whether he is worth a call.
- **Primary job:** stop them in the first second, make the reliability claim, let them question his AI self, back it up with shipped work and a checkable record, then make starting a project easy.
- **Pinned by the client:** dark, WebGL, big type, 3D that responds to the cursor, a version of him that talks. The first design ("The Interview", a quiet editorial page on slate teal) was rejected as basic. This one is allowed to be loud.

## Concept
The page opens on one image: his name standing in front of a lamp.

- The lamp burns in haze behind the letters, so each letter throws a shadow out across the frame. Nothing is drawn on the name itself; it is lit by what is behind it.
- The lamp follows the cursor, and the shadows swing with it. It burns brighter with his AI self's voice.
- On the first scroll the two words part, the lamp comes forward and floods the frame, and the promise is set in what is left of the light.
- His face is not in the hero. It appears small, as the drawn avatar: the mark in the header, the speaker above the captions, the favicon, the bust in the footer.

After the hero the page stays dark and becomes a set of lit surfaces, each one something a visitor can handle. The work is a deck of cards with the live sites inside browser windows. The record is a grid of tiles with a globe in it, under his badge on a lanyard. The process is a stage that shows what the client holds at each step. The stack is a sphere of logos. The page ends on a wall of orange silk.

## Color
Two grounds, and one family of surfaces that sits on the dark one.

| Name | Hex | Role |
| --- | --- | --- |
| Ink | `#0B0C0C` | The ground for everything except contact. `#050606` (Umbra) for the footer. |
| Surface | `#101111` | Cards and tiles on Ink, with a 10% white hairline and a 1px top highlight. `#131414` for windows drawn inside them. |
| Ember | `#FF4D1F` | An international orange, the aerospace colour worn by flight-test aircraft and astronauts' launch suits so they can be seen. It is the colour of the promise: the accent on Ink, the light that follows the pointer across a card, and the entire ground of the contact section. |
| Bone | `#F2EFE8` | Text on Ink. |
| Fog | `#9D9B93` | Secondary text on Ink (`#3B1408` on Ember). |
| Tungsten | `#F0C28A` | The hot centre of the lamp, and the tail of the beam on the rating tile. |

Colour that is not Ember always belongs to someone else: each work card is lit in its product's own brand colour, and each logo in the stack is drawn in its own.

`.on-ember` rebinds the tokens (`caption`, `fog`, `backdrop`, `signal`) for the contact section, and `.on-ink` binds them back for the dark form and contact rows that sit on it. `ink`, `paper` and `ember` are the fixed ends for the few surfaces that must not flip. Paper (`#ECE8DF`) is no longer a ground on the home page.

The lamp's ramp runs umber, rust, ember, tungsten, bone, from the edge of its reach to its core.

## Type
- **Imbue** (condensed high-contrast serif, variable `opsz`) for everything large. It is set far bigger than before: the name at 26vw, section titles at 13.5vw, "Your turn." at 33vw, numerals at 9.6vw. Leading between 0.8 and 0.92, sentence case.
- **Atkinson Hyperlegible Next** for body, UI, captions and labels.
- **Scale (px):** 14 fine print, 16 UI, 18 body, 24 lead. Display sizes are fluid and set per section.
- Body text is at most 60ch. Captions follow the broadcast rule: at most 42 characters per line, two lines, centered.
- No all-caps, no monospace, no italics for emphasis. Emphasis is a colour change to Ember, used for the half of a sentence that carries the promise ("It goes live on the date we set.", "Here's the record.").

## Layout
- Side margins `clamp(20px, 4vw, 64px)`, content up to 1680px, type allowed to run to the margins.
- **Why hire:** after "Describe it". The heading and a short admission that AI is fast; a five-row table (a prompt gives you / I ship / where I've done it) that becomes labelled stacks on a phone; then three tiles: the tools, the degree, and a way to put the question to his AI.
- **Hero:** the name spans the frame on one line, the lamp behind the space between its two words. On phones the name is two lines, set to either side, with the lamp behind the seam. Role and proof bottom left, captions bottom centre under his avatar, the ask bar bottom right.
- **Work:** four cards (Starling MX, Yip, Hypecaster, Analytra), each the height of the screen less a margin. Words on the left; on the right the live site in a browser window, turned in space and running off the card's edge. Above 1024px the cards stick and pile up, each leaving a strip of the last showing. Below it they stack, window first.
- **Record:** the statement on the left, his badge hanging on the right with the drawn avatar on its front. Under it, a six-tile grid: rating (large), job success, hours, Top Rated Plus, where he is, and a tile for asking his AI self a question.
- **Process:** four steps down the left beside a rail; a fixed stage on the right shows what the client has at that step (a scope, preview builds, a Friday update, a launch checklist). The contents are an example project. Below 1024px each step carries its own picture.
- **Experience:** the heading and résumé download stay put on the left while the roles scroll past on a rail, each a card with the company's logo. Current roles are lit.
- **Stack:** the seven groups written out as rows of labelled chips, beside a sphere of the same logos.
- **Contact:** the heading fills the width; under it, three ways to reach him as dark rows, and the form on a dark card.
- **Footer:** the name once more, sunk into the bottom edge at 10% Bone.

## Motion
- **Arrival:** the name is on screen at first paint and settles upward (CSS, so the largest element never waits for JavaScript). The lamp comes up behind it over 2.4s. The hero UI follows.
- **The lamp is alive:** it drifts, leans toward the cursor so the shadows swing, and burns brighter when he speaks (driven by the real loudness of the voice through an analyser node). Dust shows only where the light reaches it.
- **First scroll (pinned, scrubbed):** the two halves of the name part and take their shadows with them, the lamp comes forward and floods the frame, and the promise arrives word by word.
- **Work deck:** as the next card rises, the one under it shrinks a little and dims. The page inside each browser window scrolls while its card is on screen, and the window leans a few degrees toward the pointer.
- **Badge:** it drops in on its lanyard with real weight. It can be dragged and thrown, and a click turns it over ("Let's talk." and his email are on the back).
- **Record:** the numbers count up and the ring closes once, when the tiles arrive. A light follows the pointer across every card and catches its edge. The globe sways around Islamabad and can be dragged.
- **Process:** the rail fills with Ember as you scroll; the stage changes as each step reaches the middle of the screen, its rows arriving one after another.
- **Rise:** headings lift out of a mask once, when they enter.
- **Stack:** the sphere turns slowly, drifts toward the pointer and can be thrown. Pointing at a group, or one name, brings those logos forward and lights them in their own colour.
- **Contact:** the orange ground moves like silk and gives way under the pointer.
- **Cursor:** a ring trails the pointer, swells over anything clickable, and carries a label over the work ("Open case study"). The native cursor is never hidden.
- **Header:** steps out of the way while scrolling down, returns on the first scroll up.
- **Reduced motion:** nothing is pinned or scrubbed. The lamp is drawn once, lit and still. The promise sits below the hero as a plain block, the work cards stack, numbers show their final value, the sphere and globe hold still, and scrolling is native. Motion components fade instead of moving (`MotionConfig reducedMotion="user"`).

## Performance
- The lamp is one full-screen WebGL2 pass written by hand (`src/components/hero/backlight.tsx`); three.js is not loaded for it. The name is drawn once into a small texture, measured from the real heading so the shadows start exactly at the letters. Each pixel takes 44 steps back to the lamp through that texture.
- It is drawn at about half the screen's resolution, which soft light does not show.
- Shaders compile off the main thread where the driver allows it.
- A software rasterizer is detected from a throwaway worker before any context is created on the page, because creating one there can block for over a second. Those machines get a plain glow in the same place.
- The loop stops when the hero is off screen or the tab is hidden.
- Everything else that needs WebGL (badge, globe, silk) asks the same worker first, loads only when its section is about one screen away, and draws only while on screen. three.js is loaded for the badge alone, in its own chunk, and only above 1024px.
- Without a GPU the page loses the badge, the globe and the silk and nothing else: every fact on them is also in the text.
- Mobile Lighthouse on the production build was 100 performance, 100 accessibility, 100 SEO before the fourth pass. It has not been measured since.

## Libraries
Components are taken as source, the shadcn way, and then fitted to this page's tokens. They live in `src/components/ui`.

| Piece | From | Used for |
| --- | --- | --- |
| Lanyard, SpotlightCard, Silk | React Bits | The badge, the light on every card, the contact ground. Silk's highlights were changed to take the sheen colour so the orange stays orange. |
| NumberTicker, BorderBeam | Magic UI | The record numbers and the beam on the rating tile. NumberTicker was changed to render the real value on the server. |
| `motion` | Motion (Framer Motion) | Tile and card entrances, the tilt on the browser windows, the process stage. |
| `cobe` | cobe | The globe. |
| `simple-icons` | Simple Icons | Brand logos. Brands with no open mark (OpenAI, AWS, Twilio, Pinecone, Vapi, Auth.js) are written as names only. |
| GSAP, Lenis | as before | Scroll-scrubbed work: the hero, the deck, the rails. |

IconSphere, Globe (a thin wrapper), BrowserFrame and BrandIcon are written for this site.

## The avatar
`/talk` still shows his portrait as a cloud of points (`point-portrait.tsx`); only the home page hero moved to the lamp. `NEXT_PUBLIC_AVATAR_URL` swaps that cloud for a rigged, lip-synced GLB (TalkingHead, prepared with `npm run avatar`). It is unset by default, so the avatar should only go in once it is a real scan of him.

## Writing
- First person, plain and specific: "I build voice agents on Vapi and the OpenAI Realtime API", not "passionate about cutting-edge AI".
- Numbers only when they are true and checkable: 5.0 across 13 reviews, 100% job success, about 2,500 hours, Top Rated Plus.
- Headings speak to the client and make one claim each: what they get ("Shipped and live", "Whatever your product needs"), or what he will do ("You'll never have to chase me"). The contact heading, "Your turn.", answers the promise's first line.
- The promise lives in `SITE.promise` and is reused by the link preview, the manifest and the AI's profile.
- Actions say what happens: "Ask", "Start a project", "Send message", "Open case study".

## What changed from the first design, and why
The first design avoided anything that could read as a portfolio trope: near-black, a bright accent, a custom cursor, scroll effects, hairlines. What was left was one teal ground and columns of text, and the client's verdict was "very basic". Restraint everywhere is its own default.

This pass keeps the rule that every move needs a reason in the subject, and drops the rule that there should be few moves.
1. **The stand-in avatar is gone.** A sample head that isn't him was the weakest thing on the page. His photograph, rebuilt in depth, is the strongest.
2. **Near-black is back, but it is one ground of three.** The page is not a dark site with an accent; it is ink, paper and orange in blocks the size of the screen.
3. **The accent has a job.** Soft yellow could not carry a section. International orange can, and it is the colour of the claim.
4. **Scroll does work.** It bursts the portrait, runs the reel, fills the rail and slides the stack. Each of those shows content; none is a fade-in.
5. **The cursor ring is kept honest.** It labels what a click will do and leaves the native cursor alone.

## What changed in the third pass, and why
The second design was type on flat grounds: a reel of flat screenshots, four numerals, a table, four lines of names. The verdict was that it needed better components and libraries. Big type alone reads as a poster, and a developer's site should feel built.
1. **Every section now has an object in it.** A badge, browser windows, a globe, a sphere, a sheet of silk. Each responds to the hand.
2. **The work shows the products, not pictures of them.** A browser frame, the real address, a page that scrolls.
3. **The numbers became instruments.** A rating, a ring, a counter, a medal, each in its own tile.
4. **The process shows artefacts.** "Straight updates" is an update, not a sentence about one.
5. **Paper went.** Lit surfaces need a dark room, so the page is Ink until the orange.

## What changed in the fourth pass, and why
The hero was his photograph as a cloud of 70,000 points, standing between the two words of his name. The client liked everything else, including the drawn avatar in the mark and the favicon, and did not want a large picture of himself in the hero.
1. **The portrait left the hero.** The name is the subject now, and it is larger: one line, edge to edge.
2. **The light stayed.** A lamp behind the name does what the portrait did: it arrives, follows the cursor, answers the voice and lets go on scroll.
3. **His face is small and drawn.** The avatar he approved sits above the captions, so it is still clear who is speaking.

## What changed in the fifth pass, and why
The client's verdict on the copy: none of the lines were good, and the page has to win clients.
1. **The promise is addressed to the client.** "I take products from idea to launch, on time." described him. "You describe it. I build it. It goes live on the date we set." describes the deal, one sentence to a line.
2. **Every heading sells.** "Selected work", "How a project runs" and "What I build with" were labels. Each is now a claim the section under it backs up.
3. **The record is framed as proof.** "Promises are easy. Here's the record." sits directly above the numbers, with a line saying where they can be checked.
4. **The photograph is gone from the home page.** The badge, the Friday update and the ask tile all use the drawn avatar.

## What changed in the sixth pass, and why
The client's verdict: still generic. Every section so far tells a visitor what he can do. None of them does it for the visitor.
1. **"Describe it" follows the hero.** The promise ends on "You describe it", and the next thing on the page is a box to describe it in. The visitor gets a first brief (version one, what is left for later, the tools, the weeks, the questions he would ask) and the product's main screen, drawn in a browser frame while they watch.
2. **The brief is on paper.** It is the one bone-coloured sheet on a dark page, so it reads as a document being handed over, not another dark card.
3. **It is never empty.** A finished example plays when the section scrolls in, and two more are a click away. A typed idea goes to the model; if that fails, the last whole draft stays and the idea can go straight to the contact form.
4. **It ends in the form.** "Send me this brief" writes the draft into the contact message, so the first email already has a scope in it.
5. **The drawn screen is untrusted.** It is model output, so it renders in a sandboxed frame with no scripts and a policy that loads nothing.

## What changed in the seventh pass, and why
The client wants to be found: by search engines, and by ChatGPT and Claude when someone asks them for a developer.
1. **"Straight answers" sits above the contact card.** Six questions clients ask before writing, answered in plain text that is on the page without JavaScript. AI crawlers do not run scripts, and they quote text that is already shaped as question and answer.
2. **One source for the answers.** The section, its FAQPage markup and llms.txt all read from `src/constants/faq.ts`, so they cannot drift apart.

## What changed in the eighth pass, and why
The client's point: anyone can get code out of an AI now, so the page has to say why to hire him anyway.
1. **"A prompt gets you a demo. I ship the product." follows "Describe it".** The visitor has just watched AI draft a brief in seconds, which is the moment they wonder what a developer is for. The section answers it there.
2. **The answer is a ledger, not a paragraph.** Five parts of a product (payments, accounts, the AI, real traffic, the date), each as a prompt returns it and as it ships, and each ending on a link to where he has done it. A claim without a link was cut.
3. **AI is named as a tool he uses, not a rival.** Claude, Gemini, GPT and Cursor are listed as his daily tools, in this section and at the top of the stack, apart from the model APIs he builds into products.
4. **Yip is the second work card.** It is the one product he built entirely alone, so it carries the "one person can ship all of it" claim. ZFit-AI keeps its case study and moves to the archive.
5. **The question is everywhere a visitor can ask.** "Why hire you when AI can write code?" is the first suggested question in the hero and the record tile, and the answer is in the FAQ, the structured data, llms.txt and the AI's own profile, all from `src/constants/faq.ts`.

