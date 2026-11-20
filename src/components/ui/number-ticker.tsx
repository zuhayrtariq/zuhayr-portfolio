"use client";

import { cn } from "@/lib/utils";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  delay?: number;
  decimalPlaces?: number;
}

const format = (n: number, decimalPlaces: number) =>
  Intl.NumberFormat("en-US", { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }).format(n);

/**
 * A number that counts up when it scrolls into view. Adapted from Magic UI's
 * NumberTicker so that the real value is what the server renders: crawlers,
 * no-JS visitors and reduced-motion visitors read "5.0", never "0".
 */
export function NumberTicker({ value, startValue = 0, delay = 0, className, decimalPlaces = 0, ...props }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(startValue);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: "0px" });

  // Wind back to the start only when the count is going to run, and only while off screen.
  useEffect(() => {
    if (reduced || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;
    ref.current.textContent = format(startValue, decimalPlaces);
    return spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = format(Number(latest.toFixed(decimalPlaces)), decimalPlaces);
    });
  }, [reduced, spring, startValue, decimalPlaces]);

  useEffect(() => {
    if (!inView || reduced) return;
    const timer = window.setTimeout(() => motionValue.set(value), delay * 1000);
    return () => window.clearTimeout(timer);
  }, [inView, reduced, motionValue, value, delay]);

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)} {...props}>
      {format(value, decimalPlaces)}
    </span>
  );
}
