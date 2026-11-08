import { caseStudies } from "@/constants/projects";
import { SITE } from "@/constants/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE.url, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/projects`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...caseStudies.map((p) => ({
      url: `${SITE.url}/work/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE.url}/chat`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}
