import { SITE } from "@/constants/site";
import { ArrowUpRightIcon } from "lucide-react";
import Rise from "../motion/rise";
import ProcessRail from "./process-rail";

const RECORD = [
  { value: "5.0", label: "Average rating across 13 client reviews" },
  { value: "100%", label: "Job success on Upwork" },
  { value: "2,500", label: "Hours of client work, roughly" },
  { value: "Top 3%", label: "Top Rated Plus on Upwork" },
];

const STEPS = [
  {
    title: "Scope and dates",
    body: "We start with a call, then a written scope: what's in, what's out, and when each piece lands.",
  },
  {
    title: "Working builds, early",
    body: "You get something you can click through early on, and new pieces as they're finished, so you see progress instead of hearing about it.",
  },
  {
    title: "Straight updates",
    body: "You always know where things stand, including anything that needs a decision from you.",
  },
  {
    title: "Launch, then support",
    body: "I ship to production, hand over the code and the docs, and stay on for the fixes real users surface.",
  },
];

const AboutMe = () => {
  return (
    <section id="about" aria-labelledby="about-title" className="relative">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-28 md:py-48">
        <Rise
          as="h2"
          by="lines"
          id="about-title"
          className="max-w-[17ch] font-display text-[clamp(52px,8.2vw,150px)] leading-[0.9] tracking-[-0.01em] [text-wrap:wrap]"
        >
          We agree the scope and the dates before I write a line of code.{" "}
          <span className="text-signal">Then the dates hold.</span>
        </Rise>

        <dl className="mt-20 grid grid-cols-2 border-t border-caption/15 md:mt-32 lg:grid-cols-4">
          {RECORD.map((item, i) => (
            <Rise
              key={item.label}
              delay={i * 0.08}
              className="flex flex-col-reverse justify-end gap-1 border-b border-caption/15 py-8 pr-6 lg:border-b-0 lg:border-l lg:px-8 lg:py-10 lg:first:border-l-0 lg:first:pl-0"
            >
              <dt className="max-w-[20ch] text-ui leading-snug text-fog">{item.label}</dt>
              <dd className="whitespace-nowrap font-display text-[clamp(64px,9.6vw,176px)] leading-[0.8] pb-[0.14em]">{item.value}</dd>
            </Rise>
          ))}
        </dl>
        <p className="mt-8 text-ui">
          <a
            href={SITE.upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-1 font-bold"
          >
            See the Upwork profile <ArrowUpRightIcon aria-hidden className="size-4" />
          </a>
        </p>

        <div className="mt-28 grid gap-x-8 gap-y-14 md:mt-48 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
            <h3 className="font-display text-[clamp(52px,5.6vw,96px)] leading-[0.9]">How a project runs</h3>
            <p className="mt-6 max-w-[38ch] text-body text-fog">
              I&apos;m a full-stack web and AI developer based in Islamabad, and I lead engineering at{" "}
              <a
                href="https://www.starlingmx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-caption"
              >
                Starling MX
              </a>
              . Every client project follows the same four steps.
            </p>
          </div>
          <ProcessRail steps={STEPS} className="lg:col-span-7 lg:col-start-6" />
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
