import HowSection from "@/components/sections/how-section";
import JsonLd from "@/components/site/json-ld";
import { PAGES, pageMetadata } from "@/lib/metadata";
import { howSchema } from "@/lib/structured-data";

export const metadata = pageMetadata(PAGES.how);

export default function HowPage() {
  return (
    <main id="main">
      <JsonLd data={howSchema} />
      <HowSection />
    </main>
  );
}
