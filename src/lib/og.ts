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

/** The drawn avatar on its emerald tile, as a data URL that next/og can draw. */
export async function loadAvatar() {
  const file = await readFile(path.join(process.cwd(), "public/icons/icon-192.png"));
  return `data:image/png;base64,${file.toString("base64")}`;
}

export const OG_SIZE = { width: 1200, height: 630 };

/** The page's colours, and the tint of white a link preview needs for its smaller words. */
export const OG_COLORS = {
  emerald: "#0c7450",
  pine: "#0c3a2a",
  mint: "#45eba1",
  white: "#ffffff",
  mist: "#d2eee0",
};

/**
 * The site's one typeface in the three voices the previews use, each as a fixed cut:
 * his own voice for headlines, the plain one for text, and the monospaced one a tool writes in.
 */
export const OG_FONTS = {
  display: "Recursive:CASL,CRSV,MONO,slnt,wght@0.5,0.5,0,0,900",
  text: "Recursive:CASL,CRSV,MONO,slnt,wght@0,0.5,0,0,400",
  mono: "Recursive:CASL,CRSV,MONO,slnt,wght@0,0.5,1,0,300",
};
