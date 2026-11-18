"use client";

import { SKILLS } from "@/constants/skills";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const group = (title: string) => SKILLS.find((g) => g.title === title)?.stack ?? [];

const ROWS = [
  { title: "Product engineering", stack: group("Product engineering") },
  { title: "Data", stack: group("Data") },
  { title: "AI and agents", stack: group("AI and agents") },
  {
    title: "Payments, voice and shipping",
    stack: [...group("Payments and auth"), ...group("Voice"), ...group("Shipping")],
  },
];

/** "the Vercel AI SDK" reads well in a sentence; a wall of names wants the bare name. */
const bare = (name: string) => name.replace(/^the /, "");

/**
 * The stack as four lines of type that slide against each other as the page
 * scrolls. Without motion the lines wrap, so nothing is ever cut off.
 */
const MySkills = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        section.dataset.drift = "";
        gsap.utils.toArray<HTMLElement>("[data-row]", section).forEach((row, i) => {
          const travel = () => Math.max(0, row.scrollWidth - window.innerWidth);
          const leftward = i % 2 === 0;
          gsap.fromTo(
            row,
            { x: () => (leftward ? 0 : -travel()) },
            {
              x: () => (leftward ? -travel() : 0),
              ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true },
            }
          );
        });
        return () => {
          delete section.dataset.drift;
        };
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="stack" aria-labelledby="stack-title" className="on-paper group overflow-hidden pb-28 pt-16 md:pb-44 md:pt-24">
      <h2
        id="stack-title"
        className="px-[clamp(20px,4vw,64px)] font-display text-[clamp(52px,5.6vw,96px)] leading-[0.9]"
      >
        What I build with
      </h2>
      <div className="mt-12 space-y-10 md:mt-16 md:space-y-6">
        {ROWS.map((row, i) => (
          <div key={row.title}>
            <h3 className="px-[clamp(20px,4vw,64px)] font-text text-ui font-bold text-fog">{row.title}</h3>
            <ul
              data-row
              className={cn(
                "mt-1 flex flex-wrap items-center gap-x-[0.3em] px-[clamp(20px,4vw,64px)] font-display text-[clamp(44px,8.4vw,150px)] leading-[1.02] group-data-drift:w-max group-data-drift:flex-nowrap group-data-drift:whitespace-nowrap group-data-drift:will-change-transform",
                i % 2 === 1 && "text-outline"
              )}
            >
              {row.stack.map((name, n) => (
                <li key={name} className="flex items-center gap-x-[0.3em]">
                  {n > 0 && <span aria-hidden className="size-[0.11em] shrink-0 rounded-full bg-signal" />}
                  {bare(name)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MySkills;
