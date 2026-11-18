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

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  backdrop: "#0b0c0c",
  umbra: "#050606",
  caption: "#f2efe8",
  fog: "#9d9b93",
};
