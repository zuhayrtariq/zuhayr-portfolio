import { loadGoogleFont, OG_COLORS, OG_SIZE } from "@/lib/og";
import { ImageResponse } from "next/og";

export const alt = "Zuhayr Tariq, full-stack web and AI developer. I take products from idea to launch, on time.";
export const size = OG_SIZE;
export const contentType = "image/png";

const NAME = "Zuhayr Tariq";
const TAGLINE = "Full-stack web and AI developer. I take products from idea to launch, on time.";
const PROOF = "Lead Developer at Starling MX. Top Rated Plus on Upwork.";

export default async function Image() {
  const [display, regular] = await Promise.all([
    loadGoogleFont("Imbue:wght@600", NAME),
    loadGoogleFont("Atkinson+Hyperlegible+Next:wght@400", TAGLINE + PROOF),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px 72px",
          background: `radial-gradient(ellipse at 28% 30%, #2b3b3e 0%, ${OG_COLORS.backdrop} 46%, ${OG_COLORS.umbra} 100%)`,
          color: OG_COLORS.caption,
          fontFamily: "Atkinson",
        }}
      >
        <div style={{ fontFamily: "Imbue", fontSize: 220, lineHeight: 0.9 }}>{NAME}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 44, lineHeight: 1.25, maxWidth: 900 }}>{TAGLINE}</div>
          <div style={{ fontSize: 28, color: OG_COLORS.fog }}>{PROOF}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Imbue", data: display, weight: 600, style: "normal" },
        { name: "Atkinson", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
