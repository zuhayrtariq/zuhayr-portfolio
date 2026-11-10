import { SITE } from "@/constants/site";
import { stackName } from "@/lib/stack";
import type { Project } from "@/types";

const person = {
  "@type": "Person",
  "@id": `${SITE.url}/#person`,
  name: SITE.name,
  url: SITE.url,
};

export const profileSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      url: SITE.url,
      mainEntity: {
        ...person,
        // How Upwork and LinkedIn show his name to signed-out visitors.
        alternateName: "Zuhayr T.",
        image: `${SITE.url}/images/me.png`,
        description: SITE.description,
        jobTitle: "Lead Developer",
        worksFor: { "@type": "Organization", name: "Starling MX", url: "https://www.starlingmx.com" },
        knowsAbout: [
          "Full-stack web development",
          "AI development",
          "AI agents",
          "Retrieval-augmented generation",
          "Voice AI",
          "Next.js",
          "React",
          "React Native",
          "TypeScript",
          "Node.js",
          "Python",
          "Stripe",
        ],
        address: { "@type": "PostalAddress", addressLocality: "Islamabad", addressCountry: "PK" },
        email: SITE.email,
        sameAs: [SITE.upwork, SITE.linkedin, SITE.github],
        makesOffer: {
          "@type": "Offer",
          url: SITE.upwork,
          itemOffered: {
            "@type": "Service",
            name: "Full-stack web and AI development",
            description:
              "Web and mobile apps, APIs, payments and auth, and AI features such as agents, RAG and voice, taken from idea to launch.",
          },
        },
      },
    },
    {
      "@type": "WebSite",
      url: SITE.url,
      name: SITE.name,
      publisher: { "@id": person["@id"] },
    },
  ],
};

export const caseStudySchema = (project: Project) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: project.title,
  description: project.summary,
  url: `${SITE.url}/work/${project.slug}`,
  image: project.image && `${SITE.url}${project.image}`,
  author: person,
  keywords: project.stack?.map(stackName),
});
