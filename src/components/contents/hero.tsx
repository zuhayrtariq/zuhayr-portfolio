"use client";

import AskBar from "@/components/hero/ask-bar";
import Captions from "@/components/hero/captions";
import PointPortrait from "@/components/hero/point-portrait";
import PortraitStill from "@/components/hero/portrait-still";
import { useConversation } from "@/hooks/use-conversation";
import { getLenis } from "@/lib/lenis";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MOTION = "(prefers-reduced-motion: no-preference)";

const ROLE = "Full-stack web and AI developer.";
const PROOF = "Lead Developer at Starling MX. Top Rated Plus on Upwork, rated 5.0 across 13 client reviews.";
const PROMISE = ["I", "take", "products", "from", "idea", "to", "launch,"];
const PROMISE_ACCENT = ["on", "time."];

/** The greeting waits for the portrait to finish assembling. */
const GREETING_DELAY = 2800;

const Hero = () => {
  const root = useRef<HTMLElement>(null);
  /** How far the portrait has come apart, driven by scroll and read by the canvas every frame. */
  const burst = useRef(0);
  const [webgl, setWebgl] = useState(true);
  const { caption, spokenWords, speaking, busy, ask, phase, mic, action, startGreeting } = useConversation({
    autoGreet: false,
  });

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const ui = q("[data-ui]");
      const words = q("[data-promise] span");

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
        tl.to(burst, { current: 1, duration: 0.6 }, 0.02)
          .to(q("[data-name='first']"), { xPercent: -38, autoAlpha: 0, duration: 0.36, ease: "power1.in" }, 0)
          .to(q("[data-name='last']"), { xPercent: 38, autoAlpha: 0, duration: 0.36, ease: "power1.in" }, 0)
          .to(q("[data-fade]"), { autoAlpha: 0, y: -28, duration: 0.14 }, 0)
          .to(q("[data-glow]"), { autoAlpha: 0, scale: 1.6, duration: 0.5 }, 0.08)
          .fromTo(
            words,
            { autoAlpha: 0, yPercent: 70, rotate: 4 },
            { autoAlpha: 1, yPercent: 0, rotate: 0, duration: 0.14, stagger: 0.035, ease: "power3.out" },
            0.4
          )
          .to({}, { duration: 0.12 });

        return () => {
          delete section.dataset.pinned;
          burst.current = 0;
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
        {/* Firelight behind the head. */}
        <div
          data-glow
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[34%] aspect-square w-[min(120vw,105svh)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_77_31/0.2),rgb(255_77_31/0.06)_55%,transparent)]"
        />

        <h1
          id="hero-title"
          aria-label="Zuhayr Tariq"
          className="absolute inset-x-0 top-[76px] flex justify-between px-[clamp(20px,4vw,64px)] font-display text-[length:20vw] font-normal leading-[0.9] tracking-[-0.015em] lg:top-[39svh] lg:-translate-y-1/2 lg:text-[length:min(22vw,44svh)]"
        >
          {/* The name is on screen from the first paint and only settles into place, so the
              page's largest element never waits for JavaScript. The masks leave room for
              the long descenders of the y and q. */}
          <span data-name="first" aria-hidden className="-mb-[0.3em] overflow-hidden pb-[0.3em]">
            <span className="block animate-[name-rise_1.5s_var(--ease-lights)_both]">Zuhayr</span>
          </span>
          <span data-name="last" aria-hidden className="-mb-[0.3em] overflow-hidden pb-[0.3em]">
            <span className="block animate-[name-rise_1.5s_var(--ease-lights)_0.12s_both]">Tariq</span>
          </span>
        </h1>

        <div
          data-reveal="portrait"
          className="pointer-events-none absolute inset-0 [--portrait-height:0.5] [--portrait-lift:0.31] lg:[--portrait-height:0.83] lg:[--portrait-lift:0] lg:[--portrait-shift:0.07]"
        >
          {webgl ? (
            <PointPortrait speaking={speaking} burst={burst} onError={() => setWebgl(false)} />
          ) : (
            <PortraitStill speaking={speaking} className="absolute inset-0" />
          )}
        </div>

        <div
          data-fade
          className="relative z-10 mx-auto mt-auto grid w-full max-w-[1680px] items-end gap-x-8 gap-y-5 px-[clamp(20px,4vw,64px)] pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,44ch)_minmax(0,1fr)] lg:pb-10"
        >
          <div data-ui data-reveal="ui" className="max-w-[24rem]">
            <p className="text-[22px] leading-tight text-caption lg:text-[26px]">{ROLE}</p>
            <p className="mt-2.5 text-fine leading-normal text-fog lg:text-ui">{PROOF}</p>
          </div>

          <div data-ui data-reveal="ui" className="max-lg:order-first">
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

        {/* The promise takes the frame once the portrait has let go. */}
        <p
          data-promise
          className="pointer-events-none absolute inset-0 hidden flex-wrap content-center justify-center gap-x-[0.22em] px-[8vw] text-center font-display text-[clamp(64px,10.5vw,190px)] leading-[0.88] tracking-[-0.01em] group-data-pinned:flex"
        >
          {PROMISE.map((word) => (
            <span key={word} className="invisible inline-block">
              {word}
            </span>
          ))}
          {PROMISE_ACCENT.map((word) => (
            <span key={word} className="invisible inline-block text-signal">
              {word}
            </span>
          ))}
        </p>
      </div>

      {/* Without the scroll choreography, the promise simply follows the hero. */}
      <p className="mx-auto max-w-[16ch] px-[clamp(20px,4vw,64px)] py-28 text-center font-display text-[clamp(64px,10.5vw,190px)] leading-[0.88] tracking-[-0.01em] group-data-pinned:hidden md:py-40">
        {PROMISE.join(" ")} <span className="text-signal">{PROMISE_ACCENT.join(" ")}</span>
      </p>

      <p className="sr-only" aria-live="polite">
        {phase === "ready" ? caption : ""}
      </p>
    </section>
  );
};

export default Hero;
