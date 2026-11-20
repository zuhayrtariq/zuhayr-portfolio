import { experiences } from "@/constants/experiences";
import { projects } from "@/constants/projects";
import { SITE } from "@/constants/site";
import { SKILLS } from "@/constants/skills";

/**
 * The always-available knowledge base: everything the site itself says about
 * Zuhayr, as plain text for the model. Retrieved CV notes are added on top.
 */
export const PROFILE = [
  `Name: ${SITE.name}. Based in Islamabad, Pakistan, works with clients worldwide.`,
  "Positioning: full-stack web and AI developer. You describe it, I build it, and it goes live on the date we set. I build whatever the product needs, end to end: web and mobile apps, APIs and databases, payments and auth, and AI features such as agents, RAG and voice.",
  "On delivery: I agree on scope and dates up front, ship in small working pieces, keep clients updated as I go, and hit the timelines I commit to.",
  "Availability: taking on new projects. The way to start is the contact form at the bottom of the home page, or email.",
  `Contact: email ${SITE.email}, WhatsApp ${SITE.phone}, GitHub ${SITE.github}, LinkedIn ${SITE.linkedin}, Upwork ${SITE.upwork}.`,
  "Upwork: Top Rated Plus (top 3% of freelancers) with a 100% job success score, rated 5.0 across 13 client reviews, 18 jobs and about 2,500 hours. More than 30 projects shipped for over 10 clients since 2022.",
  "How I work with clients: we agree on the smallest useful version, I ship it quickly, and we improve it from real usage without letting performance or code quality slide. I work best with founders and small product teams.",
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
      `  Built with: ${(p.stack ?? []).join(", ")}. Live at ${p.link}${p.github ? `, source at ${p.github}` : ""}.`,
    ].join("\n")
  ),
  "",
  "Tools:",
  ...SKILLS.map((g) => `- ${g.title}: ${g.stack.join(", ")}.`),
].join("\n");
