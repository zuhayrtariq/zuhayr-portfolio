import Cursor from "@/components/site/cursor";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import TalkBubble from "@/components/site/talk-bubble";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <TalkBubble />
      <Cursor />
    </>
  );
}
