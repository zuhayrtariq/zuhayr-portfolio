import { experiences } from "@/constants/experiences";
import { faqFor } from "@/constants/faq";
import { projects } from "@/constants/projects";
import { SITE } from "@/constants/site";
import { SKILLS } from "@/constants/skills";
import type { Audience } from "@/lib/audience";

/**
 * The always-available knowledge base: everything the site itself says about
 * Zuhayr, as plain text for the model. Retrieved CV notes are added on top.
 *
 * The profile for a client from Upwork holds no way to reach him outside Upwork, so the
 * model has nothing of the kind to repeat, however it is asked.
 */
export const profileFor = (audience: Audience) => [
  `Name: ${SITE.name}. Based in Islamabad, Pakistan, works with clients worldwide.`,
  "Positioning: full-stack web and AI developer. You describe it, I build it, and it goes live on the date we set. I build whatever the product needs, end to end: web and mobile apps, APIs and databases, payments and auth, and AI features such as agents, RAG and voice.",
  "On delivery: I agree on scope and dates up front, ship in small working pieces, keep clients updated as I go, and hit the timelines I commit to.",
  ...(audience === "upwork"
    ? [
        "Availability: taking on new projects. This visitor found me on Upwork, so the way to start is a message on Upwork: a reply to my proposal, or a message from my Upwork profile. Calls are booked with the meeting scheduler in Upwork Messages.",
      ]
    : [
        "Availability: taking on new projects. The way to start is the contact form at the bottom of the home page, or email.",
        `Contact: email ${SITE.email}, WhatsApp ${SITE.phone}, GitHub ${SITE.github}, LinkedIn ${SITE.linkedin}, Upwork ${SITE.upwork}.`,
      ]),
  "Upwork: Top Rated Plus (top 3% of freelancers) with a 100% job success score, rated 5.0 across 13 client reviews, 18 jobs and about 2,500 hours. More than 30 projects shipped for over 10 clients since 2022.",
  "How I work with clients: we agree on the smallest useful version, I ship it quickly, and we improve it from real usage without letting performance or code quality slide. I work best with founders and small product teams.",
  "Where I work: remotely, from a desk in Islamabad (UTC+5), with a Mac mini, three laptops and two monitors, so one failed machine doesn't stop the work.",
  "On finishing and ownership: finishing is what I'm best at. I keep building until a thing is correctly and completely done, and I don't call it done until I've used it the way real users will. If something I built breaks, it's mine: I pick it up as soon as I see it, fix it, and tell the client what happened and what I changed.",
  "After launch: for 30 days, bugs in what I built are fixed free. After that I offer a monthly retainer to stay on. What the retainer costs and covers depends on the product, so we agree it when we talk; I don't quote it here.",
  "How I use AI: I work with Claude, Gemini and GPT models every day, inside Cursor, and I build the same models into client products. AI does much of the typing; I decide the architecture, read and test everything before it ships, and answer for the result.",
  "Why hire me when AI can write code: a prompt gets you a demo, and a product is everything the demo leaves out, such as payments that survive failed cards and refunds, access rules so no customer sees another's data, AI that says when it doesn't know and stays inside a budget, and a launch date someone answers for. I also take prototypes that were built with AI tools and get them ready for production.",
  "Education: MS in Computer Science at FAST NUCES, Karachi, GPA 3.89 out of 4, with advanced algorithms, machine learning and artificial intelligence. BS in Computer Science from the Institute of Business Management, Karachi, CGPA 3.8 out of 4, graduated August 2023 as gold medalist, on the Dean's List and a Presidential Merit Scholarship. Exchange semester at Istanbul Aydin University in 2022.",
  "",
  "Experience (most recent first):",
  ...experiences.toReversed().map((job) =>
    [`- ${job.title} at ${job.company_name}, ${job.date}. ${job.summary}`, ...job.points.map((p) => `  ${p}`)].join("\n")
  ),
  "",
  "Projects:",
  ...projects.map((p) =>
    [
      `- ${p.title}${p.role ? ` (${p.role}${p.year ? `, ${p.year}` : ""})` : ""}: ${p.summary}`,
      `  ${p.description.replace(/\s+/g, " ")}`,
      `  Built with: ${(p.stack ?? []).join(", ")}. Live at ${p.link}${p.github && audience === "direct" ? `, source at ${p.github}` : ""}.`,
    ].join("\n")
  ),
  "",
  "Tools:",
  ...SKILLS.map((g) => `- ${g.title}: ${g.stack.join(", ")}.`),
  "",
  "Answers I give to the questions clients ask most:",
  ...faqFor(audience).map((item) => `- ${item.question} ${item.answer}`),
].join("\n");
