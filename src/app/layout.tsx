import SmoothScroll from "@/components/site/smooth-scroll";
import Providers from "@/components/utils/providers";
import { display, text } from "@/constants/fonts";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";

const description =
  "Zuhayr Tariq is a full-stack and AI engineer and Lead Developer at Starling MX. He builds web and mobile apps, APIs, payments and AI features end to end, and ships them on the dates he commits to.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Zuhayr Tariq | I ship what I promise, when I promise it",
    template: "%s | Zuhayr Tariq",
  },
  description,
  keywords: [
    "Zuhayr Tariq",
    "full-stack developer",
    "full-stack engineer",
    "AI engineer",
    "Next.js developer",
    "TypeScript developer",
    "React Native developer",
    "AI agents",
    "RAG",
    "freelance developer",
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
    title: "Zuhayr Tariq | I ship what I promise, when I promise it",
    description,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@zuhayrtariq",
    title: "Zuhayr Tariq | I ship what I promise, when I promise it",
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
    "Full-stack development",
    "Next.js",
    "TypeScript",
    "Node.js",
    "React Native",
    "AI agents",
    "Retrieval-augmented generation",
    "Voice AI",
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
