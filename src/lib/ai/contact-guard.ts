import { splitSentences } from "@/lib/voice/sentences";

/**
 * A last check on what the site's AI says to a client who came from Upwork.
 *
 * Upwork does not allow a way to reach him outside Upwork to be shared before a contract
 * starts. The model answering those clients is given no such details and is told not to
 * offer any, but a model can still make one up. So its reply is read a sentence at a time
 * before it leaves the server, and any sentence that names a way to reach someone is
 * replaced by one line saying where to talk instead.
 */

/** What a way to reach someone looks like, written out or said aloud. */
const CONTACT = [
  // An address or a handle.
  /@/,
  // "name at gmail dot com"
  /\b[\w.+-]+\s+at\s+[\w-]+\s+dot\s+[a-z]{2,}\b/i,
  /\b(gmail|outlook|hotmail|yahoo|icloud|proton\s?mail)\b/i,
  // A phone number: seven or more digits, however they are spaced.
  /(?:\+?\d[\s().-]?){7,}/,
  /\b(whats\s?app|telegram|skype|discord|linkedin|instagram|twitter|facebook|calendly)\b/i,
  // His GitHub account, but not GitHub Actions, which is a tool he deploys with.
  /\bgithub\b(?!\s+actions)/i,
];

export const KEEP_ON_UPWORK = "Upwork asks us to keep contact there until a contract starts, so message me on Upwork.";

export const namesContact = (text: string) => CONTACT.some((pattern) => pattern.test(text));

interface TextChunk {
  type: string;
  id?: string;
  delta?: string;
}

/**
 * Passes a stream of UI message chunks through, holding text back until each sentence is
 * whole and has been checked. Everything that is not text is forwarded untouched.
 */
export const keepOnUpwork = <CHUNK extends TextChunk>() => {
  /** The unfinished sentence of each piece of text, and the chunk its words arrive in. */
  const open = new Map<string, { rest: string; like: CHUNK }>();
  let redirected = false;

  const checked = (sentence: string) => {
    if (!namesContact(sentence)) return sentence;
    // The line is said once; a second sentence about contact is simply dropped.
    if (redirected) return "";
    redirected = true;
    return KEEP_ON_UPWORK;
  };

  const release = (id: string, done: boolean, controller: TransformStreamDefaultController<CHUNK>) => {
    const text = open.get(id);
    if (!text) return;
    const { sentences, consumed } = splitSentences(text.rest, done);
    // What is left keeps its spaces, so the next words do not run into it.
    text.rest = text.rest.slice(consumed);
    const safe = sentences.map(checked).filter(Boolean).join(" ");
    if (safe) controller.enqueue({ ...text.like, delta: `${safe} ` });
    if (done) open.delete(id);
  };

  return new TransformStream<CHUNK, CHUNK>({
    transform(chunk, controller) {
      const id = chunk.id ?? "";
      if (chunk.type === "text-delta") {
        const text = open.get(id) ?? { rest: "", like: chunk };
        text.rest = `${text.rest}${chunk.delta ?? ""}`;
        open.set(id, text);
        release(id, false, controller);
        return;
      }
      if (chunk.type === "text-end") release(id, true, controller);
      controller.enqueue(chunk);
    },
    flush(controller) {
      for (const id of [...open.keys()]) release(id, true, controller);
    },
  });
};
