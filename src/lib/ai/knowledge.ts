import { experiences } from "@/constants/experiences";
import { projects } from "@/constants/projects";
import { SITE } from "@/constants/site";
import { SKILLS } from "@/constants/skills";

/**
 * The always-available knowledge base: everything the site itself says about
 * Zuhayr, as plain text for the model. Retrieved CV notes are added on top.
 */
export const PROFILE = [
  `Name: ${SITE.name}. Based in Pakistan, works with clients worldwide.`,
  "Positioning: I build AI products people can talk to: voice agents, RAG and agent systems, and the Next.js platforms around them.",
  "Availability: taking on new projects. The way to start is the contact form at the bottom of the home page, or email.",
  `Contact: email ${SITE.email}, WhatsApp ${SITE.phone}, GitHub ${SITE.github}, LinkedIn ${SITE.linkedin}, Upwork ${SITE.upwork}.`,
  "Upwork: Top Rated Plus (top 3% of freelancers) with a 100% job success score. More than 30 projects shipped for over 10 clients since 2022.",
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
