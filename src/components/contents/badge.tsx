"use client";

import { SITE } from "@/constants/site";
import { hasHardwareWebGL } from "@/lib/gpu";
import { cn, hostOf } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Lanyard = dynamic(() => import("@/components/ui/lanyard"), { ssr: false });

const W = 1024;
const H = 1440;
const INK = "#0B0C0C";
const BONE = "#F2EFE8";
const EMBER = "#FF4D1F";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const canvas = () => {
  const el = document.createElement("canvas");
  el.width = W;
  el.height = H;
  return [el, el.getContext("2d")!] as const;
};

/** Sets the largest size at which `text` still fits `width`, and returns it. */
const fit = (ctx: CanvasRenderingContext2D, text: string, family: string, size: number, width: number, weight = 400) => {
  ctx.font = `${weight} ${size}px ${family}`;
  const measured = ctx.measureText(text).width;
  const fitted = measured > width ? Math.floor((size * width) / measured) : size;
  ctx.font = `${weight} ${fitted}px ${family}`;
  return fitted;
};

/**
 * Both faces of the badge are drawn here, in the page's own typefaces, so the
 * card always matches the site and there is no image to keep in sync.
 */
const drawFaces = async () => {
  const root = getComputedStyle(document.documentElement);
  const display = root.getPropertyValue("--font-imbue").trim() || "serif";
  const text = root.getPropertyValue("--font-atkinson").trim() || "sans-serif";
  const [avatar] = await Promise.all([
    loadImage("/images/avatar-large.webp"),
    document.fonts.load(`400 200px ${display}`),
    document.fonts.load(`700 44px ${text}`),
    document.fonts.load(`400 44px ${text}`),
  ]);

  const [front, f] = canvas();
  f.fillStyle = INK;
  f.fillRect(0, 0, W, H);
  const glow = f.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, W * 0.72);
  glow.addColorStop(0, "rgba(255, 77, 31, 0.62)");
  glow.addColorStop(0.55, "rgba(255, 77, 31, 0.16)");
  glow.addColorStop(1, "rgba(255, 77, 31, 0)");
  f.fillStyle = glow;
  f.fillRect(0, 0, W, H);
  // The drawn avatar, the same one as the mark in the header. Its shoulders are cut square
  // by the edge of the drawing, so they fade out before that edge shows.
  const size = 840;
  const [figure, g] = canvas();
  g.drawImage(avatar, (W - size) / 2, 176, size, size);
  const fade = g.createLinearGradient(0, 176 + size * 0.7, 0, 176 + size * 0.97);
  fade.addColorStop(0, "#000");
  fade.addColorStop(1, "transparent");
  g.globalCompositeOperation = "destination-in";
  g.fillStyle = fade;
  g.fillRect(0, 0, W, H);
  f.drawImage(figure, 0, 0);
  const floor = f.createLinearGradient(0, 860, 0, 1040);
  floor.addColorStop(0, "rgba(11, 12, 12, 0)");
  floor.addColorStop(1, INK);
  f.fillStyle = floor;
  f.fillRect(0, 860, W, 600);
  f.textAlign = "center";
  f.fillStyle = BONE;
  fit(f, SITE.name, display, 236, W - 150);
  f.fillText(SITE.name, W / 2, 1136);
  f.fillStyle = "#B9B6AD";
  f.font = `400 45px ${text}`;
  f.fillText("Full-stack web and AI developer", W / 2, 1212);
  f.fillStyle = EMBER;
  f.beginPath();
  f.roundRect(72, 1272, W - 144, 104, 52);
  f.fill();
  f.fillStyle = INK;
  f.font = `700 43px ${text}`;
  f.fillText("Top Rated Plus on Upwork", W / 2, 1339);

  const [back, b] = canvas();
  b.fillStyle = EMBER;
  b.fillRect(0, 0, W, H);
  b.textAlign = "center";
  b.fillStyle = INK;
  fit(b, "Let\u2019s talk.", display, 400, W - 150);
  b.fillText("Let\u2019s talk.", W / 2, 790);
  b.font = `700 46px ${text}`;
  b.fillText(SITE.email, W / 2, 900);
  b.font = `400 42px ${text}`;
  b.fillText(hostOf(SITE.url), W / 2, 1340);

  return { front: front.toDataURL("image/webp", 0.92), back: back.toDataURL("image/webp", 0.92) };
};

/**
 * Zuhayr's conference badge on a lanyard, hung in the page with real weight:
 * it swings, it can be grabbed and thrown, and a click turns it over. It is an
 * extra for large screens with a GPU; everything on it is also said in the text.
 */
const Badge = ({ className }: { className?: string }) => {
  const host = useRef<HTMLDivElement>(null);
  const [faces, setFaces] = useState<{ front: string; back: string } | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || !window.matchMedia("(width >= 64rem)").matches) return;
        io.disconnect();
        try {
          if (!(await hasHardwareWebGL())) return;
          const drawn = await drawFaces();
          if (!cancelled) setFaces(drawn);
        } catch {
          // Without the badge, the section is simply quieter.
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div ref={host} aria-hidden className={cn("max-lg:hidden", className)}>
      {faces && (
        <>
          {/* The strap comes down out of the dark instead of starting at a hard edge. */}
          <div className="absolute inset-0 [mask-image:linear-gradient(transparent,black_22%)]">
            <Lanyard
              frontImage={faces.front}
              backImage={faces.back}
              cardColor={INK}
              finish="glossy"
              cornerRadius={0.28}
              size={0.5}
              strapLength={0.46}
              strapColor={EMBER}
              strapWidth={0.6}
              metal="graphite"
              breeze={0.35}
            />
          </div>
          <p className="pointer-events-none absolute inset-x-0 bottom-[7%] animate-[page-in_1s_var(--ease-lights)_2.4s_both] text-center text-fine text-fog">
            Drag the badge, or click it to turn it over.
          </p>
        </>
      )}
    </div>
  );
};

export default Badge;
