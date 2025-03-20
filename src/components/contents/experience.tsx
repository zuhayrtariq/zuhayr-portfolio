import Image from "next/image";
import { TimeLine, TimeLineItem } from "../utils/exp-timeline";
import { experiences } from "@/constants/experiences";
import { LinkPreview } from "../ui/link-preview";
const Experience = () => {
  const jobs = experiences.toReversed();
  return (
    <div className="w-full relative pt-10 pb-20 z-[99]">
      <TimeLine>
        {jobs.map((exp, i) => (
          <TimeLineItem key={i} active={exp.active} last={jobs.length - 1 == i}>
            <div className="flex items-center gap-1">
              <div className="relative w-8 h-8">
                <Image src={exp.icon} alt={exp.company_name} fill />
              </div>
              <LinkPreview url={exp.link}>
                <p className="font-semibold text-white">{exp.company_name}</p>
              </LinkPreview>
            </div>
            <TimeLineItem.Title>
              <span className="font-medium transition-all hover:text-white hover:underline hover:underline-offset-2">
                {exp.title}
              </span>{" "}
              • <span className="text-neutral-200">{exp.date}</span>
            </TimeLineItem.Title>
            <TimeLineItem.Description>{exp.points[0]}</TimeLineItem.Description>
          </TimeLineItem>
        ))}
      </TimeLine>
    </div>
  );
};

export default Experience;
