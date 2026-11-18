import { cn } from "@/lib/utils";

interface PortraitStillProps {
  speaking: boolean;
  className?: string;
}

/**
 * The portrait without WebGL: the same cut-out, graded with the cloud's colours
 * and standing in the same place, so the frame holds on machines with no GPU.
 * It reads the `--portrait-*` properties the point cloud is laid out with.
 */
const PortraitStill = ({ speaking, className }: PortraitStillProps) => {
  return (
    <div className={cn("pointer-events-none overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-portrait.mjs */}
      <img
        src="/images/portrait-still.webp"
        alt="Zuhayr Tariq"
        width={820}
        height={959}
        decoding="async"
        className={cn(
          "absolute bottom-[calc(var(--portrait-lift,0)*100%)] left-[calc(50%+var(--portrait-shift,0)*100%)] h-[calc(var(--portrait-height,0.84)*100%)] w-auto max-w-none origin-[44%_22%] -translate-x-1/2 transition-transform duration-[2400ms] ease-[var(--ease-lights)] motion-reduce:transition-none",
          speaking ? "scale-[1.03]" : "scale-100"
        )}
      />
    </div>
  );
};

export default PortraitStill;
