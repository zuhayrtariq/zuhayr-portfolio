"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

/** Broadcast subtitles cap lines at 42 characters; narrow screens fit fewer. */
const MAX_CHARS = 42;
const MIN_CHARS = 24;
const MAX_LINES = 2;
/** Average Atkinson Hyperlegible glyph width, in ems. */
const CHAR_EM = 0.52;

interface CaptionPage {
  lines: string[];
  firstWord: number;
  lastWord: number;
}

export const paginateCaptions = (text: string, maxChars = MAX_CHARS): CaptionPage[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const pages: CaptionPage[] = [];
  let lines: string[] = [];
  let line = "";
  let firstWord = 0;

  words.forEach((word, i) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
      if (lines.length === MAX_LINES) {
        pages.push({ lines, firstWord, lastWord: i - 1 });
        lines = [];
        firstWord = i;
      }
    }
    // A sentence that ends a page's last line closes the page, so the next one starts fresh.
    if (/[.?!]$/.test(word) && lines.length === MAX_LINES - 1 && i < words.length - 1) {
      lines.push(line);
      pages.push({ lines, firstWord, lastWord: i });
      lines = [];
      line = "";
      firstWord = i + 1;
    }
  });

  if (line) lines.push(line);
  if (lines.length) pages.push({ lines, firstWord, lastWord: words.length - 1 });
  return pages;
};

interface CaptionsProps {
  text: string;
  /** How many words have been spoken so far. */
  spokenWords: number;
  className?: string;
}

const Captions = ({ text, spokenWords, className }: CaptionsProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [maxChars, setMaxChars] = useState(MAX_CHARS);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const charWidth = parseFloat(getComputedStyle(el).fontSize) * CHAR_EM;
      const fits = Math.floor(el.clientWidth / charWidth);
      setMaxChars(Math.max(MIN_CHARS, Math.min(MAX_CHARS, fits)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pages = useMemo(() => paginateCaptions(text, maxChars), [text, maxChars]);
  const current = Math.max(0, spokenWords - 1);
  const page =
    spokenWords > 0
      ? pages.find((p) => current >= p.firstWord && current <= p.lastWord) ?? pages.at(-1)
      : undefined;

  return (
    <p
      ref={ref}
      aria-hidden
      className={cn(
        "min-h-[2lh] text-center text-[20px] leading-snug text-caption [text-shadow:0_1px_2px_rgb(17_25_27/0.9),0_0_24px_rgb(17_25_27/0.6)] md:text-lead",
        className
      )}
    >
      {page?.lines.map((line, i) => (
        <span key={`${page.firstWord}-${i}`} className="block">
          {line}
        </span>
      ))}
    </p>
  );
};

export default Captions;
