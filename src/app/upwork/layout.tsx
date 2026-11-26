import { AudienceProvider } from "@/components/site/audience";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import TalkBubble from "@/components/site/talk-bubble";
import type { Metadata } from "next";

/**
 * The copy of the site for clients who arrive from an Upwork proposal. Upwork does not allow
 * a client and a freelancer to reach each other anywhere else before a contract starts, so
 * nothing under /upwork shows an email address, a phone number, a contact form, a social
 * profile or the résumé, and every link stays inside it. Search engines are kept out: these
 * pages repeat the main site, and exist to be sent in a proposal.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  // The root layout names his X account here, which is one more way to reach him.
  twitter: { card: "summary_large_image" },
};

export default function UpworkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AudienceProvider value="upwork">
      <SiteHeader />
      {children}
      <SiteFooter audience="upwork" />
      <TalkBubble />
    </AudienceProvider>
  );
}
