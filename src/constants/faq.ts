import { SITE } from "@/constants/site";

/**
 * The questions a client asks before getting in touch, answered once. The
 * home page shows them, its structured data repeats them, and llms.txt
 * carries them for AI assistants, so all three always say the same thing.
 */
export const FAQ = [
  {
    question: "What do you build?",
    answer:
      "Whatever the product needs, end to end: web apps and mobile apps, APIs and databases, payments and sign-in, and AI features such as agents, chatbots, search over your own documents (RAG) and voice agents. Most of my work is in TypeScript with Next.js, React, React Native and Node.js.",
  },
  {
    question: "How do I hire you?",
    answer: `Send a few lines about the project through the contact form on this page, or email me at ${SITE.email}. If you would rather contract through Upwork, you can hire me from my Upwork profile, where I'm Top Rated Plus with a 100% job success score.`,
  },
  {
    question: "How does a project run?",
    answer:
      "We start with a call, then a written scope: what's in, what's out, and when each piece lands. You get something to click through early and new pieces as they're finished. Then I ship to production, hand over the code and the docs, and stay on to fix what real users turn up.",
  },
  {
    question: "What have you shipped?",
    answer:
      "More than 30 projects for over 10 clients since 2022. Among them are Starling MX, the enterprise AI platform where I lead engineering, Analytra, an AI analytics product, and Hypecaster, an AI agent that produces short videos. Each has a case study on this site.",
  },
  {
    question: "How can I check your track record?",
    answer:
      "My Upwork profile is public. It shows Top Rated Plus, which is the top 3% of freelancers, a 100% job success score and a 5.0 rating across 13 client reviews, over about 2,500 hours of client work. Clients write those reviews after each job is delivered.",
  },
  {
    question: "Where are you based, and do you work with clients abroad?",
    answer: "I'm in Islamabad, Pakistan (UTC+5), and I work remotely with clients worldwide.",
  },
];
