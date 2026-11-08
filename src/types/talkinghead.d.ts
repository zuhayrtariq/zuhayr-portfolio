declare module "@met4citizen/talkinghead" {
  export interface TalkingHeadAudio {
    audio: AudioBuffer;
    words: string[];
    /** Milliseconds from the start of the clip. */
    wtimes: number[];
    wdurations: number[];
    markers?: Array<() => void>;
    mtimes?: number[];
  }

  export class TalkingHead {
    constructor(node: HTMLElement, options?: Record<string, unknown>);
    lipsync: Record<string, unknown>;
    isSpeaking: boolean;
    showAvatar(
      avatar: Record<string, unknown>,
      onprogress?: ((event: ProgressEvent) => void) | null
    ): Promise<void>;
    speakAudio(
      audio: TalkingHeadAudio,
      options?: Record<string, unknown> | null,
      onsubtitles?: ((node: unknown) => void) | null
    ): void;
    stopSpeaking(): void;
    lookAt(x: number | null, y: number | null, t: number): void;
    makeEyeContact(t: number): void;
    setMood(mood: string): void;
    start(): void;
    stop(): void;
    dispose(): void;
  }
}

declare module "talkinghead-lipsync-en" {
  export class LipsyncEn {}
}
