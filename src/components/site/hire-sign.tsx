"use client";

import { useAudience } from "@/components/site/audience";
import Sign, { type SignProps } from "@/components/ui/sign";
import { HIRE_LABEL, SITE } from "@/constants/site";

/**
 * The site's main call to action. A direct visitor is taken to the contact form; a client who
 * came from Upwork is sent back there, which is where Upwork asks the conversation to stay.
 */
const HireSign = (props: Omit<SignProps, "href" | "children">) => {
  const audience = useAudience();
  return (
    <Sign href={audience === "upwork" ? SITE.upwork : "/#contact"} {...props}>
      {HIRE_LABEL[audience]}
    </Sign>
  );
};

export default HireSign;
