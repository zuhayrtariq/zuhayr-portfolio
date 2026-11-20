"use client";

import { FAQ } from "@/constants/faq";
import Rise from "../motion/rise";

/** The questions clients ask before writing, answered in plain text that people and crawlers can both read. */
const Faq = () => {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative">
      <div className="mx-auto grid max-w-[1680px] gap-x-8 gap-y-12 px-[clamp(16px,4vw,64px)] py-24 md:py-40 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <Rise
            as="h2"
            by="lines"
            id="faq-title"
            className="font-display text-[clamp(72px,8.4vw,150px)] leading-[0.84] tracking-[-0.01em]"
          >
            Straight answers
          </Rise>
          <p className="mt-7 max-w-[30ch] text-body text-fog">
            What clients usually ask before the first call. Anything else, ask me directly.
          </p>
        </div>

        <dl className="lg:col-span-7 lg:col-start-6">
          {FAQ.map((item) => (
            <div key={item.question} className="border-t border-border py-8 last:border-b md:py-10">
              <dt className="font-text text-lead font-bold leading-snug">{item.question}</dt>
              <dd className="mt-3 max-w-[62ch] text-body text-fog">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Faq;
