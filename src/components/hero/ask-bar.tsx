"use client";

import { cn } from "@/lib/utils";
import { MicIcon } from "lucide-react";
import { useId, useState } from "react";

export const SUGGESTED_QUESTIONS = [
  "What have you built with voice AI?",
  "How would you build an AI agent for my business?",
  "Are you taking on new projects?",
];

interface AskBarProps {
  onAsk: (question: string) => void;
  onMic?: () => void;
  listening?: boolean;
  busy?: boolean;
  suggestions?: string[];
  className?: string;
}

const AskBar = ({
  onAsk,
  onMic,
  listening = false,
  busy = false,
  suggestions = SUGGESTED_QUESTIONS,
  className,
}: AskBarProps) => {
  const [question, setQuestion] = useState("");
  const inputId = useId();

  const submit = (q: string) => {
    const text = q.trim();
    if (!text || busy) return;
    onAsk(text);
    setQuestion("");
  };

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(question);
        }}
        className="flex h-14 items-center gap-1.5 rounded-full border border-input bg-umbra/75 pl-5 pr-1.5 outline-offset-3 transition-colors focus-within:border-caption/60 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-signal"
      >
        <label htmlFor={inputId} className="sr-only">
          Ask Zuhayr a question
        </label>
        <input
          id={inputId}
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything"
          autoComplete="off"
          enterKeyHint="send"
          className="h-full min-w-0 flex-1 bg-transparent text-body text-caption outline-none placeholder:text-fog focus-visible:outline-none"
        />
        {onMic && (
          <button
            type="button"
            onClick={onMic}
            aria-pressed={listening}
            aria-label={listening ? "Stop listening" : "Ask out loud"}
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors",
              listening ? "bg-signal text-umbra" : "text-fog hover:text-caption"
            )}
          >
            <MicIcon className="size-5" />
          </button>
        )}
        <button
          type="submit"
          disabled={!question.trim() || busy}
          className="inline-flex h-11 shrink-0 items-center rounded-full bg-caption px-6 text-ui font-bold text-umbra transition-opacity disabled:opacity-40"
        >
          Ask
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul aria-label="Suggested questions" className="mt-2 flex flex-col items-start">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                disabled={busy}
                onClick={() => submit(s)}
                className="link-underline flex min-h-11 items-center text-left text-ui text-fog decoration-transparent transition-colors hover:text-caption disabled:opacity-50"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AskBar;
