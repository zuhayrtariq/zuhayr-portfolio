import type { Audience } from "@/lib/audience";
import Faq from "../contents/faq";
import Contact from "../home/contact";
import NextStep from "../home/next-step";
import Clocks from "../how/clocks";
import Done from "../how/done";
import HowHero from "../how/how-hero";
import Issue from "../how/issue";
import WithAi from "../how/with-ai";

/**
 * "How I work": what a client hiring someone remote wants to know and cannot see from a
 * profile. How he decides a thing is done, what he does when it breaks, his hours against
 * theirs, how he uses AI, and the questions asked before a first call.
 */
const HowSection = ({ audience = "direct" }: { audience?: Audience }) => {
  return (
    <>
      <HowHero />
      <Done />
      <Issue />
      <WithAi />
      <Clocks />
      <Faq audience={audience} />
      {audience === "upwork" ? <NextStep /> : <Contact />}
    </>
  );
};

export default HowSection;
