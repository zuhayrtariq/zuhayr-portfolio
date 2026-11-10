import TalkView from "@/components/talk/talk-view";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Talk to me",
  description: "Ask Zuhayr's AI about his work, his stack, or how he'd build your product. It answers out loud.",
  path: "/talk",
});

export default function TalkPage() {
  return (
    <main id="main">
      <TalkView />
    </main>
  );
}
