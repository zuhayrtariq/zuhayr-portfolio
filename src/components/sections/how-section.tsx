import type { Audience } from "@/lib/audience";
import Faq from "../contents/faq";
import Boarding from "../flight/boarding";
import NextStep from "../flight/next-step";
import Clocks from "../how/clocks";
import Copilots from "../how/copilots";
import GoAround from "../how/go-around";
import HowHero from "../how/how-hero";
import TechLog from "../how/tech-log";

/**
 * "How I work": what a client hiring someone remote wants to know and cannot see from a
 * profile. How he decides a thing is done, what he does when it breaks, his hours against
 * theirs, how he uses AI, and the questions asked before a first call.
 */
const HowSection = ({ audience = "direct" }: { audience?: Audience }) => {
  return (
    <>
      <HowHero />
      <GoAround />
      <TechLog />
      <Copilots />
      <Clocks />
      <Faq audience={audience} />
      {audience === "upwork" ? <NextStep /> : <Boarding />}
    </>
  );
};

export default HowSection;
