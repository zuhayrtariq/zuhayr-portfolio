import { FAQ } from "@/constants/faq";
import { caseStudies, projects } from "@/constants/projects";
import { SITE } from "@/constants/site";
import { stackName } from "@/lib/stack";
import type { Project } from "@/types";

const PERSON_ID = `${SITE.url}/#person`;
const WEBSITE_ID = `${SITE.url}/#website`;

/** A pointer to the full Person on the home page, for every other page's markup. */
const personRef = { "@type": "Person", "@id": PERSON_ID, name: SITE.name, url: SITE.url };

const caseStudyUrl = (project: Project) => `${SITE.url}/work/${project.slug}`;

/** Where a page sits in the site, as search results show it above the title. */
const breadcrumbs = (...trail: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "" }, ...trail].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE.url}${item.path}`,
  })),
});

export const profileSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE.url}/#profile`,
      url: SITE.url,
      name: `${SITE.name} | ${SITE.role}`,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": PERSON_ID },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE.name,
      url: SITE.url,
      // How Upwork and LinkedIn show his name to signed-out visitors.
      alternateName: "Zuhayr T.",
      image: {
        "@type": "ImageObject",
        url: `${SITE.url}/images/zuhayr-tariq.jpg`,
        width: 768,
        height: 768,
        caption: SITE.name,
      },
      description: SITE.description,
      jobTitle: "Lead Developer",
      worksFor: { "@type": "Organization", name: "Starling MX", url: "https://www.starlingmx.com" },
      hasOccupation: {
        "@type": "Occupation",
        name: SITE.role,
        occupationLocation: { "@type": "Country", name: "Pakistan" },
        skills:
          "Full-stack web development, AI-assisted software development, AI agents, retrieval-augmented generation, voice AI, Claude, Gemini, OpenAI, Next.js, React, TypeScript, Node.js",
      },
      award: "Upwork Top Rated Plus",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Institute of Business Management",
        address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
      },
      knowsLanguage: ["en", "ur"],
      knowsAbout: [
        "Full-stack web development",
        "AI development",
        "AI-assisted software development",
        "Taking AI-built prototypes to production",
        "Anthropic Claude",
        "Google Gemini",
        "OpenAI",
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
            "Web and mobile apps, APIs, payments and auth, and AI features such as agents, RAG and voice, taken from idea to launch. Also takes prototypes built with AI tools to production.",
          areaServed: "Worldwide",
        },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/#faq`,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": PERSON_ID },
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@type": "ItemList",
      name: "Selected work",
      itemListElement: caseStudies.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: caseStudyUrl(project),
      })),
    },
  ],
};

export const caseStudySchema = (project: Project) => {
  const url = caseStudyUrl(project);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}/#article`,
        headline: project.title,
        description: project.summary,
        url,
        mainEntityOfPage: url,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        image: project.image && `${SITE.url}${project.image}`,
        author: personRef,
        publisher: personRef,
        keywords: project.stack?.map(stackName),
        // The product the case study is about, which lives on its own domain.
        about: { "@type": "WebSite", name: project.title, url: project.link, description: project.kind },
      },
      breadcrumbs({ name: "Projects", path: "/projects" }, { name: project.title, path: `/work/${project.slug}` }),
    ],
  };
};

export const talkSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE.url}/talk/#page`,
      url: `${SITE.url}/talk`,
      name: `Talk to ${SITE.name}'s AI`,
      description: "Ask about his work, his stack or how he would build a product, and it answers out loud.",
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      about: personRef,
    },
    breadcrumbs({ name: "Talk to me", path: "/talk" }),
  ],
};

export const projectsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE.url}/projects/#collection`,
      url: `${SITE.url}/projects`,
      name: `Projects by ${SITE.name}`,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      author: personRef,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: project.title,
          description: project.summary,
          // Case studies are pages here; everything else is listed by its live address.
          url: project.slug ? caseStudyUrl(project) : project.link,
        })),
      },
    },
    breadcrumbs({ name: "Projects", path: "/projects" }),
  ],
};
