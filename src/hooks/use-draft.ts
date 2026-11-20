"use client";

import { parseDraft } from "@/lib/draft";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type DraftStatus =
  /** Nothing has been asked for yet. */
  | "idle"
  | "writing"
  | "done"
  /** The site's AI has no key, so the idea goes to Zuhayr instead. */
  | "offline"
  | "error";

export interface DraftExample {
  idea: string;
  /** A finished draft under /public, in the format the model writes. */
  file: string;
}

/** How fast an example is played back, in characters a second: the brief is read, the styles are skipped, the screen is watched. */
const PACE = { brief: 190, styles: 6000, screen: 800 };

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      window.clearTimeout(timer);
      reject(signal.reason);
    });
  });

/**
 * A draft of a visitor's product: a brief and a first screen, read from a
 * stream of text as it arrives. Examples are finished drafts played back at a
 * watchable pace; anything typed goes to the model.
 */
export const useDraft = () => {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<DraftStatus>("idle");
  /** The idea the draft on show was written for, and where that draft came from. */
  const [shown, setShown] = useState<{ idea: string; source: "example" | "live" }>({ idea: "", source: "example" });
  /** True while a new draft has been asked for and the one on show is still the last one. */
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const run = useRef<AbortController | null>(null);
  /** The last draft that finished, to go back to if the next one fails part-way. */
  const kept = useRef({ text: "", shown });

  const begin = () => {
    run.current?.abort();
    const controller = new AbortController();
    run.current = controller;
    setError("");
    setStatus("writing");
    return controller.signal;
  };

  /** Plays a finished example. `instant` shows it whole, for visitors who asked for no motion. */
  const play = useCallback(async (example: DraftExample, instant = false) => {
    const signal = begin();
    setText("");
    setWaiting(false);
    setShown({ idea: example.idea, source: "example" });
    try {
      const res = await fetch(example.file, { signal });
      if (!res.ok) throw new Error("missing example");
      const full = await res.text();
      if (!instant) {
        const screenAt = full.indexOf("\nSCREEN:");
        const stylesEnd = full.indexOf("</style>");
        let at = 0;
        let last = performance.now();
        while (at < full.length) {
          await wait(40, signal);
          const now = performance.now();
          const pace = at < screenAt ? PACE.brief : at < stylesEnd ? PACE.styles : PACE.screen;
          at = Math.min(full.length, at + Math.max(1, Math.round((pace * (now - last)) / 1000)));
          last = now;
          setText(full.slice(0, at));
        }
      }
      setText(full);
      kept.current = { text: full, shown: { idea: example.idea, source: "example" } };
      setStatus("done");
    } catch {
      if (!signal.aborted) setStatus("idle");
    }
  }, []);

  /**
   * Sends an idea to the model and reads the draft as it is written. The draft
   * on show stays until the new one starts arriving, so a failure leaves the
   * page as it was.
   */
  const draft = useCallback(async (nextIdea: string) => {
    const signal = begin();
    setWaiting(true);
    const startedAt = performance.now();
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: nextIdea }),
        signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "");
        setWaiting(false);
        setStatus(res.status === 503 ? "offline" : "error");
        return;
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let full = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!full) {
          setShown({ idea: nextIdea, source: "live" });
          setWaiting(false);
        }
        full += value;
        setText(full);
      }
      setSeconds(Math.round((performance.now() - startedAt) / 1000));
      // A reply that never became a brief is a failure, however politely it ended.
      const written = parseDraft(full);
      if (!written.name && !written.decline) throw new Error("no brief");
      kept.current = { text: full, shown: { idea: nextIdea, source: "live" } };
      setStatus("done");
    } catch {
      if (signal.aborted) return;
      // Half a draft is worse than the last whole one.
      setText(kept.current.text);
      setShown(kept.current.shown);
      setWaiting(false);
      setStatus("error");
    }
  }, []);

  useEffect(() => () => run.current?.abort(), []);

  const parsed = useMemo(() => parseDraft(text), [text]);
  return { draft: parsed, status, shown, waiting, error, seconds, play, start: draft };
};
