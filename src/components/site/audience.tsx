"use client";

import { hrefFor, type Audience } from "@/lib/audience";
import Link from "next/link";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";

const AudienceContext = createContext<Audience>("direct");

/** Set once, in the layout of the Upwork copy of the site. Everywhere else the audience is "direct". */
export const AudienceProvider = ({ value, children }: { value: Audience; children: ReactNode }) => (
  <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>
);

export const useAudience = () => useContext(AudienceContext);

type SiteLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * A link to a page of this site. Inside the Upwork copy it stays inside that copy, so a
 * client who arrived from a proposal never lands on a page with contact details.
 */
export const SiteLink = ({ href, ...props }: SiteLinkProps) => <Link href={hrefFor(useAudience(), href)} {...props} />;
