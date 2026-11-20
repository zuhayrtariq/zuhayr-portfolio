import { caseStudies } from "@/constants/projects";
import { NAV_LINKS, SITE } from "@/constants/site";
import { ArrowUpIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import FooterBust from "./footer-bust";

const columns = [
  {
    title: "Site",
    links: [...NAV_LINKS, { name: "All projects", href: "/projects" }],
  },
  {
    title: "Case studies",
    links: caseStudies.map((project) => ({ name: project.title, href: `/work/${project.slug}` })),
  },
  {
    title: "Elsewhere",
    links: [
      { name: "GitHub", href: SITE.github },
      { name: "LinkedIn", href: SITE.linkedin },
      { name: "Upwork", href: SITE.upwork },
      { name: "Résumé (PDF)", href: SITE.resume },
    ],
  },
];

const linkClass = "inline-flex items-center gap-1.5 py-1.5 text-caption transition-colors hover:text-signal";

const SiteFooter = () => {
  return (
    <footer className="overflow-hidden bg-umbra">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)]">
        <div className="grid gap-x-8 gap-y-14 pt-16 md:pt-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <FooterBust className="size-28 rounded-[24px]" />
              <p className="flex items-center gap-2.5 text-ui text-fog">
                <span aria-hidden className="relative flex size-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
                  <span className="relative size-2.5 rounded-full bg-signal" />
                </span>
                Taking on new projects
              </p>
            </div>
            <p className="mt-8 max-w-[18ch] font-display text-q-sm leading-[1.02] font-semibold md:text-q">
              Have something to build? Describe it, and I&apos;ll take it from there.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/#contact"
                className="inline-flex h-12 items-center rounded-full bg-caption px-7 text-ui font-bold text-umbra transition-colors hover:bg-signal"
              >
                Start a project
              </Link>
              <a href={`mailto:${SITE.email}`} className="link-underline text-ui">
                {SITE.email}
              </a>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:col-span-6 lg:col-start-7"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="font-text text-fine text-fog">{column.title}</h2>
                <ul className="mt-4 text-ui">
                  {column.links.map((link) => {
                    const external = link.href.startsWith("http") || link.href === SITE.resume;
                    return (
                      <li key={link.href}>
                        {external ? (
                          <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                            {link.name}
                            <ArrowUpRightIcon aria-hidden className="size-3.5 text-fog" />
                          </a>
                        ) : (
                          <Link href={link.href} className={linkClass}>
                            {link.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t pt-6 text-fine text-fog sm:flex-row sm:items-center sm:justify-between md:mt-24">
          <p>&copy; {new Date().getFullYear()} Zuhayr Tariq. Islamabad, Pakistan, working worldwide.</p>
          <a href="#main" className="inline-flex items-center gap-1.5 transition-colors hover:text-caption">
            Back to top
            <ArrowUpIcon aria-hidden className="size-3.5" />
          </a>
        </div>
      </div>

      {/* The name signs off the page, whole, from one edge to the other. It is decoration, so it
          is drawn from CSS and never reaches the accessibility tree. */}
      <div
        aria-hidden
        className="pointer-events-none select-none whitespace-nowrap bg-gradient-to-b from-caption/25 to-caption/5 bg-clip-text pb-[0.14em] text-center font-display text-[length:25.5vw] leading-[1.08] tracking-[-0.015em] text-transparent before:content-['Zuhayr_Tariq']"
      />
    </footer>
  );
};

export default SiteFooter;
