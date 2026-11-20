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
        "overflow-hidden rounded-[14px] border border-white/12 bg-[#1a1b1b] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(0_0_0/0.6)]",
        className
      )}
    >
      <div aria-hidden className="flex h-9 items-center gap-3 border-b border-white/8 px-3.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/18" />
          <span className="size-2.5 rounded-full bg-white/18" />
          <span className="size-2.5 rounded-full bg-white/18" />
        </div>
        <div className="mx-auto flex h-[22px] w-[min(52%,22rem)] items-center justify-center gap-1.5 rounded-md bg-white/6 text-[11px] leading-none text-white/55">
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
