import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  /** The interviewer's question. It is the section heading. */
  question: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A magazine Q&A block: the question is the heading, set in the display face,
 * and the content beside or below it is the answer.
 */
const Section = ({ id, question, children, className }: SectionProps) => {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "mx-auto max-w-[1440px] px-[clamp(20px,4vw,64px)] py-24 md:py-40",
        className
      )}
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-x-8">
        <h2
          id={`${id}-title`}
          className="font-display text-q-sm leading-[1.02] font-semibold md:sticky md:top-32 md:col-span-4 md:self-start md:text-q lg:col-span-3"
        >
          {question}
        </h2>
        <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">{children}</div>
      </div>
    </section>
  );
};

export default Section;
