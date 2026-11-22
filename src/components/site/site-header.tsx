"use client";

import Sign from "@/components/ui/sign";
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
  /** Pages that open on a dark picture, where the bar starts out clear with light type. */
  const overDark = pathname === "/" || pathname.startsWith("/talk");

  // On the home page the bar stays clear over the whole flight. Past it, it steps out of
  // the way while reading down and returns on the first scroll up.
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

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,translate,box-shadow] duration-500 ease-[var(--ease-lights)] focus-within:translate-y-0",
        solid
          ? "on-cloud bg-cloud/92 shadow-[0_1px_0_rgb(7_18_51/0.1)] backdrop-blur-md"
          : overDark
            ? "on-night [text-shadow:0_1px_14px_rgb(7_18_51/0.6)]"
            : "on-cloud",
        hidden && !open && "-translate-y-full"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-sun focus:px-3 focus:py-2 focus:text-night"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-[clamp(20px,4vw,64px)] md:h-20">
        <Link
          href="/"
          className="flex items-center gap-3 whitespace-nowrap font-display text-[19px] font-extrabold leading-none tracking-[-0.02em] font-stretch-[130%]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- the favicon's own drawing, from scripts/build-avatar.mjs */}
          <img src="/images/avatar-mark.webp" alt="" width={32} height={32} decoding="async" className="size-8" />
          Zuhayr Tariq
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 whitespace-nowrap lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="link-underline text-ui decoration-transparent">
              {link.name}
            </Link>
          ))}
          <Sign href="/#contact" className="h-11 [&>span:last-child]:w-11">
            Start a project
          </Sign>
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
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex h-14 items-center font-display text-[26px] font-extrabold tracking-[-0.02em] font-stretch-[130%]"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <span onClick={() => setOpen(false)} className="mt-5 block">
          <Sign href="/#contact">Start a project</Sign>
        </span>
      </nav>
    </header>
  );
};

export default SiteHeader;
