import { notFound } from "next/navigation";

/**
 * Any address under /upwork that is not a page. Without this, a wrong address would be
 * answered by the main site's 404 page, whose links lead out of the Upwork copy.
 */
export default function UpworkMissingPage() {
  notFound();
}
