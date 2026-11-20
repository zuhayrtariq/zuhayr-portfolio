"use client";

import AskBar from "@/components/hero/ask-bar";
import Captions from "@/components/hero/captions";
import Backlight, { NAME_TRAVEL, type HeroScroll } from "@/components/hero/backlight";
import { SITE } from "@/constants/site";
import { useConversation } from "@/hooks/use-conversation";
import { getLenis } from "@/lib/lenis";
import { cn, lowerFirst } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MOTION = "(prefers-reduced-motion: no-preference)";

const ROLE = `${SITE.role}.`;
const ROLE_IN_NAME = lowerFirst(SITE.role);
const PROOF = "Lead Developer at Starling MX. Top Rated Plus on Upwork, rated 5.0 across 13 client reviews.";
const PROMISE_TYPE =
  "font-display text-[length:16.4vw] leading-[0.9] tracking-[-0.01em] sm:text-[length:min(10vw,21svh,200px)]";

/** The greeting waits for the lamp behind the name to come up. */
const GREETING_DELAY = 2400;

const Hero = () => {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  /** How far the hero has let go, driven by scroll and read by the canvas every frame. */
  const scroll = useRef<HeroScroll>({ burst: 0, part: 0 });
  /** "lit" once the lamp is drawing, "dark" where there is no GPU to draw it. */
  const [lamp, setLamp] = useState<"waiting" | "lit" | "dark">("waiting");
  const { caption, spokenWords, speaking, busy, ask, phase, mic, action, startGreeting } = useConversation({
    autoGreet: false,
  });

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const ui = q("[data-ui]");
      const words = q("[data-promise] [data-word]");

      // GSAP owns visibility from here, so the CSS no-JS fallback must stop applying.
      section.dataset.choreographed = "";
      gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
      startGreeting(GREETING_DELAY);

      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        section.dataset.pinned = "";

        gsap.from(ui, { autoAlpha: 0, y: 18, duration: 0.9, ease: "expo.out", stagger: 0.1, delay: 1.7 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.5 },
        });
        tl.to(scroll.current, { burst: 1, duration: 0.6 }, 0.02)
          // The canvas moves the name's shadows by the same amount, on the same curve.
          .to(scroll.current, { part: 1, duration: 0.36, ease: "power1.in" }, 0)
          .to(q("[data-name='first']"), { xPercent: -100 * NAME_TRAVEL, autoAlpha: 0, duration: 0.36, ease: "power1.in" }, 0)
          .to(q("[data-name='last']"), { xPercent: 100 * NAME_TRAVEL, autoAlpha: 0, duration: 0.36, ease: "power1.in" }, 0)
          .to(q("[data-fade]"), { autoAlpha: 0, y: -28, duration: 0.14 }, 0)
          .to(q("[data-glow]"), { autoAlpha: 0, scale: 1.6, duration: 0.5 }, 0.08)
          .fromTo(
            words,
            { autoAlpha: 0, yPercent: 70, rotate: 4 },
            { autoAlpha: 1, yPercent: 0, rotate: 0, duration: 0.14, stagger: 0.026, ease: "power3.out" },
            0.4
          )
          .to({}, { duration: 0.12 });

        return () => {
          delete section.dataset.pinned;
          scroll.current.burst = 0;
          scroll.current.part = 0;
        };
      });

      // Keep the scrub in step with Lenis' smoothed scroll rather than raw scroll events.
      const lenis = getLenis();
      lenis?.on("scroll", ScrollTrigger.update);
      return () => {
        lenis?.off("scroll", ScrollTrigger.update);
        delete section.dataset.choreographed;
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="group relative isolate data-pinned:h-[230svh]">
      <div className="relative flex h-[100svh] min-h-[600px] flex-col overflow-hidden group-data-pinned:sticky group-data-pinned:top-0">
        {/* The lamp behind the name. Without a GPU it is a plain glow in the same place. */}
        {lamp !== "dark" && (
          <Backlight
            name={title}
            speaking={speaking}
            scroll={scroll}
            onReady={() => setLamp("lit")}
            onError={() => setLamp("dark")}
            className="absolute inset-0"
          />
        )}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-1000",
            lamp === "dark" ? "opacity-100" : "opacity-0"
          )}
        >
          <div
            data-glow
            className="absolute left-1/2 top-[30%] aspect-square w-[min(150vw,120svh)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(240_194_138/0.5),rgb(255_77_31/0.34)_14%,rgb(255_77_31/0.1)_48%,transparent)] lg:top-[41svh]"
          />
        </div>

        <h1
          ref={title}
          id="hero-title"
          aria-label={`Zuhayr Tariq, ${ROLE_IN_NAME}`}
          className="absolute inset-x-0 top-[84px] flex flex-col px-[clamp(20px,4vw,64px)] font-display text-[length:min(48vw,25svh)] font-normal leading-[0.9] tracking-[-0.015em] lg:top-[41svh] lg:-translate-y-1/2 lg:flex-row lg:justify-center lg:gap-[0.23em] lg:text-[length:min(26.2vw,54svh)]"
        >
          {/* The name is on screen from the first paint and only settles into place, so the
              page's largest element never waits for JavaScript. The masks leave room for
              the long descenders of the y and q. On a phone it is two lines, set to either side. */}
          <span data-name="first" aria-hidden className="-mb-[0.3em] self-start overflow-hidden pb-[0.3em]">
            <span className="block animate-[name-rise_1.5s_var(--ease-lights)_both]">Zuhayr</span>
          </span>
          <span data-name="last" aria-hidden className="-mb-[0.3em] self-end overflow-hidden pb-[0.3em] lg:self-start">
            <span className="block animate-[name-rise_1.5s_var(--ease-lights)_0.12s_both]">Tariq</span>
          </span>
          {/* The heading says what he does as well as who he is, for anything that reads the page as text. */}
          <span className="sr-only">{SITE.role}</span>
        </h1>

        <div
          data-fade
          className="relative z-10 mx-auto mt-auto grid w-full max-w-[1680px] items-end gap-x-8 gap-y-5 px-[clamp(20px,4vw,64px)] pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,44ch)_minmax(0,1fr)] lg:pb-10"
        >
          <div data-ui data-reveal="ui" className="max-w-[24rem]">
            <p className="text-[22px] leading-tight text-caption lg:text-[26px]">{ROLE}</p>
            <p className="mt-2.5 text-fine leading-normal text-fog lg:text-ui">{PROOF}</p>
          </div>

          <div data-ui data-reveal="ui" className="max-lg:order-first">
            {/* Who is speaking: the same drawing of him as the mark in the header. */}
            <span
              aria-hidden
              className={cn(
                "mx-auto mb-3 flex size-12 items-end justify-center overflow-hidden rounded-full bg-umbra ring-1 ring-caption/15 transition-shadow duration-300",
                speaking && "shadow-[0_0_0_4px_rgb(255_77_31/0.35)]"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
              <img src="/images/avatar.webp" alt="" width={52} height={52} decoding="async" className="size-[52px] max-w-none" />
            </span>
            <Captions text={caption} spokenWords={spokenWords} className="[text-shadow:0_1px_2px_#050606,0_0_28px_#050606]" />
          </div>

          <div data-ui data-reveal="ui" className="lg:justify-self-end">
            {action && phase === "ready" && (
              <a
                href="#contact"
                className="mb-4 inline-flex h-13 items-center rounded-full bg-signal px-8 text-ui font-bold text-ink transition-colors hover:bg-caption"
              >
                Start a project
              </a>
            )}
            <AskBar
              onAsk={ask}
              busy={busy}
              onMic={mic.supported ? mic.toggle : undefined}
              listening={mic.state === "listening"}
              className="lg:w-[24rem] max-lg:[&_ul]:hidden"
            />
          </div>
        </div>

        {/* The promise takes the frame once the name has let go: one sentence to a line. */}
        <p
          data-promise
          className={cn(
            "pointer-events-none absolute inset-0 hidden flex-col justify-center gap-y-[0.06em] px-[clamp(20px,6vw,96px)] text-center group-data-pinned:flex",
            PROMISE_TYPE
          )}
        >
          {SITE.promise.map((line, i) => (
            <span
              key={line}
              className={cn("flex flex-wrap justify-center gap-x-[0.22em]", i === SITE.promise.length - 1 && "text-signal")}
            >
              {line.split(" ").map((word, n) => (
                <span key={n} data-word className="invisible inline-block">
                  {word}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>

      {/* Without the scroll choreography, the promise simply follows the hero. */}
      <p className={cn("px-[clamp(20px,6vw,96px)] py-28 text-center group-data-pinned:hidden md:py-40", PROMISE_TYPE)}>
        {SITE.promise.map((line, i) => (
          <span key={line} className={cn("block", i === SITE.promise.length - 1 && "text-signal")}>
            {line}{" "}
          </span>
        ))}
      </p>

      <p className="sr-only" aria-live="polite">
        {phase === "ready" ? caption : ""}
      </p>
    </section>
  );
};

export default Hero;
