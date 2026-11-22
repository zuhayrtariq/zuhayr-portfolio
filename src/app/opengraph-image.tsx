import { loadAvatar, loadGoogleFont, OG_COLORS, OG_FONTS, OG_SIZE } from "@/lib/og";
import { ImageResponse } from "next/og";

export const alt = "Zuhayr Tariq, full-stack web and AI developer. Anyone can take off now. I land the plane.";
export const size = OG_SIZE;
export const contentType = "image/png";

const NAME = "Zuhayr Tariq";
const CLAIM = ["Anyone can", "take off now.", "I land the plane."];
const ROLE = "Full-stack web and AI developer. Top Rated Plus on Upwork.";
const ADDRESS = "zuhayrr.com";

export default async function Image() {
  const [display, regular, avatar] = await Promise.all([
    loadGoogleFont(OG_FONTS.display, NAME + CLAIM.join("")),
    loadGoogleFont(OG_FONTS.text, ROLE + ADDRESS),
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
          background: `linear-gradient(180deg, ${OG_COLORS.night} 0%, ${OG_COLORS.deep} 42%, ${OG_COLORS.cobalt} 100%)`,
          color: OG_COLORS.white,
          fontFamily: "B612",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- next/og draws plain HTML */}
          <img src={avatar} width={64} height={64} style={{ borderRadius: 14 }} />
          <div style={{ fontFamily: "Anybody", fontSize: 34, letterSpacing: "-0.02em" }}>{NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Anybody", fontSize: 92, lineHeight: 0.98, letterSpacing: "-0.03em" }}>
          {CLAIM.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
          <div style={{ fontSize: 28, color: OG_COLORS.mist }}>{ROLE}</div>
          <div style={{ display: "flex", background: OG_COLORS.sun, color: OG_COLORS.night, fontSize: 28, padding: "14px 24px", borderRadius: 8 }}>
            {ADDRESS}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anybody", data: display, weight: 800, style: "normal" },
        { name: "B612", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
