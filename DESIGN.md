# Design: "Made of light"

## Brief
- **Subject:** Zuhayr Tariq is a full-stack web and AI developer who builds whatever a product needs, end to end, and ships it on the dates he commits to. He is Lead Developer at Starling MX and Top Rated Plus on Upwork.
- **Hero copy:** his name, split by his own portrait. Under it: "Full-stack web and AI developer." and one line of proof. The promise, "I take products from idea to launch, on time.", gets the whole frame to itself on the first scroll. "Full-stack web and AI developer" is also the phrase clients search for, so the page title, description and structured data use it too.
- **Audience:** founders and product teams who opened a shared link from a proposal, a DM or WhatsApp. They are deciding in under a minute whether he is worth a call.
- **Primary job:** stop them in the first second, make the reliability claim, let them question his AI self, back it up with shipped work and a checkable record, then make starting a project easy.
- **Pinned by the client:** dark, WebGL, big type, 3D that responds to the cursor, a version of him that talks. The first design ("The Interview", a quiet editorial page on slate teal) was rejected as basic. This one is allowed to be loud.

## Concept
The page is built from one image: Zuhayr drawn as a cloud of about 70,000 points of light with real depth (about 24,000 on phones).

- It assembles on load, turns toward the cursor, swells where the cursor touches it, and ripples from the mouth when his AI self speaks.
- On the first scroll it lets go and streams past the camera, and the promise takes the frame.
- It is his actual photograph, with depth estimated once at build time, so it is a likeness and not a stock avatar. A rigged 3D avatar can still replace it (see "The avatar").

After the hero, the page alternates between three full-bleed grounds, and each section has one large move of its own. The work runs sideways as a reel. The record is set in numerals the height of a hand. The process fills a rail as you read down it. The stack is four lines of type sliding against each other. The page ends on a wall of orange.

## Color
Three grounds, used as whole sections and never mixed inside one.

| Name | Hex | Role |
| --- | --- | --- |
| Ink | `#0B0C0C` | The dark ground: hero, record and process. `#050606` (Umbra) for the footer. |
| Paper | `#ECE8DF` | The light ground: work, experience and stack. Screenshots of dark products sit hard against it. |
| Ember | `#FF4D1F` | An international orange, the aerospace colour worn by flight-test aircraft and astronauts' launch suits so they can be seen. It is the "launch, on time" colour: the accent on Ink, and the entire ground of the contact section. |
| Bone | `#F2EFE8` | Text on Ink. |
| Fog | `#9D9B93` | Secondary text on Ink (`#5F5D56` on Paper, `#3B1408` on Ember). |
| Tungsten | `#F0C28A` | Mid-tones of the portrait only. Never used in UI. |

Sections flip ground with `.on-paper` and `.on-ember`, which rebind the same tokens (`caption`, `fog`, `backdrop`, `signal`), so components don't know which ground they are on. `ink`, `paper` and `ember` are the fixed ends for the few surfaces that must not flip.

The portrait's ramp runs umber, rust, tungsten, bone: he is lit like someone beside a fire, and Ember is the fire.

## Type
- **Imbue** (condensed high-contrast serif, variable `opsz`) for everything large. It is set far bigger than before: the name at 22vw, section titles at 13.5vw, "Let's talk." at 36vw, numerals at 9.6vw. Leading between 0.8 and 0.92, sentence case.
- **Atkinson Hyperlegible Next** for body, UI, captions and labels.
- **Scale (px):** 14 fine print, 16 UI, 18 body, 24 lead. Display sizes are fluid and set per section.
- Body text is at most 60ch. Captions follow the broadcast rule: at most 42 characters per line, two lines, centered.
- No all-caps, no monospace, no italics for emphasis. Emphasis is a colour change to Ember, used for the half of a sentence that carries the promise ("on time.", "Then the dates hold.").

## Layout
- Side margins `clamp(20px, 4vw, 64px)`, content up to 1680px, type allowed to run to the margins.
- **Hero:** the name spans the frame with the portrait standing in the gap between the two words, shoulders over the descenders. Role and proof bottom left, captions bottom centre, the ask bar bottom right.
- **Work:** above 1024px, a horizontal reel pinned for its own length. Each project title is set across the bottom edge of its screenshot with `mix-blend-difference`, so it is dark on paper and light on the image. Below 1024px, the same panels stack.
- **Record and process:** the statement, four numerals divided by hairlines, then the four steps beside a sticky heading.
- **Experience:** full-width rows; the company name is the row.
- **Stack:** four lines of names at display size, alternating solid and outlined.
- **Contact:** the heading fills the width; details and form beneath.
- **Footer:** the name once more, sunk into the bottom edge at 10% Bone.

## Motion
- **Arrival:** the name is on screen at first paint and settles upward (CSS, so the largest element never waits for JavaScript). The portrait flies in from a wide swirl over 2.6s. The hero UI follows.
- **The portrait is alive:** it sways, follows the cursor up to about 20 degrees, lifts under it, and ripples when he speaks (driven by the real loudness of the voice through an analyser node).
- **First scroll (pinned, scrubbed):** the two halves of the name part, the cloud bursts toward the camera, and the promise arrives word by word.
- **Work reel:** vertical scroll drives horizontal travel. Screenshots slide inside their frames against the direction of travel, and the reel leans a little with scroll speed.
- **Rise:** headings and numerals lift out of a mask once, when they enter.
- **Process rail:** fills with Ember as you scroll; each numeral lights when the fill reaches it.
- **Stack:** the four lines travel in alternating directions with scroll.
- **Cursor:** a ring trails the pointer, swells over anything clickable, and carries a label over the work ("Open case study"). The native cursor is never hidden.
- **Header:** steps out of the way while scrolling down, returns on the first scroll up.
- **Reduced motion:** nothing is pinned or scrubbed. The portrait is drawn once, formed and still. The promise sits below the hero as a plain block, the reel stacks, the stack lines wrap, and scrolling is native.

## Performance
- The portrait is one WebGL2 draw call written by hand; three.js is not loaded for it. The data is a single 512px texture (brightness, depth, mask), built by `scripts/build-portrait.mjs`.
- Shaders compile off the main thread where the driver allows it.
- A software rasterizer is detected from a throwaway worker before any context is created on the page, because creating one there can block for over a second. Those machines get a graded still of the same cut-out in the same place.
- The loop stops when the hero is off screen or the tab is hidden.

## The avatar
`NEXT_PUBLIC_AVATAR_URL` still swaps the point cloud on `/talk` for a rigged, lip-synced GLB (TalkingHead, prepared with `npm run avatar`). It is unset by default: a generic sample head looks worse than his own face made of light, so the avatar should only go in once it is a real scan of him.

## Writing
- First person, plain and specific: "I build voice agents on Vapi and the OpenAI Realtime API", not "passionate about cutting-edge AI".
- Numbers only when they are true and checkable: 5.0 across 13 reviews, 100% job success, about 2,500 hours, Top Rated Plus.
- Actions say what happens: "Ask", "Start a project", "Send message", "Open case study".

## What changed from the first design, and why
The first design avoided anything that could read as a portfolio trope: near-black, a bright accent, a custom cursor, scroll effects, hairlines. What was left was one teal ground and columns of text, and the client's verdict was "very basic". Restraint everywhere is its own default.

This pass keeps the rule that every move needs a reason in the subject, and drops the rule that there should be few moves.
1. **The stand-in avatar is gone.** A sample head that isn't him was the weakest thing on the page. His photograph, rebuilt in depth, is the strongest.
2. **Near-black is back, but it is one ground of three.** The page is not a dark site with an accent; it is ink, paper and orange in blocks the size of the screen.
3. **The accent has a job.** Soft yellow could not carry a section. International orange can, and it is the colour of the claim.
4. **Scroll does work.** It bursts the portrait, runs the reel, fills the rail and slides the stack. Each of those shows content; none is a fade-in.
5. **The cursor ring is kept honest.** It labels what a click will do and leaves the native cursor alone.
