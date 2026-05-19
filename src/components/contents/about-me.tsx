import AnimationContainer from "../utils/animation-container";

const AboutMe = () => {
  return (
    <div className="w-full relative pt-10 pb-20 z-40">
      <AnimationContainer
        animation="slide-up"
        className="flex items-center justify-center overflow-hidden w-full mx-auto"
      >
        <div className="w-full">
          <h2 className="text-2xl lg:text-3xl font-medium text-left w-full">
            About Me
          </h2>
        </div>
      </AnimationContainer>
      <AnimationContainer
        animation="slide-up"
        className="flex flex-col items-start justify-center w-full mx-auto pt-10 gap-5"
      >
        <p className="text-base md:text-lg text-justify w-full text-foreground/90">
          I&apos;m a Top Rated Plus full-stack developer on Upwork and the{" "}
          <span className="text-white font-medium">
            Lead Developer at{" "}
            <a
              href="https://starlingaix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-blue-500/60 hover:decoration-blue-400"
            >
              Starling AIX
            </a>
          </span>
          , the company building &ldquo;JARVIS for your business&rdquo; on top
          of a Universal Cognitive Architecture. I build production web apps in
          TypeScript with Next.js, React, Node.js and the modern serverless
          stack (Vercel, Supabase, Convex, Neon, Drizzle, tRPC, Stripe and
          Clerk).
        </p>

        <p className="text-base md:text-lg text-justify w-full text-foreground/90">
          These days I specialize in{" "}
          <span className="text-white font-medium">
            AI and real-time voice
          </span>
          : agents and RAG pipelines on OpenAI, Anthropic and Gemini with the
          Vercel AI SDK and LangChain, and voice assistants / phone agents
          built on{" "}
          <span className="text-white font-medium">Vapi</span> and the{" "}
          <span className="text-white font-medium">
            OpenAI Realtime API
          </span>
          , wired up with Twilio, Deepgram and ElevenLabs.
        </p>

        <p className="text-base md:text-lg text-justify w-full text-foreground/90">
          I work closely with founders and product teams to take ideas from
          zero to production — fast — without sacrificing performance, UX or
          maintainability. Let&apos;s turn your idea into a shipped product.
        </p>
      </AnimationContainer>
    </div>
  );
};

export default AboutMe;
