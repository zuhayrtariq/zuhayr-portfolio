/** The models and the editor he works with every day, as opposed to what he builds into products. */
export const AI_WORKFLOW = {
  title: "AI in my workflow",
  stack: ["Cursor", "Claude", "Gemini", "GPT"],
};

/** What goes into a client's product. The draft tool picks a stack from these. */
export const PRODUCT_SKILLS = [
  {
    title: "AI and agents",
    stack: [
      "the Claude API",
      "the OpenAI API",
      "the Gemini API",
      "the Vercel AI SDK",
      "LangChain",
      "LangGraph",
      "Pinecone",
      "RAG",
      "tool calling",
    ],
  },
  {
    title: "Product engineering",
    stack: [
      "TypeScript",
      "Next.js",
      "React",
      "React Native with Expo",
      "Node.js",
      "NestJS",
      "Hono",
      "tRPC",
      "Python with FastAPI",
    ],
  },
  {
    title: "Data",
    stack: ["PostgreSQL", "Supabase", "Neon", "Convex", "MongoDB", "Firebase", "Redis on Upstash", "Drizzle", "Prisma"],
  },
  {
    title: "Payments and auth",
    stack: ["Stripe", "Stripe Connect", "Clerk", "Auth.js"],
  },
  {
    title: "Voice",
    stack: ["Vapi", "the OpenAI Realtime API", "ElevenLabs", "Deepgram", "Twilio"],
  },
  {
    title: "Shipping",
    stack: ["Vercel", "AWS", "Google Cloud", "Cloudflare", "Docker", "GitHub Actions", "Sentry", "Resend"],
  },
];

export const SKILLS = [AI_WORKFLOW, ...PRODUCT_SKILLS];
