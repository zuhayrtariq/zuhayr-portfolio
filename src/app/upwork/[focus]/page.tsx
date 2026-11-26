import HomeSection from "@/components/sections/home-section";
import { FOCUSES, getFocus } from "@/constants/focus";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return FOCUSES.map((focus) => ({ focus: focus.slug }));
}

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

type Props = { params: Promise<{ focus: string }> };

/** The Upwork home page, leading with the work closest to one kind of job. */
export default async function UpworkFocusHome({ params }: Props) {
  const focus = getFocus((await params).focus);
  if (!focus) notFound();

  return (
    <main id="main">
      <HomeSection audience="upwork" focus={focus} />
    </main>
  );
}
