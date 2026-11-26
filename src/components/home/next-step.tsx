import LocalTime from "@/components/site/local-time";
import Sign from "@/components/ui/sign";
import { HIRE_LABEL, SITE } from "@/constants/site";

/** What a client does next, in the order they do it. */
const STEPS = [
  "Open my proposal on Upwork, or my profile.",
  "Send me a message, or pick a time with the meeting scheduler in Upwork Messages.",
  "We talk on Upwork's video call. Bring the hard questions.",
];

/**
 * The way in for a client who came from Upwork. Upwork does not allow a client and a
 * freelancer to reach each other anywhere else before a contract starts, so in place of the
 * contact form this sends them back, and says why.
 */
const NextStep = () => {
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-emerald relative overflow-hidden bg-emerald">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-24 md:py-36">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 id="contact-title" className="text-[clamp(38px,5.5vw,96px)] lg:col-span-7">
            Next step: an interview.
          </h2>
          <p className="max-w-[40ch] text-body lg:col-span-5 lg:pb-3 lg:text-lead">
            You&apos;ve seen what I&apos;ve shipped and how I work. The next step is a conversation, and for an Upwork
            job that happens on Upwork.
          </p>
        </div>

        <div className="on-paper mt-12 grid overflow-hidden rounded-2xl bg-paper shadow-[0_60px_120px_-50px_rgb(3_20_14/0.85)] md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <div className="p-6 sm:p-9 lg:p-12">
            <p className="border-b-2 border-pine pb-4 text-fine font-bold">Three steps, all on Upwork</p>
            <ol className="mt-2">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-baseline gap-5 border-t py-5 first:border-t-0 sm:gap-7 sm:py-6">
                  <span aria-hidden className="w-6 shrink-0 font-mono text-lead font-bold tabular-nums text-emerald">
                    {i + 1}
                  </span>
                  <span className="max-w-[44ch] text-body sm:text-lead sm:leading-snug">{step}</span>
                </li>
              ))}
            </ol>
            <Sign href={SITE.upwork} tone="pine" className="mt-6">
              {HIRE_LABEL.upwork}
            </Sign>
          </div>

          <div className="flex flex-col border-t bg-umbra p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
            <p className="text-fine font-bold">Why there&apos;s no email on this page</p>
            <p className="mt-3 text-ui text-fog">
              Upwork asks clients and freelancers to keep every conversation on Upwork until a contract starts. So this
              copy of my site has no email, phone number or contact form, and I&apos;m glad to keep it that way: it
              protects your account and mine.
            </p>
            <p className="mt-6 border-t pt-5 text-ui lg:mt-auto">
              It&apos;s <LocalTime /> for me right now, in Islamabad.
            </p>
            <p className="mt-2 text-fine text-fog">UTC+5. Working worldwide.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextStep;
