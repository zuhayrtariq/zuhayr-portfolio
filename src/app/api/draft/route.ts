import { DRAFT_INSTRUCTIONS } from "@/lib/ai/draft-prompt";
import { siteModel } from "@/lib/ai/model";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { streamText } from "ai";
import { z } from "zod";

export const maxDuration = 60;

const bodySchema = z.object({ idea: z.string().trim().min(12).max(600) });

/** Drafts a brief and a first screen for a visitor's product idea, as a stream of plain text. */
export async function POST(request: Request) {
  const selected = siteModel();
  if (!selected) {
    return Response.json({ error: "The AI isn't configured yet." }, { status: 503 });
  }

  // A draft is the most expensive thing the site does, so it is the most tightly limited.
  const limit = rateLimit(clientKey(request, "draft"), 5, 10 * 60_000);
  if (!limit.ok) {
    return Response.json(
      { error: "That's a lot of drafts. Try again in a few minutes, or tell me the idea yourself." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Describe the product in a sentence or two." }, { status: 400 });

  const result = streamText({
    model: selected,
    instructions: DRAFT_INSTRUCTIONS,
    prompt: `The visitor's description:\n"""\n${parsed.data.idea}\n"""`,
    maxOutputTokens: 5000,
    abortSignal: request.signal,
    onError: ({ error }) => console.error("Draft model call failed", error),
  });

  return result.toTextStreamResponse({ headers: { "Cache-Control": "no-store" } });
}
