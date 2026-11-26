import { SiteLink } from "@/components/site/audience";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface SignProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Dark on light grounds, where the yellow needs an edge to sit against. */
  tone?: "sun" | "night";
  /** The link is a file to save, not a page to open. */
  download?: boolean;
}

/**
 * The one way this site says "this way": an airport wayfinding sign, with the words on the
 * plate and the arrow in its own square.
 */
const Sign = ({ href, children, className, tone = "sun", download = false }: SignProps) => {
  const external = download || /^(https?:|mailto:)/.test(href);
  const classes = cn(
    "group/sign inline-flex h-13 items-stretch overflow-hidden rounded-md text-ui font-bold leading-none shadow-[0_10px_30px_-12px_rgb(7_18_51/0.55)] [text-shadow:none]",
    tone === "sun" ? "bg-sun text-night ring-1 ring-white/20" : "bg-night text-cloud",
    className
  );
  const content = (
    <>
      <span className="flex items-center px-5">{children}</span>
      <span aria-hidden className={cn("grid w-13 place-items-center", tone === "sun" ? "bg-night text-sun" : "bg-sun text-night")}>
        <svg
          viewBox="0 0 24 24"
          className="size-5 transition-transform duration-300 ease-[var(--ease-lights)] group-hover/sign:-translate-y-0.5 group-hover/sign:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
        >
          <path d="M6 18 18 6M8 6h10v10" />
        </svg>
      </span>
    </>
  );
  return external ? (
    <a
      href={href}
      className={classes}
      {...(download ? { download: true } : href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    >
      {content}
    </a>
  ) : (
    <SiteLink href={href} className={classes}>
      {content}
    </SiteLink>
  );
};

export default Sign;
