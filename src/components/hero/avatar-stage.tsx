"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useState } from "react";
import PointPortrait from "./point-portrait";
import PortraitStill from "./portrait-still";

const AVATAR_URL = process.env.NEXT_PUBLIC_AVATAR_URL;

const TalkingAvatar = dynamic(() => import("./talking-avatar"), { ssr: false });

const FADE_MASK = "linear-gradient(to bottom, #000 48%, transparent 86%)";

interface AvatarStageProps {
  speaking: boolean;
  className?: string;
}

/**
 * Where Zuhayr appears in the frame. By default that is his portrait as a cloud
 * of points; a rigged 3D avatar takes over when one is configured and has loaded.
 * The plain still covers browsers without WebGL2.
 */
const AvatarStage = ({ speaking, className }: AvatarStageProps) => {
  const [avatar, setAvatar] = useState<"loading" | "ready" | "failed">(AVATAR_URL ? "loading" : "failed");
  const [webgl, setWebgl] = useState(true);

  return (
    <div className={cn("relative size-full", className)}>
      {avatar !== "ready" &&
        (webgl ? (
          <PointPortrait speaking={speaking} onError={() => setWebgl(false)} className="absolute inset-0" />
        ) : (
          <PortraitStill speaking={speaking} className="absolute inset-0" />
        ))}
      {AVATAR_URL && avatar !== "failed" && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-[var(--ease-lights)]",
            avatar === "ready" ? "opacity-100" : "opacity-0"
          )}
          style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
        >
          <TalkingAvatar url={AVATAR_URL} onReady={() => setAvatar("ready")} onError={() => setAvatar("failed")} />
        </div>
      )}
    </div>
  );
};

export default AvatarStage;
