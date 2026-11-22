"use client";

import FlightCanvas from "@/components/flight/flight-canvas";
import type { FlightHandle } from "@/components/flight/scene";
import AskBar from "@/components/hero/ask-bar";
import Captions from "@/components/hero/captions";
import Sign from "@/components/ui/sign";
import { WHY_QUESTION } from "@/constants/faq";
import { useConversation } from "@/hooks/use-conversation";
import { cn } from "@/lib/utils";
import { Volume2Icon, VolumeXIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const TALK_SUGGESTIONS = [WHY_QUESTION, "What have you shipped recently?", "How do you usually start a project?"];

/** Where in the flight the page sits: level in the cruise, the airliner ahead. */
const CRUISE = 0.57;

/**
 * A conversation with his AI, held in the cruise: the same flight as the home page, level
 * above the cloud, with what he says on a plate in front of it.
 */
const TalkView = () => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [sky, setSky] = useState<"waiting" | "live" | "flat">("waiting");
  const flight = useRef<FlightHandle | null>(null);
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

  const onReady = useCallback(() => {
    flight.current?.setProgress(CRUISE);
    setSky("live");
  }, []);
  const onUnavailable = useCallback(() => setSky("flat"), []);

  return (
    <section aria-labelledby="talk-title" className="on-night relative isolate flex min-h-svh flex-col overflow-hidden bg-[#0b27b4]">
      <h1 id="talk-title" className="sr-only">
        Talk to Zuhayr
      </h1>
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b27b4_0%,#3c68ee_42%,#b4cfff_56%,#e9f0ff_70%,#8ea6ee_100%)]" />
        {sky !== "flat" && (
          <FlightCanvas
            handle={flight}
            onReady={onReady}
            onUnavailable={onUnavailable}
            lift={0.043}
            className={cn("absolute inset-0 transition-opacity duration-1000", sky === "live" ? "opacity-100" : "opacity-0")}
          />
        )}
      </div>

      <div className="relative mt-auto w-full max-w-[calc(40rem+2*clamp(20px,4vw,64px))] px-[clamp(20px,4vw,64px)] pb-8 pt-28 md:pb-12 2xl:ml-[max(0px,calc((100vw-1680px)/2))]">
        <div className="overflow-hidden rounded-xl bg-night/90 shadow-[0_40px_90px_-40px_rgb(4_11_34/0.9)]">
          <p className="flex items-center gap-3 bg-sun px-4 py-2.5 text-fine font-bold text-night">
            <span
              aria-hidden
              className={cn(
                "block size-8 shrink-0 overflow-hidden rounded-full bg-cobalt ring-2 transition-[--tw-ring-color] duration-300",
                speaking ? "ring-night" : "ring-night/25"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
              <img src="/images/avatar.webp" alt="" width={32} height={32} decoding="async" className="size-full max-w-none" />
            </span>
            Zuhayr&apos;s AI, answering from his record
          </p>
          <div className="p-5 sm:p-7">
            {question && phase !== "waiting" && <p className="mb-3 text-fine text-fog">You asked: {question}</p>}
            <Captions text={caption} spokenWords={spokenWords} className="min-h-[3lh] text-left md:text-[26px]" />

            {action && phase === "ready" && (
              <Sign href="/#contact" className="mt-5">
                Start a project
              </Sign>
            )}

            <AskBar
              onAsk={ask}
              busy={busy}
              onMic={mic.supported ? mic.toggle : undefined}
              listening={mic.state === "listening"}
              suggestions={transcript.length ? [] : TALK_SUGGESTIONS}
              className="mt-6 max-w-none"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-fine text-fog">
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
      </div>

      <aside
        aria-label="Transcript"
        className={cn(
          "fixed inset-y-0 right-0 z-[60] w-full max-w-md overflow-y-auto bg-night px-8 pb-12 pt-24 transition-transform duration-300 ease-[var(--ease-lights)]",
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
