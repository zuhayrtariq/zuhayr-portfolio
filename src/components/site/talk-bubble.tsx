"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TalkBubble = () => {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const onHome = pathname === "/";

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

  if (pathname.startsWith("/talk")) return null;
  const visible = !onHome || (pastHero && !atContact);

  return (
    <Link
      href="/talk"
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      className={cn(
        "fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-3 rounded-full bg-ember py-2 pl-2 pr-6 text-ui font-bold text-ink shadow-[0_8px_30px_rgb(0_0_0/0.35)] transition-[opacity,transform,background-color] duration-300 ease-[var(--ease-lights)] hover:bg-paper md:bottom-8 md:right-8",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <span className="relative size-10 overflow-hidden rounded-full bg-ink">
        <Image
          src="/images/me.png"
          alt=""
          fill
          sizes="40px"
          className="-scale-x-100 object-cover [object-position:50%_16%] grayscale"
        />
      </span>
      Talk to me
    </Link>
  );
};

export default TalkBubble;
