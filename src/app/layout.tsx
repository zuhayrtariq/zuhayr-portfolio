import Providers from "@/components/utils/providers";
import { base, heading } from "@/constants/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Head from "./head";
export const metadata: Metadata = {
  title: {
    default:
      "Zuhayr Tariq - Top Rated Full Stack Web Developer & Software Engineer",
    template: "%s | Zuhayr Tariq",
  },
  description:
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
  ],
  authors: [{ name: "Zuhayr Tariq", url: "https://zuhayrr.com" }],
  creator: "Zuhayr Tariq",
  publisher: "Zuhayr Tariq",
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
    url: "https://zuhayrr.com",
    title:
      "Zuhayr Tariq - Top Rated Full Stack Web Developer & Software Engineer",
    description:
      "Top Rated Full Stack Web Developer specializing in Next.js, React, Node.js, and AI-powered applications. Freelance developer available for hire.",
    siteName: "Zuhayr Tariq - Portfolio",
    images: [
      {
        url: "https://zuhayrr.com/images/me.png",
        width: 1200,
        height: 630,
        alt: "Zuhayr Tariq - Full Stack Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Zuhayr Tariq - Top Rated Full Stack Web Developer & Software Engineer",
    description:
      "Top Rated Full Stack Web Developer specializing in Next.js, React, Node.js, and AI-powered applications. Freelance developer available for hire.",
    creator: "@zuhayrtariq",
    images: ["https://zuhayrr.com/images/me.png"],
  },
  verification: {
    google: "SDIF20D5qYtRWbuFWvVITF0BYmcj1xvOynhNHPMcWJU", // You'll need to add this from Google Search Console
    // other: {
    //   "msvalidate.01": "your-bing-verification-code", // Add Bing verification if needed
    // },
  },
  alternates: {
    canonical: "https://zuhayrr.com",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <Head />
        <link rel="preload" href="/images/me.png" as="image" />
        <link rel="preload" href="/images/art.svg" as="image" />
        <link rel="preload" href="/images/code.svg" as="image" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//vercel.live" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased font-heading relative select-none ",
          heading.variable,
          base.variable
        )}
      >
        <Providers>
          {/* <Navbar /> */}
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
