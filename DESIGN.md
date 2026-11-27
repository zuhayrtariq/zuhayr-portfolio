# Design: "A prompt gets you a demo. I ship the product."

## Brief
- **Subject:** Zuhayr Tariq is a full-stack web and AI developer. In 2026 anyone can get a demo out of a prompt, so the page has to answer one question: why hire him? His answer is delivery. He finishes, on the date agreed.
- **Audience:** founders and product teams who opened a shared link, deciding in under a minute whether to write to him. Most of them now arrive from one of his Upwork proposals, with his Upwork profile open in the next tab.
- **Primary job:** make the delivery claim impossible to miss, prove it with shipped work and a checkable record, and get a project brief into the contact form. For a client from Upwork the last step is different: send them back to Upwork to message him (see "Two audiences").
- **Pinned by the client:** the page should look like where and how he builds: a coder's environment. A wow in the first second, and nothing that reads as a generated template. Earlier directions were rejected (see the end of this file).

## Concept
The page is his workspace, and the visitor watches one product go through it.

The first section is five windows on one screen: a browser, a brief, a test file, a thread of updates and a terminal. The page arrives with a first draft of a product already on them, because that is the part a prompt can do. A visitor can describe their own product in the box under the headline and have it drafted in front of them. Scrolling then takes that same product through the four steps of a real project, on the same windows:

1. **Brief.** The written scope, as the Markdown file it would be, read from top to bottom.
2. **Build.** Version one, written as tests. Each line of the scope goes green in turn.
3. **Updates.** What he sends each week, and the one question that needs an answer from the client.
4. **Launch.** The terminal on the day: tests passing, built, deployed, monitoring on, live. The browser's address changes from localhost to the product's own, with a Live badge.

The headline sets up the two voices the whole site uses. "A prompt gets you a demo." is in the monospaced voice of a tool, with a cursor after it. "I ship the product." is in his own.

Every section after that borrows one object from a developer's tools, and each was chosen because it already does the job the section needs:

| Section | Object | Why that object |
| --- | --- | --- |
| Work | A browser with a tab for each product | A client sees the real site, at its real address, marked Live. |
| Why hire me | A review of a change | The line a prompt writes is taken out in red; the line he ships is put in, in green. |
| Record | A run of checks in a terminal | Six facts, each a line that passes. Numbers you can check, not claims. |
| The rest of the site | A list of routes | Each page with its address beside it. |
| Contact | None | A form on paper. On the Upwork copy, three steps back to Upwork. |
| Experience (own page) | A history of commits | One line down the page, a point for each role, and a second line where two roles run at once, as his two do now. |
| When something breaks (How I work) | The life of an issue | Opened, fixed, closed with a note. The colours are the ones every tracker uses. |
| His hours against yours (How I work) | Two clocks | Large figures, and the client's working day read from Islamabad. |
| Talk | A call | The next thing a client hiring someone remote will do is get on a call with him. One window holds who is speaking, what is being said as captions, and the box to ask the next thing. The questions worth starting with sit beside it. |

Only the first section moves with the scroll. The sections under it are flat colour and type.

## Pages
The home page makes the case in one scroll. Everything a client might want to check afterwards has its own page, so the home page stays short.

| Page | What it is for |
| --- | --- |
| `/` | The workspace and the build, the five live products, why hire a developer at all, the record, the way to the other pages, and the way in. |
| `/work`, `/work/[slug]` | Everything he has built: the live products in browser windows, then the archive as a list. One page for each case study. |
| `/how-i-work` | What a client hiring someone remote cannot see from a profile: how he decides a thing is done, what he does when it breaks, what AI does and what stays with him, his clock against theirs, and the questions asked before a first call. Its hero is waiting for a photograph of his desk. |
| `/experience` | The history, where he trained, and the stack. |
| `/talk` | His AI, answering out loud. |

## Two audiences
Upwork does not allow a client and a freelancer to reach each other anywhere else before a contract starts, and counts a link to a page that shows an email address as sharing one. So the site exists twice:

- **The direct copy** is everything outside `/upwork`. It has the contact form, his email, WhatsApp, GitHub, LinkedIn and the résumé.
- **The Upwork copy** is the same pages under `/upwork`. It is what goes in a proposal. It shows no email, phone number, form, social profile or résumé; every internal link stays inside it; its calls to action say "Message me on Upwork"; the contact form becomes three steps back to Upwork Messages; a drafted brief is copied to the clipboard instead of sent; and its AI is given a profile with no contact details in it. As a last check, every sentence that AI writes is read on the server before it is sent, and one that names a way to reach someone is replaced by a line saying to message him on Upwork (`src/lib/ai/contact-guard.ts`). Search engines are kept out of it.
- `/upwork/ai-agents`, `/upwork/web-apps` and `/upwork/prototype-to-production` are the Upwork home page with the work closest to that job first, and for AI jobs an AI product drafted on the screens (`src/constants/focus.ts`).

How it is built: `src/app/upwork/layout.tsx` sets the audience once. Client components read it with `useAudience()`; internal links are `SiteLink`, which keeps a visitor in the copy they are in; server components that show contact details take an `audience` prop and leave them out. `npm run check` loads every page and fails if anything under `/upwork` shows a way to reach him outside Upwork, or links out of the copy. `npm run check:ai` runs the AI route against a stand-in model that leaks contact details, and fails if any of them get through.

## Colour
Blue is the ground. Green is kept for what every tool a developer uses means by it: done, passing, live.

| Name | Hex | Role |
| --- | --- | --- |
| Brand | `#1145C4` | The main ground: the workspace, the review, contact, Talk. On Paper, the button and the link. |
| Paper | `#F3F6FB` | The light ground: the record, the history, the FAQ, anything a client reads like a document. |
| Ink | `#0B183D` | The dark ground: the work, the routes, the footer. Text on Paper. |
| Screen | `#09112A` | The inside of an editor, terminal or call window. |
| Mint | `#45EBA1` | Done, and go: the button on Brand and Ink, passing checks, Live. Nothing else. |
| Ok | `#087046` | Done, as a mark on Paper, where Mint is too light to read. |
| Fail | `#E4553C` | Broken, or taken out. Only as a state. |
| Wait | `#F5B83D` | In progress, or needs an answer. Only as a state. |

A section sets `.on-brand`, `.on-paper`, `.on-ink` or `.on-screen`, which rebinds `--color-caption`, `--color-fog`, `--color-backdrop` and `--color-signal`, so components never ask which ground they are on. Product screenshots, brand logos and a drafted product keep their own colours.

### Why blue
The client asked for blue in place of green, for trust, and asked for the choice to be researched. What the research says:

- **The same site, recoloured, is trusted most in blue.** Alberts and van der Geest (2011, *Technical Communication* 58(2)) showed 179 people finance, legal and medical sites in blue, green, red and black versions. Blue was rated most trustworthy, then green, then red, then black. Blue led green by 0.32 on a 7-point scale and black by 0.87. Asked to name the most trustworthy colour, people said blue 188 times out of 495.
- **It holds across countries.** Cyr, Head and Larios (2010, *Int. J. Human-Computer Studies* 68) tested grey, blue and yellow versions of a shop with 90 people in Canada, Germany and Japan. Blue had the highest appeal and the highest trust in all three. YouGov (2015) found blue the favourite colour in all ten countries it asked, among them the US, the UK, Germany and Australia.
- **Which blue.** Seckler, Opwis and Tuch (2015, *Computers in Human Behavior* 49, 194 people) found the best-rated sites had a blue hue, medium brightness and medium to high saturation. Labrecque and Milne (2012, *J. Academy of Marketing Science* 40, Study 2) found that a logo read as more competent in blue than in red (β = .30) while green made no difference (β = .08, not significant), more competent when saturated (β = .28) and less competent when light (β = −.36). So Brand is a fully saturated blue at medium-dark brightness, not a pale or greyed one.
- **How much it matters.** Not a lot on its own. In the first study colour explained 6.8% of the difference in trust, and all of these studies had people judge screenshots, none of them a freelancer's portfolio. One experiment found people gave more back in a trust game on a red screen than a blue one (Hawlitschek et al., 2016). Fogg et al. (2003, 2,684 people) found the look of a site as a whole was the reason given most often for believing it, in 46.1% of comments. The colour is one part of that look. The record and the live products are still what earn the trust.

One reason is ours, not the research's: this site is opened from an Upwork proposal, and Upwork's own colour is green. In green the site looked like part of Upwork. In blue it is his.

### Checked
Every pairing of text and ground meets WCAG 2.2 AA (4.5:1 for text, 3:1 for the edge of a control). White on Brand is 7.9:1, Ink on Paper 16:1, Brand on Paper 7.3:1, Ink on a Mint button 11.3:1, and the weakest pairing, the plus mark on a mint line in the review, is 4.8:1. Brand cannot reach 3:1 against any dark fill, so a box to type in on Brand takes a light edge.

About one man in twelve has trouble telling red from green. A state is therefore never shown by colour alone: each has a mark or a word (a tick, a minus, "Live", "3 of 5 passing"). In a simulation of the three kinds of colour blindness, Brand, Mint, Wait and Fail all stay apart.

## Type
One family for everything: **Recursive**, a variable font drawn for code and interfaces. It has an axis from proportional to monospaced (`MONO`) and an axis from ruled to hand-drawn (`CASL`), and the site uses them as voices (`src/styles/globals.css`, "The voices"):

- **What a tool writes** is monospaced and ruled (`.font-mono`): code, logs, file names, addresses.
- **What he says** is proportional, heavy and a little hand-drawn: headlines (`h1` to `h3`, `.font-display`), weight 900, sentence case, tight tracking.
- **Text** is proportional and ruled.
- **His notes** inside a window are slanted and cursive (`.voice-note`), the way many developers set their comments.

No all-caps labels, no eyebrow above every heading, no single coloured word in a headline.

## Layout
Left-aligned throughout, on a 1680px maximum with fluid side padding.

```
THE BUILD (sticky, 5.6 screens of scroll)
+--------------------------------------------------------------+
| Zuhayr Tariq            Work How Experience Talk [Start]     |
|                                                              |
| A prompt gets                     +----------------------+   |
| you a demo.█                      | browser: first draft |   |
| I ship                       +------------+              |   |
| the product.                 | brief.md   |--------------+   |
| I'm Zuhayr Tariq, ...        | # Chairside|                  |
| [Start a project]  See ...   | ## Version |                  |
| [ describe a product  Draft ]| - ...      |                  |
| [example] [example] [example]+------------+                  |
+--------------------------------------------------------------+
  after the opening: one step's words bottom-left, its window in
  front on the right, the browser behind; four steps along the bottom

SECTIONS: heading left, one object, nothing else
+--------------------------------------------------------------+
| Shipped, and live.                        short paragraph    |
| [ Starling MX | Yip | Runes | Hypecaster | Analytra ]        |
| [ starlingmx.com                                    ● Live ] |
| the live site, scrolling itself     | what he did on it      |
+--------------------------------------------------------------+
```

The first section is composed on a 1440 by 900 sheet. One unit of the sheet is `--u`, and the headline and every window are sized in it, so the composition keeps its proportions from a small laptop to a large monitor. The words on the left are held clear of the windows by a rule of their own (`beside-windows`). On a short laptop screen the introduction gives up its second sentence, so the prompt box always fits.

Under 1280px wide there is no room for words and windows side by side. The draft's screen sits under the prompt, and each step holds the screen in turn with its window under its words.

## Motion
- **One orchestrated moment:** the build. It is scroll-linked, so it never plays at anyone. Where each window is at each point of the scroll is one table at the top of `src/components/build/stage.tsx`.
- **Small arrivals**, each once: a draft is written line by line, the record's checks pass in turn, the page inside the work browser scrolls itself.
- Everything else is still. No fade-and-rise on sections, no hover effects on cards.
- `prefers-reduced-motion`: the first section is not pinned. The four steps are an ordinary list, each with its finished window beside it.

## The workspace (`src/components/build/`)
The depth is CSS: one container with perspective, and five windows moved and turned inside it. There is no WebGL and no 3D library, so there is nothing to download before the first screen and nothing that depends on a graphics card.

- `stage.tsx` is the section: the opening words, the prompt, the scroll, and where the windows go.
- `windows.tsx` is what is in each window. Every one is drawn from the same draft, so a visitor who describes their own product sees their own scope tested, their own weeks in the updates and their own name go live.
- A draft is plain text, one field to a line (`src/lib/draft.ts`), so it can be shown while it is still being written. The drafted screen is markup from a model; it is drawn in a frame that runs no scripts and can load nothing (`src/components/draft/screen-frame.tsx`).
- The page is served with a finished example already on the screens (`src/lib/draft-example.ts`), so it is never empty and works without JavaScript.

## Rules for adding to this site
- A new section gets one object from a developer's tools, and only if that object does the section's job. Otherwise it is plain type on a ground.
- Mint means done, or go. Do not use it for emphasis. Red and amber are states, never decoration.
- Green is never a ground. The grounds are Brand, Ink, Paper and Screen.
- Monospaced type is for what a tool writes. His own words are never set in it.
- Windows show what a client would understand: a scope, tests named after features, updates, a deploy. No walls of code.
- Every number on the page has to be checkable (Upwork profile, the live products).
- Anything that names a way to reach him goes behind `audience === "direct"`, and internal links are `SiteLink`, never `next/link`. Run `npm run check` before shipping.
- "How I work" makes promises in his name. Change them only to what he has said he does.

## Directions already tried and rejected by the client
1. **"The Interview":** a quiet editorial layout with an AI avatar. Read as basic.
2. **"Made of light":** near-black ground, one ember-orange accent, condensed serif, his name lit from behind by a WebGL lamp, bento tiles for the record. Read as AI-generic: it is the most common generated look there is.
3. Variations on 2 (3D bust, globe, spotlight cards, lanyard badge). More effects on the same template did not change the verdict.
4. **"I land the plane":** the page as a flight, drawn in WebGL, with an arrivals board, cockpit instruments and a boarding pass. He did not like the aeroplane theme and asked for a coder's environment, or how he builds, instead. The lesson: the picture has to be his own work, not a metaphor for it.
5. **Green as the ground:** this same workspace on an emerald ground, with a Talk page that was a headline and a box on the left half of the screen. He asked for blue, for trust, and whether the Talk page would stay like that. See "Why blue".
