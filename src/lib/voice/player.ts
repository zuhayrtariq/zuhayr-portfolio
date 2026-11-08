export interface SpokenWord {
  word: string;
  /** Seconds from the start of the clip. */
  start: number;
  end: number;
}

export interface Utterance {
  /** Base64-encoded MP3 from /api/speech. */
  audio: string;
  words: SpokenWord[];
}

export interface SpeechPlayer {
  /** Resumes audio output. Must be called from a user gesture at least once. */
  unlock(): void;
  /**
   * Plays an utterance, calling onWord with the number of words spoken so far as
   * each word starts. Resolves when playback ends or the signal aborts, with
   * false if audio output isn't allowed yet (no user gesture) and nothing played.
   */
  play(utterance: Utterance, onWord: (spoken: number) => void, signal: AbortSignal): Promise<boolean>;
}

const decodeBase64 = (b64: string) => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
};

let audioContext: AudioContext | null = null;

/** One AudioContext for the whole page, shared with the 3D avatar. */
export const sharedAudioContext = () => (audioContext ??= new AudioContext());

export const decodeSpeech = (utterance: Utterance) =>
  sharedAudioContext().decodeAudioData(decodeBase64(utterance.audio));

/** Plays speech through Web Audio and reports word progress from the audio clock. */
class WebAudioPlayer implements SpeechPlayer {
  unlock() {
    const ctx = sharedAudioContext();
    if (ctx.state === "suspended") void ctx.resume();
  }

  async play(utterance: Utterance, onWord: (spoken: number) => void, signal: AbortSignal) {
    this.unlock();
    const ctx = sharedAudioContext();
    const running = () => (ctx.state as AudioContextState) === "running";
    if (!running()) {
      await Promise.race([ctx.resume(), new Promise((r) => setTimeout(r, 150))]);
      if (!running()) return false;
    }
    const buffer = await decodeSpeech(utterance);
    if (signal.aborted) return true;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    await new Promise<void>((resolve) => {
      let frame = 0;
      const startedAt = ctx.currentTime + 0.05;
      const finish = () => {
        cancelAnimationFrame(frame);
        signal.removeEventListener("abort", abort);
        onWord(utterance.words.length);
        resolve();
      };
      const abort = () => {
        try {
          source.stop();
        } catch {}
        finish();
      };
      const tick = () => {
        const t = ctx.currentTime - startedAt;
        let spoken = 0;
        while (spoken < utterance.words.length && utterance.words[spoken].start <= t) spoken++;
        onWord(spoken);
        frame = requestAnimationFrame(tick);
      };
      source.onended = finish;
      signal.addEventListener("abort", abort, { once: true });
      source.start(startedAt);
      frame = requestAnimationFrame(tick);
    });
    return true;
  }
}

const webAudioPlayer = new WebAudioPlayer();
let avatarPlayer: SpeechPlayer | null = null;

/** The 3D avatar registers itself here so its lip-sync drives playback. */
export const setAvatarPlayer = (player: SpeechPlayer | null) => {
  avatarPlayer = player;
};

export const getPlayer = (): SpeechPlayer => avatarPlayer ?? webAudioPlayer;
