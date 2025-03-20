"use client";

import React from "react";
import { usePathname } from "next/navigation";

const Head = () => {
  const pathname = usePathname();
  const title = pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);

  const meta = {
    title: `Zuhayr Tariq ${
      pathname === "/" ? "" : "• " + title.replace(/[-/]/g, " ")
    }`,
    description:
      "I'm a software engineer and a web developer. I love to build things for the web and mobile devices. I love to learn new things and I'm always looking for new challenges.",
    keywords:
      "Zuhayr Tariq, Web Developer, Software Engineer, Full Stack Developer",
    type: "website",
  };

  return (
    <>
      <title>{meta.title}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta name="robots" content="follow, index" />
      <meta content={meta.description} name="description" />
      <meta name="keywords" content={meta.keywords} />
      <meta
        property="og:url"
        content={`https://zuhayr.vercel.app${pathname}`}
      />
      <link rel="canonical" href={`https://zuhayr.vercel.app${pathname}`} />
      <link rel="me" href="mailto:TariqZuhayr@gmail.com" />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="Zuhayr Tariq" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@_Zuhayr_ms_" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      />
      <meta name="theme-color" content="#000000" />
    </>
  );
};

export default Head;
