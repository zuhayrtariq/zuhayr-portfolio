import { Project as ProjectProps } from "@/types";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Icons from "../ui/icons";
import { LinkPreview } from "../ui/link-preview";

interface Props {
  project: ProjectProps;
}

const Project = ({ project }: Props) => {
  const truncateDescription = (description: string) => {
    const firstFullStopIndex = description.indexOf(".");
    const firstExclamationIndex = description.indexOf("!");

    let truncateIndex = -1;

    if (firstFullStopIndex !== -1 && firstExclamationIndex !== -1) {
      // Choose the earlier occurrence of '.' or '!'
      truncateIndex = Math.min(firstFullStopIndex, firstExclamationIndex) + 1;
    } else if (firstFullStopIndex !== -1) {
      truncateIndex = firstFullStopIndex + 1;
    } else if (firstExclamationIndex !== -1) {
      truncateIndex = firstExclamationIndex + 1;
    }

    return truncateIndex !== -1
      ? description.slice(0, truncateIndex)
      : description;
  };

  return (
    <div className="w-full rounded-xl">
      <div className="flex flex-col p-2 lg:p-4">
        <h4 className="text-lg font-medium">{project.title}</h4>
        <p className="text-sm text-foreground/80 mt-2">
          {truncateDescription(project.description)}
        </p>
        <div className="flex gap-x-4 mt-4">
          <Link href={project.github} target="_blank">
            <Button variant="outline" size="sm">
              <Icons.github className="size-4 mr-2" />
              GitHub
            </Button>
          </Link>
          <LinkPreview url={project.link} className="text-white">
            <Button variant="outline" size="sm">
              <ExternalLinkIcon className="size-4 mr-2" />
              Site
            </Button>
          </LinkPreview>
        </div>
      </div>
    </div>
  );
};

export default Project;
