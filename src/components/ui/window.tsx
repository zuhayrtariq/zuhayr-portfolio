import { cn } from "@/lib/utils";
import { LockIcon } from "lucide-react";
import type { ReactNode } from "react";

interface WindowProps {
  /** What the title bar says: a file name, or the name of the tool. */
  title?: ReactNode;
  /** Set instead of a title to make the window a browser: the address in its bar. */
  address?: string;
  /** Sits at the right end of the bar. */
  status?: ReactNode;
  /** "screen" is an editor or a terminal; "paper" is a browser or anything a client reads. */
  tone?: "screen" | "paper";
  className?: string;
  children: ReactNode;
}

/**
 * A window on his screen: an editor, a terminal or a browser. Every size inside is in em, so
 * a window is as big as the type it is given and stays in proportion at any size.
 */
const Window = ({ title, address, status, tone = "screen", className, children }: WindowProps) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[0.7em] shadow-[0_2.2em_4.5em_-2em_rgb(4_9_26/0.8)]",
        tone === "screen" ? "on-screen bg-screen ring-1 ring-white/12" : "on-paper bg-paper ring-1 ring-ink/15",
        className
      )}
    >
      <div className="flex h-[2.5em] items-center gap-[0.8em] border-b px-[0.9em]">
        <span aria-hidden className="flex shrink-0 gap-[0.4em]">
          <i className="size-[0.62em] rounded-full bg-current opacity-25" />
          <i className="size-[0.62em] rounded-full bg-current opacity-25" />
          <i className="size-[0.62em] rounded-full bg-current opacity-25" />
        </span>
        {address ? (
          <span className="mx-auto flex h-[1.9em] min-w-0 max-w-[62%] flex-1 items-center justify-center gap-[0.5em] rounded-[0.4em] bg-caption/8 px-[0.8em] font-mono text-[0.72em] leading-none text-fog">
            <LockIcon aria-hidden className="size-[0.95em] shrink-0" />
            <span className="truncate">{address}</span>
          </span>
        ) : (
          <span className="min-w-0 truncate font-mono text-[0.78em] leading-none text-fog">{title}</span>
        )}
        <span className={cn("flex shrink-0 justify-end text-[0.78em] leading-none", address ? "w-[5.5em]" : "ml-auto")}>{status}</span>
      </div>
      {children}
    </div>
  );
};

export default Window;
