import { caseStudies, getProject } from "@/constants/projects";
import { loadGoogleFont, OG_COLORS, OG_SIZE } from "@/lib/og";
import { ImageResponse } from "next/og";

export const alt = "Case study by Zuhayr Tariq";
export const size = OG_SIZE;
export const contentType = "image/png";

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
    loadGoogleFont("Imbue:wght@600", title),
    loadGoogleFont("Atkinson+Hyperlegible+Next:wght@400", summary + byline),
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
          fontFamily: "Atkinson",
        }}
      >
        <div style={{ fontSize: 28, color: OG_COLORS.fog }}>{byline}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontFamily: "Imbue", fontSize: 150, lineHeight: 0.88 }}>{title}</div>
          <div style={{ fontSize: 32, lineHeight: 1.3, color: OG_COLORS.fog, maxWidth: 960 }}>{summary}</div>
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
