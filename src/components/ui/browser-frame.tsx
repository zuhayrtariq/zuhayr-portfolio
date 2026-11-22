import { cn } from "@/lib/utils";
import { LockIcon } from "lucide-react";
import type { ReactNode } from "react";

interface BrowserFrameProps {
  /** Shown in the address bar. */
  host: string;
  className?: string;
  children: ReactNode;
}

/** A browser window around a screenshot, so a product reads as a live site and not a picture. */
const BrowserFrame = ({ host, className, children }: BrowserFrameProps) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/14 bg-[#0d1947] shadow-[0_40px_90px_-30px_rgb(3_8_28/0.85)]",
        className
      )}
    >
      <div aria-hidden className="flex h-9 items-center gap-3 border-b border-white/10 px-3.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/22" />
          <span className="size-2.5 rounded-full bg-white/22" />
          <span className="size-2.5 rounded-full bg-white/22" />
        </div>
        <div className="mx-auto flex h-[22px] w-[min(52%,22rem)] items-center justify-center gap-1.5 rounded-md bg-white/8 text-[11px] leading-none text-white/65">
          <LockIcon className="size-2.5" />
          <span className="truncate">{host}</span>
        </div>
        <div className="w-[42px]" />
      </div>
      {children}
    </div>
  );
};

export default BrowserFrame;
