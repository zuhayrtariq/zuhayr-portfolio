import SmoothScroll from "@/components/site/smooth-scroll";
import Providers from "@/components/utils/providers";
import { display, text } from "@/constants/fonts";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";

const description =
  "Zuhayr Tariq is a full-stack and AI engineer and Lead Developer at Starling MX. He builds voice agents, RAG and agent systems, and the Next.js platforms around them.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Zuhayr Tariq | AI products people can talk to",
    template: "%s | Zuhayr Tariq",
  },
  description,
  keywords: [
    "Zuhayr Tariq",
    "AI engineer",
    "voice AI developer",
    "voice agents",
    "RAG",
    "AI agents",
    "full-stack developer",
    "Next.js developer",
    "Vapi",
    "OpenAI Realtime API",
    "Upwork Top Rated Plus",
    "Pakistan",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: "Zuhayr Tariq | AI products people can talk to",
    description,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@zuhayrtariq",
    title: "Zuhayr Tariq | AI products people can talk to",
    description,
  },
  verification: {
    google: "SDIF20D5qYtRWbuFWvVITF0BYmcj1xvOynhNHPMcWJU",
  },
  alternates: {
    canonical: "/",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#1d2a2c",
  colorScheme: "dark",
  viewportFit: "cover",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/images/me.png`,
  jobTitle: "Lead Developer",
  worksFor: { "@type": "Organization", name: "Starling MX", url: "https://www.starlingmx.com" },
  description,
  knowsAbout: [
    "Voice AI",
    "AI agents",
    "Retrieval-augmented generation",
    "Next.js",
    "TypeScript",
    "Node.js",
  ],
  sameAs: [SITE.github, SITE.linkedin, SITE.upwork],
  email: SITE.email,
  address: { "@type": "PostalAddress", addressCountry: "Pakistan" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(display.variable, text.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <SmoothScroll />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
