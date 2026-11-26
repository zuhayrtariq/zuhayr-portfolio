"use client";

import AskBar from "@/components/hero/ask-bar";
import Captions from "@/components/hero/captions";
import { useAudience } from "@/components/site/audience";
import HireSign from "@/components/site/hire-sign";
import { WHY_QUESTION } from "@/constants/faq";
import { useConversation } from "@/hooks/use-conversation";
import { cn } from "@/lib/utils";
import { Volume2Icon, VolumeXIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TALK_SUGGESTIONS = {
  direct: [WHY_QUESTION, "What have you shipped recently?", "How do you usually start a project?"],
  // A client reading proposals is about to interview him, so these are the questions an interview opens with.
  upwork: ["How do I know the project will get finished?", "What happens if something breaks after launch?", WHY_QUESTION],
};

/**
 * A conversation with his AI. Nothing is on the page but what he says, set large in his own
 * voice, and the box to ask the next thing in.
 */
const TalkView = () => {
  const [showTranscript, setShowTranscript] = useState(false);
  const asked = useRef(false);
  const audience = useAudience();
  const { caption, spokenWords, speaking, busy, ask, phase, soundOn, setSoundOn, mic, action, transcript, question } =
    useConversation({ greetingDelayMs: 600 });

  // Read ?q= after mount (not with useSearchParams) so the page still renders on the server.
  useEffect(() => {
    if (asked.current) return;
    asked.current = true;
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q") ?? params.get("query");
    if (initial) void ask(initial);
  }, [ask]);

  return (
    <section aria-labelledby="talk-title" className="on-emerald relative flex min-h-svh flex-col bg-emerald">
      <h1 id="talk-title" className="sr-only">
        Talk to Zuhayr
      </h1>

      <div className="mx-auto my-auto w-full max-w-[1680px] px-[clamp(20px,4vw,64px)] pb-10 pt-28">
        <div className="max-w-[60rem]">
          <p className="flex items-center gap-3.5 text-fine font-bold">
            <span
              aria-hidden
              className={cn(
                "block size-12 shrink-0 overflow-hidden rounded-full bg-pine ring-[3px] transition-[--tw-ring-color] duration-300",
                speaking ? "ring-mint" : "ring-white/30"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
              <img src="/images/avatar.webp" alt="" width={48} height={48} decoding="async" className="size-full max-w-none" />
            </span>
            Zuhayr&apos;s AI, answering from his record
          </p>

          <p className="mt-8 min-h-6 text-fine text-fog">{question && phase !== "waiting" ? `You asked: ${question}` : ""}</p>
          <Captions
            text={caption}
            spokenWords={spokenWords}
            className="mt-3 min-h-[2lh] text-left font-display text-[clamp(22px,3.4vw,50px)] font-black leading-[1.06] tracking-[-0.03em] md:text-[clamp(22px,3.4vw,50px)]"
          />

          {action && phase === "ready" && <HireSign className="mt-7" />}

          <AskBar
            onAsk={ask}
            busy={busy}
            onMic={mic.supported ? mic.toggle : undefined}
            listening={mic.state === "listening"}
            suggestions={transcript.length ? [] : TALK_SUGGESTIONS[audience]}
            className="mt-9 max-w-2xl"
          />
          <div className="mt-3 flex max-w-2xl flex-wrap items-center justify-between gap-x-6 gap-y-2 text-fine text-fog">
            <p className="min-h-5" aria-live="polite">
              {mic.state === "listening"
                ? "Listening. Tap the mic when you're done."
                : mic.state === "transcribing"
                  ? "Got it, one moment."
                  : ""}
            </p>
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => setSoundOn(!soundOn)}
                aria-pressed={soundOn}
                className="inline-flex items-center gap-2 transition-colors hover:text-caption"
              >
                {soundOn ? <Volume2Icon className="size-4" /> : <VolumeXIcon className="size-4" />}
                {soundOn ? "Sound on" : "Sound off"}
              </button>
              <button
                type="button"
                onClick={() => setShowTranscript(true)}
                disabled={!transcript.length}
                className="transition-colors hover:text-caption disabled:opacity-40"
              >
                Transcript
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside
        aria-label="Transcript"
        className={cn(
          "on-pine fixed inset-y-0 right-0 z-[60] w-full max-w-md overflow-y-auto bg-pine px-8 pb-12 pt-24 transition-transform duration-300 ease-[var(--ease-lights)]",
          showTranscript ? "translate-x-0" : "translate-x-full"
        )}
        data-lenis-prevent
        inert={!showTranscript}
      >
        <button
          type="button"
          onClick={() => setShowTranscript(false)}
          aria-label="Close transcript"
          className="absolute right-6 top-6 inline-flex size-11 items-center justify-center text-fog hover:text-caption"
        >
          <XIcon className="size-5" />
        </button>
        <h2 className="text-q-sm">Transcript</h2>
        <ol className="mt-8 space-y-6">
          {transcript.map((line) => (
            <li key={line.id}>
              <p className="text-fine text-fog">{line.speaker === "visitor" ? "You" : "Zuhayr"}</p>
              <p className={cn("text-body", line.speaker === "visitor" ? "text-fog" : "text-caption")}>{line.text}</p>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  );
};

export default TalkView;
