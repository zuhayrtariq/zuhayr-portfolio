import LocalTime from "@/components/site/local-time";
import Sign from "@/components/ui/sign";
import { HIRE_LABEL, SITE } from "@/constants/site";

/** What a client does next, in the order they do it. */
const STEPS = [
  "Open my proposal on Upwork, or my profile.",
  "Send me a message, or pick a time with the meeting scheduler in Upwork Messages.",
  "We talk on Upwork's video call. Bring the hard questions.",
];

/** The bars of a boarding pass. They say nothing; they are what makes a ticket look like one. */
const BARS = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 1, 4, 1, 2, 3, 1, 2, 1, 1, 3, 1, 4, 2, 1, 3, 1, 1, 2, 4, 1];

/**
 * The way in for a client who came from Upwork. Upwork does not allow a client and a
 * freelancer to reach each other anywhere else before a contract starts, so in place of the
 * contact form this pass sends them back, and says why.
 */
const NextStep = () => {
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-cobalt relative overflow-hidden bg-cobalt">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-24 md:py-36">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 id="contact-title" className="text-[clamp(38px,5.5vw,96px)] lg:col-span-7">
            Next stop: an interview.
          </h2>
          <p className="max-w-[40ch] text-body lg:col-span-5 lg:pb-3 lg:text-lead">
            You&apos;ve seen what I&apos;ve landed and how I work. The next step is a conversation, and for an Upwork
            job that happens on Upwork.
          </p>
        </div>

        <div className="on-cloud mt-12 grid rounded-2xl bg-cloud shadow-[0_60px_120px_-50px_rgb(4_11_34/0.85)] md:mt-16 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,24rem)]">
          <div className="p-6 sm:p-9 lg:p-12">
            <p className="flex items-center justify-between gap-6 border-b-2 border-night pb-4 text-fine">
              <span className="font-bold">Boarding pass</span>
              <span className="whitespace-nowrap font-mono text-fog">Gate: Upwork</span>
            </p>
            <ol className="mt-2">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-baseline gap-5 border-t py-5 first:border-t-0 sm:gap-7 sm:py-6">
                  <span aria-hidden className="w-6 shrink-0 font-mono text-lead font-bold tabular-nums text-cobalt">
                    {i + 1}
                  </span>
                  <span className="max-w-[44ch] text-body sm:text-lead sm:leading-snug">{step}</span>
                </li>
              ))}
            </ol>
            <Sign href={SITE.upwork} tone="night" className="mt-6">
              {HIRE_LABEL.upwork}
            </Sign>
          </div>

          {/* The tear line, with the two notches a real pass has where it is punched. */}
          <div aria-hidden className="relative max-lg:h-0 lg:w-0">
            <span className="absolute border-dashed border-night/35 max-lg:inset-x-6 max-lg:border-t-2 lg:inset-y-6 lg:border-l-2" />
            <span className="absolute size-7 rounded-full bg-cobalt max-lg:-left-3.5 max-lg:-top-3.5 lg:-left-3.5 lg:-top-3.5" />
            <span className="absolute size-7 rounded-full bg-cobalt max-lg:-right-3.5 max-lg:-top-3.5 lg:-bottom-3.5 lg:-left-3.5" />
          </div>

          <div className="flex flex-col p-6 sm:p-9 lg:p-10">
            <p className="text-fine font-bold">Why there&apos;s no email on this page</p>
            <p className="mt-3 text-ui text-fog">
              Upwork asks clients and freelancers to keep every conversation on Upwork until a contract starts. So this
              copy of my site has no email, phone number or contact form, and I&apos;m glad to keep it that way: it
              protects your account and mine.
            </p>
            <p className="mt-6 border-t pt-5 text-ui">
              It&apos;s <LocalTime /> for me right now, in Islamabad.
            </p>
            <div aria-hidden className="mt-auto flex h-14 items-stretch gap-[3px] pt-8 opacity-90 max-lg:mt-4 max-lg:h-12">
              {BARS.map((weight, i) => (
                <span key={i} style={{ flexGrow: weight }} className={i % 2 ? "" : "bg-night"} />
              ))}
            </div>
            <p className="mt-3 font-mono text-[12px] text-fog">Islamabad, UTC+5. Working worldwide.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextStep;
