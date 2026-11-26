import TalkView from "@/components/talk/talk-view";
import { PAGES, pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(PAGES.talk);

export default function UpworkTalkPage() {
  return (
    <main id="main">
      <TalkView />
    </main>
  );
}
