import History from "@/components/experience/history";
import JsonLd from "@/components/site/json-ld";
import { PAGES, pageMetadata } from "@/lib/metadata";
import { experienceSchema } from "@/lib/structured-data";

export const metadata = pageMetadata(PAGES.experience);

export default function ExperiencePage() {
  return (
    <main id="main">
      <JsonLd data={experienceSchema} />
      <History />
    </main>
  );
}
