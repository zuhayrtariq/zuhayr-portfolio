"use client";

import AskBar from "@/components/hero/ask-bar";
import Captions from "@/components/hero/captions";
import { useAudience } from "@/components/site/audience";
import HireSign from "@/components/site/hire-sign";
import Window from "@/components/ui/window";
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

/** Where the conversation goes once his AI has been asked: to him. */
const THEN = {
  direct: "Ask the hard questions here first, then ask me.",
  upwork: "Ask the hard questions here first, then ask me on Upwork.",
};

/**
 * A conversation with his AI, set as the thing a client hiring someone remote will do next: a
 * call. One window holds who is speaking, what is being said as captions, and the place to
 * ask the next thing, by typing or out loud. Beside it are the questions worth starting with.
 */
const TalkView = () => {
  const [showTranscript, setShowTranscript] = useState(false);
  const asked = useRef(false);
  const audience = useAudience();
  const { caption, spokenWords, speaking, busy, ask, phase, soundOn, setSoundOn, voiceAvailable, mic, action, transcript, question } =
    useConversation({ greetingDelayMs: 600 });

  // Read ?q= after mount (not with useSearchParams) so the page still renders on the server.
  useEffect(() => {
    if (asked.current) return;
    asked.current = true;
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q") ?? params.get("query");
    if (initial) void ask(initial);
  }, [ask]);

  /** What the call is doing, for the window's bar. Nothing is shown while it waits for a question. */
  const state =
    mic.state === "listening"
      ? { label: "Listening", dot: "bg-mint motion-safe:animate-pulse" }
      : busy
        ? { label: "Thinking", dot: "bg-wait motion-safe:animate-pulse" }
        : speaking
          ? { label: "Speaking", dot: "bg-mint" }
          : null;

  return (
    <section aria-labelledby="talk-title" className="on-brand relative flex min-h-svh flex-col bg-brand">
      <div className="mx-auto my-auto grid w-full max-w-[1680px] grid-cols-[minmax(0,1fr)] gap-x-14 gap-y-7 px-[clamp(20px,4vw,64px)] pb-10 pt-24 md:pt-28 lg:grid-cols-12 lg:items-center">
        {/* On a narrow screen the call sits between the invitation and the questions. */}
        <div className="max-lg:contents lg:col-span-5">
          <div className="order-1">
            <h1 id="talk-title" className="text-[clamp(30px,4.3vw,70px)]">
              Ask my AI what you&apos;d ask me.
            </h1>
            <p className="mt-4 max-w-[42ch] text-ui text-fog sm:text-body lg:mt-6">
              It knows my work, my record and how I run a project, and it answers out loud. {THEN[audience]}
            </p>
          </div>

          <div className="order-3 lg:mt-9">
            <p id="talk-starters" className="text-fine font-bold">
              Start with one of these
            </p>
            <ul aria-labelledby="talk-starters" className="mt-2.5 border-t border-white/25">
              {TALK_SUGGESTIONS[audience].map((suggestion) => (
                <li key={suggestion} className="border-b border-white/25">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void ask(suggestion)}
                    className="flex min-h-13 w-full items-center py-3 text-left text-ui transition-colors hover:text-mint disabled:opacity-50 sm:text-body"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
            {/* The way on appears once he has been asked about working together. Its room is kept, so nothing above it moves. */}
            <div className="mt-7 min-h-13">{action && phase === "ready" && <HireSign />}</div>
          </div>
        </div>

        <div className="@container order-2 text-[15px] sm:text-[16px] lg:col-span-7">
          <Window
            title="Zuhayr's AI"
            status={
              state && (
                <span className="flex items-center gap-[0.6em] font-mono">
                  <i aria-hidden className={cn("size-[0.6em] rounded-full", state.dot)} />
                  {state.label}
                </span>
              )
            }
          >
            {/* Who is speaking, and what is being said. The picture starts under the label, and beside it only once the window is wide enough for both. */}
            <div className="relative flex h-[clamp(13rem,34svh,18rem)] flex-col items-center px-4 pb-4 pt-11 sm:px-6 lg:h-[clamp(14.5rem,calc(100svh-27.5rem),27rem)] @min-[44rem]:pt-5">
              <p className="absolute left-4 top-3.5 flex items-center gap-2.5 font-mono text-[13px] leading-none text-fog">
                <span aria-hidden className={cn("flex h-3.5 items-end gap-[3px] transition-colors duration-300", speaking ? "text-mint" : "text-fog/60")}>
                  {[0, 1, 2, 3].map((bar) => (
                    <i
                      key={bar}
                      style={{ animationDelay: `${bar * 130}ms` }}
                      className={cn(
                        "w-[3px] origin-bottom rounded-full bg-current",
                        speaking ? "h-full motion-safe:animate-[voice_0.85s_ease-in-out_infinite]" : "h-1"
                      )}
                    />
                  ))}
                </span>
                Answering from his record
              </p>

              <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                <div className="relative aspect-square h-[min(100%,15.5rem)]">
                  {/* A ring that leaves the picture while he speaks. */}
                  <i
                    aria-hidden
                    className={cn("absolute inset-0 rounded-full border-2 border-mint opacity-0", speaking && "motion-safe:animate-[halo_1.7s_ease-out_infinite]")}
                  />
                  <div
                    className={cn(
                      "relative size-full overflow-hidden rounded-full bg-brand ring-4 transition-[--tw-ring-color] duration-300",
                      speaking ? "ring-mint" : "ring-white/15"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
                    <img src="/images/avatar-large.webp" alt="" width={512} height={512} decoding="async" className="size-full max-w-none" />
                  </div>
                </div>
              </div>

              <p className="mt-3 min-h-[1lh] w-full truncate text-center text-fine text-fog">
                {question && phase !== "waiting" ? `You asked: ${question}` : ""}
              </p>
              {/* Until a question is asked, the words on show are a line of his own, known in full. */}
              <Captions
                text={caption}
                spokenWords={spokenWords}
                even={!question}
                className="mt-1 min-h-[2lh] w-full font-display text-[clamp(17px,1.65vw,24px)] font-black leading-[1.15] tracking-[-0.02em] md:text-[clamp(17px,1.65vw,24px)]"
              />
            </div>

            <div className="border-t p-3 sm:p-3.5">
              <AskBar
                onAsk={ask}
                busy={busy}
                onMic={mic.supported ? mic.toggle : undefined}
                listening={mic.state === "listening"}
                suggestions={[]}
                className="max-w-none"
              />
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-1 text-fine text-fog">
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
                    className="inline-flex min-h-9 items-center gap-2 transition-colors hover:text-caption"
                  >
                    {soundOn ? <Volume2Icon className="size-4" /> : <VolumeXIcon className="size-4" />}
                    {soundOn ? "Sound on" : "Sound off"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTranscript(true)}
                    disabled={!transcript.length}
                    className="min-h-9 transition-colors hover:text-caption disabled:opacity-40"
                  >
                    Transcript
                  </button>
                </div>
              </div>
            </div>
          </Window>
        </div>
      </div>

      {/* The answer as text, for anyone who is not hearing it: the captions are a picture of speech, not a reading of it. */}
      <p className="sr-only" aria-live="polite">
        {phase === "ready" && (!soundOn || voiceAvailable === false) ? caption : ""}
      </p>

      <aside
        aria-label="Transcript"
        className={cn(
          "on-ink fixed inset-y-0 right-0 z-[60] w-full max-w-md overflow-y-auto bg-ink px-8 pb-12 pt-24 transition-transform duration-300 ease-[var(--ease-lights)]",
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
