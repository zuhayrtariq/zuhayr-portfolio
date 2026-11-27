import { SiteLink } from "@/components/site/audience";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface SignProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Mint on the blue and dark grounds; the site's blue on paper, where mint has nothing to sit against. */
  tone?: "mint" | "brand";
  /** The link is a file to save, not a page to open. */
  download?: boolean;
}

/**
 * The site's button. It is shaped like a key: a face with an edge under it, which goes down
 * when it is pressed.
 */
const Sign = ({ href, children, className, tone = "mint", download = false }: SignProps) => {
  const external = download || /^(https?:|mailto:)/.test(href);
  const classes = cn(
    "inline-flex h-13 items-center justify-center whitespace-nowrap rounded-md px-6 text-ui font-bold leading-none [text-shadow:none] transition-[translate,box-shadow] duration-100 active:translate-y-0.5",
    tone === "mint"
      ? "bg-mint text-ink shadow-[0_3px_0_var(--color-mint-edge)] active:shadow-[0_1px_0_var(--color-mint-edge)]"
      : "bg-brand text-white shadow-[0_3px_0_var(--color-brand-edge)] active:shadow-[0_1px_0_var(--color-brand-edge)]",
    className
  );
  return external ? (
    <a
      href={href}
      className={classes}
      {...(download ? { download: true } : href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  ) : (
    <SiteLink href={href} className={classes}>
      {children}
    </SiteLink>
  );
};

export default Sign;
