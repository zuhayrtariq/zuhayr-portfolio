import type { Focus } from "@/constants/focus";
import type { Audience } from "@/lib/audience";
import Draft from "../contents/draft";
import Arrivals from "../flight/arrivals";
import Boarding from "../flight/boarding";
import Captain from "../flight/captain";
import Flight from "../flight/flight";
import Instruments from "../flight/instruments";
import NextStep from "../flight/next-step";
import Wayfinding from "../flight/wayfinding";

interface HomeSectionProps {
  audience?: Audience;
  /** Set on the pages tailored to one kind of job, which lead with the work closest to it. */
  focus?: Focus;
}

/**
 * The home page is one flight. It takes off and lands in the first section; what follows is
 * what has landed before, who is flying, the record, a plan drafted for the visitor, the way
 * to the rest of the site, and how to board.
 */
const HomeSection = ({ audience = "direct", focus }: HomeSectionProps) => {
  const work = <Arrivals lead={focus?.lead} order={focus?.order} />;
  const why = <Captain note={focus?.note} />;
  return (
    <>
      <Flight />
      {focus?.checklistFirst ? why : work}
      {focus?.checklistFirst ? work : why}
      <Instruments />
      <Draft />
      <Wayfinding />
      {audience === "upwork" ? <NextStep /> : <Boarding />}
    </>
  );
};

export default HomeSection;
