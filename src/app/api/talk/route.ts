import { siteModel } from "@/lib/ai/model";
import { instructionsFor } from "@/lib/ai/persona";
import { retrieveNotes } from "@/lib/ai/retrieve";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  tool,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";

export const maxDuration = 30;

const MAX_MESSAGES = 12;
const MAX_CHARS = 1200;

const bodySchema = z.object({
  messages: z.array(z.custom<UIMessage>((m) => typeof m === "object" && m !== null)).min(1).max(40),
});

const textOf = (message: UIMessage) =>
  message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "talk"), 24, 10 * 60_000);
  if (!limit.ok) {
    return Response.json(
      { error: "You're asking faster than I can answer. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const selected = siteModel();
  if (!selected) {
    return Response.json({ error: "The AI isn't configured yet." }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });

  // Keep the recent conversation, trim long turns, and drop anything that isn't a user or assistant turn.
  const messages = parsed.data.messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      ...m,
      parts: m.parts.map((part) =>
        part.type === "text" ? { ...part, text: part.text.slice(0, MAX_CHARS) } : part
      ),
    }));

  const question = textOf(messages.findLast((m) => m.role === "user") ?? messages[0]);
  const notes = await retrieveNotes(question);

  const result = streamText({
    model: selected,
    instructions: instructionsFor(notes),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 320,
    stopWhen: isStepCount(2),
    abortSignal: request.signal,
    // The visitor only sees "an error occurred"; the reason (a bad key, no credit, a retired model) belongs in the log.
    onError: ({ error }) => console.error("Talk model call failed", error),
    tools: {
      start_project: tool({
        description:
          "Take the visitor to the contact form so they can start a project or book a call with Zuhayr.",
        inputSchema: z.object({
          topic: z
            .string()
            .max(200)
            .describe("One line, in the visitor's words, about what they want to build."),
        }),
        execute: async ({ topic }) => ({ topic }),
      }),
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
