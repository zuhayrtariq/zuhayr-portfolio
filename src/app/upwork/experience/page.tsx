import History from "@/components/experience/history";
import { PAGES, pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(PAGES.experience);

export default function UpworkExperiencePage() {
  return (
    <main id="main">
      <History audience="upwork" />
    </main>
  );
}
