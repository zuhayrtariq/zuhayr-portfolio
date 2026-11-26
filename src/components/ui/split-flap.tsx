"use client";

import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useRef } from "react";

/** The order the characters sit on the drum; a cell turns forward through it to reach the next one. */
const DRUM = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-/+:";
const FLIP_MS = 64;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** The last few characters on the drum before `to`, which the cell passes through on its way there. */
const pathTo = (from: string, to: string, steps: number) => {
  if (from === to) return [];
  const end = Math.max(0, DRUM.indexOf(to));
  const path: string[] = [];
  for (let i = steps - 1; i >= 1; i--) path.push(DRUM[(end - i + DRUM.length * 2) % DRUM.length]);
  path.push(to);
  return path;
};

interface SplitFlapProps {
  text: string;
  /** How many cells the word gets; shorter text is padded, longer is cut. */
  width: number;
  /** Start turning. Until this is true the cells sit blank, if they were off screen when the page loaded. */
  play?: boolean;
  /** Milliseconds before the first cell moves. */
  delay?: number;
  className?: string;
}

/**
 * A row of split-flap cells, as on a station or airport board. The server renders the final
 * text, so it is readable with no JavaScript; in the browser the row blanks itself while it
 * is still below the screen and turns to its text when it arrives.
 */
const SplitFlap = ({ text, width, play = true, delay = 0, className }: SplitFlapProps) => {
  const root = useRef<HTMLSpanElement>(null);
  const shown = useRef<string[]>([]);
  const run = useRef(0);
  const target = text.toUpperCase().padEnd(width).slice(0, width);

  const set = (cell: Element, char: string) => {
    const [top, bottom] = cell.children;
    (top.firstChild as HTMLElement).textContent = char;
    (bottom.firstChild as HTMLElement).textContent = char;
  };

  // Blank the row before it has been seen, so its arrival is the first thing it does.
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    shown.current = target.split("");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    [...el.children].forEach((cell) => set(cell, " "));
    shown.current = Array(width).fill(" ");
    // Only on mount: later changes of text are turned to, not blanked.
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !play) return;
    const cells = [...el.children] as HTMLElement[];
    const id = ++run.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const flip = (cell: HTMLElement, from: string, to: string) =>
      new Promise<void>((resolve) => {
        const [top, bottom, leaf] = cell.children as unknown as HTMLElement[];
        const face = leaf.firstChild as HTMLElement;
        // The new character is already behind the falling leaf.
        (top.firstChild as HTMLElement).textContent = to;
        face.textContent = from;
        leaf.dataset.half = "top";
        leaf.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }], {
          duration: FLIP_MS / 2,
          easing: "ease-in",
        }).onfinish = () => {
          face.textContent = to;
          leaf.dataset.half = "bottom";
          leaf.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }], {
            duration: FLIP_MS / 2,
            easing: "ease-out",
          }).onfinish = () => {
            (bottom.firstChild as HTMLElement).textContent = to;
            delete leaf.dataset.half;
            resolve();
          };
        };
      });

    cells.forEach(async (cell, i) => {
      const to = target[i];
      if (reduced) {
        set(cell, to);
        shown.current[i] = to;
        return;
      }
      await new Promise((r) => window.setTimeout(r, delay + i * 26));
      // A longer run for cells further along, so the row settles from left to right.
      for (const next of pathTo(shown.current[i], to, 3 + (i % 5))) {
        if (run.current !== id) return;
        await flip(cell, shown.current[i], next);
        shown.current[i] = next;
      }
    });
  }, [target, play, delay, width]);

  return (
    <span ref={root} aria-hidden className={cn("inline-flex gap-[0.13em]", className)}>
      {target.split("").map((char, i) => (
        <span key={i} className="flap">
          <span className="flap-top">
            <i>{char}</i>
          </span>
          <span className="flap-bottom">
            <i>{char}</i>
          </span>
          <span className="flap-leaf">
            <i />
          </span>
        </span>
      ))}
    </span>
  );
};

export default SplitFlap;
