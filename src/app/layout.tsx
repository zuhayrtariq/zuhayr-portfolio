import SmoothScroll from "@/components/site/smooth-scroll";
import Providers from "@/components/utils/providers";
import { display, text } from "@/constants/fonts";
import { SITE } from "@/constants/site";
import { OPEN_GRAPH } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";

const title = `${SITE.name} | Full-stack web and AI developer`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Zuhayr Tariq",
    "full-stack AI developer",
    "AI web developer",
    "full-stack web developer",
    "hire AI developer",
    "Next.js developer",
    "React Native developer",
    "AI agents",
    "RAG",
    "voice AI",
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
  openGraph: { ...OPEN_GRAPH, title, description: SITE.description },
  // X falls back to the Open Graph title, description and image.
  twitter: {
    card: "summary_large_image",
    creator: "@zuhayrtariq",
  },
  verification: {
    google: "SDIF20D5qYtRWbuFWvVITF0BYmcj1xvOynhNHPMcWJU",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#1d2a2c",
  colorScheme: "dark",
  viewportFit: "cover",
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
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <SmoothScroll />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
