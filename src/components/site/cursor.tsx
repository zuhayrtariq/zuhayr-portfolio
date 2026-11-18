"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [data-cursor]";

/**
 * A ring that trails the pointer, swells over anything clickable and carries a
 * label where one is set with `data-cursor`. The native cursor stays, so
 * nothing depends on this.
 */
const Cursor = () => {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ring.current;
    const text = label.current;
    if (!el || !text) return;
    const capable = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!capable.matches) return;

    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let frame = 0;
    let shown = false;

    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        el.dataset.shown = "";
      }
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE);
      const tag = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      if (tag) {
        if (text.textContent !== tag) text.textContent = tag;
        el.dataset.state = "label";
      } else {
        el.dataset.state = target ? "over" : "idle";
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      shown = false;
      delete el.dataset.shown;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      data-state="idle"
      className="group pointer-events-none fixed left-0 top-0 z-[100] opacity-0 transition-opacity duration-300 data-shown:opacity-100"
    >
      <div className="absolute size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper mix-blend-difference transition-[width,height,opacity,background-color] duration-300 ease-[var(--ease-lights)] group-data-[state=label]:opacity-0 group-data-[state=over]:size-16 group-data-[state=over]:bg-paper" />
      <span
        ref={label}
        className="absolute inline-flex h-11 -translate-x-1/2 -translate-y-1/2 scale-50 items-center whitespace-nowrap rounded-full bg-ember px-5 text-fine font-bold text-ink opacity-0 transition-[opacity,scale] duration-300 ease-[var(--ease-lights)] group-data-[state=label]:scale-100 group-data-[state=label]:opacity-100"
      />
    </div>
  );
};

export default Cursor;
