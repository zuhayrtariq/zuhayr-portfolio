"use client";

import AskBar from "@/components/hero/ask-bar";
import AvatarStage from "@/components/hero/avatar-stage";
import Backdrop from "@/components/hero/backdrop";
import Captions from "@/components/hero/captions";
import LowerThird from "@/components/hero/lower-third";
import { useConversation } from "@/hooks/use-conversation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP, SplitText);

const SESSION_KEY = "lights-up-played";

const Hero = () => {
  const root = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);
  const [greetingDelay] = useState(() =>
    typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) ? 300 : 1600
  );
  const { caption, spokenWords, speaking, busy, ask, phase } = useConversation({
    greetingDelayMs: greetingDelay,
  });

  useGSAP(
    () => {
      setLit(true);
      const skip =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");

      const reveal = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (skip) {
        gsap.set(reveal, { autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo("[data-reveal=stage]", { autoAlpha: 0, filter: "brightness(0.3)" }, {
        autoAlpha: 1,
        filter: "brightness(1)",
        duration: 1.4,
        ease: "power2.out",
        clearProps: "filter",
      }, 0);

      SplitText.create("[data-reveal=title]", {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          gsap.set("[data-reveal=title]", { autoAlpha: 1 });
          return tl.from(self.lines, { yPercent: 105, duration: 1.1, stagger: 0.08 }, 0.3);
        },
      });

      tl.fromTo("[data-reveal=ask]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.95)
        .fromTo("[data-reveal=lower-third]", { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.8 }, 1.2);
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden md:block"
    >
      <Backdrop lit={lit} />

      <div
        data-reveal="stage"
        className="relative h-[52svh] w-full md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[54%]"
      >
        <AvatarStage speaking={speaking} />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-[clamp(20px,4vw,64px)] pb-8 md:min-h-[100svh] md:pb-10 md:pt-28">
        <div className="-mt-16 flex flex-1 flex-col justify-center md:mt-0 md:max-w-[46rem]">
          <h1
            id="hero-title"
            data-reveal="title"
            className="font-display text-[clamp(52px,8.6vw,148px)] font-semibold leading-[0.9] tracking-[-0.01em] [text-wrap:wrap]"
          >
            I build AI products people can talk to.
          </h1>
          <div data-reveal="ask" className="mt-8 md:mt-12">
            <AskBar onAsk={ask} busy={busy} />
          </div>
        </div>

        <div className="mt-10 grid items-end gap-6 md:mt-0 md:grid-cols-[1fr_minmax(0,46ch)_1fr]">
          <div data-reveal="lower-third" className="order-2 md:order-none">
            <LowerThird />
          </div>
          <Captions text={caption} spokenWords={spokenWords} className="order-1 md:order-none" />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {phase === "ready" ? caption : ""}
      </p>
    </section>
  );
};

export default Hero;
