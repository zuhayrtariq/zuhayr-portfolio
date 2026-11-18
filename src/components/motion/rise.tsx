"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type ElementType, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface RiseProps {
  as?: ElementType;
  /** "lines" lifts each line out of a mask; "block" lifts the whole element. */
  by?: "lines" | "block";
  delay?: number;
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Text that rises into place the first time it scrolls into view. Without
 * motion, or without JS, it is simply there.
 */
const Rise = ({ as: Tag = "div", by = "block", delay = 0, id, className, children }: RiseProps) => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scrollTrigger = { trigger: el, start: "top 88%", once: true };
        if (by === "block") {
          gsap.from(el, { y: 36, autoAlpha: 0, duration: 1, delay, ease: "expo.out", scrollTrigger });
          return;
        }
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 110, duration: 1.2, delay, stagger: 0.09, ease: "expo.out", scrollTrigger }),
        });
        return () => split.revert();
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} id={id} className={cn(by === "lines" && "[&>div]:-mb-[0.16em] [&>div]:pb-[0.16em]", className)}>
      {children}
    </Tag>
  );
};

export default Rise;
