import { caseStudies, getProject } from "@/constants/projects";
import { loadGoogleFont, OG_COLORS, OG_FONTS, OG_SIZE } from "@/lib/og";
import { ImageResponse } from "next/og";

export const alt = "Case study by Zuhayr Tariq";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Every case study is of something that shipped. */
const STATUS = "Shipped, and live";

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug! }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const title = project?.title ?? "Case study";
  const summary = project?.summary ?? "";
  const byline = "A case study by Zuhayr Tariq";

  const [display, regular] = await Promise.all([
    loadGoogleFont(OG_FONTS.display, title + STATUS),
    loadGoogleFont(OG_FONTS.text, summary + byline),
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
          padding: "64px 72px",
          background: OG_COLORS.pine,
          color: OG_COLORS.white,
          fontFamily: "Text",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 28, color: OG_COLORS.mist }}>{byline}</div>
          <div style={{ display: "flex", background: OG_COLORS.mint, color: OG_COLORS.pine, fontFamily: "Display", fontSize: 26, padding: "10px 20px", borderRadius: 8 }}>
            {STATUS}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontFamily: "Display", fontSize: title.length > 14 ? 84 : 124, lineHeight: 0.96, letterSpacing: "-0.03em" }}>{title}</div>
          <div style={{ fontSize: 31, lineHeight: 1.32, color: OG_COLORS.mist, maxWidth: 1000 }}>{summary}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display, weight: 900, style: "normal" },
        { name: "Text", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
