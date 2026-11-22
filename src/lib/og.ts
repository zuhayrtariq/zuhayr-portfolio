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

/** The drawn avatar on its cobalt tile, as a data URL that next/og can draw. */
export async function loadAvatar() {
  const file = await readFile(path.join(process.cwd(), "public/icons/icon-192.png"));
  return `data:image/png;base64,${file.toString("base64")}`;
}

export const OG_SIZE = { width: 1200, height: 630 };

/** The page's four colours, and the two tints of them a link preview needs. */
export const OG_COLORS = {
  cobalt: "#1838dc",
  deep: "#0f27ad",
  night: "#071233",
  sun: "#ffce1f",
  white: "#ffffff",
  mist: "#c9d3f5",
};

/** The wide display face and the text face, as the names the previews use for them. */
export const OG_FONTS = { display: "Anybody:wdth,wght@135,800", text: "B612:wght@400" };
