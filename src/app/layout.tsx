import SmoothScroll from "@/components/site/smooth-scroll";
import Providers from "@/components/utils/providers";
import { display, text } from "@/constants/fonts";
import { SITE } from "@/constants/site";
import { HOME_TITLE, OPEN_GRAPH } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Zuhayr Tariq",
    "full-stack AI developer",
    "AI web developer",
    "full-stack web developer",
    "hire AI developer",
    "freelance full-stack developer",
    "Next.js developer",
    "React developer",
    "React Native developer",
    "Node.js developer",
    "AI chatbot developer",
    "Claude developer",
    "Gemini developer",
    "AI-assisted development",
    "AI prototype to production",
    "MVP development",
    "AI agents",
    "RAG",
    "voice AI",
    "Upwork Top Rated Plus",
    "Pakistan",
  ],
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
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
  // Only the home page keeps these: every page below it sets its own through pageMetadata,
  // and setting openGraph on the home page itself would drop the app/opengraph-image file.
  openGraph: { ...OPEN_GRAPH, title: HOME_TITLE, description: SITE.description, url: "/" },
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
  themeColor: "#0b0c0c",
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
