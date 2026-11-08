import { SKILLS } from "@/constants/skills";
import Section from "../site/section";

const listFormat = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

const MySkills = () => {
  return (
    <Section id="stack" question="What do you build with?">
      <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {SKILLS.map((group) => (
          <div key={group.title}>
            <dt className="text-body font-bold">{group.title}</dt>
            <dd className="mt-1.5 text-body text-fog">{listFormat.format(group.stack)}.</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
};

export default MySkills;
