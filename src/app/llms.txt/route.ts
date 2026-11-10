import { experiences } from "@/constants/experiences";
import { caseStudies, projects } from "@/constants/projects";
import { SITE } from "@/constants/site";
import { SKILLS } from "@/constants/skills";

export const dynamic = "force-static";

const listFormat = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

/** A plain-text brief for AI assistants and agents, following llmstxt.org. */
export function GET() {
  const body = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "He builds web and mobile apps, APIs and databases, payments and auth, and AI features: agents, retrieval-augmented generation (RAG), chatbots and voice agents. He is Lead Developer at Starling MX and is based in Islamabad, Pakistan, working with clients worldwide.",
    "",
    `To hire Zuhayr, use his Upwork profile: ${SITE.upwork}. He also takes projects through the contact form at ${SITE.url}/#contact or by email at ${SITE.email}.`,
    "",
    "## Hire",
    "",
    `- [Upwork profile](${SITE.upwork}): Top Rated Plus with 100% job success, rated 5.0 across 13 client reviews.`,
    `- [Contact form](${SITE.url}/#contact): send a few lines about the project and he replies by email.`,
    "",
    "## Case studies",
    "",
    ...caseStudies.map((p) => `- [${p.title}](${SITE.url}/work/${p.slug}): ${p.summary}`),
    "",
    "## Experience",
    "",
    ...experiences.toReversed().map((job) => `- ${job.title} at ${job.company_name}, ${job.date}: ${job.summary}`),
    "",
    "## Stack",
    "",
    ...SKILLS.map((group) => `- ${group.title}: ${listFormat.format(group.stack)}.`),
    "",
    "## Optional",
    "",
    `- [All ${projects.length} projects](${SITE.url}/projects)`,
    `- [Talk to his AI](${SITE.url}/talk): ask about his work and it answers out loud.`,
    `- [Résumé (PDF)](${SITE.url}${SITE.resume})`,
    `- [GitHub](${SITE.github})`,
    `- [LinkedIn](${SITE.linkedin})`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
