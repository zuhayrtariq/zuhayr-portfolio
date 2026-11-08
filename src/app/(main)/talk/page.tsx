import TalkView from "@/components/talk/talk-view";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Talk to me",
  description: "Ask Zuhayr's AI about his work, his stack, or how he'd build your product. It answers out loud.",
  alternates: { canonical: "/talk" },
};

export default function TalkPage() {
  return (
    <main id="main">
      <Suspense>
        <TalkView />
      </Suspense>
    </main>
  );
}
