import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Loads a static TrueType instance of a Google font, subset to `text`, for use
 * in next/og. Satori cannot read WOFF2 or variable fonts.
 */
export async function loadGoogleFont(axes: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${axes}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`Could not load font: ${axes}`);
  return (await fetch(match[1])).arrayBuffer();
}

/** The pixel avatar on its ember tile, as a data URL that next/og can draw. */
export async function loadAvatar() {
  const file = await readFile(path.join(process.cwd(), "public/icons/icon-192.png"));
  return `data:image/png;base64,${file.toString("base64")}`;
}

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  backdrop: "#0b0c0c",
  umbra: "#050606",
  caption: "#f2efe8",
  fog: "#9d9b93",
};
