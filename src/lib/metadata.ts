import { getProject } from "@/constants/projects";
import { SITE } from "@/constants/site";
import { OG_SIZE } from "@/lib/og";
import { lowerFirst } from "@/lib/utils";
import type { Metadata } from "next";

export const OPEN_GRAPH = { type: "website", locale: "en_US", siteName: SITE.name } as const;

export const HOME_TITLE = `${SITE.name} | ${SITE.role}`;
const OG_ALT = `${SITE.name}, ${lowerFirst(SITE.role)}. A prompt gets you a demo. I ship the product.`;

interface PageMetadata {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  /** The route has its own opengraph-image file, which images set here would replace. */
  hasOwnImage?: boolean;
}

/**
 * Metadata for a page below the home page. Next.js replaces nested fields like
 * openGraph wholesale, so each page sets its own canonical URL and link preview.
 */
export const pageMetadata = ({
  title,
  description,
  path,
  type = "website",
  hasOwnImage = false,
}: PageMetadata): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    ...OPEN_GRAPH,
    type,
    title: `${title} | ${SITE.name}`,
    description,
    url: path,
    ...(!hasOwnImage && { images: { url: "/opengraph-image", ...OG_SIZE, alt: OG_ALT, type: "image/png" } }),
  },
});

/** The pages below the home page. Both copies of the site have each of them, under the same title. */
export const PAGES = {
  work: {
    title: "Full-stack and AI projects",
    description:
      "Everything Zuhayr Tariq has built, from the enterprise AI platform he leads and a pet adoption platform he built alone to AI agents, voice apps, dashboards and e-commerce.",
    path: "/work",
  },
  how: {
    title: "How I work",
    description:
      "How Zuhayr Tariq works with clients, remotely from Islamabad: how he decides something is done, what he does when it breaks, his hours against yours, how he uses AI, and the questions clients ask first.",
    path: "/how-i-work",
  },
  experience: {
    title: "Experience and stack",
    description:
      "Five years, from an SAP internship to Lead Developer at Starling MX and Top Rated Plus on Upwork: where Zuhayr Tariq has worked, where he studied, and the stack he builds with.",
    path: "/experience",
  },
  talk: {
    title: "Talk to me",
    description: "Ask Zuhayr's AI about his work, his stack, or how he'd build your product. It answers out loud.",
    path: "/talk",
  },
} satisfies Record<string, PageMetadata>;

/** Metadata for one case study. `hasOwnImage` is true where the route draws its own link preview. */
export const caseStudyMetadata = (slug: string, hasOwnImage: boolean): Metadata => {
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    // "Yip: Pet adoption platform" says what the page is about; a bare product name does not.
    title: project.kind ? `${project.title}: ${project.kind}` : `${project.title} case study`,
    description: project.summary,
    path: `/work/${slug}`,
    type: "article",
    hasOwnImage,
  });
};
