import Image from "next/image";
import Section from "../site/section";

const AboutMe = () => {
  return (
    <Section id="about" title="About">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
        <div className="max-w-[62ch] space-y-5 text-[19px] leading-relaxed">
          <p>
            I&apos;m a full-stack developer from Pakistan and the Lead
            Developer at{" "}
            <a
              href="https://starlingaix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              Starling AIX
            </a>
            , where we&apos;re building &ldquo;JARVIS for your business&rdquo;
            on a Universal Cognitive Architecture. Most of my work is in
            TypeScript: Next.js, React and Node on Vercel, Supabase, Convex,
            Neon, Drizzle, tRPC, Stripe and Clerk.
          </p>
          <p className="text-muted-foreground">
            My focus is AI and real-time voice. I build agents and RAG pipelines
            on OpenAI, Anthropic and Gemini with the Vercel AI SDK and
            LangChain, and voice assistants and phone agents on Vapi and the
            OpenAI Realtime API, wired up with Twilio, Deepgram and ElevenLabs.
          </p>
          <p className="text-muted-foreground">
            I work best with founders and small product teams: we agree on the
            smallest useful version, I ship it quickly, and we improve it from
            real usage without letting performance or code quality slide.
          </p>
        </div>

        <figure className="relative aspect-[4/5] w-full max-w-[16rem] overflow-hidden rounded-[18px] bg-secondary">
          <Image
            src="/images/me.png"
            alt="Portrait of Zuhayr Tariq"
            fill
            sizes="256px"
            className="object-cover object-top"
          />
        </figure>
      </div>
    </Section>
  );
};

export default AboutMe;
