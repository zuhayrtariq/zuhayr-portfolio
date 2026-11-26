"use client";

import { SiteLink, useAudience } from "@/components/site/audience";
import HireSign from "@/components/site/hire-sign";
import { DRAFT_EXAMPLES } from "@/constants/drafts";
import { getProject } from "@/constants/projects";
import { useDraft } from "@/hooks/use-draft";
import { handToContact } from "@/lib/contact-topic";
import { briefMessage, screenIsDrawable, type Draft } from "@/lib/draft";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  BriefWindow,
  BrowserWindow,
  launchAt,
  launchLines,
  passedAt,
  TerminalWindow,
  TestsWindow,
  updatesAt,
  UpdatesWindow,
} from "./windows";

/**
 * The four steps of a project. `from` and `to` are where along the scroll each step's words
 * are on screen, as fractions of the whole section.
 */
const LEGS = [
  {
    label: "Brief",
    title: "You describe it.",
    body: "Tell me what it is and who it's for. We start with a call, then you get a written scope before any code: what's in, what's out, and when each piece is due.",
    from: 0.13,
    to: 0.3,
  },
  {
    label: "Build",
    title: "I build it.",
    body: "AI does a lot of the typing, so it's fast. You get something to click early, and new pieces as they're finished. Nothing ships that I haven't read, run and tested.",
    from: 0.34,
    to: 0.54,
  },
  {
    label: "Updates",
    title: "You always know where we are.",
    body: "Updates reach you before you ask for them. You can always see where things stand, including anything that needs a decision from you.",
    from: 0.58,
    to: 0.76,
  },
  {
    label: "Launch",
    title: "It goes live on the date we set.",
    body: "I ship to production and hand over the code and the docs. For 30 days after launch, bugs in what I built are fixed free.",
    from: 0.8,
    to: 1.1,
  },
];

/** The part of each step in which what is on its screen plays, from its first line to its last. */
const PLAY: [number, number][] = [
  [0.17, 0.27],
  [0.39, 0.5],
  [0.63, 0.73],
  [0.86, 0.96],
];
/** How many moments each step's screen is divided into. */
const TICKS = 24;
/** How much of the scroll a step's words take to arrive or leave. */
const FADE = 0.022;
/** The opening words have gone by this point, and the first step follows them. */
const HERO_GONE = 0.105;
/** Screens of scrolling the whole section takes. */
const LENGTH = 5.6;

const MIN_IDEA = 12;
const MAX_IDEA = 600;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

type WindowId = "browser" | "brief" | "tests" | "updates" | "terminal";
const WINDOWS: WindowId[] = ["browser", "brief", "tests", "updates", "terminal"];

/** Where a window is: its centre on a 1440 by 900 sheet measured from the middle, how far it is turned, its size and how solid it is. */
interface Pose {
  x: number;
  y: number;
  z: number;
  turn: number;
  size: number;
  solid: number;
}
const pose = (x: number, y: number, z: number, turn: number, solid = 1, size = 1): Pose => ({ x, y, z, turn, size, solid });

/** Behind everything and out of sight: where a window waits, and where it goes when its step is over. */
const AWAY = pose(520, -60, -560, -26, 0, 0.9);
const BEHIND = pose(566, -196, -280, -21, 0.42, 0.94);
const FRONT = pose(300, -30, 190, -5, 1, 1.22);

/**
 * The choreography: where each window is at each point of the scroll. Between two points a
 * window eases from one to the other. Everything about how the section moves is in this table.
 */
const TRACKS: Record<WindowId, [number, Pose][]> = {
  browser: [
    [0.07, pose(356, -74, 0, -11)],
    [0.17, BEHIND],
    [0.29, BEHIND],
    [0.39, pose(590, -170, -230, -21, 0.85, 0.94)],
    [0.53, pose(590, -170, -230, -21, 0.85, 0.94)],
    [0.63, BEHIND],
    [0.75, BEHIND],
    [0.86, pose(352, -78, 40, -7, 1, 1.02)],
  ],
  brief: [
    [0.07, pose(70, 184, 110, -8)],
    [0.17, FRONT],
    [0.29, FRONT],
    [0.39, AWAY],
  ],
  tests: [
    [0.29, AWAY],
    [0.39, pose(262, -10, 190, -6, 1, 1.12)],
    [0.53, pose(262, -10, 190, -6, 1, 1.12)],
    [0.63, AWAY],
  ],
  updates: [
    [0.53, AWAY],
    [0.63, FRONT],
    [0.75, FRONT],
    [0.86, AWAY],
  ],
  terminal: [
    [0.75, AWAY],
    [0.86, pose(158, 214, 250, -9)],
  ],
};

const poseAt = (track: [number, Pose][], p: number): Pose => {
  if (p <= track[0][0]) return track[0][1];
  for (let i = 1; i < track.length; i++) {
    const [at, to] = track[i];
    if (p > at) continue;
    const [before, from] = track[i - 1];
    const t = smooth((p - before) / (at - before));
    const mix = (a: number, b: number) => a + (b - a) * t;
    return {
      x: mix(from.x, to.x),
      y: mix(from.y, to.y),
      z: mix(from.z, to.z),
      turn: mix(from.turn, to.turn),
      size: mix(from.size, to.size),
      solid: mix(from.solid, to.solid),
    };
  }
  return track[track.length - 1][1];
};

/** A pose as styles. The server writes the first one and the browser every one after it, in the same words. */
const styleOf = (q: Pose): CSSProperties => ({
  transform: `translate(-50%, -50%) translate3d(calc(${q.x.toFixed(1)} * var(--u)), calc(${q.y.toFixed(1)} * var(--u)), calc(${q.z.toFixed(1)} * var(--u))) rotateY(${q.turn.toFixed(2)}deg) scale(${q.size.toFixed(3)})`,
  opacity: q.solid.toFixed(3),
  visibility: q.solid < 0.01 ? "hidden" : "visible",
});

const WIDTHS: Record<WindowId, string> = {
  browser: "w-[42em]",
  brief: "w-[24.5em] [--fit:24.5em]",
  tests: "w-[33em]",
  updates: "w-[27em]",
  terminal: "w-[28em]",
};

interface StageProps {
  /** The example that is on the screens when the page arrives: its text, and the idea it was drafted from. */
  initial: { text: string; idea: string };
}

/**
 * The first screens of the home page: his workspace, with a product on it. It arrives with a
 * first draft already written, which is the part a prompt can do, and a visitor can describe
 * their own product to have it drafted in front of them. Scrolling then takes that product
 * through the four steps of a real project, on the same screens: the brief, the build, the
 * updates and the launch.
 *
 * Without JavaScript, or for a visitor who has asked for less motion, the same words are
 * stacked in order, each step with its screen beside it.
 */
const Stage = ({ initial }: StageProps) => {
  const root = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const plates = useRef<(HTMLLIElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const panes = useRef<Partial<Record<WindowId, HTMLDivElement | null>>>({});
  /** Unknown until the page is in a browser: whether the screen is wide, and whether the section may hold the screen. */
  const [mode, setMode] = useState<{ wide: boolean; pinned: boolean } | null>(null);
  /** Which step is on screen, and how far through its own play it is. */
  const [scene, setScene] = useState({ leg: -1, tick: 0 });
  const audience = useAudience();
  const viaUpwork = audience === "upwork";

  const { draft, status, shown, waiting, error, seconds, play, start } = useDraft(initial);
  const [idea, setIdea] = useState("");
  const [hint, setHint] = useState("");
  /** Whether the brief reached the clipboard, for a client who is taking it back to Upwork. */
  const [copied, setCopied] = useState<"" | "done" | "failed">("");

  // A refusal is a sentence, not a product, so the screens keep the last product they had.
  const last = useRef(draft);
  if (!draft.decline && (draft.name || status === "writing")) last.current = draft;
  const product: Draft = draft.decline ? last.current : draft;

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1280px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setMode({ wide: wide.matches, pinned: !still.matches });
    read();
    wide.addEventListener("change", read);
    still.addEventListener("change", read);
    return () => {
      wide.removeEventListener("change", read);
      still.removeEventListener("change", read);
    };
  }, []);

  const pinned = mode?.pinned ?? false;
  const wide = mode?.wide ?? false;

  useEffect(() => {
    const section = root.current;
    if (!section || !pinned) return;
    section.dataset.pinned = "";
    const heroEl = hero.current;
    const stripEl = strip.current;
    const plateEls = plates.current;
    const paneEls = panes.current;

    let top = 0;
    let span = 1;
    let raf = 0;
    let current = { leg: -1, tick: 0 };

    const measure = () => {
      const box = section.getBoundingClientRect();
      top = box.top + window.scrollY;
      span = Math.max(1, box.height - window.innerHeight);
    };

    const apply = () => {
      raf = 0;
      const p = clamp((window.scrollY - top) / span);

      const heroShown = 1 - smooth((p - 0.045) / (HERO_GONE - 0.045));
      if (hero.current) {
        hero.current.style.opacity = String(heroShown);
        hero.current.style.transform = `translate3d(0, ${-(1 - heroShown) * 48}px, 0)`;
        hero.current.style.visibility = heroShown < 0.01 ? "hidden" : "visible";
      }

      let active = -1;
      LEGS.forEach((item, i) => {
        const el = plates.current[i];
        if (!el) return;
        const seen = smooth(Math.min((p - item.from) / FADE, (item.to - p) / FADE));
        // Faded, not hidden: a screen reader can still read every step from wherever it is.
        el.style.opacity = String(seen);
        el.style.transform = `translate3d(0, ${(1 - seen) * 28}px, 0)`;
        el.style.pointerEvents = seen > 0.6 ? "auto" : "none";
        if (p >= item.from - FADE) active = i;
      });

      if (wide) {
        for (const id of WINDOWS) {
          const el = panes.current[id];
          if (!el) continue;
          const q = poseAt(TRACKS[id], p);
          Object.assign(el.style, styleOf(q));
          // What is far behind is out of focus, as it would be through a lens.
          el.style.filter = q.z < -140 && q.solid > 0.01 ? `blur(${Math.min(3, (-q.z - 140) / 70).toFixed(2)}px)` : "";
        }
      }

      const range = active >= 0 ? PLAY[active] : null;
      const tick = range ? Math.round(clamp((p - range[0]) / (range[1] - range[0])) * TICKS) : 0;
      if (active !== current.leg || tick !== current.tick) {
        current = { leg: active, tick };
        setScene(current);
      }

      if (strip.current) strip.current.style.opacity = String(smooth((p - 0.07) / 0.05));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    // The workspace leans a little toward the pointer, the way a desk does when you move your head.
    const onPointer = (e: PointerEvent) => {
      if (!wide || e.pointerType !== "mouse" || !rig.current) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      rig.current.style.transform = `rotateY(${(x * 2.4).toFixed(2)}deg) rotateX(${(-y * 1.6).toFixed(2)}deg)`;
    };

    measure();
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      delete section.dataset.pinned;
      for (const el of [heroEl, stripEl, ...plateEls]) el?.removeAttribute("style");
      for (const id of WINDOWS) {
        const el = paneEls[id];
        if (el) Object.assign(el.style, styleOf(poseAt(TRACKS[id], 0)), { filter: "" });
      }
      setScene({ leg: -1, tick: 0 });
    };
  }, [pinned, wide]);

  const submit = () => {
    const text = idea.trim();
    if (text.length < MIN_IDEA) {
      setHint("Add a little more: what is it, and who is it for?");
      return;
    }
    setHint("");
    setCopied("");
    void start(text);
  };

  /**
   * Hands a brief to Zuhayr: into the contact form, or for a client from Upwork onto the
   * clipboard, to paste into a message there, since that copy of the site has no form.
   */
  const handOver = (text: string) => {
    if (!viaUpwork) return handToContact(text);
    navigator.clipboard.writeText(text).then(
      () => setCopied("done"),
      () => setCopied("failed")
    );
  };

  const writing = status === "writing";
  const live = shown.source === "live";
  const finished = status === "done";
  const drawing = screenIsDrawable(draft.screen);
  const like = draft.like ? getProject(draft.like) : undefined;
  /** A finished draft of the visitor's own product, which is worth sending. */
  const theirs = finished && live && !draft.decline;
  const where = viaUpwork ? " on Upwork" : "";

  const progress = waiting
    ? "Reading your idea"
    : !writing
      ? ""
      : !draft.planned
        ? "Writing the brief"
        : drawing
          ? "Drawing the main screen"
          : "Setting up the main screen";

  const note =
    copied === "done"
      ? "Copied. Paste it into your message to me on Upwork."
      : copied === "failed"
        ? "It couldn't be copied from here. Select the brief and copy it by hand."
        : status === "offline"
          ? `Live drafts aren't switched on right now. Send me the idea${where} and I'll reply with the scope myself.`
          : status === "error"
            ? error || `That draft didn't come through. Try again, or send me the idea${where} and I'll scope it myself.`
            : finished && draft.decline
              ? draft.decline
              : theirs
                ? `Drafted in ${seconds === 1 ? "a second" : `${seconds} seconds`}. It's a starting point, not a quote.`
                : "";

  /** How far through its play a step's screen is. A step that has gone by stays finished. */
  const playOf = (leg: number) => (!pinned ? 1 : scene.leg > leg ? 1 : scene.leg === leg ? scene.tick / TICKS : 0);
  const launched = launchAt(product, playOf(3)) >= launchLines(product).length;
  /** Where the product is running: a draft at first, then on his machine, then in production. */
  const running = !pinned ? "draft" : launched ? "live" : scene.leg >= 1 ? "local" : "draft";

  const stepWindow = (leg: number) => {
    const t = playOf(leg);
    const className = "w-full";
    if (leg === 0) return <BriefWindow draft={product} scroll={pinned ? t : 0} whole={!pinned} className={className} />;
    if (leg === 1) return <TestsWindow draft={product} passed={passedAt(product, t)} className={className} />;
    if (leg === 2) return <UpdatesWindow draft={product} shown={updatesAt(product, t)} className={className} />;
    return <TerminalWindow draft={product} shown={launchAt(product, t)} className={className} />;
  };

  const sendBrief = (
    <button
      type="button"
      onClick={() => handOver(briefMessage(shown.idea, draft))}
      className="inline-flex h-11 items-center rounded-md bg-mint px-5 text-ui font-bold text-pine shadow-[0_3px_0_#1c9e66] transition-[translate,box-shadow] duration-100 active:translate-y-0.5 active:shadow-[0_1px_0_#1c9e66]"
    >
      {viaUpwork ? "Copy this brief for Upwork" : "Send me this brief"}
    </button>
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      style={{ "--length": `${LENGTH * 100}svh` } as CSSProperties}
      className="on-emerald group relative bg-emerald data-pinned:h-(--length)"
    >
      <div className="sheet relative isolate overflow-hidden group-data-pinned:sticky group-data-pinned:top-0 group-data-pinned:h-svh">
        {/* The workspace: five windows on one sheet, moved by the scroll. Drawn only on a wide screen. */}
        {(mode === null || wide) && (
          <div aria-hidden className="workspace pointer-events-none absolute inset-x-0 top-0 h-svh max-xl:hidden">
            <div
              ref={rig}
              className="absolute left-1/2 top-1/2 size-0 text-[calc(16*var(--u))] transition-transform duration-700 ease-out [transform-style:preserve-3d]"
            >
              {WINDOWS.map((id) => (
                <div
                  key={id}
                  ref={(el) => {
                    panes.current[id] = el;
                  }}
                  style={styleOf(poseAt(TRACKS[id], 0))}
                  className={cn("absolute left-0 top-0 will-change-transform", WIDTHS[id])}
                >
                  {/* While a new draft is on its way, the last one waits dimmed. */}
                  <div className={cn("transition-opacity duration-500", waiting && "opacity-40")}>
                    {id === "browser" && <BrowserWindow draft={product} done={!writing} stage={running} />}
                    {id === "brief" && <BriefWindow draft={draft} scroll={pinned ? playOf(0) : 0} />}
                    {id === "tests" && <TestsWindow draft={product} passed={passedAt(product, playOf(1))} />}
                    {id === "updates" && <UpdatesWindow draft={product} shown={updatesAt(product, playOf(2))} />}
                    {id === "terminal" && <TerminalWindow draft={product} shown={launchAt(product, playOf(3))} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The opening: the claim, who is making it, and a prompt of the visitor's own. */}
        <div
          ref={hero}
          className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1680px] flex-col px-[clamp(20px,4vw,64px)] pb-8 pt-[clamp(84px,13svh,136px)] will-change-transform md:max-xl:grid md:max-xl:grid-cols-2 md:max-xl:items-center md:max-xl:gap-x-10 group-data-pinned:absolute group-data-pinned:inset-0 group-data-pinned:min-h-0"
        >
          {/* On a wide screen the words keep to the left of the windows, and the headline is sized on the same sheet as they are. */}
          <div className="beside-windows">
            <h1 id="hero-title" className="text-[clamp(36px,9.4vw,64px)] md:max-xl:text-[clamp(40px,5.6vw,64px)] xl:text-[calc(80*var(--u))]">
              <span className="block pb-[0.08em] font-mono text-[0.78em] font-light leading-[1.06] tracking-[-0.05em]">
                A prompt gets <br />
                you a demo.
                <i aria-hidden className="caret text-mint" />
              </span>
              <span className="block">
                I ship <br className="max-sm:hidden" />
                the product.
              </span>
            </h1>
            {/* On a short laptop screen the introduction gives up its second sentence, and under that all of it, so the prompt always fits. */}
            <p className="mt-[clamp(14px,2.4svh,26px)] max-w-[44ch] text-ui sm:text-body xl:[@media(max-height:630px)]:hidden xl:[@media(max-height:760px)]:text-ui">
              I&apos;m Zuhayr Tariq, a full-stack web and AI developer, Top Rated Plus on Upwork.{" "}
              <span className="xl:[@media(max-height:760px)]:hidden">
                I build the whole product, and it goes live on the date we set.
              </span>
            </p>
            <div className="mt-[clamp(16px,2.8svh,30px)] flex flex-wrap items-center gap-x-7 gap-y-4">
              <HireSign />
              <a href="#work" className="link-underline text-ui font-bold">
                See what I&apos;ve shipped
              </a>
            </div>

            <form
              id="draft"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="mt-[clamp(22px,4svh,48px)]"
            >
              <label htmlFor="draft-idea" className="block text-fine font-bold">
                See what a prompt gets you: describe a product, or pick one.
              </label>
              <div className="mt-2.5 flex items-end gap-2 rounded-xl bg-pine/70 p-2 pl-4 outline-offset-3 ring-1 ring-white/20 transition-shadow focus-within:ring-white/60 has-[textarea:focus-visible]:outline-2 has-[textarea:focus-visible]:outline-signal">
                <textarea
                  id="draft-idea"
                  name="idea"
                  rows={2}
                  value={idea}
                  maxLength={MAX_IDEA}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder="A marketplace for local bakeries' surplus…"
                  aria-describedby={hint ? "draft-idea-hint" : undefined}
                  aria-invalid={hint ? true : undefined}
                  enterKeyHint="send"
                  className="min-h-[3.6rem] min-w-0 flex-1 resize-none bg-transparent py-1.5 text-ui leading-snug text-caption outline-none placeholder:text-fog/75 focus-visible:outline-none sm:text-body"
                />
                <button
                  type="submit"
                  disabled={writing && (waiting || live)}
                  className="inline-flex h-12 shrink-0 items-center justify-center rounded-md bg-mint px-5 text-ui font-bold text-pine transition-opacity disabled:pointer-events-none disabled:opacity-60"
                >
                  Draft it
                </button>
              </div>

              <div className="mt-3 min-h-11 text-fine">
                {hint ? (
                  <p id="draft-idea-hint" role="alert" className="font-bold text-error">
                    {hint}
                  </p>
                ) : progress ? (
                  <p role="status" className="flex items-center gap-2.5">
                    <span aria-hidden className="size-2 rounded-full bg-wait motion-safe:animate-pulse" />
                    {progress}
                  </p>
                ) : note ? (
                  <div className="flex flex-col gap-2.5">
                    <p role="status" className="max-w-[52ch]">
                      {note}
                    </p>
                    {(theirs || status === "offline" || status === "error") && !copied && (
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        {theirs ? (
                          sendBrief
                        ) : (
                          <button
                            type="button"
                            disabled={idea.trim().length < MIN_IDEA}
                            onClick={() => handOver(`I'd like to build: ${idea.trim()}\n`)}
                            className="inline-flex h-11 items-center rounded-md bg-mint px-5 text-ui font-bold text-pine disabled:opacity-50"
                          >
                            {viaUpwork ? "Copy the idea for Upwork" : "Send me the idea"}
                          </button>
                        )}
                        {theirs && like && (
                          <SiteLink href={`/work/${like.slug}`} className="link-underline text-ui font-bold">
                            The closest thing I&apos;ve shipped: {like.title}
                          </SiteLink>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div role="group" aria-label="Examples to watch" className="flex flex-wrap items-center gap-2">
                    {DRAFT_EXAMPLES.map((example) => {
                      const current = !live && shown.idea === example.idea;
                      return (
                        <button
                          key={example.file}
                          type="button"
                          aria-pressed={current}
                          onClick={() => {
                            setCopied("");
                            void play(example, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
                          }}
                          className={cn(
                            "h-8 rounded-md px-2.5 text-[13px] transition-colors",
                            current ? "bg-white font-bold text-pine" : "ring-1 ring-inset ring-white/35 hover:ring-white/80"
                          )}
                        >
                          {example.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* On a narrow screen the draft's screen sits under the prompt, and the rest follows step by step. */}
          {(mode === null || !wide) && (
            <div aria-hidden className={cn("mt-7 max-w-[44rem] text-[15px] transition-opacity duration-500 md:mt-0 xl:hidden", waiting && "opacity-40")}>
              <BrowserWindow draft={product} done={!writing} />
            </div>
          )}
        </div>

        {/* The four steps, each with its words, and on a narrow or still page its screen. */}
        <ol className="relative mx-auto grid w-full max-w-[1680px] grid-cols-[minmax(0,1fr)] gap-16 px-[clamp(20px,4vw,64px)] pb-24 pt-10 group-data-pinned:static group-data-pinned:block group-data-pinned:max-w-none group-data-pinned:p-0">
          {LEGS.map((item, i) => (
            <li
              key={item.label}
              ref={(el) => {
                plates.current[i] = el;
              }}
              className="grid w-full grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-7 will-change-transform xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:items-center group-data-pinned:page-left group-data-pinned:pointer-events-none group-data-pinned:absolute group-data-pinned:top-[4.6rem] group-data-pinned:block group-data-pinned:w-[calc(100%-2*clamp(20px,4vw,64px))] group-data-pinned:opacity-0 xl:group-data-pinned:bottom-[clamp(96px,14svh,140px)] xl:group-data-pinned:top-auto xl:group-data-pinned:w-[min(33rem,37vw)]"
            >
              <div>
                <p className="flex items-center gap-3 text-fine">
                  <span className="grid size-7 place-items-center rounded-full bg-mint font-mono font-bold text-pine">{i + 1}</span>
                  <span className="font-bold">{item.label}</span>
                  <span className="text-fog">Step {i + 1} of 4</span>
                </p>
                <h2 className="mt-3.5 text-[clamp(27px,3.5vw,58px)] xl:mt-5">{item.title}</h2>
                <p className="mt-3 max-w-[46ch] text-ui text-fog sm:text-body xl:mt-5">{item.body}</p>
                {i === 3 && (
                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 xl:mt-7">
                    {theirs ? sendBrief : <HireSign />}
                    {copied === "done" && <span className="text-fine">Copied. Paste it into your message to me.</span>}
                  </div>
                )}
              </div>
              {(mode === null || !wide || !pinned) && (
                <div
                  aria-hidden
                  className={cn(
                    "max-w-[36rem] text-[14.5px] group-data-pinned:mt-5 group-data-pinned:[--fit:calc(100svh-25rem)]",
                    mode === null && "xl:hidden",
                    waiting && "opacity-40"
                  )}
                >
                  {stepWindow(i)}
                </div>
              )}
            </li>
          ))}
        </ol>

        {/* Where the project is: each step goes green as it is done, the way a pipeline shows it. */}
        <div
          ref={strip}
          aria-hidden
          className="page-left pointer-events-none absolute right-[clamp(20px,4vw,64px)] bottom-5 hidden opacity-0 group-data-pinned:block xl:bottom-8"
        >
          <ol className="flex items-center text-fine">
            {LEGS.map((item, i) => {
              const done = i < scene.leg || (i === 3 && launched);
              return (
                <li key={item.label} className="flex items-center">
                  {i > 0 && <span className={cn("mx-2 h-0.5 w-4 transition-colors duration-300 sm:w-7", i <= scene.leg ? "bg-mint" : "bg-white/30")} />}
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300",
                      done ? "border-mint bg-mint text-pine" : i === scene.leg ? "border-wait" : "border-white/40"
                    )}
                  >
                    {done && (
                      <svg viewBox="0 0 20 20" className="size-3" fill="none" stroke="currentColor" strokeWidth="3.4">
                        <path d="m4 10.5 4 4 8-9" />
                      </svg>
                    )}
                  </span>
                  {/* On a phone there is room for one name, so only the step on screen is named. */}
                  <span className={cn("ml-2 transition-colors duration-300", i === scene.leg ? "font-bold text-white" : "text-fog max-sm:hidden")}>
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <p
          aria-hidden
          className="pointer-events-none absolute bottom-4 right-[clamp(20px,4vw,64px)] hidden text-fine text-fog transition-opacity duration-500 max-xl:group-data-pinned:hidden xl:group-data-pinned:block"
          style={{ opacity: scene.leg >= 0 ? 0 : 1 }}
        >
          Scroll to watch it get built
        </p>
      </div>

      {/* The draft in plain order, for anyone who is not looking at the screens. */}
      <article className="sr-only" aria-label={product.name ? `First draft of ${product.name}` : "First draft"}>
        <p>{product.pitch}</p>
        <p>Version one: {product.v1.join("; ")}.</p>
        {product.later.length > 0 && <p>Left for later: {product.later.join("; ")}.</p>}
        {product.stack.length > 0 && <p>Built with: {product.stack.join(", ")}.</p>}
        {product.weeks.length > 0 && <p>{product.weeks.map((week) => `Week ${week.when}: ${week.what}`).join(". ")}.</p>}
        {product.asks.length > 0 && <p>Before starting, I would ask: {product.asks.join(" ")}</p>}
      </article>
    </section>
  );
};

export default Stage;
