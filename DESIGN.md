# Design: "The Interview"

## Brief
- **Subject:** Zuhayr Tariq builds AI products people can talk to: voice agents, RAG and agent systems, and the web platforms around them. He is Lead Developer at Starling AIX and Top Rated Plus on Upwork.
- **Audience:** founders and product teams who opened a shared link from a proposal, a DM or WhatsApp. They are deciding in under a minute whether he is worth a call.
- **Primary job:** prove he builds conversational AI better than the next profile by letting visitors talk to his AI self, then back it up with shipped work, then make starting a project easy.
- **Pinned by the client:** dark, editorial, WebGL, big type, a custom shader hero, smooth scroll, a 3D scene that responds to the cursor.

## Concept
The site is an interview, and the visitor is the interviewer.

The hero is an interview frame:
- His avatar sits in front of a hand-painted canvas backdrop under a single key light.
- A lower third names him.
- Subtitles show what he says.
- Visitors type or speak questions, and he answers out loud with subtitles.

The rest of the page uses magazine Q&A grammar. Each section heading is a question in the interviewer's voice, and the content is his answer. Project media is treated as footage: sharp frames that pull into focus as they arrive.

## Color
| Name | Hex | Role |
| --- | --- | --- |
| Backdrop | `#1D2A2C` | The painted slate-teal canvas. Dominant surface; the shader mottles it lighter and darker. |
| Umbra | `#11191B` | The backdrop's shadow: vignette, the end card, the footer. |
| Caption | `#F3F4EF` | Subtitle white. Primary text and the primary button. |
| Fog | `#97A6A4` | Secondary text and the interviewer's voice. 6:1 on Backdrop. |
| Signal | `#F1D86B` | Interaction only: focus rings, link underlines on hover, the mic while listening. Never decoration. |
| Tungsten | `#F0C28A` | The key light in 3D. Never used in UI. |

## Type
- **Imbue** (condensed high-contrast serif, variable `opsz` and `wght`) for headings and the questions. It's set large at optical size 100, with tight leading and sentence case. It reads like a film title card.
- **Atkinson Hyperlegible Next** for everything else: body, UI, captions and the lower third. It was designed for legibility, which is what subtitles are for.
- **Scale (px), after Bringhurst:**
  - 14 for fine print.
  - 16 for UI.
  - 18 for body.
  - 24 for captions and the lead.
  - 36 and 48 for section questions.
  - Display uses `clamp(56px, 9vw, 152px)`.
- **Measure:**
  - Body text is at most 64ch.
  - Captions follow the broadcast rule: at most 42 characters per line, two lines, centered.
  - Captions are the only centered text on the site.
- No italics or color for single-word emphasis. No all-caps. No monospace.

## Layout
- 12-column grid, `max-width: 1440px`, side margins `clamp(20px, 4vw, 64px)`. Everything is left-aligned except captions.
- Sections are separated by space (160px on desktop, 96px on mobile), not by rules.
- Media frames have square corners, like film frames. Inputs and buttons are pills. Nothing else is rounded, and there are no cards.

The hero opens on a title card: the statement alone, set enormous over the painted set. On desktop the section is two screens tall, and scrolling scrubs the title down into the interview frame below while the key light comes up on Zuhayr. On mobile the interview sits under the title card and lights up as it scrolls in. Of three directions built (interview frame, close-up, title card), the title card was chosen because it spends the boldness in one place and doesn't depend on the stand-in portrait.

```
HERO, after the title card (desktop, 100svh)
+--------------------------------------------------------------------------+
| Zuhayr Tariq                                Work  Experience  About  [Talk] |
|                                                                          |
|  I build AI                                         ( avatar, lit from   |
|  products people                                      the left, eyes     |
|  can talk to.                                         follow cursor )    |
|                                                                          |
|  ( Ask me anything.......................... [mic] [ask] )               |
|                                                                          |
|  Zuhayr Tariq                 "Hi, I'm Zuhayr. Ask me what I've          |
|  Lead Developer, Starling AIX   built, or how I'd build yours."          |
|  ^ lower third                  ^ subtitles, centered, max 42ch/line     |
+--------------------------------------------------------------------------+

HERO (mobile)
+----------------------+
| Zuhayr Tariq    Menu |
|  ( avatar, 55svh )   |
|  "subtitle line..."  |
|  I build AI products |
|  people can talk to. |
|  ( Ask me... [mic] ) |
+----------------------+

SECTION (Q&A)
+--------------------------------------------------------------------------+
|  What have you shipped?                                  <- h2, Imbue 48 |
|                                                                          |
|  +------------------------------------------------------------------+   |
|  |  footage frame 16:9, pulls into focus on arrival                 |   |
|  +------------------------------------------------------------------+   |
|  Starling AIX        Lead Developer, 2026        Visit  Case study       |
|  One plain sentence about what it is and what I did.                     |
+--------------------------------------------------------------------------+
```

The section questions are:
- What have you shipped?
- Where have you worked?
- What do you build with?
- How do you work with clients?

The page ends on an end card: "Let's talk."

## Motion
- **One orchestrated moment, "lights up":**
  1. On the first visit of a session, the title card reveals line by line behind a mask, 80ms apart.
  2. Scrolling scrubs the title into the interview frame while the key light comes up on Zuhayr. The set stays painted while dark, so it still counts for LCP.
  3. The lower third and ask bar arrive on cue once the frame is mostly lit, and the greeting subtitle plays only once the frame is on screen.
- **Living, not decorating:** the avatar breathes, blinks and follows the cursor with its eyes. The backdrop's light falloff drifts toward the cursor.
- **Footage:** project frames pull focus from blurred to sharp as they cross the viewport. This is the only scroll-linked effect.
- **Everything else answers an action:**
  - Links grow a Signal underline.
  - Buttons invert.
  - The mic shows a listening state.
  - Sections have no entrance animations.
- **Reduced motion:** the frame starts lit, footage is always sharp, scrolling is native, and the avatar keeps a minimal idle.

## The stand-in
Until the 3D avatar (an Avaturn T2 GLB) is set with `NEXT_PUBLIC_AVATAR_URL`, the stage shows a documentary still of Zuhayr:
- A low-key tone curve and a warm wash.
- Mirrored so the brightest background detail falls into the radial fade.
- A slow push-in while he speaks.

## Writing
- First person, plain and specific: "I build voice agents on Vapi and the OpenAI Realtime API", not "passionate about cutting-edge AI".
- Numbers only when they are true and checkable: Top Rated Plus, 100% job success.
- Actions say what happens: "Ask", "Start a project", "Send message", "Turn on sound".

## Critique of the first draft, and what changed
1. **Accent color.** The first draft used Tungsten as the UI accent. A warm peach accent on dark sits too close to the warm-clay default.
   - Tungsten is now light-only, inside the 3D scene.
   - Interaction moved to Signal, a soft yellow tied to the captions-and-listening idea, used only for interaction.
2. **Background.** The first draft considered near-black. Near-black with one bright accent is the commonest dark default.
   - The surface is now a colored, painted slate-teal backdrop that has a reason to exist (the interview set).
3. **Separators.** The other agent's rows used hairline rules between items, which drifts toward the broadsheet default.
   - Rules are removed. Spacing and type scale separate content.
4. **Cards.** The contact block was a rounded dark card, the SaaS-card default.
   - It is now a full-bleed end card on Umbra.
5. **Stack section.** The plan had a 3D cloud of tool logos, a template component in its own right.
   - It's now a typeset answer to "What do you build with?", grouped by what each tool does.
6. **Effects.** Cursor-following image previews and custom cursors are portfolio tropes, so neither is used. Boldness is spent once, in the hero.
7. **Section labels.** Small question labels above big headings would be eyebrow labels.
   - The question is the heading itself, in the display face, the way a magazine Q&A sets its questions.
