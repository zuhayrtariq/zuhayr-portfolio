import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Section = ({ id, title, intro, children, className }: SectionProps) => {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24", className)}
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4 md:sticky md:top-28 md:self-start lg:col-span-3">
          <h2
            id={`${id}-title`}
            className="text-[28px] font-semibold leading-tight tracking-tight"
          >
            {title}
          </h2>
          {intro && (
            <p className="mt-3 max-w-xs text-[15px] text-muted-foreground">
              {intro}
            </p>
          )}
        </div>
        <div className="md:col-span-8 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
};

export default Section;
