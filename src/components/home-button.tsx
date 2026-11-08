import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

const HomeButton = () => {
  return (
    <Link
      href="/"
      className="group -ml-2 inline-flex h-11 items-center gap-2 rounded-full px-2 font-display text-[24px] font-semibold"
    >
      <ArrowLeftIcon
        className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5"
        aria-hidden
      />
      Zuhayr Tariq
      <span className="sr-only">, back to homepage</span>
    </Link>
  );
};

export default HomeButton;
