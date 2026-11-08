"use client";

import { useEffect, useState } from "react";

const WORDS_PER_SECOND = 2.7;

/**
 * Estimates how many words of `text` have been spoken, at a natural speaking
 * pace, while `running` is true. Used for captions when there is no audio clock.
 */
export const useSpeechClock = (text: string, running: boolean, delayMs = 0) => {
  const [spoken, setSpoken] = useState(0);

  useEffect(() => {
    const total = text.trim() ? text.trim().split(/\s+/).length : 0;
    if (!running || total === 0) return;

    let frame = 0;
    let startedAt = 0;
    const tick = (now: number) => {
      if (!startedAt) startedAt = now + delayMs;
      const elapsed = Math.max(0, now - startedAt) / 1000;
      const next = Math.min(total, Math.floor(elapsed * WORDS_PER_SECOND) + (now >= startedAt ? 1 : 0));
      setSpoken((prev) => (prev === next ? prev : next));
      if (next < total) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, running, delayMs]);

  useEffect(() => {
    setSpoken(0);
  }, [text]);

  return spoken;
};
