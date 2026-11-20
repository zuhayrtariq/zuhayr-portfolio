"use client";

import { hasHardwareWebGL } from "@/lib/gpu";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Silk = dynamic(() => import("@/components/ui/silk"), { ssr: false });

/**
 * The orange ground of the contact section, moving like a sheet of silk and
 * giving way under the pointer. It loads when the section comes near, and
 * machines without a GPU keep the flat colour underneath.
 */
const ContactBackdrop = () => {
  const host = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if ((await hasHardwareWebGL()) && !cancelled) setOn(true);
      },
      { rootMargin: "60% 0px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div ref={host} aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {on && (
        <Silk
          lightMode
          color="#ff4d1f"
          sheenColor="#ff7a4d"
          speed={2.2}
          scale={0.85}
          rotation={0.35}
          depth={0.28}
          sheen={0.22}
          glow={0.1}
          noiseIntensity={0.6}
          ripple={0.6}
          interactionStrength={0.8}
          className="animate-[page-in_1.2s_var(--ease-lights)_both]"
        />
      )}
    </div>
  );
};

export default ContactBackdrop;
