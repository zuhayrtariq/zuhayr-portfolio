import Window from "@/components/ui/window";
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
    <Window address={host} className={className}>
      {children}
    </Window>
  );
};

export default BrowserFrame;
