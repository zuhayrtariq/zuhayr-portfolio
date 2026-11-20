"use client";

import { NAV_LINKS } from "@/constants/site";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const HEADER_HEIGHT = 80;

const SiteHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // On the home page the header stays clear over the whole hero. Past it, the bar
  // steps out of the way while reading down and returns on the first scroll up.
  useEffect(() => {
    const hero = pathname === "/" ? document.querySelector('section[aria-labelledby="hero-title"]') : null;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const past = hero ? hero.getBoundingClientRect().bottom <= HEADER_HEIGHT : y > 24;
      setScrolled(past);
      if (Math.abs(y - last) > 6) {
        setHidden(past && y > last);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,translate] duration-500 ease-[var(--ease-lights)] focus-within:translate-y-0",
        scrolled || open ? "bg-backdrop" : "bg-transparent",
        hidden && !open && "-translate-y-full"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-umbra focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-[clamp(20px,4vw,64px)] md:h-20">
        <Link href="/" className="flex items-center gap-3 font-display text-[26px] font-semibold leading-none">
          {/* eslint-disable-next-line @next/next/no-img-element -- the favicon's own drawing, from scripts/build-avatar.mjs */}
          <img
            src="/images/avatar-mark.webp"
            alt=""
            width={32}
            height={32}
            decoding="async"
            className="size-8"
          />
          Zuhayr Tariq
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ui text-fog transition-colors hover:text-caption"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="inline-flex h-11 items-center rounded-full bg-caption px-6 text-ui font-bold text-umbra transition-colors hover:bg-signal"
          >
            Start a project
          </Link>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={cn("bg-backdrop px-[clamp(20px,4vw,64px)] pb-8 md:hidden", open ? "block" : "hidden")}
      >
        <ul className="flex flex-col">
          {[...NAV_LINKS, { name: "Start a project", href: "/#contact" }].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex h-14 items-center font-display text-[34px] font-semibold"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default SiteHeader;
