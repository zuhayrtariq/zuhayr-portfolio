"use client";

import AskBar from "@/components/hero/ask-bar";
import Captions from "@/components/hero/captions";
import { useAudience } from "@/components/site/audience";
import HireSign from "@/components/site/hire-sign";
import { SITE } from "@/constants/site";
import { useConversation } from "@/hooks/use-conversation";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import FlightCanvas from "./flight-canvas";
import type { FlightHandle } from "./scene";

/**
 * The four legs of a project, which are also the four legs of the flight behind them.
 * `from` and `to` are where along the flight each one is on screen; the gaps between
 * them are the two passes through cloud.
 */
const LEGS = [
  {
    label: "Brief",
    title: "You describe it.",
    body: "Tell me what it is and who it's for. We start with a call, then you get a written scope before any code: what's in, what's out, and when each piece lands.",
    from: 0.135,
    to: 0.27,
  },
  {
    label: "Build",
    title: "I build it.",
    body: "With AI as my copilot, so it's fast. You get something to click early, and new pieces as they're finished. Nothing ships that I haven't read, run and tested.",
    from: 0.35,
    to: 0.51,
  },
  {
    label: "Updates",
    title: "You always know where we are.",
    body: "Updates reach you before you ask for them. You can always see where things stand, including anything that needs a decision from you.",
    from: 0.54,
    to: 0.715,
  },
  {
    label: "Launch",
    title: "It goes live on the date we set.",
    body: "I ship to production and hand over the code and the docs. For 30 days after launch, bugs in what I built are fixed free.",
    from: 0.81,
    to: 1.1,
  },
];

/** How much of the flight a plate takes to arrive or leave. */
const FADE = 0.024;
/** The hero has gone by this point, and the first plate follows it. */
const HERO_GONE = 0.115;
/** Where the reduced-motion frame is taken: the paper plane, a moment after sunrise. */
const STILL_AT = 0.03;
/** Screens of scrolling the whole flight takes. */
const LENGTH = 6.4;

const PROOF = "Lead Developer at Starling MX. Top Rated Plus on Upwork, rated 5.0 across 13 client reviews.";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

const PlaneGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
    <path d="M22 2 2 9.5l7 2.6L11.5 20 22 2Zm-4.3 4.2-8 5.3-3.4-1.3 11.4-4Z" />
  </svg>
);

/**
 * The first screens of the home page: a flight you scroll through. A paper plane leaves at
 * dawn, becomes an airliner inside the first cloud, cruises through the day and lands at dusk,
 * while the four steps of a project arrive on plates in front of it.
 *
 * Without JavaScript, or for a visitor who has asked for less motion, the same words are
 * simply stacked under a still of the first frame.
 */
const Flight = () => {
  const root = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const plates = useRef<(HTMLLIElement | null)[]>([]);
  const route = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const flight = useRef<FlightHandle | null>(null);
  const progress = useRef(STILL_AT);
  /** "live" once the scene has drawn, "flat" where there is no GPU to draw it. */
  const [sky, setSky] = useState<"waiting" | "live" | "flat">("waiting");
  const [leg, setLeg] = useState(-1);
  const audience = useAudience();
  const { caption, spokenWords, speaking, busy, ask, phase, mic, action, startGreeting } = useConversation({
    autoGreet: false,
  });

  useEffect(() => {
    startGreeting(1500);
  }, [startGreeting]);

  useEffect(() => {
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    section.dataset.pinned = "";
    const heroEl = hero.current;
    const routeEl = route.current;
    const plateEls = plates.current;

    let top = 0;
    let span = 1;
    let raf = 0;
    let current = -1;

    const measure = () => {
      const box = section.getBoundingClientRect();
      top = box.top + window.scrollY;
      span = Math.max(1, box.height - window.innerHeight);
    };

    const apply = () => {
      raf = 0;
      const p = clamp((window.scrollY - top) / span);
      progress.current = p;
      flight.current?.setProgress(p);

      const heroShown = 1 - smooth((p - 0.05) / (HERO_GONE - 0.05));
      if (hero.current) {
        hero.current.style.opacity = String(heroShown);
        hero.current.style.transform = `translate3d(0, ${-(1 - heroShown) * 48}px, 0)`;
        hero.current.style.visibility = heroShown < 0.01 ? "hidden" : "visible";
      }

      let active = -1;
      LEGS.forEach((item, i) => {
        const el = plates.current[i];
        if (!el) return;
        const shown = smooth(Math.min((p - item.from) / FADE, (item.to - p) / FADE));
        // Faded, not hidden: a screen reader can still read every step from wherever it is.
        el.style.opacity = String(shown);
        el.style.transform = `translate3d(0, ${(1 - shown) * 28}px, 0)`;
        if (p >= item.from - FADE) active = i;
      });
      if (active !== current) {
        current = active;
        setLeg(active);
      }

      if (route.current) route.current.style.opacity = String(smooth((p - 0.07) / 0.05));
      if (marker.current) marker.current.style.left = `${p * 100}%`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      delete section.dataset.pinned;
      for (const el of [heroEl, ...plateEls, routeEl]) el?.removeAttribute("style");
    };
  }, []);

  const onReady = useCallback(() => {
    flight.current?.setProgress(progress.current);
    setSky("live");
  }, []);
  const onUnavailable = useCallback(() => setSky("flat"), []);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      style={{ "--flight": `${LENGTH * 100}svh` } as React.CSSProperties}
      className="on-night group relative bg-[#0a1a78] data-pinned:h-(--flight)"
    >
      <div className="relative isolate overflow-hidden group-data-pinned:sticky group-data-pinned:top-0 group-data-pinned:h-svh">
        <div aria-hidden className="absolute inset-x-0 top-0 h-svh">
          {/* The sky as paint: what is on screen before the flight loads, and all there is without a GPU. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#0a1a78_0%,#3555d8_30%,#8b9cf0_44%,#ffcf96_52%,#8f8fe0_60%,#4b55c8_100%)]" />
          {sky === "flat" && (
            <PlaneGlyph className="absolute left-[58%] top-[40%] w-[min(26vw,17rem)] -rotate-12 text-white drop-shadow-[0_30px_40px_rgb(7_18_51/0.45)] max-lg:left-[50%] max-lg:top-[58%] max-lg:w-[42vw]" />
          )}
          {sky !== "flat" && (
            <FlightCanvas
              handle={flight}
              onReady={onReady}
              onUnavailable={onUnavailable}
              className={cn("absolute inset-0 transition-opacity duration-1000", sky === "live" ? "opacity-100" : "opacity-0")}
            />
          )}
        </div>

        {/* The top of the frame is held dark, so the header reads over cloud as well as over sky. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-night/45 to-transparent" />

        {/* The hero: the claim, who is making it, and a way to ask him about it. */}
        <div
          ref={hero}
          className="relative mx-auto flex min-h-svh w-full max-w-[1680px] flex-col px-[clamp(20px,4vw,64px)] pb-7 pt-[clamp(88px,15svh,150px)] will-change-transform group-data-pinned:absolute group-data-pinned:inset-0 group-data-pinned:min-h-0"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(7_18_51/0.5),transparent_62%)] lg:bg-[linear-gradient(98deg,rgb(7_18_51/0.5),rgb(7_18_51/0.2)_36%,transparent_62%)]" />
          <h1
            id="hero-title"
            className="text-[clamp(31px,5.5vw,94px)] text-white font-stretch-[125%] [text-shadow:0_2px_30px_rgb(7_18_51/0.4)]"
          >
            Anyone can <br className="max-sm:hidden" />
            take off now. <br />I land the plane.
          </h1>
          <p className="mt-[clamp(14px,2.6svh,28px)] max-w-[40ch] text-ui text-white sm:text-body xl:max-w-[44ch] xl:text-lead [text-shadow:0_1px_18px_rgb(7_18_51/0.45)]">
            I&apos;m Zuhayr Tariq, a full-stack web and AI developer.{" "}
            <span className="max-sm:hidden">AI gets a demo off the ground in an afternoon. </span>I build the product that
            carries real users, and it goes live on the date we set.
          </p>
          <div className="mt-[clamp(18px,3.2svh,34px)] flex flex-wrap items-center gap-x-7 gap-y-4">
            <HireSign />
            <a href="#work" className="link-underline text-ui font-bold text-white">
              See what has landed
            </a>
          </div>

          <div className="mt-auto grid grid-cols-[minmax(0,1fr)] items-end gap-x-10 gap-y-5 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
            <p className="max-w-[40ch] text-fine text-white/85 max-lg:hidden [text-shadow:0_1px_14px_rgb(7_18_51/0.6)]">{PROOF}</p>
            <div className="rounded-xl bg-night/80 p-3">
              <div className="flex items-center gap-3 px-1 pb-2.5 pt-1">
                <span
                  aria-hidden
                  className={cn(
                    "block size-10 shrink-0 overflow-hidden rounded-full bg-cobalt ring-2 transition-[box-shadow,--tw-ring-color] duration-300",
                    speaking ? "ring-sun" : "ring-white/25"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
                  <img src="/images/avatar.webp" alt="" width={40} height={40} decoding="async" className="size-full max-w-none" />
                </span>
                <Captions
                  text={caption}
                  spokenWords={spokenWords}
                  className="min-h-[2lh] flex-1 text-left text-[15px] leading-snug md:text-[16px]"
                />
              </div>
              {action &&
                phase === "ready" &&
                (audience === "upwork" ? (
                  <a
                    href={SITE.upwork}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline mb-2.5 ml-1 inline-block text-ui font-bold text-sun"
                  >
                    Tell me about it in a message on Upwork
                  </a>
                ) : (
                  <a href="#contact" className="link-underline mb-2.5 ml-1 inline-block text-ui font-bold text-sun">
                    Start a project with what you just told me
                  </a>
                ))}
              <AskBar
                onAsk={ask}
                busy={busy}
                onMic={mic.supported ? mic.toggle : undefined}
                listening={mic.state === "listening"}
                suggestions={[]}
                className="max-w-none"
              />
            </div>
          </div>
        </div>

        {/* The four legs, each on its own plate as its part of the flight goes by. */}
        <ol className="relative mx-auto w-full max-w-[1680px] space-y-5 px-[clamp(20px,4vw,64px)] pb-20 pt-6 group-data-pinned:static group-data-pinned:max-w-none group-data-pinned:space-y-0 group-data-pinned:p-0">
          {LEGS.map((item, i) => (
            <li
              key={item.label}
              ref={(el) => {
                plates.current[i] = el;
              }}
              className="w-full max-w-[33rem] will-change-transform lg:max-w-[min(33rem,38vw)] group-data-pinned:pointer-events-none group-data-pinned:absolute group-data-pinned:left-[clamp(20px,4vw,64px)] group-data-pinned:top-24 group-data-pinned:w-[calc(100%-2*clamp(20px,4vw,64px))] group-data-pinned:opacity-0 lg:group-data-pinned:bottom-[clamp(88px,13svh,128px)] lg:group-data-pinned:top-auto"
            >
              <div className="overflow-hidden rounded-lg bg-night/90 shadow-[0_30px_70px_-30px_rgb(7_18_51/0.9)]">
                <p className="flex items-stretch bg-sun text-fine font-bold text-night">
                  <span className="grid w-10 place-items-center bg-night font-mono text-sun">{i + 1}</span>
                  <span className="px-3.5 py-2">{item.label}</span>
                  <span className="ml-auto self-center pr-3.5 font-normal">Step {i + 1} of 4</span>
                </p>
                <div className="p-5 sm:p-7">
                  <h2 className="text-[clamp(26px,3vw,46px)] text-white">{item.title}</h2>
                  <p className="mt-3 max-w-[46ch] text-ui text-fog sm:text-body">{item.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* Where we are along the flight, as the strip above an airline seat shows it. */}
        <div
          ref={route}
          aria-hidden
          className="pointer-events-none absolute inset-x-[clamp(20px,4vw,64px)] bottom-5 hidden opacity-0 group-data-pinned:block lg:left-auto lg:w-[min(34rem,42vw)]"
        >
          <div className="rounded-lg bg-night/85 px-4 pb-2.5 pt-3.5">
            <div className="relative mx-2 h-4">
              <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/35" />
              {LEGS.map((item, i) => (
                <span
                  key={item.label}
                  style={{ left: `${item.from * 100}%` }}
                  className={cn(
                    "absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300",
                    i <= leg ? "bg-sun" : "bg-white/50"
                  )}
                />
              ))}
              <span ref={marker} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
                <PlaneGlyph className="size-5 rotate-45" />
              </span>
            </div>
            <div className="relative mx-2 mt-1.5 h-4 text-[12px] leading-none">
              {LEGS.map((item, i) => (
                <span
                  key={item.label}
                  style={{ left: `${item.from * 100}%` }}
                  className={cn(
                    "absolute -translate-x-1/2 transition-colors duration-300",
                    i === leg ? "font-bold text-sun" : "text-white/70"
                  )}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-2 hidden text-center text-fine text-white/80 transition-opacity duration-500 group-data-pinned:block max-lg:group-data-pinned:hidden"
          style={{ opacity: leg >= 0 ? 0 : 1 }}
        >
          Scroll to fly
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {phase === "ready" ? caption : ""}
      </p>
    </section>
  );
};

export default Flight;
