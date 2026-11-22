import BrandIcon from "@/components/ui/brand-icon";
import { WHY_QUESTION } from "@/constants/faq";
import { askAiHref, SITE } from "@/constants/site";
import { AI_WORKFLOW } from "@/constants/skills";
import Link from "next/link";

/**
 * The lines of the checklist: one part of a product each, as a prompt hands it back and as
 * it has to be before real users arrive, ending on somewhere he has already done it.
 */
const ITEMS: { call: string; prompt: string; landed: string; proof: string; href: string }[] = [
  {
    call: "Payments",
    prompt: "A checkout page that takes a card.",
    landed: "Failed cards, refunds and webhooks handled, and no customer ever charged twice.",
    proof: "The Ticket Zone: Stripe Connect payouts and automatic refunds.",
    href: "/work/the-ticket-zone",
  },
  {
    call: "Accounts",
    prompt: "A login form.",
    landed: "Sign-in people already trust, a role for each kind of user, and no account able to read another's data.",
    proof: "Yip: sign-in with Apple, Google or email, and every private page locked behind it.",
    href: "/work/yip",
  },
  {
    call: "The AI",
    prompt: "A chatbot that always has an answer.",
    landed: "One that says when it doesn't know, stays inside a cost limit and can't be talked out of its rules.",
    proof: "The AI on this site: it answers only from my record, and it is rate limited.",
    href: "/talk",
  },
  {
    call: "Real traffic",
    prompt: "It works on your laptop.",
    landed: "It works for the thousandth user on a slow phone, and I hear about an error before you do.",
    proof: "Yip: more than 48,000 listings, with errors tracked in Sentry.",
    href: "/work/yip",
  },
  {
    call: "The date",
    prompt: "“Almost done”, for weeks.",
    landed: "A written scope, a date, and one person who answers for both.",
    proof: "My Upwork record: 100% job success across 18 jobs.",
    href: SITE.upwork,
  },
];

/**
 * Why hire a developer when AI can write code: AI is the copilot, and landing the thing is
 * still a checklist somebody has to answer for. Set as the laminated card from a cockpit.
 */
const Captain = () => {
  return (
    <section id="why" aria-labelledby="why-title" className="on-cobalt relative bg-cobalt">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pt-24 md:pt-36">
        <h2 id="why-title" className="text-[clamp(34px,5.2vw,90px)]">
          Everyone has a copilot now. <br className="max-md:hidden" />
          You&apos;re hiring the captain.
        </h2>
      </div>
      <div className="mx-auto grid max-w-[1680px] gap-x-12 gap-y-12 px-[clamp(20px,4vw,64px)] pb-24 pt-10 md:pb-36 md:pt-16 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <p className="max-w-[44ch] text-body lg:text-lead">
            I fly with AI every day, and it&apos;s a big part of why I&apos;m fast. But a prompt only gets a demo off
            the ground. Getting it down safely is a checklist, and these are the lines a prompt skips.
          </p>

          <dl className="mt-10 space-y-6 border-t border-white/25 pt-8 text-ui">
            <div>
              <dt className="text-fine text-fog">My copilots</dt>
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
          <Link href={askAiHref(WHY_QUESTION)} className="link-underline mt-8 inline-block text-ui font-bold">
            Put the question to my AI: “{WHY_QUESTION}”
          </Link>
        </div>

        <div className="lg:col-span-7">
          <div className="on-cloud overflow-hidden rounded-xl bg-cloud shadow-[0_50px_100px_-40px_rgb(4_11_34/0.75)]">
            <p className="flex items-center justify-between gap-6 bg-sun px-5 py-3.5 text-ui font-bold text-night sm:px-8">
              <span>Before landing</span>
              <span className="font-mono text-fine font-normal">5 items</span>
            </p>
            <ol>
              {ITEMS.map((item) => (
                <li key={item.call} className="border-t border-night/12 px-5 py-6 first:border-t-0 sm:px-8 sm:py-7">
                  <h3 className="flex items-center font-text text-[19px] font-bold leading-tight tracking-normal font-stretch-normal sm:text-lead">
                    {item.call}
                    <span aria-hidden className="leaders" />
                    <span className="inline-flex items-center gap-2 text-fine text-cobalt">
                      <svg viewBox="0 0 20 20" aria-hidden className="size-5 rounded-full bg-cobalt p-1 text-white" fill="none" stroke="currentColor" strokeWidth="3.2">
                        <path d="m4 10.5 4 4 8-9" />
                      </svg>
                      Checked
                    </span>
                  </h3>
                  <dl className="mt-3.5 grid gap-x-5 gap-y-2 text-ui sm:grid-cols-[9.5rem_minmax(0,1fr)]">
                    <dt className="text-fog">A prompt gives you</dt>
                    <dd className="text-fog">{item.prompt}</dd>
                    <dt className="font-bold">I land</dt>
                    <dd>{item.landed}</dd>
                    <dt className="text-fog max-sm:mt-1">Where I&apos;ve done it</dt>
                    <dd>
                      {item.href.startsWith("/") ? (
                        <Link href={item.href} className="link-underline">
                          {item.proof}
                        </Link>
                      ) : (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-underline">
                          {item.proof}
                        </a>
                      )}
                    </dd>
                  </dl>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Captain;
