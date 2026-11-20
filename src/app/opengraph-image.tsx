import { loadAvatar, loadGoogleFont, OG_COLORS, OG_SIZE } from "@/lib/og";
import { ImageResponse } from "next/og";

export const alt = "Zuhayr Tariq, full-stack web and AI developer. You describe it, I build it, and it goes live on the date we set.";
export const size = OG_SIZE;
export const contentType = "image/png";

const NAME = "Zuhayr Tariq";
const TAGLINE = "Full-stack web and AI developer. You describe it, I build it, and it goes live on the date we set.";
const PROOF = "Lead Developer at Starling MX. Top Rated Plus on Upwork.";

export default async function Image() {
  const [display, regular, avatar] = await Promise.all([
    loadGoogleFont("Imbue:wght@600", NAME),
    loadGoogleFont("Atkinson+Hyperlegible+Next:wght@400", TAGLINE + PROOF),
    loadAvatar(),
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
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 44, lineHeight: 1.25, maxWidth: 820 }}>{TAGLINE}</div>
            <div style={{ fontSize: 28, color: OG_COLORS.fog }}>{PROOF}</div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- next/og draws plain HTML */}
          <img src={avatar} width={192} height={192} />
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
