"use client";

import { cn } from "@/lib/utils";
import PortraitStill from "./portrait-still";

interface AvatarStageProps {
  speaking: boolean;
  className?: string;
}

/**
 * Where Zuhayr appears in the frame. Uses the 3D avatar when one is configured,
 * otherwise the documentary still.
 */
const AvatarStage = ({ speaking, className }: AvatarStageProps) => {
  return <PortraitStill speaking={speaking} className={cn("size-full", className)} />;
};

export default AvatarStage;
