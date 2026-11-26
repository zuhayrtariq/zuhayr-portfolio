import { caseStudies } from "@/constants/projects";
import { SITE } from "@/constants/site";
import type { MetadataRoute } from "next";

// No lastModified: nothing here records when a page really changed, and a date
// that moves on every deploy teaches crawlers to ignore it.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE.url}/images/zuhayr-tariq.jpg`],
    },
    { url: `${SITE.url}/work`, changeFrequency: "monthly", priority: 0.8 },
    ...caseStudies.map((project) => ({
      url: `${SITE.url}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...(project.image && { images: [`${SITE.url}${project.image}`] }),
    })),
    { url: `${SITE.url}/how-i-work`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/experience`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/talk`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
