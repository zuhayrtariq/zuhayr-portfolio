import { SITE } from "@/constants/site";
import Section from "../site/section";

const AboutMe = () => {
  return (
    <Section id="about" question="How do you work with clients?">
      <div className="max-w-[60ch] space-y-6">
        <p className="text-lead leading-snug">
          I work best with founders and small product teams. We agree on the smallest useful
          version, I ship it quickly, and we improve it from real usage without letting performance
          or code quality slide.
        </p>
        <p className="text-body text-fog">
          I&apos;m based in Pakistan and work with clients worldwide. Day to day I lead engineering
          at{" "}
          <a
            href="https://starlingaix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-caption"
          >
            Starling AIX
          </a>
          , where we&apos;re building &ldquo;JARVIS for your business&rdquo; on a Universal Cognitive
          Architecture. Most of my work is in TypeScript, with agents, RAG pipelines and real-time
          voice on top.
        </p>
        <p className="text-body text-fog">
          On{" "}
          <a href={SITE.upwork} target="_blank" rel="noopener noreferrer" className="link-underline text-caption">
            Upwork
          </a>{" "}
          I&apos;m Top Rated Plus with a 100% job success score, and I&apos;ve shipped more than 30
          projects for over 10 clients since 2022.
        </p>
      </div>
    </Section>
  );
};

export default AboutMe;
