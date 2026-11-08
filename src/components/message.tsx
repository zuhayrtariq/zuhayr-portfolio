"use client";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { memo, useState } from "react";
import { PencilEditIcon } from "./icons";
import { Markdown } from "./markdown";
import equal from "fast-deep-equal";
import { cn, sanitizeText } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "./data-stream-provider";

// Type narrowing is handled by TypeScript's control flow analysis
// The AI SDK provides proper discriminated unions for tool calls

const AssistantAvatar = () => (
  <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-secondary">
    <Image
      src="/images/me.png"
      alt=""
      fill
      sizes="32px"
      className="object-cover object-top"
    />
  </div>
);

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  regenerate,
  requiresScrollPadding,
}: {
  chatId: string;
  message: ChatMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];

  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  useDataStream();

  return (
    <AnimatePresence>
      <TooltipProvider>
        <motion.div
          data-testid={`message-${message.role}`}
          className="w-full mx-auto max-w-3xl px-4 group/message"
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          data-role={message.role}
        >
          <div
            className={cn(
              "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
              {
                "w-full": mode === "edit",
                "group-data-[role=user]/message:w-fit": mode !== "edit",
              }
            )}
          >
            {message.role === "assistant" && <AssistantAvatar />}

            <div
              className={cn("flex flex-col gap-4 w-full", {
                "min-h-96":
                  message.role === "assistant" && requiresScrollPadding,
              })}
            >
              {message.parts?.map((part, index) => {
                const { type } = part;
                const key = `message-${message.id}-part-${index}`;

                if (type === "reasoning" && part.text?.trim().length > 0) {
                  return (
                    <MessageReasoning
                      key={key}
                      isLoading={isLoading}
                      reasoning={part.text}
                    />
                  );
                }

                if (type === "text") {
                  if (mode === "view") {
                    return (
                      <div
                        key={key}
                        className="flex flex-row gap-2 items-start"
                      >
                        {message.role === "user" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                data-testid="message-edit-button"
                                variant="ghost"
                                aria-label="Edit message"
                                className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100 focus-visible:opacity-100"
                                onClick={() => {
                                  setMode("edit");
                                }}
                              >
                                <PencilEditIcon />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit message</TooltipContent>
                          </Tooltip>
                        )}

                        <div
                          data-testid="message-content"
                          className={cn("flex flex-col gap-4 text-[16px] leading-relaxed", {
                            "bg-foreground text-background px-4 py-2.5 rounded-2xl rounded-br-md":
                              message.role === "user",
                          })}
                        >
                          <Markdown>{sanitizeText(part.text)}</Markdown>
                        </div>
                      </div>
                    );
                  }

                  if (mode === "edit") {
                    return (
                      <div
                        key={key}
                        className="flex flex-row gap-2 items-start"
                      >
                        <div className="size-8" />

                        <MessageEditor
                          key={message.id}
                          message={message}
                          setMode={setMode}
                          setMessages={setMessages}
                          regenerate={regenerate}
                        />
                      </div>
                    );
                  }
                }
              })}
            </div>
          </div>
        </motion.div>
      </TooltipProvider>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return false;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <AssistantAvatar />

        <div className="flex flex-col gap-2 w-full pt-1">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking…
          </div>
        </div>
      </div>
    </motion.div>
  );
};
