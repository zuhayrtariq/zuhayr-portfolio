import type { Focus } from "@/constants/focus";
import type { Audience } from "@/lib/audience";
import { loadDraftExample } from "@/lib/draft-example";
import Stage from "../build/stage";
import Contact from "../home/contact";
import Next from "../home/next";
import NextStep from "../home/next-step";
import Record from "../home/record";
import Review from "../home/review";
import Shipped from "../home/shipped";

interface HomeSectionProps {
  audience?: Audience;
  /** Set on the pages tailored to one kind of job, which lead with the work closest to it. */
  focus?: Focus;
}

/**
 * The home page is one build. It opens on his workspace with a product drafted on it, and
 * scrolling takes that product from brief to launch. What follows is what he has shipped
 * before, why a developer still matters, the record, the way to the rest of the site, and how
 * to start.
 */
const HomeSection = async ({ audience = "direct", focus }: HomeSectionProps) => {
  const initial = await loadDraftExample(focus?.example);
  const work = <Shipped lead={focus?.lead} order={focus?.order} />;
  const why = <Review note={focus?.note} />;
  return (
    <>
      <Stage initial={initial} />
      {focus?.checklistFirst ? why : work}
      {focus?.checklistFirst ? work : why}
      <Record />
      <Next audience={audience} />
      {audience === "upwork" ? <NextStep /> : <Contact />}
    </>
  );
};

export default HomeSection;
