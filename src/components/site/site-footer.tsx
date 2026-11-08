import { SITE } from "@/constants/site";

const links = [
  { name: "GitHub", href: SITE.github },
  { name: "LinkedIn", href: SITE.linkedin },
  { name: "Upwork", href: SITE.upwork },
  { name: "Résumé (PDF)", href: SITE.resume },
];

const SiteFooter = () => {
  return (
    <footer className="bg-umbra">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-[clamp(20px,4vw,64px)] pb-12 pt-4 text-ui text-fog md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Zuhayr Tariq</p>
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
    </footer>
  );
};

export default SiteFooter;
