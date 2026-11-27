import { SiteLink } from "@/components/site/audience";
import { projects } from "@/constants/projects";
import { hrefFor, type Audience } from "@/lib/audience";

/** The rest of the site, one line each. */
const WAYS = [
  { name: "Work", href: "/work", line: `All ${projects.length} projects, back to my first React apps.` },
  { name: "How I work", href: "/how-i-work", line: "My desk, my hours against yours, and what I do when something breaks." },
  { name: "Experience", href: "/experience", line: "Five years, six roles, and the tools I build with." },
  { name: "Talk to me", href: "/talk", line: "Ask my AI anything about my work. It answers out loud." },
];

/** The way on from the home page: the four other pages, each with its address. */
const Next = ({ audience = "direct" }: { audience?: Audience }) => {
  return (
    <section aria-labelledby="ways-title" className="on-ink relative bg-ink">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-24 md:py-32">
        <h2 id="ways-title" className="text-[clamp(34px,4.3vw,72px)]">
          Where to next.
        </h2>
        <nav aria-labelledby="ways-title" className="mt-10 md:mt-14">
          <ul className="border-t">
            {WAYS.map((way) => (
              <li key={way.href} className="border-b">
                <SiteLink
                  href={way.href}
                  className="group/way grid gap-x-10 gap-y-2 py-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-baseline md:py-8"
                >
                  <span className="font-display text-[clamp(30px,4vw,64px)] font-black leading-none tracking-[-0.03em] transition-colors duration-200 group-hover/way:text-mint">
                    {way.name}
                  </span>
                  <span className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-1">
                    <span className="max-w-[46ch] text-body text-fog">{way.line}</span>
                    <span className="font-mono text-fine text-fog">{hrefFor(audience, way.href)}</span>
                  </span>
                </SiteLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Next;
