"use client";

import { SITE } from "@/constants/site";
import { CONTACT_TOPIC_EVENT, CONTACT_TOPIC_KEY } from "@/lib/contact-topic";
import { getPlayer, type Utterance } from "@/lib/voice/player";
import { countWords, splitSentences } from "@/lib/voice/sentences";
import { streamTalk, TalkError, type TalkMessage } from "@/lib/voice/talk-stream";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecorder } from "./use-recorder";

export const GREETING = "Hi, I'm Zuhayr. Ask me what I've built, or how I'd build yours.";

const WORDS_PER_SECOND = 2.7;
const SETTLE_MS = 900;

export type ConversationPhase = "waiting" | "greeting" | "ready" | "thinking" | "answering";

export interface ConversationAction {
  kind: "start-project";
  topic: string;
}

export interface TranscriptLine {
  id: string;
  speaker: "visitor" | "zuhayr";
  text: string;
}

interface Segment {
  text: string;
  words: number;
  speech: Promise<Utterance | null>;
}

const friendlyError = (error: unknown) => {
  if (error instanceof TalkError && error.status === 429) return error.message;
  return `I can't answer right now. Email me at ${SITE.email} and I'll get back to you.`;
};

/** Waits as long as it would take to say `words` words, reporting progress. */
const speakSilently = (words: number, onWord: (spoken: number) => void, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const spoken = Math.min(words, Math.floor(((now - startedAt) / 1000) * WORDS_PER_SECOND) + 1);
      onWord(spoken);
      if (spoken >= words || signal.aborted) {
        cancelAnimationFrame(frame);
        resolve();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  });

interface UseConversationOptions {
  /** Delay before the greeting starts, so it lands after the lights come up. */
  greetingDelayMs?: number;
  /** Set false to start the greeting yourself with `startGreeting`. */
  autoGreet?: boolean;
}

export const useConversation = ({ greetingDelayMs = 1600, autoGreet = true }: UseConversationOptions = {}) => {
  const [messages, setMessages] = useState<TalkMessage[]>([]);
  const [phase, setPhase] = useState<ConversationPhase>("waiting");
  const [caption, setCaption] = useState("");
  const [spoken, setSpoken] = useState(0);
  const [question, setQuestion] = useState<string | null>(null);
  const [soundOn, setSoundOnState] = useState(true);
  const [voiceAvailable, setVoiceAvailable] = useState<boolean | null>(null);
  const [action, setAction] = useState<ConversationAction | null>(null);

  const messagesRef = useRef(messages);
  const phaseRef = useRef(phase);
  const soundOnRef = useRef(soundOn);
  const voiceRef = useRef(voiceAvailable);
  const interacted = useRef(false);
  const request = useRef<AbortController | null>(null);
  const greetTimer = useRef(0);
  const greetRequested = useRef(false);
  const pipe = useRef({
    id: 0,
    segments: [] as Segment[],
    processed: 0,
    played: 0,
    spokenBefore: 0,
    playing: false,
    streamDone: false,
    voiced: false,
    abort: new AbortController(),
    settle: 0,
  });

  messagesRef.current = messages;
  phaseRef.current = phase;
  soundOnRef.current = soundOn;
  voiceRef.current = voiceAvailable;

  const fetchSpeech = useCallback(async (text: string, signal: AbortSignal): Promise<Utterance | null> => {
    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal,
      });
      if (res.status === 503) {
        setVoiceAvailable(false);
        return null;
      }
      if (!res.ok) return null;
      setVoiceAvailable(true);
      return (await res.json()) as Utterance;
    } catch {
      return null;
    }
  }, []);

  const finishIfDone = useCallback(() => {
    const p = pipe.current;
    if (!p.streamDone || p.playing || p.played < p.segments.length) return;
    const id = p.id;
    window.clearTimeout(p.settle);
    p.settle = window.setTimeout(() => {
      if (pipe.current.id === id) setPhase("ready");
    }, SETTLE_MS);
  }, []);

  const playQueue = useCallback(async () => {
    const p = pipe.current;
    if (p.playing) return;
    p.playing = true;
    const { id, abort } = p;

    while (p.played < p.segments.length) {
      const segment = p.segments[p.played];
      const utterance = await segment.speech;
      if (pipe.current.id !== id || abort.signal.aborted) return;
      const onWord = (n: number) => {
        if (pipe.current.id === id) setSpoken(p.spokenBefore + n);
      };
      const played = utterance ? await getPlayer().play(utterance, onWord, abort.signal) : false;
      if (!played) await speakSilently(segment.words, onWord, abort.signal);
      if (pipe.current.id !== id || abort.signal.aborted) return;
      p.spokenBefore += segment.words;
      p.played += 1;
    }

    p.playing = false;
    finishIfDone();
  }, [finishIfDone]);

  /** Turns newly completed sentences into segments and keeps the queue playing. */
  const feed = useCallback(
    (text: string, done: boolean) => {
      const p = pipe.current;
      const { sentences } = splitSentences(text, done);
      for (let i = p.processed; i < sentences.length; i++) {
        p.segments.push({
          text: sentences[i],
          words: countWords(sentences[i]),
          speech: p.voiced ? fetchSpeech(sentences[i], p.abort.signal) : Promise.resolve(null),
        });
      }
      p.processed = Math.max(p.processed, sentences.length);
      p.streamDone = done;
      setCaption(p.segments.map((s) => s.text).join(" "));
      void playQueue();
      finishIfDone();
    },
    [fetchSpeech, playQueue, finishIfDone]
  );

  const reset = useCallback((voiced: boolean) => {
    const p = pipe.current;
    p.abort.abort();
    window.clearTimeout(p.settle);
    pipe.current = {
      id: p.id + 1,
      segments: [],
      processed: 0,
      played: 0,
      spokenBefore: 0,
      playing: false,
      streamDone: false,
      voiced,
      abort: new AbortController(),
      settle: 0,
    };
    setSpoken(0);
    setCaption("");
  }, []);

  /** Speaks a local line (greeting or error) as captions, without voice. */
  const say = useCallback(
    (text: string, nextPhase: ConversationPhase) => {
      reset(false);
      setPhase(nextPhase);
      feed(text, true);
    },
    [reset, feed]
  );

  const unlockAudio = useCallback(() => {
    interacted.current = true;
    getPlayer().unlock();
  }, []);

  /**
   * Plays the greeting once, captions only, since browsers block sound before a
   * gesture. Calls after the first are ignored, so it's safe to cue repeatedly.
   */
  const startGreeting = useCallback(
    (delayMs = 0) => {
      if (greetRequested.current) return;
      greetRequested.current = true;
      greetTimer.current = window.setTimeout(() => {
        if (phaseRef.current === "waiting") say(GREETING, "greeting");
      }, delayMs);
    },
    [say]
  );

  useEffect(() => {
    if (autoGreet) startGreeting(greetingDelayMs);
    return () => {
      window.clearTimeout(greetTimer.current);
      greetRequested.current = false;
    };
  }, [autoGreet, greetingDelayMs, startGreeting]);

  useEffect(() => () => request.current?.abort(), []);

  const ask = useCallback(
    async (q: string) => {
      const text = q.trim();
      if (!text) return;
      unlockAudio();
      request.current?.abort();
      const controller = new AbortController();
      request.current = controller;

      const history: TalkMessage[] = [...messagesRef.current, { id: crypto.randomUUID(), role: "user", text }];
      setMessages(history);
      reset(soundOnRef.current && interacted.current && voiceRef.current !== false);
      setQuestion(text);
      setAction(null);
      setPhase("thinking");

      let answer = "";
      try {
        await streamTalk(history, {
          signal: controller.signal,
          onText: (delta) => {
            answer += delta;
            setPhase("answering");
            feed(answer, false);
          },
          onToolOutput: (toolName, output) => {
            if (toolName !== "start_project") return;
            const topic = (output as { topic?: string } | null)?.topic ?? "";
            setAction({ kind: "start-project", topic });
            sessionStorage.setItem(CONTACT_TOPIC_KEY, topic);
            window.dispatchEvent(new CustomEvent(CONTACT_TOPIC_EVENT, { detail: topic }));
          },
        });
        if (controller.signal.aborted) return;
        feed(answer, true);
        if (answer.trim()) {
          setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: answer.trim() }]);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        say(friendlyError(error), "answering");
      }
    },
    [unlockAudio, reset, feed, say]
  );

  const recorder = useRecorder({
    onTranscript: (text) => void ask(text),
    onError: (message) => say(message, "answering"),
  });

  const toggleMic = useCallback(() => {
    unlockAudio();
    if (recorder.state === "idle") {
      request.current?.abort();
      reset(false);
      setPhase("ready");
    }
    recorder.toggle();
  }, [unlockAudio, recorder, reset]);

  const setSoundOn = useCallback(
    (on: boolean) => {
      if (on) unlockAudio();
      setSoundOnState(on);
    },
    [unlockAudio]
  );

  const transcript = useMemo<TranscriptLine[]>(
    () => messages.map((m) => ({ id: m.id, speaker: m.role === "user" ? "visitor" : "zuhayr", text: m.text })),
    [messages]
  );

  return {
    phase,
    caption,
    spokenWords: spoken,
    speaking: phase === "greeting" || phase === "answering",
    busy: phase === "thinking" || recorder.state === "transcribing",
    question,
    ask,
    startGreeting,
    soundOn,
    setSoundOn,
    voiceAvailable,
    mic: { supported: recorder.supported, state: recorder.state, toggle: toggleMic },
    action,
    transcript,
  };
};
