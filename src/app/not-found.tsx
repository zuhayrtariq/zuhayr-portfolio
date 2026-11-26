import NotFoundBody from "@/components/site/not-found-body";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. Head back to the home page, or ask Zuhayr's AI what you were looking for.",
};

export default function NotFound() {
  return <NotFoundBody />;
}
