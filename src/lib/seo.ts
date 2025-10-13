export const seoConfig = {
  siteName: "Zuhayr Tariq",
  siteUrl: "https://zuhayrr.com",
  defaultTitle:
    "Zuhayr Tariq - Top Rated Full Stack Web Developer & Software Engineer",
  titleTemplate: "%s | Zuhayr Tariq",
  defaultDescription:
    "Zuhayr Tariq - Top Rated Full Stack Web Developer specializing in Next.js, React, Node.js, and AI-powered applications. Freelance developer with expertise in e-commerce, analytics platforms, and modern web technologies. Available for hire on Upwork.",

  keywords: [
    "Zuhayr Tariq",
    "Zuhayr",
    "Full Stack Developer",
    "Web Developer",
    "Software Engineer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "Freelance Developer",
    "Upwork Developer",
    "AI Developer",
    "E-commerce Developer",
    "Portfolio",
    "Web Development",
    "JavaScript",
    "TypeScript",
    "Frontend Developer",
    "Backend Developer",
    "MERN Stack Developer",
    "Portfolio Website",
    "Hire Developer",
    "Pakistan Developer",
    "Top Rated Developer",
    "Freelance Web Developer",
    "React Specialist",
    "Next.js Expert",
    "Full Stack Engineer",
    "Web Application Developer",
    "Custom Web Development",
    "Modern Web Technologies",
  ],

  social: {
    twitter: "@zuhayrtariq",
    github: "https://github.com/zuhayrtariq",
    linkedin: "https://linkedin.com/in/zuhayr-tariq",
    upwork: "https://www.upwork.com/freelancers/zuhayr",
    email: "TariqZuhayr@gmail.com",
  },

  images: {
    default: "https://zuhayrr.com/images/me.png",
    width: 1200,
    height: 630,
    alt: "Zuhayr Tariq - Full Stack Web Developer",
  },

  structuredData: {
    person: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Zuhayr Tariq",
      alternateName: "Zuhayr",
      url: "https://zuhayrr.com",
      image: "https://zuhayrr.com/images/me.png",
      description:
        "Top Rated Full Stack Web Developer specializing in Next.js, React, Node.js, and AI-powered applications",
      jobTitle: "Full Stack Web Developer",
      worksFor: {
        "@type": "Organization",
        name: "Freelance",
      },
      knowsAbout: [
        "Web Development",
        "Full Stack Development",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "AI Development",
        "E-commerce Development",
        "Frontend Development",
        "Backend Development",
        "Database Design",
        "API Development",
        "Cloud Computing",
        "DevOps",
      ],
      sameAs: [
        "https://github.com/zuhayrtariq",
        "https://www.upwork.com/freelancers/zuhayr",
        "https://linkedin.com/in/zuhayr-tariq",
      ],
      email: "TariqZuhayr@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressCountry: "Pakistan",
      },
      hasOccupation: {
        "@type": "Occupation",
        name: "Full Stack Web Developer",
        description:
          "Developing full-stack web applications using modern technologies",
      },
    },

    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Zuhayr Tariq Portfolio",
      url: "https://zuhayrr.com",
      description:
        "Professional portfolio of Zuhayr Tariq, Top Rated Full Stack Web Developer",
      author: {
        "@type": "Person",
        name: "Zuhayr Tariq",
      },
      publisher: {
        "@type": "Person",
        name: "Zuhayr Tariq",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://zuhayrr.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  },
};

export function generatePageMetadata(
  pageTitle: string,
  description?: string,
  keywords?: string[]
) {
  return {
    title: pageTitle,
    description: description || seoConfig.defaultDescription,
    keywords: keywords || seoConfig.keywords,
    openGraph: {
      title: `${pageTitle} | ${seoConfig.siteName}`,
      description: description || seoConfig.defaultDescription,
      url: seoConfig.siteUrl,
      siteName: seoConfig.siteName,
      images: [seoConfig.images.default],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | ${seoConfig.siteName}`,
      description: description || seoConfig.defaultDescription,
      images: [seoConfig.images.default],
      creator: seoConfig.social.twitter,
    },
  };
}
