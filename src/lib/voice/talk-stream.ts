export interface TalkMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface StreamHandlers {
  onText: (delta: string) => void;
  onToolOutput: (toolName: string, output: unknown) => void;
  signal: AbortSignal;
}

export class TalkError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

/**
 * Sends the conversation to /api/talk and reads the AI SDK UI message stream
 * (server-sent events with JSON chunks) without shipping the SDK to the browser.
 */
export async function streamTalk(messages: TalkMessage[], { onText, onToolOutput, signal }: StreamHandlers) {
  const res = await fetch("/api/talk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map((m) => ({ id: m.id, role: m.role, parts: [{ type: "text", text: m.text }] })),
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new TalkError(data.error ?? "Request failed", res.status);
  }

  const toolNames = new Map<string, string>();
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const data = event
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("");
      if (!data || data === "[DONE]") continue;

      const chunk = JSON.parse(data) as {
        type: string;
        delta?: string;
        toolCallId?: string;
        toolName?: string;
        output?: unknown;
        errorText?: string;
      };
      if (chunk.type === "text-delta" && chunk.delta) onText(chunk.delta);
      else if ((chunk.type === "tool-input-start" || chunk.type === "tool-input-available") && chunk.toolCallId) {
        toolNames.set(chunk.toolCallId, chunk.toolName ?? "");
      } else if (chunk.type === "tool-output-available" && chunk.toolCallId) {
        onToolOutput(toolNames.get(chunk.toolCallId) ?? "", chunk.output);
      } else if (chunk.type === "error") {
        throw new TalkError(chunk.errorText ?? "Stream error", 500);
      }
    }
  }
}
