"use client";

import { SiteLink } from "@/components/site/audience";
import { barePath, isHomePath } from "@/lib/audience";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TalkBubble = () => {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const onHome = isHomePath(pathname);

  // The footer carries its own way in, and the bubble would sit on its links.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setAtFooter(entry.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, [pathname]);

  // The hero is the conversation, so the bubble waits until it has scrolled away.
  useEffect(() => {
    if (!onHome) return;
    const hero = document.querySelector('section[aria-labelledby="hero-title"]');
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting));
    io.observe(hero);
    // The contact section is the call to action, so the bubble does not sit on top of it.
    const contact = document.querySelector("#contact");
    const contactIo = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), {
      rootMargin: "0px 0px -30% 0px",
    });
    if (contact) contactIo.observe(contact);
    return () => {
      io.disconnect();
      contactIo.disconnect();
    };
  }, [onHome]);

  if (barePath(pathname).startsWith("/talk")) return null;
  const visible = !atFooter && (!onHome || (pastHero && !atContact));

  return (
    <SiteLink
      href="/talk"
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      className={cn(
        "fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-3 rounded-lg bg-mint py-2 pl-2 pr-5 text-ui font-bold text-pine shadow-[0_12px_34px_-8px_rgb(4_26_18/0.55)] transition-[opacity,transform] duration-300 ease-[var(--ease-lights)] md:bottom-8 md:right-8",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <span className="flex size-10 items-end justify-center overflow-hidden rounded-md bg-emerald">
        {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
        <img
          src="/images/avatar.webp"
          alt=""
          width={44}
          height={44}
          decoding="async"
          className="size-11 max-w-none"
        />
      </span>
      Talk to me
    </SiteLink>
  );
};

export default TalkBubble;
