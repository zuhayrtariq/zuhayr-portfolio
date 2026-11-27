import { SiteLink } from "@/components/site/audience";
import BrandIcon from "@/components/ui/brand-icon";
import { WHY_QUESTION } from "@/constants/faq";
import { askAiHref, SITE } from "@/constants/site";
import { AI_WORKFLOW } from "@/constants/skills";

/**
 * The checks: one part of a product each, as a prompt hands it back and as it has to be
 * before real users arrive, ending on somewhere he has already done it.
 */
const CHECKS: { name: string; prompt: string; shipped: string; proof: string; href: string }[] = [
  {
    name: "Payments",
    prompt: "A checkout page that takes a card.",
    shipped: "Failed cards, refunds and webhooks handled, and no customer ever charged twice.",
    proof: "The Ticket Zone: Stripe Connect payouts and automatic refunds.",
    href: "/work/the-ticket-zone",
  },
  {
    name: "Accounts",
    prompt: "A login form.",
    shipped: "Sign-in people already trust, a role for each kind of user, and no account able to read another's data.",
    proof: "Yip: sign-in with Apple, Google or email, and every private page locked behind it.",
    href: "/work/yip",
  },
  {
    name: "The AI",
    prompt: "A chatbot that always has an answer.",
    shipped: "One that says when it doesn't know, stays inside a cost limit and can't be talked out of its rules.",
    proof: "The AI on this site: it answers only from my record, and it is rate limited.",
    href: "/talk",
  },
  {
    name: "Real traffic",
    prompt: "It works on your laptop.",
    shipped: "It works for the thousandth user on a slow phone, and I hear about an error before you do.",
    proof: "Yip: more than 48,000 listings, with errors tracked in Sentry.",
    href: "/work/yip",
  },
  {
    name: "The date",
    prompt: "“Almost done”, for weeks.",
    shipped: "A written scope, a date, and one person who answers for both.",
    proof: "My Upwork record: 100% job success across 18 jobs.",
    href: SITE.upwork,
  },
];

/**
 * Why hire a developer when AI can write code. The answer is set the way a change is reviewed
 * before it ships: each check with the line a prompt writes taken out, and the line he ships
 * put in.
 */
const Review = ({ note }: { /** A line for a visitor with one kind of job in mind. */ note?: string }) => {
  return (
    <section id="why" aria-labelledby="why-title" className="on-brand relative bg-brand">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pt-24 md:pt-36">
        <h2 id="why-title" className="text-[clamp(34px,5.2vw,90px)]">
          <span className="block font-mono font-light tracking-[-0.05em]">AI writes the code.</span>
          <span className="block">I answer for it.</span>
        </h2>
      </div>
      <div className="mx-auto grid max-w-[1680px] gap-x-12 gap-y-12 px-[clamp(20px,4vw,64px)] pb-24 pt-10 md:pb-36 md:pt-16 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <p className="max-w-[44ch] text-body lg:text-lead">
            I work with AI every day, and it&apos;s a big part of why I&apos;m fast. But a prompt gets you a demo, and a
            product is everything the demo leaves out. These are the lines a prompt skips.
          </p>
          {note && <p className="mt-5 max-w-[44ch] text-body font-bold">{note}</p>}

          <dl className="mt-10 space-y-6 border-t border-white/25 pt-8 text-ui">
            <div>
              <dt className="text-fine text-fog">What I work with</dt>
              <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-2 font-bold">
                {AI_WORKFLOW.stack.map((name) => (
                  <span key={name} className="inline-flex items-center gap-2">
                    <BrandIcon name={name} colored={false} className="size-4 shrink-0" />
                    {name}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-fine text-fog">What I studied</dt>
              <dd className="mt-2 max-w-[44ch]">
                MS in Computer Science at FAST NUCES, GPA 3.89 of 4, with machine learning and AI on the course. Before
                it, a BS in Computer Science as gold medalist.
              </dd>
            </div>
          </dl>
          <SiteLink href={askAiHref(WHY_QUESTION)} className="link-underline mt-8 inline-block text-ui font-bold">
            Put the question to my AI: “{WHY_QUESTION}”
          </SiteLink>
        </div>

        <div className="lg:col-span-7">
          <div className="on-paper overflow-hidden rounded-xl bg-paper shadow-[0_50px_100px_-40px_rgb(5_11_32/0.75)]">
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b-2 border-ink px-5 py-4 sm:px-8">
              <p className="text-ui font-bold">Before it ships</p>
              {/* The key to the two kinds of line below. */}
              <p className="flex flex-wrap gap-x-5 gap-y-1 text-fine">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="grid size-5 place-items-center rounded-sm bg-fail/20 font-mono font-bold text-error">
                    −
                  </span>
                  A prompt gives you
                </span>
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="grid size-5 place-items-center rounded-sm bg-mint/55 font-mono font-bold text-ink">
                    +
                  </span>
                  I ship
                </span>
              </p>
            </div>
            <ol>
              {CHECKS.map((item) => (
                <li key={item.name} className="border-t px-5 py-6 first:border-t-0 sm:px-8 sm:py-7">
                  <h3 className="flex items-center gap-3 text-[24px] sm:text-[28px]">
                    <svg viewBox="0 0 20 20" aria-hidden className="size-6 shrink-0 rounded-full bg-mint p-1.5 text-ink" fill="none" stroke="currentColor" strokeWidth="3.4">
                      <path d="m4 10.5 4 4 8-9" />
                    </svg>
                    {item.name}
                  </h3>
                  <div className="mt-4 overflow-hidden rounded-md text-ui">
                    <p className="flex gap-3.5 bg-fail/14 px-3.5 py-2.5">
                      <span aria-hidden className="font-mono font-bold text-error">
                        −
                      </span>
                      <span>
                        <span className="sr-only">A prompt gives you: </span>
                        {item.prompt}
                      </span>
                    </p>
                    <p className="flex gap-3.5 bg-mint/40 px-3.5 py-2.5">
                      <span aria-hidden className="font-mono font-bold text-ok">
                        +
                      </span>
                      <span>
                        <span className="sr-only">I ship: </span>
                        {item.shipped}
                      </span>
                    </p>
                  </div>
                  <p className="mt-3.5 text-ui text-fog">
                    Where I&apos;ve done it:{" "}
                    {item.href.startsWith("/") ? (
                      <SiteLink href={item.href} className="link-underline text-caption">
                        {item.proof}
                      </SiteLink>
                    ) : (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-underline text-caption">
                        {item.proof}
                      </a>
                    )}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;
