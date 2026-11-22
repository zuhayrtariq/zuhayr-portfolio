"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

/** Broadcast subtitles cap lines at 42 characters; narrow screens fit fewer. */
const MAX_CHARS = 42;
const MIN_CHARS = 24;
const MAX_LINES = 2;
/** Average B612 glyph width, in ems. */
const CHAR_EM = 0.56;

interface CaptionPage {
  lines: string[];
  firstWord: number;
  lastWord: number;
}

const SENTENCE_END = /[.?!]["')\]]*$/;

/** How many lines `words` wrap to, starting on a line that already holds `used` characters. */
const linesNeeded = (words: string[], maxChars: number, used = 0) => {
  let count = 1;
  let length = used;
  for (const word of words) {
    const next = length ? length + 1 + word.length : word.length;
    if (next <= maxChars || !length) {
      length = next;
    } else {
      count += 1;
      length = word.length;
    }
  }
  return count;
};

export const paginateCaptions = (text: string, maxChars = MAX_CHARS): CaptionPage[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const pages: CaptionPage[] = [];
  let lines: string[] = [];
  let line = "";
  let firstWord = 0;

  words.forEach((word, i) => {
    // A sentence that would run off this page, but fits on a page of its own, starts the next
    // one. Otherwise its last word or two can be left alone on a page, and that page is what
    // stays on screen once the speaking stops.
    if (line && SENTENCE_END.test(words[i - 1])) {
      let end = i;
      while (end < words.length - 1 && !SENTENCE_END.test(words[end])) end += 1;
      const sentence = words.slice(i, end + 1);
      const here = lines.length + linesNeeded(sentence, maxChars, line.length);
      if (here > MAX_LINES && linesNeeded(sentence, maxChars) <= MAX_LINES) {
        lines.push(line);
        pages.push({ lines, firstWord, lastWord: i - 1 });
        lines = [];
        line = "";
        firstWord = i;
      }
    }

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
    if (SENTENCE_END.test(word) && lines.length === MAX_LINES - 1 && i < words.length - 1) {
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
        "min-h-[2lh] text-center text-[19px] leading-snug text-caption md:text-lead",
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
