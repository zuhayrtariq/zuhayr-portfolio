import Route from "@/components/flight/route";
import { PAGES, pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(PAGES.experience);

export default function UpworkExperiencePage() {
  return (
    <main id="main">
      <Route audience="upwork" />
    </main>
  );
}
