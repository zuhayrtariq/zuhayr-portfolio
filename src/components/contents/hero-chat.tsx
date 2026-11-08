"use client";

import { askAiHref } from "@/constants/site";
import { useReducedMotion } from "framer-motion";
import { ArrowUpIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SAMPLE_QUESTION = "What has Zuhayr built with voice AI?";
const SAMPLE_ANSWER =
  "ZFit-AI, a fitness coach you talk to. It runs on Vapi and Gemini and turns a short conversation into a workout and diet plan. He also builds phone agents on the OpenAI Realtime API with Twilio and ElevenLabs.";

const SUGGESTIONS = [
  "Is he available for a new project?",
  "What's his experience with RAG and agents?",
  "What does he do at Starling AIX?",
];

const HeroChat = () => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const words = SAMPLE_ANSWER.split(" ");
  const [shown, setShown] = useState(0);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (reduceMotion) {
      setShown(words.length);
      return;
    }
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(i);
        if (i >= words.length) clearInterval(interval);
      }, 45);
    }, 700);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [reduceMotion, words.length]);

  const ask = (q: string) => {
    const text = q.trim();
    if (text) router.push(askAiHref(text));
  };

  return (
    <div className="relative rounded-[22px] border border-border bg-card shadow-[0_1px_0_hsl(var(--border)),0_24px_48px_-24px_hsl(220_13%_8%/0.18)]">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-secondary">
          <Image
            src="/images/me.png"
            alt=""
            fill
            sizes="36px"
            className="object-cover object-top"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-tight">
            Ask my AI assistant
          </p>
          <p className="text-[13px] leading-tight text-muted-foreground">
            Trained on my CV, projects and experience
          </p>
        </div>
        <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span className="live-dot size-2 rounded-full bg-live" aria-hidden />
          Online
        </span>
      </div>

      <div className="space-y-4 px-5 py-5" aria-live="off">
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-[15px] leading-snug text-background">
          {SAMPLE_QUESTION}
        </p>
        <p className="min-h-[7.5rem] max-w-[92%] text-[15px] leading-relaxed">
          <span className="sr-only">{SAMPLE_ANSWER}</span>
          <span aria-hidden>
            {words.slice(0, shown).join(" ")}
            {shown < words.length && (
              <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-primary" />
            )}
          </span>
        </p>
      </div>

      <div className="border-t border-border px-5 pb-5 pt-4">
        <ul className="mb-3 flex flex-wrap gap-2" aria-label="Suggested questions">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => ask(s)}
                className="rounded-full border border-border px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="flex items-center gap-2 rounded-full border border-input bg-background py-1.5 pl-4 pr-1.5 focus-within:border-primary"
        >
          <label htmlFor="hero-question" className="sr-only">
            Ask a question about Zuhayr
          </label>
          <input
            id="hero-question"
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about my work, stack or availability…"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground focus-visible:outline-none"
          />
          <button
            type="submit"
            aria-label="Ask"
            disabled={!question.trim()}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
          >
            <ArrowUpIcon className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroChat;
