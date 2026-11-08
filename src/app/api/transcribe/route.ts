import { clientKey, rateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return Response.json({ error: "Voice input isn't configured yet." }, { status: 503 });

  const limit = rateLimit(clientKey(request, "transcribe"), 30, 10 * 60_000);
  if (!limit.ok) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  const form = await request.formData().catch(() => null);
  const audio = form?.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0 || audio.size > MAX_BYTES) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const upstream = new FormData();
  upstream.set("model_id", "scribe_v2");
  upstream.set("file", audio, "question.webm");
  upstream.set("tag_audio_events", "false");

  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": apiKey },
    body: upstream,
    signal: request.signal,
  });

  if (!res.ok) {
    console.error("ElevenLabs STT failed", res.status, await res.text().catch(() => ""));
    return Response.json({ error: "Transcription failed" }, { status: 502 });
  }

  const data = (await res.json()) as { text?: string };
  return Response.json({ text: (data.text ?? "").trim() });
}
