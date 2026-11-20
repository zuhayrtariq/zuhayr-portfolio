"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, type ReactNode } from "react";

export interface SphereItem {
  id: string;
  node: ReactNode;
}

interface IconSphereProps {
  items: SphereItem[];
  /** Ids to bring forward; everything else steps back. Empty lights them all. */
  highlight?: string[];
  className?: string;
}

/**
 * Tiles laid out on a sphere that turns slowly, follows the pointer and can be
 * thrown by dragging. The tiles are real DOM, so they stay sharp at any size.
 * Under reduced motion the sphere holds still.
 */
const IconSphere = ({ items, highlight = [], className }: IconSphereProps) => {
  const root = useRef<HTMLDivElement>(null);
  const lit = useRef<string[]>(highlight);
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    lit.current = highlight;
    wake.current();
  }, [highlight]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const tiles = Array.from(el.querySelectorAll<HTMLElement>("[data-tile]"));
    const count = tiles.length;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // An even spread of points over the sphere.
    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = tiles.map((_, i) => {
      const y = 1 - ((i + 0.5) / count) * 2;
      const r = Math.sqrt(1 - y * y);
      return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r];
    });
    const focus = tiles.map(() => 1);

    let radius = el.offsetWidth * 0.4;
    let pitch = -0.35;
    let yaw = 0.6;
    let vPitch = 0;
    let vYaw = still ? 0 : 0.0028;
    let targetPitch = 0;
    let targetYaw = 0.0028;
    let grab: { x: number; y: number } | null = null;
    let frame = 0;
    let visible = false;

    const draw = () => {
      frame = 0;
      if (!grab && !still) {
        // Thrown speed decays back to the idle drift.
        vYaw += (targetYaw - vYaw) * 0.04;
        vPitch += (targetPitch - vPitch) * 0.04;
      }
      if (!grab) {
        yaw += vYaw;
        pitch += vPitch;
      }
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const chosen = lit.current;
      let settling = false;
      for (let i = 0; i < count; i++) {
        const [px, py, pz] = points[i];
        const x = px * cy + pz * sy;
        const z1 = -px * sy + pz * cy;
        const y = py * cp - z1 * sp;
        const z = py * sp + z1 * cp;
        const depth = (z + 1) / 2;
        const want = chosen.length === 0 ? 1 : chosen.includes(tiles[i].dataset.tile!) ? 1.35 : 0.22;
        focus[i] += (want - focus[i]) * (still ? 1 : 0.14);
        if (Math.abs(want - focus[i]) > 0.004) settling = true;
        const f = focus[i];
        const scale = (0.52 + depth * 0.66) * (f > 1 ? 1 + (f - 1) * 0.5 : 0.82 + f * 0.18);
        const style = tiles[i].style;
        style.transform = `translate3d(${(x * radius).toFixed(1)}px, ${(y * radius).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        style.opacity = Math.min(1, (0.16 + depth * 0.84) * Math.min(1, f)).toFixed(3);
        style.zIndex = String(Math.round(z * 100) + 100 + (f > 1 ? 200 : 0));
        tiles[i].toggleAttribute("data-lit", f > 1.05);
      }
      if (visible && (!still || grab || settling)) frame = requestAnimationFrame(draw);
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    wake.current = start;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      grab = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
      start();
    };
    const onMove = (e: PointerEvent) => {
      if (grab) {
        vYaw = (e.clientX - grab.x) / 260;
        vPitch = -(e.clientY - grab.y) / 260;
        yaw += vYaw;
        pitch += vPitch;
        grab = { x: e.clientX, y: e.clientY };
        return;
      }
      if (still || e.pointerType !== "mouse") return;
      // The sphere drifts toward wherever the pointer sits over it.
      const box = el.getBoundingClientRect();
      targetYaw = ((e.clientX - box.left) / box.width - 0.5) * 0.02;
      targetPitch = -((e.clientY - box.top) / box.height - 0.5) * 0.014;
    };
    const onUp = () => {
      grab = null;
      el.style.cursor = "";
    };
    const onLeave = () => {
      targetYaw = 0.0028;
      targetPitch = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      radius = el.offsetWidth * 0.4;
      start();
    });
    ro.observe(el);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);
    el.dataset.ready = "";

    return () => {
      cancelAnimationFrame(frame);
      wake.current = () => {};
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [items]);

  return (
    <div
      ref={root}
      aria-hidden
      className={cn(
        "group/sphere relative aspect-square cursor-grab touch-pan-y select-none opacity-0 transition-opacity duration-700 data-ready:opacity-100",
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.id}
          data-tile={item.id}
          className="absolute left-1/2 top-1/2 -ml-[calc(var(--tile)/2)] -mt-[calc(var(--tile)/2)] size-(--tile) will-change-transform [--tile:clamp(48px,5.6vw,84px)]"
        >
          {item.node}
        </div>
      ))}
    </div>
  );
};

export default IconSphere;
