"use client";

import { hasHardwareWebGL } from "@/lib/gpu";
import { cn } from "@/lib/utils";
import { useEffect, useRef, type RefObject } from "react";
import type { FlightHandle } from "./scene";

interface FlightCanvasProps {
  /** Filled in once the scene is running, so the stage can tell it where in the flight we are. */
  handle: RefObject<FlightHandle | null>;
  onReady?: () => void;
  /** No GPU to draw with, or the context was lost: the stage falls back to its painted sky. */
  onUnavailable?: () => void;
  /** Raises the aircraft on a tall screen. See FlightOptions. */
  lift?: number;
  className?: string;
}

/**
 * The canvas the flight is drawn on. three.js and the scene load in their own chunk, after
 * the page is interactive, and only on a machine with a real GPU.
 */
const FlightCanvas = ({ handle, onReady, onUnavailable, lift, className }: FlightCanvasProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const callbacks = useRef({ onReady, onUnavailable });
  callbacks.current = { onReady, onUnavailable };

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let cancelled = false;
    let flight: FlightHandle | null = null;
    const cleanups: (() => void)[] = [];

    const start = async () => {
      if (!(await hasHardwareWebGL())) return callbacks.current.onUnavailable?.();
      const { createFlight } = await import("./scene");
      if (cancelled) return;
      try {
        flight = createFlight(el, {
          compact: window.matchMedia("(max-width: 860px), (pointer: coarse)").matches,
          still: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          lift,
          onFirstFrame: () => callbacks.current.onReady?.(),
          onLost: () => callbacks.current.onUnavailable?.(),
        });
      } catch (error) {
        console.error("The flight could not start", error);
        return callbacks.current.onUnavailable?.();
      }
      handle.current = flight;

      const onPointer = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        flight?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("pointermove", onPointer, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", onPointer));

      // Nothing is drawn while the stage is off screen or the tab is in the background.
      let onScreen = true;
      const sync = () => flight?.setActive(onScreen && !document.hidden);
      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      });
      io.observe(el);
      document.addEventListener("visibilitychange", sync);
      const ro = new ResizeObserver(() => flight?.resize());
      ro.observe(el);
      cleanups.push(() => {
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", sync);
      });
    };

    // Let the first paint and hydration finish before a megabyte of 3D arrives.
    const idle = window.requestIdleCallback?.(() => void start(), { timeout: 1200 }) ?? window.setTimeout(() => void start(), 200);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanups.forEach((fn) => fn());
      handle.current = null;
      flight?.dispose();
    };
  }, [handle, lift]);

  return <canvas ref={canvas} aria-hidden className={cn("block size-full", className)} />;
};

export default FlightCanvas;
