"use client";

import AskBar from "@/components/hero/ask-bar";
import AvatarStage from "@/components/hero/avatar-stage";
import Backdrop from "@/components/hero/backdrop";
import Captions from "@/components/hero/captions";
import LowerThird from "@/components/hero/lower-third";
import { useConversation } from "@/hooks/use-conversation";
import { getLenis } from "@/lib/lenis";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useCallback, useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const SESSION_KEY = "lights-up-played";

// PINNED must match Tailwind's `lg` breakpoint, where the interview frame goes side by side.
const PINNED = "(width >= 64rem) and (prefers-reduced-motion: no-preference)";
const STACKED = "(width < 64rem) and (prefers-reduced-motion: no-preference)";
const REDUCED = "(prefers-reduced-motion: reduce)";

const TAGLINE = "Full-stack web and AI developer. I take products from idea to launch, on time.";
const PROOF = "Lead Developer at Starling MX. Top Rated Plus on Upwork, rated 5.0 across 13 client reviews.";

const GREETING_CUE_DELAY = 400;
/** Transition progress at which the lower third and ask bar are cued in. */
const ARRIVAL_AT = 0.66;
/** Transition progress at which the frame is lit enough for him to start talking. */
const GREETING_AT = 0.72;

/** Layout offset of `el` inside `ancestor`, ignoring transforms. */
const offsetWithin = (el: HTMLElement, ancestor: HTMLElement) => {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
};

const Hero = () => {
  const root = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const interviewTaglineRef = useRef<HTMLParagraphElement>(null);
  const interviewRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLDivElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);
  const lowerThirdRef = useRef<HTMLDivElement>(null);
  const firstVisit = useRef<boolean | null>(null);

  const [lit, setLit] = useState(false);
  const { caption, spokenWords, speaking, busy, ask, phase, mic, action, startGreeting } = useConversation({
    autoGreet: false,
  });
  /** Starts the greeting once the interview frame is on screen. Later calls do nothing. */
  const cueGreeting = useCallback(() => startGreeting(GREETING_CUE_DELAY), [startGreeting]);

  useGSAP(
    () => {
      const section = root.current;
      const frame = frameRef.current;
      const title = titleRef.current;
      const tagline = taglineRef.current;
      const interviewTagline = interviewTaglineRef.current;
      const interview = interviewRef.current;
      const stage = stageRef.current;
      const slot = slotRef.current;
      const askBar = askRef.current;
      const captions = captionsRef.current;
      const lowerThird = lowerThirdRef.current;
      if (
        !section || !frame || !title || !tagline || !interviewTagline || !interview ||
        !stage || !slot || !askBar || !captions || !lowerThird
      ) {
        return;
      }

      setLit(true);
      // GSAP owns visibility from here, so the CSS no-JS fallback must stop applying.
      section.dataset.choreographed = "";
      if (firstVisit.current === null) {
        firstVisit.current = sessionStorage.getItem(SESSION_KEY) !== "1";
        sessionStorage.setItem(SESSION_KEY, "1");
      }
      const lightsUp = firstVisit.current && !window.matchMedia(REDUCED).matches;

      if (lightsUp) {
        SplitText.create(title, {
          type: "lines",
          mask: "lines",
          linesClass: "title-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(title, { autoAlpha: 1 });
            return gsap.from(self.lines, {
              yPercent: 105,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.08,
              delay: 0.3,
              onComplete: () => self.revert(),
            });
          },
        });
        // The intro animates the lines inside; the scroll fade owns the wrapper, so they never fight.
        gsap.set(tagline, { autoAlpha: 1 });
        gsap.fromTo(
          tagline.children,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.85, stagger: 0.08, ease: "expo.out" }
        );
      } else {
        gsap.set([title, tagline], { autoAlpha: 1 });
      }

      document.fonts.ready.then(() => ScrollTrigger.refresh());

      const mm = gsap.matchMedia();

      // Desktop: the title card holds the frame, then scrubs back into the interview.
      mm.add(PINNED, () => {
        section.dataset.pinned = "";
        interview.style.pointerEvents = "none";
        gsap.set(lowerThird, { visibility: "visible" });

        const fit = () => {
          const from = offsetWithin(title, frame);
          const to = offsetWithin(slot, frame);
          return {
            x: to.x - from.x,
            y: to.y - from.y,
            scale: parseFloat(getComputedStyle(slot).fontSize) / parseFloat(getComputedStyle(title).fontSize),
          };
        };

        // The interview UI arrives on cue rather than with the scrub, so it is never left half visible.
        const arrival = gsap
          .timeline({ paused: true })
          .fromTo([interviewTagline, askBar, captions], { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0)
          .fromTo(lowerThird, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.8, ease: "expo.out" }, 0.2);
        let arrived = false;

        const sync = (progress: number) => {
          if (progress >= ARRIVAL_AT !== arrived) {
            arrived = !arrived;
            interview.style.pointerEvents = arrived ? "" : "none";
            if (arrived) arrival.play();
            else arrival.reverse();
          }
          if (progress >= GREETING_AT) cueGreeting();
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: (self) => sync(self.progress),
          },
        });

        tl.fromTo(
          title,
          { x: 0, y: 0, scale: 1, transformOrigin: "0 0" },
          { x: () => fit().x, y: () => fit().y, scale: () => fit().scale, ease: "power2.inOut", duration: 0.65 },
          0
        )
          // The title card's tagline steps aside; the interview has its own, readable copy.
          .fromTo(
            tagline,
            { autoAlpha: 1, y: 0 },
            { autoAlpha: 0, y: -24, duration: 0.22, ease: "power1.in", immediateRender: false },
            0
          )
          .fromTo(
            stage,
            { autoAlpha: 0, filter: "brightness(0.3)" },
            { autoAlpha: 1, filter: "brightness(1)", ease: "power1.out", duration: 0.53 },
            0.12
          )
          .to({}, { duration: 0.35 }, 0.65);
        tl.eventCallback("onUpdate", () => sync(tl.progress()));

        // Tabbing into the ask bar or lower third skips the transition rather than focusing hidden controls.
        const toInterview = () => {
          const st = tl.scrollTrigger;
          if (st && st.progress < 1) window.scrollTo({ top: st.end });
        };
        interview.addEventListener("focusin", toInterview);

        return () => {
          interview.removeEventListener("focusin", toInterview);
          interview.style.pointerEvents = "";
          delete section.dataset.pinned;
        };
      });

      // Mobile: the interview sits below the title card and lights up as it scrolls in.
      mm.add(STACKED, () => {
        if (!firstVisit.current) {
          gsap.set([stage, lowerThird], { autoAlpha: 1 });
          ScrollTrigger.create({ trigger: stage, start: "top 75%", end: "max", onEnter: cueGreeting });
          return;
        }

        gsap.set(stage, { autoAlpha: 0, filter: "brightness(0.3)" });
        gsap.set(lowerThird, { autoAlpha: 0, x: -16 });
        const arrival = gsap
          .timeline({ paused: true })
          .to(stage, { autoAlpha: 1, filter: "brightness(1)", duration: 1.4, ease: "power2.out", clearProps: "filter" }, 0)
          .to(lowerThird, { autoAlpha: 1, x: 0, duration: 0.8, ease: "expo.out" }, 0.6)
          .call(cueGreeting, undefined, 0.9);
        ScrollTrigger.create({ trigger: stage, start: "top 65%", end: "max", onEnter: () => arrival.play() });
      });

      mm.add(REDUCED, () => {
        gsap.set([stage, lowerThird], { autoAlpha: 1 });
        ScrollTrigger.create({ trigger: stage, start: "top 75%", end: "max", onEnter: cueGreeting });
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
    <section ref={root} aria-labelledby="hero-title" className="group relative isolate data-pinned:h-[200svh]">
      <div
        ref={frameRef}
        className="relative group-data-pinned:sticky group-data-pinned:top-0 group-data-pinned:h-[100svh] group-data-pinned:overflow-hidden"
      >
        <Backdrop lit={lit} />

        <div className="relative z-10 mx-auto flex min-h-[84svh] max-w-[1440px] items-end px-[clamp(20px,4vw,64px)] pb-14 pt-16 md:min-h-[100svh] md:items-center md:pb-0 md:pt-20 group-data-pinned:pointer-events-none group-data-pinned:absolute group-data-pinned:inset-0">
          <div className="pointer-events-auto">
            <h1
              ref={titleRef}
              id="hero-title"
              data-reveal="title"
              className="font-display text-[length:31vw] font-normal leading-[0.86] tracking-[-0.015em] [text-wrap:wrap] md:text-[length:min(25vw,356px)] [&_.title-line-mask]:-mb-[0.14em] [&_.title-line-mask]:pb-[0.14em]"
            >
              Zuhayr Tariq
            </h1>
            {/* The margin clears the long descenders of the y and q at display size. */}
            <div ref={taglineRef} data-reveal="tagline" className="mt-10 max-w-[38rem] md:mt-[clamp(56px,7vw,104px)]">
              <p className="text-[clamp(22px,2.3vw,34px)] leading-snug text-caption">{TAGLINE}</p>
              <p className="mt-3 text-ui text-fog md:mt-4">{PROOF}</p>
            </div>
          </div>
        </div>

        <div
          ref={interviewRef}
          className="relative lg:h-[100svh] group-data-pinned:absolute group-data-pinned:inset-0"
        >
          <div
            ref={stageRef}
            data-reveal="stage"
            className="relative h-[56svh] lg:absolute lg:bottom-0 lg:right-0 lg:top-20 lg:h-auto lg:w-[54%]"
          >
            <AvatarStage speaking={speaking} />
          </div>

          <div className="relative mx-auto flex max-w-[1440px] flex-col px-[clamp(20px,4vw,64px)] pb-10 lg:h-full lg:pt-20">
            <div className="order-2 mt-8 flex flex-col lg:order-none lg:mt-0 lg:max-w-[46rem] lg:flex-1 lg:justify-center">
              {/* The name scales into this box: one line at the title's leading of 0.86. */}
              <div
                ref={slotRef}
                aria-hidden
                className="hidden h-[0.86em] text-[length:clamp(72px,9vw,136px)] group-data-pinned:block"
              />
              <p
                ref={interviewTaglineRef}
                aria-hidden
                className="mt-5 hidden max-w-[34rem] text-[clamp(20px,1.7vw,26px)] leading-snug text-caption group-data-pinned:block"
              >
                {TAGLINE}
              </p>
              <div ref={askRef} className="group-data-pinned:mt-9">
                {action && phase === "ready" && (
                  <a
                    href="#contact"
                    className="mb-6 inline-flex h-13 items-center rounded-full bg-caption px-8 text-ui font-bold text-umbra transition-colors hover:bg-signal"
                  >
                    Start a project
                  </a>
                )}
                <AskBar
                  onAsk={ask}
                  busy={busy}
                  onMic={mic.supported ? mic.toggle : undefined}
                  listening={mic.state === "listening"}
                />
              </div>
            </div>

            <div className="order-1 grid items-end gap-5 lg:order-none lg:grid-cols-[1fr_minmax(0,46ch)_1fr]">
              <div ref={lowerThirdRef} data-reveal="lower-third" className="order-2 lg:order-none">
                <LowerThird />
              </div>
              <div ref={captionsRef} className="order-1 -mt-16 lg:order-none lg:mt-0">
                <Captions text={caption} spokenWords={spokenWords} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {phase === "ready" ? caption : ""}
      </p>
    </section>
  );
};

export default Hero;
