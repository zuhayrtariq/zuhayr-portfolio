import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 md:px-8">
      <p className="text-[17px] text-muted-foreground">Error 404</p>
      <h1 className="mt-3 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[64px]">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-5 max-w-md text-[19px] text-muted-foreground">
        The link may be old or mistyped. Head back to the homepage, or ask my
        AI what you were looking for.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 font-medium text-primary-foreground transition-colors hover:bg-foreground"
        >
          Go to homepage
        </Link>
        <Link
          href="/chat"
          className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/20 px-7 font-medium transition-colors hover:border-foreground"
        >
          Ask my AI
        </Link>
      </div>
    </main>
  );
}
