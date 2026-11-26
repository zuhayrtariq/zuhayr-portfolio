const ABBREVIATION = /\b(e\.g|i\.e|etc|vs|mr|mrs|ms|dr|st|approx)\.$/i;

/**
 * Splits streaming text into complete sentences plus the unfinished remainder.
 * A boundary is ., ! or ? followed by whitespace, so "Next.js" and "e.g." stay intact.
 * When `done` is true, the remainder is returned as a final sentence.
 * `consumed` is how many characters of `text` the returned sentences used up.
 */
export function splitSentences(text: string, done: boolean) {
  const sentences: string[] = [];
  let start = 0;

  for (let i = 0; i < text.length - 1; i++) {
    const ch = text[i];
    if (ch !== "." && ch !== "!" && ch !== "?") continue;
    if (!/\s/.test(text[i + 1])) continue;
    const candidate = text.slice(start, i + 1);
    if (ch === "." && ABBREVIATION.test(candidate)) continue;
    if (candidate.trim()) sentences.push(candidate.trim());
    start = i + 1;
  }

  const rest = text.slice(start).trim();
  if (done && rest) return { sentences: [...sentences, rest], rest: "", consumed: text.length };
  return { sentences, rest, consumed: start };
}

export const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);
