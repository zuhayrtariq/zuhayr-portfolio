import { loadGoogleFont, OG_COLORS, OG_SIZE } from "@/lib/og";
import { ImageResponse } from "next/og";

export const alt = "Zuhayr Tariq: I ship what I promise, when I promise it.";
export const size = OG_SIZE;
export const contentType = "image/png";

const TITLE = "I ship what I promise, when I promise it.";
const NAME = "Zuhayr Tariq";
const ROLE = "Full-stack and AI engineer, Lead Developer at Starling MX";

export default async function Image() {
  const [display, regular, bold] = await Promise.all([
    loadGoogleFont("Imbue:wght@600", TITLE),
    loadGoogleFont("Atkinson+Hyperlegible+Next:wght@400", ROLE),
    loadGoogleFont("Atkinson+Hyperlegible+Next:wght@700", NAME),
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
          padding: "72px 80px",
          background: `radial-gradient(ellipse at 28% 30%, #2b3b3e 0%, ${OG_COLORS.backdrop} 46%, ${OG_COLORS.umbra} 100%)`,
          color: OG_COLORS.caption,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Imbue", fontSize: 140, lineHeight: 0.92 }}>
          {TITLE.split(", ").map((line, i, lines) => (
            <div key={line}>{i < lines.length - 1 ? `${line},` : line}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Atkinson" }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{NAME}</div>
          <div style={{ fontSize: 28, color: OG_COLORS.fog }}>{ROLE}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Imbue", data: display, weight: 600, style: "normal" },
        { name: "Atkinson", data: regular, weight: 400, style: "normal" },
        { name: "Atkinson", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
