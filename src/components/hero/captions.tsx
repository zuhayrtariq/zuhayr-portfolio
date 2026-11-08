"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";

const MAX_CHARS = 42;
const MAX_LINES = 2;

interface CaptionPage {
  lines: string[];
  firstWord: number;
  lastWord: number;
}

export const paginateCaptions = (text: string): CaptionPage[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const pages: CaptionPage[] = [];
  let lines: string[] = [];
  let line = "";
  let firstWord = 0;

  words.forEach((word, i) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= MAX_CHARS || !line) {
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
    // Start a new page after sentence ends that close out a full line.
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
  const pages = useMemo(() => paginateCaptions(text), [text]);
  const current = Math.max(0, spokenWords - 1);
  const page =
    spokenWords > 0
      ? pages.find((p) => current >= p.firstWord && current <= p.lastWord) ?? pages.at(-1)
      : undefined;

  return (
    <p
      aria-hidden
      className={cn(
        "min-h-[2lh] text-center text-lead leading-snug text-caption [text-shadow:0_1px_2px_rgb(17_25_27/0.9),0_0_24px_rgb(17_25_27/0.6)]",
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
