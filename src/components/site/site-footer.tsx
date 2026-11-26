import { SiteLink } from "@/components/site/audience";
import HireSign from "@/components/site/hire-sign";
import { caseStudies } from "@/constants/projects";
import { NAV_LINKS, SITE } from "@/constants/site";
import type { Audience } from "@/lib/audience";

const site = { title: "Site", links: NAV_LINKS };
const studies = {
  title: "Case studies",
  links: caseStudies.map((project) => ({ name: project.title, href: `/work/${project.slug}` })),
};

/** The other places he can be found. A client from Upwork is only ever sent back to Upwork. */
const elsewhere = (audience: Audience) => ({
  title: "Elsewhere",
  links:
    audience === "upwork"
      ? [{ name: "My Upwork profile", href: SITE.upwork }]
      : [
          { name: "GitHub", href: SITE.github },
          { name: "LinkedIn", href: SITE.linkedin },
          { name: "Upwork", href: SITE.upwork },
          { name: "Résumé (PDF)", href: SITE.resume },
        ],
});

const linkClass = "link-underline inline-block py-1.5 decoration-transparent";

const SiteFooter = ({ audience = "direct" }: { audience?: Audience }) => {
  const columns = [site, studies, elsewhere(audience)];
  return (
    <footer className="on-night overflow-hidden bg-night">
      {/* Approach lights: a row of lamps that fire in turn toward the page above. */}
      <div aria-hidden className="mx-auto flex max-w-[1680px] items-center justify-between px-[clamp(20px,4vw,64px)] pt-10">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 70}ms` }}
            className="size-1.5 rounded-full bg-sun opacity-25 motion-safe:animate-[approach_1.7s_linear_infinite] max-sm:nth-[2n]:hidden"
          />
        ))}
      </div>

      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)]">
        <div className="grid gap-x-8 gap-y-14 pt-14 md:pt-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3 text-ui text-fog">
              {/* eslint-disable-next-line @next/next/no-img-element -- the favicon's own drawing, from scripts/build-avatar.mjs */}
              <img src="/images/avatar-mark.webp" alt="" width={40} height={40} loading="lazy" decoding="async" className="size-10" />
              Taking on new projects
            </p>
            <p className="mt-7 max-w-[19ch] font-display text-[clamp(28px,2.9vw,44px)] font-extrabold leading-[1] tracking-[-0.025em] font-stretch-[130%]">
              Have something to build? Describe it, and I&apos;ll land it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <HireSign />
              {audience === "direct" && (
                <a href={`mailto:${SITE.email}`} className="link-underline text-ui">
                  {SITE.email}
                </a>
              )}
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="font-text text-fine font-normal tracking-normal text-fog font-stretch-normal">{column.title}</h2>
                <ul className="mt-4 text-ui">
                  {column.links.map((link) => {
                    const external = link.href.startsWith("http") || link.href === SITE.resume;
                    return (
                      <li key={link.href}>
                        {external ? (
                          <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                            {link.name}
                          </a>
                        ) : (
                          <SiteLink href={link.href} className={linkClass}>
                            {link.name}
                          </SiteLink>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t pt-6 text-fine text-fog sm:flex-row sm:items-start sm:justify-between md:mt-24">
          <p className="max-w-[72ch]">
            &copy; {new Date().getFullYear()} Zuhayr Tariq. Islamabad, Pakistan, working worldwide.
            {audience === "upwork" &&
              " This is the copy of my site for Upwork clients. It has no email, phone number or contact form, because Upwork asks us to talk there until a contract starts."}
          </p>
          <a href="#main" className="link-underline shrink-0 decoration-transparent">
            Back to the top
          </a>
        </div>
      </div>

      {/* The name signs off the page, set as wide as the page is. It is decoration, so it
          is drawn from CSS and never reaches the accessibility tree. */}
      <div
        aria-hidden
        className="pointer-events-none mt-10 select-none whitespace-nowrap text-center font-display text-[length:9.2vw] font-black leading-[0.82] tracking-[-0.04em] text-white/8 font-stretch-[150%] before:content-['Zuhayr_Tariq']"
      />
    </footer>
  );
};

export default SiteFooter;
