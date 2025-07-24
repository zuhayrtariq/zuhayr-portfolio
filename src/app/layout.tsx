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
  title: "Zuhayr Tariq",
  description:
    "This is my portfolio website. My name is Zuhayr Tariq and I am a Fullstack Web Developer.",
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
