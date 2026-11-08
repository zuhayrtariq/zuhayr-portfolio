"use client";

import { decodeSpeech, setAvatarPlayer, sharedAudioContext, type SpeechPlayer } from "@/lib/voice/player";
import { TalkingHead } from "@met4citizen/talkinghead";
import { LipsyncEn } from "talkinghead-lipsync-en";
import { useEffect, useRef } from "react";

interface TalkingAvatarProps {
  url: string;
  onReady: () => void;
  onError: () => void;
}

const createPlayer = (head: TalkingHead): SpeechPlayer => ({
  unlock() {
    const ctx = sharedAudioContext();
    if (ctx.state === "suspended") void ctx.resume();
  },
  async play(utterance, onWord, signal) {
    const ctx = sharedAudioContext();
    if (ctx.state !== "running") {
      await Promise.race([ctx.resume(), new Promise((r) => setTimeout(r, 150))]);
      if ((ctx.state as AudioContextState) !== "running") return false;
    }
    const buffer = await decodeSpeech(utterance);
    if (signal.aborted) return true;

    return new Promise<boolean>((resolve) => {
      let spoken = 0;
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        onWord(utterance.words.length);
        resolve(true);
      };
      signal.addEventListener(
        "abort",
        () => {
          head.stopSpeaking();
          finish();
        },
        { once: true }
      );
      head.speakAudio(
        {
          audio: buffer,
          words: utterance.words.map((w) => w.word),
          wtimes: utterance.words.map((w) => w.start * 1000),
          wdurations: utterance.words.map((w) => Math.max(40, (w.end - w.start) * 1000)),
          markers: [finish],
          mtimes: [buffer.duration * 1000],
        },
        { lipsyncLang: "en" },
        () => onWord(++spoken)
      );
    });
  },
});

/**
 * Zuhayr's 3D avatar (an Avaturn T2 GLB with ARKit and viseme blend shapes),
 * lit like the set, lip-syncing to his cloned voice and following the cursor.
 */
const TalkingAvatar = ({ url, onReady, onError }: TalkingAvatarProps) => {
  const node = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReady, onError });
  callbacks.current = { onReady, onError };

  useEffect(() => {
    if (!node.current) return;
    let disposed = false;
    const head = new TalkingHead(node.current, {
      ttsEndpoint: null,
      lipsyncModules: [],
      audioCtx: sharedAudioContext(),
      cameraView: "upper",
      cameraRotateEnable: false,
      modelFPS: 30,
      modelPixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
      lightAmbientColor: 0xc9d4d2,
      lightAmbientIntensity: 1.4,
      lightDirectColor: 0xf0c28a,
      lightDirectIntensity: 24,
      lightDirectPhi: 0.9,
      lightDirectTheta: 2.6,
      lightSpotColor: 0x97a6a4,
      lightSpotIntensity: 8,
      lightSpotPhi: 0.4,
      lightSpotTheta: 5.2,
      avatarMood: "neutral",
    });
    head.lipsync.en = new LipsyncEn();

    let lastLook = 0;
    const onPointer = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastLook < 350) return;
      lastLook = now;
      head.lookAt(e.clientX, e.clientY, 500);
    };

    head
      .showAvatar({ url, body: "M", avatarMood: "neutral", lipsyncLang: "en" })
      .then(() => {
        if (disposed) return;
        setAvatarPlayer(createPlayer(head));
        // Eye tracking needs the loaded rig, so it starts only now.
        if (window.matchMedia("(pointer: fine)").matches) {
          window.addEventListener("pointermove", onPointer, { passive: true });
        }
        callbacks.current.onReady();
      })
      .catch((error) => {
        if (disposed) return;
        console.error("Avatar failed to load", error);
        callbacks.current.onError();
      });

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? head.start() : head.stop()));
    io.observe(node.current);

    return () => {
      disposed = true;
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      setAvatarPlayer(null);
      head.dispose();
    };
  }, [url]);

  return <div ref={node} className="size-full" />;
};

export default TalkingAvatar;
