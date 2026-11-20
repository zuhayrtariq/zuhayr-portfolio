import { SITE } from "@/constants/site";
import { OG_SIZE } from "@/lib/og";
import { lowerFirst } from "@/lib/utils";
import type { Metadata } from "next";

export const OPEN_GRAPH = { type: "website", locale: "en_US", siteName: SITE.name } as const;

export const HOME_TITLE = `${SITE.name} | ${SITE.role}`;
const OG_ALT = `${SITE.name}, ${lowerFirst(SITE.role)}. You describe it, I build it, and it goes live on the date we set.`;

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
