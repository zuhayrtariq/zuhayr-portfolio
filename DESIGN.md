# Design: "I land the plane"

## Brief
- **Subject:** Zuhayr Tariq is a full-stack web and AI developer. In 2026 anyone can get a demo out of a prompt, so the page has to answer one question: why hire him? His answer is delivery. He finishes, on the date agreed.
- **Audience:** founders and product teams who opened a shared link from a proposal, a DM or WhatsApp, deciding in under a minute whether to write to him.
- **Primary job:** make the delivery claim impossible to miss, prove it with shipped work and a checkable record, and get a project brief into the contact form.
- **Pinned by the client:** real 3D, a wow in the first second, nothing that reads as a generated template. Earlier directions were rejected for that reason (see the end of this file).

## Concept
Everyone in software says "ship" and "launch". This page uses the older metaphor underneath them: **anyone can take off now; landing is the job.**

The first six screens are one flight, drawn live and flown by the scroll:

1. Dawn. A paper plane (the prompt, the demo) floats over a sea of cloud. It leans toward the pointer.
2. It dips into the cloud, the frame goes white, and what comes out the top is an airliner in the page's own livery.
3. Cruise in full daylight.
4. Descent through the cloud into dusk. Under it, an airport: approach lights running in, a town beyond.
5. Wheels down, touchdown, roll out.

The four steps of a project (Brief, Build, Updates, Launch) arrive on plates as their part of the flight goes by. Everything after the flight borrows one object each from an airport, and each object was chosen because it already does the job the section needs:

| Section | Object | Why that object |
| --- | --- | --- |
| Work | Arrivals board (split-flap) | A list of things that have landed, each with a status. |
| Why hire me | Before-landing checklist | The parts of a product a prompt skips are literally a checklist. |
| Record | Six cockpit instruments | Numbers you read at a glance, not claims. |
| Describe it | Flight plan | The AI drafts a plan before anything flies. |
| Experience | Route with stops | Six employers in order; this content really is a sequence. |
| Contact | Boarding pass | A form with a destination, and a stub with the other ways in. |

Only the flight is spectacle. The sections under it are flat colour and type.

## Colour
Four colours, used as whole grounds. No dark-mode-with-one-accent, no gradients as decoration.

| Name | Hex | Role |
| --- | --- | --- |
| Cobalt | `#1838DC` | The sky at altitude. Ground for the checklist and contact sections, links and focus on light grounds. |
| Cloud | `#F1F5FA` | The light ground: record, route, FAQ, the paper of the checklist and the boarding pass. |
| Night | `#071233` | The dark ground: arrivals board, flight plan, footer, plates over the flight. Text on Cloud. |
| Sun | `#FFCE1F` | Airport wayfinding yellow. Only for things that say "this way": the Sign buttons, plate headers, instrument needles, LIVE. |

A section sets `.on-cloud`, `.on-cobalt` or `.on-night`, which rebinds `--color-caption`, `--color-fog`, `--color-backdrop` and `--color-signal`, so components never ask which ground they are on. Product screenshots and brand logos keep their own colours.

The 3D scene uses the same palette: cloud shadows are cobalt-tinted at every time of day, the livery is white, cobalt and sun.

## Type
- **Anybody** (variable width axis) for headlines, set wide and heavy (`font-stretch: 135%`, 800) like a name painted along a fuselage. Sentence case, tight tracking.
- **B612** for body and interface. It was drawn for Airbus cockpit displays, which is why it is here; it also happens to be very legible small.
- **B612 Mono** only where characters sit in cells or columns: the split-flap board, instrument scales, dates on the route.

No all-caps labels, no eyebrow above every heading, no single coloured word in a headline.

## Layout
Left-aligned throughout, on a 1680px maximum with fluid side padding.

```
FLIGHT (sticky, 6.4 screens of scroll)
+--------------------------------------------------------------+
| Zuhayr Tariq                Work Record Experience [Start ↗] |
|                                                              |
| Anyone can                                                   |
| take off now.                         ___                    |
| I land the plane.                 ___/__/  <- aircraft,      |
| I'm Zuhayr Tariq, ...                         right of centre |
| [Start a project ↗]  See what has landed                     |
|                                                              |
| proof line                          [ avatar: captions     ] |
|                                     [ Ask the captain  Ask ] |
+--------------------------------------------------------------+
  after the hero: one plate bottom-left, route strip bottom-right

SECTIONS: heading left, one object, nothing else
+--------------------------------------------------------------+
| Landed, and live.                         short paragraph    |
| [ S T A R L I N G   M X | ENTERPRISE AI PLATFORM | L I V E ] |
| [ Y I P                 | PET ADOPTION PLATFORM  | L I V E ] |
| chosen product: text left, live site in a browser, right     |
+--------------------------------------------------------------+
```

On a phone the aircraft moves to the lower half of the frame, plates sit under the header, and the board keeps two columns (product, status).

## Motion
- **One orchestrated moment:** the flight. It is scroll-linked, so it never plays at anyone.
- **Three small arrivals**, each once: the board's flaps turn to their text, the instrument needles swing up, the footer's approach lights run.
- Everything else is still. No fade-and-rise on sections, no hover effects on cards.
- `prefers-reduced-motion`: the flight is not pinned, the plates are an ordinary list under a still of the first frame, flaps and needles are simply in place.

## The scene (`src/components/flight/scene.ts`)
Plain three.js, one canvas, four passes through one camera: a ray-marched sky, ground and cloud layer at about half resolution; the airport's lamps as points; the aircraft; a veil of cloud while the camera is inside the layer. Distances are kilometres. The flight plan (altitude, pitch, heading, sun, time of day) is a set of keyframe tables at the top of the file.

- It loads in its own chunk after the page is interactive, only on a real GPU (`src/lib/gpu.ts`), and stops drawing off screen or in a background tab.
- It measures its own frame time for the first moments and lowers the cloud's resolution and step count if the machine is struggling.
- Without WebGL the stage is a painted gradient and a flat paper plane; the words are identical.

## Rules for adding to this page
- A new section gets one airport object, and only if that object does the section's job. Otherwise it is plain type on a ground.
- Sun yellow means "this way". Do not use it for emphasis.
- Every number on the page has to be checkable (Upwork profile, the live products).

## Directions already tried and rejected by the client
1. **"The Interview":** a quiet editorial layout with an AI avatar. Read as basic.
2. **"Made of light":** near-black ground, one ember-orange accent, condensed serif, his name lit from behind by a WebGL lamp, bento tiles for the record. Read as AI-generic: it is the most common generated look there is.
3. Variations on 2 (3D bust, globe, spotlight cards, lanyard badge). More effects on the same template did not change the verdict.

What changed this time is the idea, not the effects: the page is about one sentence, and the 3D is that sentence.
