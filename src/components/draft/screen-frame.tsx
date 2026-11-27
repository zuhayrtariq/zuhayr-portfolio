"use client";

import { SCREEN_HEIGHT, SCREEN_WIDTH, screenDocument, screenIsDrawable } from "@/lib/draft";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

/** While the screen is still being written, it is redrawn at most this often. */
const REDRAW_MS = 550;

interface ScreenFrameProps {
  /** The screen's markup so far. */
  screen: string;
  /** True once the whole screen has been written. */
  done: boolean;
  /** Says what the picture is, for anyone who cannot see it. */
  label: string;
  className?: string;
}

/**
 * Until the frame has been measured, it is scaled to its box by the stylesheet alone: the
 * box's width over the screen's, as a plain number. That is what the server sends, so a
 * screen that is already written is on the page before any script has run.
 */
const FIT = `scale(tan(atan2(100cqw, ${SCREEN_WIDTH}px)))`;

/**
 * Draws a drafted screen while it is being written. The markup comes from a
 * model, so it lives in a frame that runs no scripts and can load nothing.
 * Two frames take turns: each new version loads behind the one on show and is
 * swapped in once it is ready, so the picture grows without flashing.
 */
const ScreenFrame = ({ screen, done, label, className }: ScreenFrameProps) => {
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  /** A screen that is whole when the page is made goes straight into the first frame. */
  const [first] = useState(() => (screenIsDrawable(screen) ? screenDocument(screen) : ""));
  const [slots, setSlots] = useState<[string, string]>([first, ""]);
  const [front, setFront] = useState<0 | 1>(0);
  const state = useRef({ latest: first, shown: first, loading: false, wroteAt: 0, timer: 0, front: 0 as 0 | 1 });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / SCREEN_WIDTH);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const flush = useCallback((now: boolean) => {
    const s = state.current;
    window.clearTimeout(s.timer);
    if (s.loading || s.latest === s.shown) return;
    const wait = REDRAW_MS - (performance.now() - s.wroteAt);
    if (!now && wait > 0) {
      s.timer = window.setTimeout(() => flush(false), wait);
      return;
    }
    const back = s.front === 0 ? 1 : 0;
    const next = s.latest;
    s.loading = true;
    s.shown = next;
    s.wroteAt = performance.now();
    setSlots((current) => (back === 0 ? [next, current[1]] : [current[0], next]));
  }, []);

  useEffect(() => {
    const s = state.current;
    const drawable = screenIsDrawable(screen);
    s.latest = drawable ? screenDocument(screen) : "";
    if (!drawable) {
      // A new draft has started: clear both frames at once.
      window.clearTimeout(s.timer);
      s.loading = false;
      s.shown = "";
      setSlots(["", ""]);
      return;
    }
    flush(done);
  }, [screen, done, flush]);

  useEffect(() => {
    const s = state.current;
    return () => window.clearTimeout(s.timer);
  }, []);

  const onLoad = (slot: 0 | 1) => {
    const s = state.current;
    if (!s.loading || slot === s.front) return;
    s.loading = false;
    s.front = slot;
    setFront(slot);
    flush(false);
  };

  return (
    <div
      ref={host}
      role="img"
      aria-label={label}
      className={cn("@container relative overflow-hidden bg-ink", className)}
      style={{ aspectRatio: `${SCREEN_WIDTH} / ${SCREEN_HEIGHT}` }}
    >
      {([0, 1] as const).map((slot) => (
        <iframe
          key={slot}
          title=""
          aria-hidden
          tabIndex={-1}
          inert
          sandbox=""
          srcDoc={slots[slot]}
          onLoad={() => onLoad(slot)}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          className={cn("pointer-events-none absolute left-0 top-0 origin-top-left border-0", slot === front && slots[slot] ? "visible" : "invisible")}
          style={{ transform: scale ? `scale(${scale})` : FIT }}
        />
      ))}
    </div>
  );
};

export default ScreenFrame;
