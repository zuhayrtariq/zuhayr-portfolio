"use client";

import { WHY_QUESTION } from "@/constants/faq";
import { cn } from "@/lib/utils";
import { MicIcon } from "lucide-react";
import { useState } from "react";

export const SUGGESTED_QUESTIONS = [WHY_QUESTION, "What have you shipped recently?", "Are you taking on new projects?"];

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
        className="flex h-14 items-center gap-1.5 rounded-lg bg-white/8 pl-4 pr-1.5 outline-offset-3 ring-1 ring-white/40 transition-shadow focus-within:ring-white/90 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-signal"
      >
        <input
          name="question"
          aria-label="Ask Zuhayr a question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything"
          autoComplete="off"
          enterKeyHint="send"
          className="h-full min-w-0 flex-1 text-ellipsis bg-transparent text-body text-caption outline-none placeholder:text-fog focus-visible:outline-none"
        />
        {onMic && (
          <button
            type="button"
            onClick={onMic}
            aria-pressed={listening}
            aria-label={listening ? "Stop listening" : "Ask out loud"}
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-md transition-colors",
              listening ? "bg-mint text-ink" : "text-fog hover:text-caption"
            )}
          >
            <MicIcon className="size-5" />
          </button>
        )}
        <button
          type="submit"
          disabled={!question.trim() || busy}
          className="inline-flex h-11 shrink-0 items-center rounded-md bg-mint px-5 text-ui font-bold text-ink transition-opacity disabled:opacity-40"
        >
          Ask
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul aria-label="Suggested questions" className="mt-3 flex flex-col items-start">
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
