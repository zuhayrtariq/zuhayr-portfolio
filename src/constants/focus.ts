/**
 * The Upwork copy of the home page can be tailored to the kind of job a proposal answers:
 * /upwork/ai-agents and so on. A focus changes which products come first and what the work
 * section says about them. Nothing on these pages is said that the general page does not say.
 */
export interface Focus {
  slug: string;
  /** The kind of job, as it reads after "hiring for". */
  job: string;
  /** What the work section says first, in place of its general introduction. */
  lead: string;
  /** Case-study slugs, most relevant first. The rest follow in their usual order. */
  order: string[];
  /** The example draft that is on the screens when the page arrives. One of DRAFT_EXAMPLES; the first by default. */
  example?: string;
  /** Open with the "why hire a developer" checks, before the work. */
  checklistFirst?: boolean;
  /** A line added under the introduction to those checks. */
  note?: string;
}

export const FOCUSES: Focus[] = [
  {
    slug: "ai-agents",
    job: "an AI build",
    lead: "You're hiring for an AI build, so the AI products come first: an enterprise AI platform I lead, an agent that makes short videos, and analytics you can question in plain language. Each is live.",
    order: ["starling-mx", "hypecaster", "analytra"],
    example: "/drafts/support.txt",
  },
  {
    slug: "web-apps",
    job: "a web product",
    lead: "You're hiring for a web product, so these come first: a pet adoption platform, and the web home of an app with more than 60,000 players. I built both alone, and both are live.",
    order: ["yip", "runes", "starling-mx"],
  },
  {
    slug: "prototype-to-production",
    job: "a prototype that has to become a product",
    lead: "Products I built or led, each of them live. Open one and click around, or read how it was made.",
    order: ["yip", "starling-mx", "runes"],
    checklistFirst: true,
    note: "Already have a prototype built with AI? Share the repository in your Upwork message. I'll tell you what's solid, what will break under real users, and what it takes to launch.",
  },
];

export const getFocus = (slug: string) => FOCUSES.find((focus) => focus.slug === slug);
