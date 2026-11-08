"use client";

import { askAiHref } from "@/constants/site";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSpeechClock } from "./use-speech-clock";

export const GREETING =
  "Hi, I'm Zuhayr. Ask me what I've built, or how I'd build yours.";

export type ConversationPhase = "waiting" | "greeting" | "ready" | "thinking" | "answering";

interface UseConversationOptions {
  /** Delay before the greeting starts, so it lands after the lights come up. */
  greetingDelayMs?: number;
}

export const useConversation = ({ greetingDelayMs = 1600 }: UseConversationOptions = {}) => {
  const router = useRouter();
  const [phase, setPhase] = useState<ConversationPhase>("waiting");
  const [caption, setCaption] = useState(GREETING);
  const [question, setQuestion] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setPhase("greeting"), greetingDelayMs);
    return () => window.clearTimeout(t);
  }, [greetingDelayMs]);

  const speaking = phase === "greeting" || phase === "answering";
  const spokenWords = useSpeechClock(caption, speaking);
  const totalWords = caption.trim().split(/\s+/).length;

  useEffect(() => {
    if (speaking && spokenWords >= totalWords) {
      const t = window.setTimeout(() => setPhase("ready"), 900);
      return () => window.clearTimeout(t);
    }
  }, [speaking, spokenWords, totalWords]);

  const ask = useCallback(
    (q: string) => {
      setQuestion(q);
      setPhase("thinking");
      router.push(askAiHref(q));
    },
    [router]
  );

  return {
    phase,
    caption,
    setCaption,
    question,
    spokenWords: phase === "waiting" ? 0 : spokenWords,
    speaking,
    busy: phase === "thinking",
    ask,
  };
};
