import { faqFor } from "@/constants/faq";
import type { Audience } from "@/lib/audience";

/** The questions clients ask before writing, answered in plain text that people and crawlers can both read. */
const Faq = ({ audience = "direct" }: { audience?: Audience }) => {
  return (
    <section id="faq" aria-labelledby="faq-title" className="on-cloud relative bg-cloud">
      <div className="mx-auto grid max-w-[1680px] gap-x-12 gap-y-10 border-t px-[clamp(20px,4vw,64px)] py-24 md:py-36 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <h2 id="faq-title" className="text-[clamp(34px,4.3vw,72px)]">
            Before you board.
          </h2>
          <p className="mt-6 max-w-[32ch] text-body text-fog">
            What clients usually ask before the first call. Anything else, ask me directly.
          </p>
        </div>

        <dl className="lg:col-span-7 lg:col-start-6">
          {faqFor(audience).map((item) => (
            <div key={item.question} className="border-t py-7 first:border-t-0 first:pt-0 md:py-9">
              <dt className="text-lead font-bold leading-snug">{item.question}</dt>
              <dd className="mt-3 max-w-[64ch] text-body text-fog">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Faq;
