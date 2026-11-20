import { caseStudies } from "@/constants/projects";
import { lowerFirst } from "@/lib/utils";

/** A first-draft brief for a visitor's product, as far as it has been written. */
export interface Draft {
  name: string;
  pitch: string;
  /** What version one includes. */
  v1: string[];
  /** What is deliberately left for later. */
  later: string[];
  stack: string[];
  weeks: { when: string; what: string }[];
  /** The case study closest to this product, if there is one. */
  like?: string;
  asks: string[];
  /** Set instead of everything else when the idea is not something to build. */
  decline?: string;
  /** The product's main screen: a style block and body markup. Empty until it starts. */
  screen: string;
  /** True once the brief is written and the screen has begun. */
  planned: boolean;
}

/** The line that ends the brief and starts the screen. */
const SCREEN_MARK = "\nSCREEN:";
const FIELD = /^([A-Z0-9]+):\s*(.*)$/;
const CASE_STUDY_SLUGS = new Set(caseStudies.map((p) => p.slug));

/** The screen is drawn on a fixed canvas and scaled to whatever frame shows it. */
export const SCREEN_WIDTH = 1200;
export const SCREEN_HEIGHT = 750;

/**
 * Reads a draft out of the text written so far. The text is one field to a line
 * ("V1: Online booking"), so every prefix of it is readable and the page can
 * show the brief while it is still being written.
 */
export const parseDraft = (text: string): Draft => {
  const source = text.replace(/\r/g, "");
  const mark = `\n${source}`.indexOf(SCREEN_MARK);
  const brief = mark < 0 ? source : source.slice(0, mark);
  const draft: Draft = { name: "", pitch: "", v1: [], later: [], stack: [], weeks: [], asks: [], screen: "", planned: mark >= 0 };

  for (const line of brief.split("\n")) {
    const [, key, raw] = FIELD.exec(line.trim()) ?? [];
    const value = raw?.trim();
    if (!key || !value) continue;
    if (key === "NAME") draft.name = value;
    else if (key === "PITCH") draft.pitch = value;
    else if (key === "V1") draft.v1.push(value);
    else if (key === "LATER") draft.later.push(value);
    else if (key === "STACK") draft.stack.push(value);
    else if (key === "ASK") draft.asks.push(value);
    else if (key === "DECLINE") draft.decline = value;
    else if (key === "LIKE" && CASE_STUDY_SLUGS.has(value)) draft.like = value;
    else if (key === "WEEK") {
      const [when, ...what] = value.split("|");
      if (what.length) draft.weeks.push({ when: when.trim(), what: what.join("|").trim() });
    }
  }

  if (mark >= 0) {
    draft.screen = source
      .slice(mark + SCREEN_MARK.length - 1)
      .replace(/^\s*```(?:html)?\s*/i, "")
      .replace(/```\s*$/, "");
  }
  return draft;
};

/** Whether enough of the screen exists to be worth drawing: its styles are whole and some markup follows. */
export const screenIsDrawable = (screen: string) => {
  const end = screen.lastIndexOf("</style>");
  return end >= 0 && screen.length - end > 40;
};

/**
 * The page a screen is shown in. The markup comes from a model, so it runs in
 * a frame that allows no scripts, and this policy stops it loading anything at all.
 */
export const screenDocument = (screen: string) => {
  // While it is still being written, stop at the last whole tag so no half-written tag shows as text.
  // A refresh tag is the one thing a frame without scripts could still use to leave for another page.
  const whole = screen.slice(0, screen.lastIndexOf(">") + 1).replace(/<(meta|base)\b[^>]*>/gi, "");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; form-action 'none'">
<style>*,*::before,*::after{box-sizing:border-box}html,body{margin:0;width:${SCREEN_WIDTH}px;height:${SCREEN_HEIGHT}px;overflow:hidden}body{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}</style>
</head><body>${whole}<style>a,button,input,select,textarea{pointer-events:none}</style></body></html>`;
};

/** The draft as a message for the contact form, in the visitor's voice. */
export const briefMessage = (idea: string, draft: Draft) => {
  const lines = [
    `I'd like to build: ${idea.trim()}`,
    "",
    `Your site drafted this as "${draft.name}".`,
    draft.v1.length ? `Version one: ${draft.v1.join("; ")}.` : "",
    draft.later.length ? `Later: ${draft.later.join("; ")}.` : "",
    draft.weeks.length ? `Rough timeline: ${draft.weeks.map((w) => `week ${w.when}, ${lowerFirst(w.what)}`).join("; ")}.` : "",
  ].filter((line, i) => line || i === 1);
  return lines.join("\n").slice(0, 1900);
};
