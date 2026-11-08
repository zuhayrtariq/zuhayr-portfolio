"use client";

import { memo } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}

const suggestedActions = [
  "Is Zuhayr available for a new project?",
  "What has he built with AI agents and RAG?",
  "What does he do at Starling AIX?",
  "Which stack would he use for a SaaS MVP?",
];

function PureSuggestedActions({ sendMessage }: SuggestedActionsProps) {
  return (
    <ul
      data-testid="suggested-actions"
      aria-label="Suggested questions"
      className="flex flex-wrap gap-2 w-full"
    >
      {suggestedActions.map((action, index) => (
        <li key={action} className={index > 1 ? "hidden sm:block" : "block"}>
          <button
            type="button"
            onClick={() => {
              sendMessage({
                role: "user",
                parts: [{ type: "text", text: action }],
              });
            }}
            className="rounded-full border border-border bg-card px-4 py-2 text-[14px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground text-left"
          >
            {action}
          </button>
        </li>
      ))}
    </ul>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;

    return true;
  }
);
