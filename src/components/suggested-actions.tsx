"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { memo } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}

function PureSuggestedActions({ chatId, sendMessage }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "Get to know about",
      label: "Zuhayr",
      action: "Who is Zuhayr and what does he do?",
    },
    {
      title: "Explore Zuhayr's",
      label: "experience in software development",
      action: "What experience does Zuhayr have in software development?",
    },
    {
      title: "Learn about",
      label: "Zuhayr's achievements",
      action: "What are some notable achievements of Zuhayr?",
    },
    {
      title: "What is Zuhayr's",
      label: "educational background",
      action: "What is Zuhayr's educational background?",
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              // window.history.replaceState({}, '', `/chat/${chatId}`);

              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestedAction.action }],
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;

    return true;
  }
);
