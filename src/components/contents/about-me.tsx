import { SITE } from "@/constants/site";
import Section from "../site/section";

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
    <Section id="about" question="How do you work with clients?">
      <p className="max-w-[46ch] text-lead leading-snug">
        We agree on the scope and the dates before I write a line of code, and then the dates hold.
      </p>

      <ol className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-5">
            <span aria-hidden className="font-display text-q-sm leading-none text-fog">
              {i + 1}
            </span>
            <div>
              <h3 className="font-text text-body font-bold">{step.title}</h3>
              <p className="mt-1.5 text-body text-fog">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-14 max-w-[60ch] text-body text-fog">
        I&apos;m based in Islamabad and lead engineering at{" "}
        <a
          href="https://www.starlingmx.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-caption"
        >
          Starling MX
        </a>
        . On{" "}
        <a href={SITE.upwork} target="_blank" rel="noopener noreferrer" className="link-underline text-caption">
          Upwork
        </a>{" "}
        I&apos;m Top Rated Plus with 100% job success, rated 5.0 across 13 client reviews and about 2,500
        hours of work.
      </p>
    </Section>
  );
};

export default AboutMe;
