import { loadAvatar, loadGoogleFont, OG_COLORS, OG_FONTS, OG_SIZE } from "@/lib/og";
import { ImageResponse } from "next/og";

export const alt = "Zuhayr Tariq, full-stack web and AI developer. A prompt gets you a demo. I ship the product.";
export const size = OG_SIZE;
export const contentType = "image/png";

const NAME = "Zuhayr Tariq";
/** The claim, in its two voices: what a tool writes, then what he says. */
const PROMPT = "A prompt gets you a demo.";
const CLAIM = "I ship the product.";
const ROLE = "Full-stack web and AI developer. Top Rated Plus on Upwork.";
const ADDRESS = "zuhayrr.com";

export default async function Image() {
  const [display, regular, mono, avatar] = await Promise.all([
    loadGoogleFont(OG_FONTS.display, NAME + CLAIM),
    loadGoogleFont(OG_FONTS.text, ROLE + ADDRESS),
    loadGoogleFont(OG_FONTS.mono, PROMPT),
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
          padding: "56px 72px 64px",
          background: OG_COLORS.brand,
          color: OG_COLORS.white,
          fontFamily: "Text",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- next/og draws plain HTML */}
          <img src={avatar} width={64} height={64} style={{ borderRadius: 14, border: `3px solid ${OG_COLORS.mint}` }} />
          <div style={{ fontFamily: "Display", fontSize: 36, letterSpacing: "-0.02em" }}>{NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Mono", fontSize: 66, letterSpacing: "-0.05em", lineHeight: 1.1 }}>
            {PROMPT}
            <div style={{ width: 30, height: 60, marginLeft: 10, background: OG_COLORS.mint }} />
          </div>
          <div style={{ fontFamily: "Display", fontSize: 118, lineHeight: 1.02, letterSpacing: "-0.03em" }}>{CLAIM}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
          <div style={{ fontSize: 26, color: OG_COLORS.mist }}>{ROLE}</div>
          <div style={{ display: "flex", background: OG_COLORS.mint, color: OG_COLORS.ink, fontSize: 28, padding: "14px 24px", borderRadius: 8 }}>
            {ADDRESS}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display, weight: 900, style: "normal" },
        { name: "Text", data: regular, weight: 400, style: "normal" },
        { name: "Mono", data: mono, weight: 300, style: "normal" },
      ],
    }
  );
}
