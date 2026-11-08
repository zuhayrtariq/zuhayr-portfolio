import { cn } from "@/lib/utils";
import Image from "next/image";

interface PortraitStillProps {
  speaking: boolean;
  className?: string;
}

const FADE_MASK =
  "radial-gradient(ellipse 44% 58% at 55% 36%, #000 30%, rgb(0 0 0 / 0.5) 54%, transparent 78%)";

/**
 * The documentary fallback for the avatar: a treated still of Zuhayr that slowly
 * pushes in while he is speaking, the way a voiceover plays over an archive still.
 * A low-key tone curve pulls the bright background lights down to the mid-tones.
 */
const PortraitStill = ({ speaking, className }: PortraitStillProps) => {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
    >
      <svg aria-hidden className="absolute size-0">
        <filter id="low-key" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0 0.2 0.42 0.55 0.6" />
            <feFuncG type="table" tableValues="0 0.2 0.42 0.55 0.6" />
            <feFuncB type="table" tableValues="0 0.2 0.42 0.55 0.6" />
          </feComponentTransfer>
        </filter>
      </svg>
      <div
        className="absolute inset-0 origin-[54%_30%] animate-[ken-burns_28s_linear_forwards]"
        style={{ animationPlayState: speaking ? "running" : "paused" }}
      >
        <Image
          src="/images/me.png"
          alt="Zuhayr Tariq"
          fill
          priority
          sizes="(min-width: 768px) 54vw, 100vw"
          className="origin-[54%_30%] -scale-x-[1.4] scale-y-[1.4] object-cover [object-position:50%_18%] [filter:url(#low-key)]"
        />
      </div>
      <div className="absolute inset-0 bg-tungsten opacity-30 mix-blend-soft-light" />
    </div>
  );
};

export default PortraitStill;
