import { SiteLink } from "@/components/site/audience";
import BrandIcon, { bareName } from "@/components/ui/brand-icon";
import { AI_WORKFLOW, PRODUCT_SKILLS } from "@/constants/skills";

const BUILT_IN = PRODUCT_SKILLS.filter((group) => group.title === "AI and agents" || group.title === "Voice");

const Tools = ({ names }: { names: string[] }) => (
  <span className="flex flex-wrap gap-x-4 gap-y-1.5">
    {names.map((name) => (
      <span key={name} className="inline-flex items-center gap-1.5">
        <BrandIcon name={name} className="size-3.5 shrink-0" />
        {bareName(name)}
      </span>
    ))}
  </span>
);

/**
 * How he uses AI: what it does, what stays with him, and what he builds with it. The same
 * split the home page makes between the copilot and the captain, in detail.
 */
const Copilots = () => {
  return (
    <section aria-labelledby="ai-title" className="on-cloud relative bg-cloud">
      <div className="mx-auto grid max-w-[1680px] gap-x-12 gap-y-12 px-[clamp(20px,4vw,64px)] py-24 md:py-36 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="ai-title" className="text-[clamp(34px,4.3vw,72px)]">
            What AI does, and what stays with me.
          </h2>
          <p className="mt-7 max-w-[42ch] text-body text-fog lg:text-lead">
            I work with AI every day, and I build it into products for clients. It makes me fast. It doesn&apos;t make
            the decisions, and it doesn&apos;t sign anything off.
          </p>
          <SiteLink href="/talk" className="link-underline mt-8 inline-block text-ui font-bold">
            Try the AI on this site: ask it anything about my work
          </SiteLink>
        </div>

        <dl className="text-body lg:col-span-6 lg:col-start-7">
          <div className="border-t py-6 first:border-t-0 first:pt-0">
            <dt className="text-ui font-bold">What the AI does</dt>
            <dd className="mt-2 text-fog">A lot of the typing, which is a big part of why I&apos;m fast.</dd>
          </div>
          <div className="border-t py-6">
            <dt className="text-ui font-bold">What stays with me</dt>
            <dd className="mt-2 text-fog">
              The architecture. Reading and testing everything before it ships. And the result: it&apos;s my
              responsibility, not the model&apos;s.
            </dd>
          </div>
          <div className="border-t py-6">
            <dt className="text-ui font-bold">What I work with</dt>
            <dd className="mt-3 text-ui text-fog">
              <Tools names={AI_WORKFLOW.stack} />
            </dd>
          </div>
          {BUILT_IN.map((group) => (
            <div key={group.title} className="border-t py-6">
              <dt className="text-ui font-bold">
                {group.title === "Voice" ? "What I build into voice products" : "What I build into products"}
              </dt>
              <dd className="mt-3 text-ui text-fog">
                <Tools names={group.stack} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Copilots;
