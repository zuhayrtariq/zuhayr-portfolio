import { SITE } from "@/constants/site";

/** The question the hero, the record tile and the "why hire me" section all hand to his AI. */
export const WHY_QUESTION = "Why hire you when AI can write code?";

/**
 * The questions a client asks before getting in touch, answered once. The
 * home page shows them, its structured data repeats them, llms.txt carries
 * them for AI assistants and his own AI answers from them, so all four
 * always say the same thing.
 */
export const FAQ = [
  {
    question: "What do you build?",
    answer:
      "Whatever the product needs, end to end: web apps and mobile apps, APIs and databases, payments and sign-in, and AI features such as agents, chatbots, search over your own documents (RAG) and voice agents. Most of my work is in TypeScript with Next.js, React, React Native and Node.js.",
  },
  {
    question: "AI can write code now. Why hire a developer?",
    answer:
      "Because a prompt gets you a demo, and a product is everything the demo leaves out. Payments have to survive failed cards and refunds. One customer must never see another's data. An AI feature has to say when it doesn't know, and stay inside a budget. And someone has to answer for the launch date. I use AI every day, so you get its speed. What you're hiring is the judgment about what to build, the checking of everything the AI writes, and one person who is accountable once real users arrive.",
  },
  {
    question: "Do you use AI to build?",
    answer:
      "Every day. I work with Claude, Gemini and GPT models inside Cursor, and I build the same models into client products as agents, chatbots, search over documents and voice. AI does a lot of the typing, which is a big part of why I'm fast. I decide the architecture, I read and test everything before it ships, and the result is my responsibility, not the model's.",
  },
  {
    question: "I already built a prototype with AI. Can you take it to production?",
    answer:
      "Yes. Send me the repository or a link. I'll tell you what's solid, what will break under real users, and what it takes to launch: usually sign-in and access rules, payments, error handling, tests and deployment. I keep what works and rebuild only what won't hold.",
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
      "More than 30 projects for over 10 clients since 2022. Among them are Starling MX, the enterprise AI platform where I lead engineering; Yip, a pet adoption platform with more than 48,000 listings that I built on my own, front end to back end; Analytra, an AI analytics product; and Hypecaster, an AI agent that produces short videos. Each has a case study on this site.",
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
