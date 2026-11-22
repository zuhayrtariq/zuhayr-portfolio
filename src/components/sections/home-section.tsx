import Draft from "../contents/draft";
import Faq from "../contents/faq";
import Arrivals from "../flight/arrivals";
import Boarding from "../flight/boarding";
import Captain from "../flight/captain";
import Flight from "../flight/flight";
import Instruments from "../flight/instruments";
import Route from "../flight/route";

/**
 * The home page is one flight. It takes off and lands in the first section; what follows is
 * what has landed before, who is flying, the record, and how to board.
 */
const HomeSection = () => {
  return (
    <>
      <Flight />
      <Arrivals />
      <Captain />
      <Instruments />
      <Draft />
      <Route />
      <Faq />
      <Boarding />
    </>
  );
};

export default HomeSection;
