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
  backdrop: "#1d2a2c",
  umbra: "#11191b",
  caption: "#f3f4ef",
  fog: "#97a6a4",
};
