"use client";

import AskBar from "@/components/hero/ask-bar";
import AvatarStage from "@/components/hero/avatar-stage";
import Backdrop from "@/components/hero/backdrop";
import Captions from "@/components/hero/captions";
import { useConversation } from "@/hooks/use-conversation";
import { cn } from "@/lib/utils";
import { Volume2Icon, VolumeXIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const TALK_SUGGESTIONS = [
  "What have you shipped recently?",
  "How do you usually start a project?",
];

const TalkView = () => {
  const [showTranscript, setShowTranscript] = useState(false);
  const asked = useRef(false);
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
    <section aria-labelledby="talk-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <h1 id="talk-title" className="sr-only">
        Talk to Zuhayr
      </h1>
      <Backdrop />

      <div className="relative mx-auto h-[50svh] w-full max-w-3xl md:absolute md:inset-x-0 md:top-0 md:h-[78svh]">
        <AvatarStage speaking={speaking} />
      </div>

      <div className="relative mt-auto flex flex-col items-center px-[clamp(20px,4vw,64px)] pb-10 pt-6 md:pb-12">
        {question && phase !== "waiting" && (
          <p className="mb-3 max-w-[46ch] text-center text-ui text-fog">You asked: {question}</p>
        )}
        <Captions text={caption} spokenWords={spokenWords} className="max-w-[46ch] md:text-[30px]" />

        {action && phase === "ready" && (
          <Link
            href="/#contact"
            className="mt-6 inline-flex h-13 items-center rounded-full bg-caption px-8 text-ui font-bold text-umbra transition-colors hover:bg-signal"
          >
            Start a project
          </Link>
        )}

        <AskBar
          onAsk={ask}
          busy={busy}
          onMic={mic.supported ? mic.toggle : undefined}
          listening={mic.state === "listening"}
          suggestions={transcript.length ? [] : TALK_SUGGESTIONS}
          className="mt-8"
        />
        <p className="mt-3 h-5 text-fine text-fog" aria-live="polite">
          {mic.state === "listening" ? "Listening. Tap the mic when you're done." : mic.state === "transcribing" ? "Got it, one moment." : ""}
        </p>

        <div className="mt-4 flex gap-6 text-ui text-fog">
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

      <aside
        aria-label="Transcript"
        className={cn(
          "fixed inset-y-0 right-0 z-[60] w-full max-w-md overflow-y-auto bg-umbra px-8 pb-12 pt-24 transition-transform duration-300 ease-[var(--ease-lights)]",
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
        <h2 className="font-display text-q-sm leading-none font-semibold">Transcript</h2>
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
