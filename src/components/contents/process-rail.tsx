"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProcessRailProps {
  steps: { title: string; body: string }[];
  className?: string;
}

/**
 * The steps of a project down a rail that fills as you scroll, each numeral
 * lighting when the fill reaches it. Without motion, every step is lit.
 */
const ProcessRail = ({ steps, className }: ProcessRailProps) => {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const list = root.current;
      if (!list) return;
      const q = gsap.utils.selector(list);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        list.dataset.tracked = "";
        gsap.fromTo(
          q("[data-fill]"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 62%", end: "bottom 62%", scrub: 0.4 } }
        );
        q("li").forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 62%",
            end: "max",
            onToggle: (self) => step.toggleAttribute("data-reached", self.isActive),
          });
        });
        return () => {
          delete list.dataset.tracked;
          q("li").forEach((step) => step.removeAttribute("data-reached"));
        };
      });
    },
    { scope: root }
  );

  return (
    <ol ref={root} className={cn("group/rail relative", className)}>
      <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-caption/15">
        <div data-fill className="size-full origin-top bg-signal group-data-tracked/rail:scale-y-0" />
      </div>
      {steps.map((step, i) => (
        <li key={step.title} className="group/step grid grid-cols-[auto_minmax(0,1fr)] gap-x-[clamp(20px,4vw,64px)] pb-16 pl-[clamp(24px,4vw,56px)] last:pb-0 md:pb-24">
          <span
            aria-hidden
            className="w-[0.62em] font-display text-[clamp(96px,12vw,200px)] leading-[0.76] text-signal transition-colors duration-700 ease-[var(--ease-lights)] group-data-tracked/rail:text-caption/15 group-data-tracked/rail:group-data-reached/step:text-signal"
          >
            {i + 1}
          </span>
          <div className="pt-1 md:pt-3">
            <h4 className="font-display text-[clamp(36px,3.6vw,60px)] leading-[0.95]">{step.title}</h4>
            <p className="mt-4 max-w-[44ch] text-body text-fog">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ProcessRail;
