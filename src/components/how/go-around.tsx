/**
 * How he decides a thing is finished. Plain type on purpose: this section is a promise, and
 * the object that backs it up is the log in the section below.
 */
const GoAround = () => {
  return (
    <section aria-labelledby="done-title" className="on-cloud relative bg-cloud">
      <div className="mx-auto grid max-w-[1680px] gap-x-12 gap-y-10 px-[clamp(20px,4vw,64px)] py-24 md:py-36 lg:grid-cols-12">
        <h2 id="done-title" className="text-[clamp(34px,4.3vw,72px)] lg:col-span-5">
          Done means done.
        </h2>
        <div className="max-w-[58ch] space-y-6 text-body lg:col-span-6 lg:col-start-7 lg:text-lead">
          <p>
            Most projects don&apos;t fail at the start. They stall at ninety percent, in the part nobody demos: the edge
            cases, the error messages, the last few screens. That part is what I&apos;m best at.
          </p>
          <p>
            I don&apos;t call something finished because it worked once on my machine. I use it the way your users
            will: on a phone, on a slow connection, with the wrong input, with an empty account.
          </p>
          <p>
            When a pilot doesn&apos;t like an approach, they go around and set it up again, and nobody calls that
            failing. I do the same with a feature that isn&apos;t right. I say so, I fix it, and then it lands. You
            hear about a problem from me before the date, not on it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GoAround;
