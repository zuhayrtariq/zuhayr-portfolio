import { DRAFT_EXAMPLES } from "@/constants/drafts";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Reads a finished example draft at build time, so the home page is served with a draft
 * already on its screens. `file` is one of the examples; anything else gets the first.
 */
export const loadDraftExample = async (file?: string) => {
  const example = DRAFT_EXAMPLES.find((item) => item.file === file) ?? DRAFT_EXAMPLES[0];
  const text = await readFile(path.join(process.cwd(), "public", example.file), "utf8");
  return { text, idea: example.idea };
};
