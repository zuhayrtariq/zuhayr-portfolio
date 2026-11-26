import HowSection from "@/components/sections/how-section";
import { PAGES, pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(PAGES.how);

export default function UpworkHowPage() {
  return (
    <main id="main">
      <HowSection audience="upwork" />
    </main>
  );
}
