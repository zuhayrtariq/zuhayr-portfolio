import { Navbar } from "@/components";
import Providers from "@/components/utils/providers";
import { base, heading } from "@/constants/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import Head from "./head";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zuhayr Tariq",
  description:
    "This is my portfolio website. My name is Zuhayr Tariq, I have graduated from Iobm",
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
          "min-h-screen bg-background text-foreground antialiased font-heading relative",
          heading.variable,
          base.variable
        )}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
