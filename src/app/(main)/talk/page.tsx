import JsonLd from "@/components/site/json-ld";
import TalkView from "@/components/talk/talk-view";
import { PAGES, pageMetadata } from "@/lib/metadata";
import { talkSchema } from "@/lib/structured-data";

export const metadata = pageMetadata(PAGES.talk);

export default function TalkPage() {
  return (
    <main id="main">
      <JsonLd data={talkSchema} />
      <TalkView />
    </main>
  );
}
