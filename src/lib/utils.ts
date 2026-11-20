import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge can't see the CSS theme, so it would read text-lead (a size) and
// text-caption (a color) as the same kind of class and drop one of them.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["fine", "ui", "body", "lead", "q-sm", "q"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** "Full-stack developer" as it reads in the middle of a sentence. Acronyms such as "AI" keep their capitals. */
export const lowerFirst = (text: string) =>
  /^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
