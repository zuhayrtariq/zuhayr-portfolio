import { SITE } from "@/constants/site";
import Section from "../site/section";

const AboutMe = () => {
  return (
    <Section id="about" question="How do you work with clients?">
      <div className="max-w-[60ch] space-y-6">
        <p className="text-lead leading-snug">
          We agree on the scope and the dates before I write a line of code. Then I ship in small,
          working pieces, you always know where things stand, and the dates hold.
        </p>
        <p className="text-body text-fog">
          I build whatever the product needs, end to end: web and mobile apps, APIs and databases,
          payments and auth, and AI features like agents, RAG and voice. Day to day I lead
          engineering at{" "}
          <a
            href="https://www.starlingmx.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-caption"
          >
            Starling MX
          </a>
          , and I work with founders and product teams worldwide from Pakistan.
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
