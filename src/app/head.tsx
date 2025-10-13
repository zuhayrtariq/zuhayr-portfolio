"use client";

import React from "react";
import { usePathname } from "next/navigation";

const Head = () => {
  const pathname = usePathname();
  const title = pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);

  // Enhanced meta data for better SEO
  const meta = {
    title: `Zuhayr Tariq ${
      pathname === "/"
        ? "- Top Rated Full Stack Web Developer & Software Engineer"
        : "• " + title.replace(/[-/]/g, " ")
    }`,
    description:
      pathname === "/"
        ? "Zuhayr Tariq - Top Rated Full Stack Web Developer specializing in Next.js, React, Node.js, and AI-powered applications. Freelance developer with expertise in e-commerce, analytics platforms, and modern web technologies. Available for hire on Upwork."
        : "Zuhayr Tariq - Full Stack Web Developer portfolio showcasing projects, experience, and technical expertise in modern web development technologies.",
    keywords:
      "Zuhayr Tariq, Zuhayr, Full Stack Developer, Web Developer, Software Engineer, Next.js Developer, React Developer, Node.js Developer, Freelance Developer, Upwork Developer, AI Developer, E-commerce Developer, Portfolio, Web Development, JavaScript, TypeScript, Frontend Developer, Backend Developer, MERN Stack Developer, Portfolio Website, Hire Developer, Pakistan Developer",
    type: "website",
    author: "Zuhayr Tariq",
    siteName: "Zuhayr Tariq - Portfolio",
    locale: "en_US",
  };

  const currentUrl = `https://zuhayrr.com${pathname}`;

  // JSON-LD Structured Data for better SEO
  const jsonLd = {
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
  };

  return (
    <>
      <title>{meta.title}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />

      {/* Basic Meta Tags */}
      <meta
        name="robots"
        content="follow, index, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta
        name="googlebot"
        content="follow, index, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta content={meta.description} name="description" />
      <meta name="keywords" content={meta.keywords} />
      <meta name="author" content={meta.author} />
      <meta name="generator" content="Next.js" />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      <link rel="me" href="mailto:TariqZuhayr@gmail.com" />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content="https://zuhayrr.com/images/me.png" />
      <meta
        property="og:image:alt"
        content="Zuhayr Tariq - Full Stack Web Developer"
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={meta.locale} />
      <meta property="og:updated_time" content={new Date().toISOString()} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@zuhayrtariq" />
      <meta name="twitter:creator" content="@zuhayrtariq" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content="https://zuhayrr.com/images/me.png" />
      <meta
        name="twitter:image:alt"
        content="Zuhayr Tariq - Full Stack Web Developer"
      />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content="Zuhayr Tariq" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Security and Performance */}
      <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default Head;
