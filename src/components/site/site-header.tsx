"use client";

import { SiteLink } from "@/components/site/audience";
import HireSign from "@/components/site/hire-sign";
import { NAV_LINKS } from "@/constants/site";
import { barePath, isHomePath } from "@/lib/audience";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const HEADER_HEIGHT = 80;

const SiteHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const onHome = isHomePath(pathname);
  /** Pages that open on a dark ground, where the bar starts out clear with light type. */
  const overDark = onHome || ["/talk", "/how-i-work"].includes(barePath(pathname));

  // On the home page the bar stays clear over the whole first section, which holds the screen
  // while it plays. Past it, it steps out of the way while reading down and returns on the
  // first scroll up. With reduced motion that section scrolls away like any page, so the bar
  // turns solid as soon as words start to pass under it.
  useEffect(() => {
    const held = onHome && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = held ? document.querySelector('section[aria-labelledby="hero-title"]') : null;
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
  }, [pathname, onHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;
  /** The button takes the colour that shows on the ground the bar is over: blue on paper, mint on blue and navy. */
  const tone = solid || !overDark ? "brand" : "mint";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,translate,box-shadow] duration-500 ease-[var(--ease-lights)] focus-within:translate-y-0",
        solid
          ? "on-paper bg-paper/92 shadow-[0_1px_0_rgb(6_14_40/0.1)] backdrop-blur-md"
          : overDark
            ? "on-ink"
            : "on-paper",
        // A little further than its own height, so the shadow under the sign leaves with it.
        hidden && !open && "-translate-y-[calc(100%+3rem)]"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-mint focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-[clamp(20px,4vw,64px)] md:h-20">
        <SiteLink
          href="/"
          className="flex items-center gap-3 whitespace-nowrap font-display text-[19px] font-extrabold leading-none tracking-[-0.02em]"
        >
          {/* The drawn avatar on a mint tile, which shows on every ground the bar sits over. */}
          <span className="flex size-8 items-end justify-center overflow-hidden rounded-md bg-mint">
            {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
            <img src="/images/avatar.webp" alt="" width={36} height={36} decoding="async" className="size-9 max-w-none" />
          </span>
          Zuhayr Tariq
        </SiteLink>

        <nav aria-label="Main" className="hidden items-center gap-8 whitespace-nowrap lg:flex">
          {NAV_LINKS.map((link) => (
            <SiteLink key={link.href} href={link.href} className="link-underline text-ui decoration-transparent">
              {link.name}
            </SiteLink>
          ))}
          <HireSign tone={tone} className="h-11 px-5" />
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      <nav id="mobile-nav" aria-label="Mobile" className={cn("px-[clamp(20px,4vw,64px)] pb-8 lg:hidden", open ? "block" : "hidden")}>
        <ul className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-t">
              <SiteLink
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex h-14 items-center font-display text-[26px] font-extrabold tracking-[-0.02em]"
              >
                {link.name}
              </SiteLink>
            </li>
          ))}
        </ul>
        <span onClick={() => setOpen(false)} className="mt-5 block">
          <HireSign tone="brand" />
        </span>
      </nav>
    </header>
  );
};

export default SiteHeader;
