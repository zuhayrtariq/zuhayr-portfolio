import { FOCUSES } from "@/constants/focus";

/**
 * Who a page is rendered for. Upwork does not allow a freelancer and a client to reach each
 * other outside Upwork before a contract starts, so clients who arrive from a proposal get
 * their own copy of the site, under /upwork, with no email, phone, form or social link on it.
 */
export type Audience = "direct" | "upwork";

export const UPWORK_ROOT = "/upwork";

/** An internal address as it is written inside one audience's copy of the site. */
export const hrefFor = (audience: Audience, href: string) => {
  // Files such as the résumé are not pages, and are the same for everyone.
  if (audience !== "upwork" || !href.startsWith("/") || /\.[a-z0-9]+$/i.test(href)) return href;
  if (href === UPWORK_ROOT || href.startsWith(`${UPWORK_ROOT}/`) || href.startsWith(`${UPWORK_ROOT}#`)) return href;
  // "/" and "/#contact" are on the copy's own home page.
  if (href === "/") return UPWORK_ROOT;
  return href.startsWith("/#") || href.startsWith("/?") ? `${UPWORK_ROOT}${href.slice(1)}` : `${UPWORK_ROOT}${href}`;
};

/** A pathname with the audience's prefix taken off, so one test serves both copies. */
export const barePath = (pathname: string) =>
  pathname === UPWORK_ROOT ? "/" : pathname.startsWith(`${UPWORK_ROOT}/`) ? pathname.slice(UPWORK_ROOT.length) : pathname;

/** The pages that open on the flight: the home page, and the home pages tailored to one kind of job. */
export const isHomePath = (pathname: string) => {
  const path = barePath(pathname);
  return path === "/" || (pathname.startsWith(UPWORK_ROOT) && FOCUSES.some((focus) => path === `/${focus.slug}`));
};
