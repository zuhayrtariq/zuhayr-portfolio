import { clientKey, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const maxDuration = 30;

const bodySchema = z.object({ text: z.string().trim().min(1).max(600) });

interface Alignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

export interface SpokenWord {
  word: string;
  start: number;
  end: number;
}

export interface SpeechResponse {
  audio: string;
  words: SpokenWord[];
}

const cache = new Map<string, SpeechResponse>();

/** Groups ElevenLabs' character timings into word timings, in seconds. */
const toWords = (alignment: Alignment): SpokenWord[] => {
  const words: SpokenWord[] = [];
  let current: SpokenWord | null = null;
  alignment.characters.forEach((char, i) => {
    if (/\s/.test(char)) {
      if (current) words.push(current);
      current = null;
      return;
    }
    const start = alignment.character_start_times_seconds[i];
    const end = alignment.character_end_times_seconds[i];
    if (current) {
      current.word += char;
      current.end = end;
    } else {
      current = { word: char, start, end };
    }
  });
  if (current) words.push(current);
  return words;
};

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) {
    return Response.json({ error: "Voice isn't configured yet." }, { status: 503 });
  }

  const limit = rateLimit(clientKey(request, "speech"), 90, 10 * 60_000);
  if (!limit.ok) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });
  const { text } = parsed.data;

  const cached = cache.get(text);
  if (cached) return Response.json(cached);

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL ?? "eleven_flash_v2_5",
      }),
      signal: request.signal,
    }
  );

  if (!res.ok) {
    console.error("ElevenLabs TTS failed", res.status, await res.text().catch(() => ""));
    return Response.json({ error: "Speech failed" }, { status: 502 });
  }

  const data = (await res.json()) as { audio_base64: string; alignment: Alignment };
  const body: SpeechResponse = { audio: data.audio_base64, words: toWords(data.alignment) };

  if (text.length < 200) {
    cache.set(text, body);
    if (cache.size > 64) cache.delete(cache.keys().next().value!);
  }
  return Response.json(body);
}
