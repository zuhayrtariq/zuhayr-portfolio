"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderState = "idle" | "listening" | "transcribing";

const SPEECH_RMS = 0.025;
const SILENCE_MS = 1300;
const NO_SPEECH_MS = 7000;
const MAX_MS = 20000;

const pickMimeType = () =>
  ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"].find((t) =>
    MediaRecorder.isTypeSupported(t)
  );

interface UseRecorderOptions {
  onTranscript: (text: string) => void;
  onError: (message: string) => void;
}

/**
 * Push-to-talk recording that stops on its own after the speaker goes quiet,
 * then sends the clip to /api/transcribe.
 */
export const useRecorder = ({ onTranscript, onError }: UseRecorderOptions) => {
  const [state, setState] = useState<RecorderState>("idle");
  const [supported, setSupported] = useState(false);
  const controlRef = useRef<{ finish: () => void; cancel: () => void } | null>(null);
  const handlers = useRef({ onTranscript, onError });
  handlers.current = { onTranscript, onError };

  useEffect(() => {
    setSupported(!!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined");
    return () => controlRef.current?.cancel();
  }, []);

  const transcribe = async (blob: Blob) => {
    setState("transcribing");
    try {
      const form = new FormData();
      form.set("audio", blob);
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "I couldn't hear that.");
      if (data.text) handlers.current.onTranscript(data.text);
      else handlers.current.onError("I didn't catch that. Try again, or type your question.");
    } catch (e) {
      handlers.current.onError(e instanceof Error ? e.message : "I couldn't hear that.");
    } finally {
      setState("idle");
    }
  };

  const start = useCallback(async () => {
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      handlers.current.onError("I need microphone access to hear you. You can type instead.");
      return;
    }

    const recorder = new MediaRecorder(stream, { mimeType: pickMimeType() });
    const chunks: Blob[] = [];
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    audioCtx.createMediaStreamSource(stream).connect(analyser);
    const samples = new Float32Array(analyser.fftSize);

    let heardSpeech = false;
    let lastLoud = performance.now();
    const startedAt = performance.now();
    let frame = 0;
    let cancelled = false;

    const cleanup = () => {
      cancelAnimationFrame(frame);
      stream.getTracks().forEach((t) => t.stop());
      void audioCtx.close();
      controlRef.current = null;
    };

    const stop = (cancel = false) => {
      cancelled = cancel;
      if (recorder.state !== "inactive") recorder.stop();
    };
    controlRef.current = { finish: () => stop(false), cancel: () => stop(true) };

    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = () => {
      cleanup();
      if (cancelled || !heardSpeech) {
        setState("idle");
        if (!cancelled) handlers.current.onError("I didn't hear anything. Try again, or type your question.");
        return;
      }
      void transcribe(new Blob(chunks, { type: recorder.mimeType }));
    };

    const watch = () => {
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const s of samples) sum += s * s;
      const rms = Math.sqrt(sum / samples.length);
      const now = performance.now();
      if (rms > SPEECH_RMS) {
        heardSpeech = true;
        lastLoud = now;
      }
      const silentFor = now - lastLoud;
      if ((heardSpeech && silentFor > SILENCE_MS) || (!heardSpeech && now - startedAt > NO_SPEECH_MS) || now - startedAt > MAX_MS) {
        stop();
        return;
      }
      frame = requestAnimationFrame(watch);
    };

    recorder.start();
    setState("listening");
    frame = requestAnimationFrame(watch);
  }, []);

  /** Starts listening, or stops and sends what was said so far. */
  const toggle = useCallback(() => {
    if (state === "listening") controlRef.current?.finish();
    else if (state === "idle") void start();
  }, [state, start]);

  return { state, supported, toggle };
};
