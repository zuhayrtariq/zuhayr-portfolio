import Link from "next/link";
import HeroChat from "./hero-chat";

const Hero = () => {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid max-w-6xl items-center md:min-h-[min(calc(100svh-4rem),52rem)] gap-12 px-5 py-16 md:grid-cols-12 md:gap-8 md:px-8"
    >
      <div className="md:col-span-7 md:pr-8">
        <p className="text-[17px] text-muted-foreground">
          Zuhayr Tariq, full-stack and AI engineer
        </p>
        <h1
          id="hero-title"
          className="mt-4 text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
        >
          I build AI products people can talk to.
        </h1>
        <p className="mt-6 max-w-[34rem] text-[19px] leading-relaxed text-muted-foreground">
          Lead Developer at{" "}
          <a
            href="https://starlingaix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-foreground"
          >
            Starling AIX
          </a>
          . I ship production apps in Next.js and TypeScript, with agents, RAG
          pipelines and real-time voice on Vapi and the OpenAI Realtime API.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-[16px] font-medium text-primary-foreground transition-colors hover:bg-foreground"
          >
            Start a project
          </Link>
          <Link
            href="#projects"
            className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/20 px-7 text-[16px] font-medium transition-colors hover:border-foreground"
          >
            See my projects
          </Link>
        </div>

        <p className="mt-8 text-[15px] text-muted-foreground">
          Top Rated Plus on Upwork with 100% job success, and 30+ projects
          shipped for 10+ clients since 2022.
        </p>
      </div>

      <div className="md:col-span-5">
        <HeroChat />
      </div>
    </section>
  );
};

export default Hero;
