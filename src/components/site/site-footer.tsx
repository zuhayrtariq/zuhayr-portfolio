import { SITE } from "@/constants/site";

const links = [
  { name: "GitHub", href: SITE.github },
  { name: "LinkedIn", href: SITE.linkedin },
  { name: "Upwork", href: SITE.upwork },
  { name: "Résumé (PDF)", href: SITE.resume },
];

const SiteFooter = () => {
  return (
    <footer className="overflow-hidden bg-umbra">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-6 px-[clamp(20px,4vw,64px)] pt-10 text-ui text-fog md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Zuhayr Tariq. Islamabad, working worldwide.</p>
        <ul className="flex flex-wrap gap-x-7 gap-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-caption"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* The name signs off the page, sunk into the bottom edge. It is decoration, so it is drawn
          from CSS and never reaches the accessibility tree. */}
      <div
        aria-hidden
        className="pointer-events-none -mb-[0.2em] mt-10 select-none whitespace-nowrap text-center font-display text-[length:25.5vw] leading-[0.8] tracking-[-0.015em] text-caption/10 before:content-['Zuhayr_Tariq']"
      />
    </footer>
  );
};

export default SiteFooter;
