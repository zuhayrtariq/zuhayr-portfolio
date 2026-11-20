"use client";

import { hasHardwareWebGL } from "@/lib/gpu";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";

interface GlobeProps {
  /** Latitude and longitude the globe keeps facing the viewer. */
  focus: [number, number];
  className?: string;
}

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * A dotted globe (cobe) that sways around one place and can be dragged. It
 * only draws while it is on screen, and stays still under reduced motion.
 * Machines without a GPU get no globe; the tile's text says where he is.
 */
const Globe = ({ focus, className }: GlobeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  // Making a WebGL context on a software rasterizer can hold the main thread for a
  // second, so the globe waits until it is nearly on screen and the GPU is known to be real.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if ((await hasHardwareWebGL()) && !cancelled) setReady(true);
      },
      { rootMargin: "80% 0px" }
    );
    io.observe(canvas);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const home = Math.PI - (rad(focus[1]) - Math.PI / 2);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = canvas.offsetWidth;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size,
      height: size,
      phi: home,
      theta: 0.28,
      dark: 1,
      diffuse: 1.5,
      mapSamples: 18000,
      mapBrightness: 7,
      mapBaseBrightness: 0.04,
      baseColor: [0.42, 0.36, 0.3],
      markerColor: [1, 0.3, 0.12],
      glowColor: [0.26, 0.1, 0.04],
      markers: [{ location: focus, size: 0.085 }],
      markerElevation: 0.01,
    });

    let frame = 0;
    let visible = false;
    let t = 0;
    let drag = 0;
    let dragVelocity = 0;
    let grabX: number | null = null;

    const draw = () => {
      frame = 0;
      if (grabX === null) {
        t += 1 / 60;
        // After a drag the globe coasts, then eases back to face home.
        drag += dragVelocity;
        dragVelocity *= 0.94;
        drag *= 0.985;
      }
      globe.update({ phi: home + drag + (still ? 0 : Math.sin(t * 0.32) * 0.42), width: size, height: size });
      if (visible && !still) frame = requestAnimationFrame(draw);
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onDown = (e: PointerEvent) => {
      grabX = e.clientX;
      dragVelocity = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (grabX === null) return;
      const delta = (e.clientX - grabX) / 180;
      grabX = e.clientX;
      drag += delta;
      dragVelocity = delta;
      start();
    };
    const onUp = () => {
      grabX = null;
      canvas.style.cursor = "grab";
    };
    const onResize = () => {
      size = canvas.offsetWidth;
      start();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.style.opacity = "1";

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      globe.destroy();
    };
  }, [focus, ready]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "aspect-square w-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]",
        className
      )}
    />
  );
};

export default Globe;
