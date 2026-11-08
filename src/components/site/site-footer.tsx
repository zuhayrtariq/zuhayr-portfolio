import { SITE } from "@/constants/site";

const links = [
  { name: "GitHub", href: SITE.github },
  { name: "LinkedIn", href: SITE.linkedin },
  { name: "Upwork", href: SITE.upwork },
  { name: "Resume (PDF)", href: SITE.resume },
];

const SiteFooter = () => {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-[15px] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          &copy; {new Date().getFullYear()} Zuhayr Tariq. Built with Next.js.
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
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
