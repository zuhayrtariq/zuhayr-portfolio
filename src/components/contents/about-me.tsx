import Rise from "../motion/rise";
import Badge from "./badge";
import Process from "./process";
import Record from "./record";

const AboutMe = () => {
  return (
    <section id="about" aria-labelledby="about-title" className="relative">
      <div className="mx-auto max-w-[1680px] px-[clamp(16px,4vw,64px)] py-24 md:py-40">
        {/* The statement is short, so the block keeps the height the badge needs to hang in. */}
        <div className="relative lg:flex lg:min-h-[max(34vw,30rem)] lg:flex-col lg:justify-center">
          <Rise
            as="h2"
            by="lines"
            id="about-title"
            className="max-w-[13ch] font-display text-[clamp(60px,13vw,150px)] leading-[0.88] tracking-[-0.01em] [text-wrap:wrap] lg:text-[clamp(52px,9.2vw,172px)]"
          >
            Promises are easy. <span className="text-signal">Here&apos;s the record.</span>
          </Rise>
          <p className="mt-7 max-w-[40ch] text-body text-fog lg:mt-9 lg:text-lead">
            The rating, the job success score and Top Rated Plus all come from my public Upwork profile,
            where clients review each job after it&apos;s delivered.
          </p>
          {/* His badge hangs in the space beside the statement. */}
          <Badge className="absolute -top-64 bottom-[-7rem] right-[-4vw] w-[60%]" />
        </div>

        <Record className="mt-16 md:mt-28" />

        <div className="mt-28 md:mt-48">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
            <Rise
              as="h3"
              by="lines"
              className="max-w-[4.75em] font-display text-[clamp(64px,9.4vw,170px)] leading-[0.84] tracking-[-0.01em]"
            >
              You&apos;ll never have to chase me
            </Rise>
            <p className="max-w-[36ch] pb-2 text-body text-fog lg:pb-4">
              I&apos;m a full-stack web and AI developer based in Islamabad, and I lead engineering at{" "}
              <a
                href="https://www.starlingmx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-caption"
              >
                Starling MX
              </a>
              . Every client project runs on the same four steps, so you always know what comes next.
            </p>
          </div>
          <Process className="mt-14 md:mt-10" />
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
