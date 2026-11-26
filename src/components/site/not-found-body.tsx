import { SiteLink } from "@/components/site/audience";

/** What a visitor sees at an address that doesn't exist, with the two ways back. */
const NotFoundBody = () => {
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 md:px-8">
      <p className="text-[17px] text-muted-foreground">Error 404</p>
      <h1 className="mt-3 text-[38px] md:text-[60px]">This page doesn&apos;t exist.</h1>
      <p className="mt-5 max-w-md text-[19px] text-muted-foreground">
        The link may be old or mistyped. Head back to the homepage, or ask my AI what you were looking for.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <SiteLink
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-md bg-night px-7 font-bold text-cloud"
        >
          Go to homepage
        </SiteLink>
        <SiteLink
          href="/talk"
          className="inline-flex h-12 items-center justify-center rounded-md border border-night/30 px-7 font-bold transition-colors hover:border-night"
        >
          Ask my AI
        </SiteLink>
      </div>
    </main>
  );
};

export default NotFoundBody;
