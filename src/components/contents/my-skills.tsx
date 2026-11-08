import { SKILLS } from "@/constants/skills";
import Section from "../site/section";

const MySkills = () => {
  return (
    <Section
      id="capabilities"
      title="Capabilities"
      intro="The tools I reach for, grouped by where they sit in the stack."
    >
      <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((group) => (
          <div key={group.title}>
            <dt className="font-heading text-[17px] font-semibold">
              {group.title}
            </dt>
            <dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {group.stack.join(", ")}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
};

export default MySkills;
