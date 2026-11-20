"use client";

import BrandIcon, { bareName, brandColor, brandKey } from "@/components/ui/brand-icon";
import IconSphere, { type SphereItem } from "@/components/ui/icon-sphere";
import { SKILLS } from "@/constants/skills";
import { motion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
import Rise from "../motion/rise";

const EASE = [0.22, 1, 0.36, 1] as const;
/** One tile per logo: brands with no open mark are left to the written list, and "Stripe Connect" shares Stripe's. */
const LOGOS = [
  ...new Map(
    SKILLS.flatMap((group) => group.stack).flatMap((name) => {
      const key = brandKey(name);
      return key ? [[key, name] as const] : [];
    })
  ),
];

const keysOf = (names: string[]) => names.flatMap((name) => brandKey(name) ?? []);

const CHIP =
  "inline-flex h-9 items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3.5 text-fine text-caption/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/8 has-[svg]:pl-2.5";

/**
 * The stack as a sphere of logos beside the same names written out by job.
 * Pointing at a group, or at one name, brings those logos forward.
 */
const MySkills = () => {
  const [highlight, setHighlight] = useState<string[]>([]);

  const items = useMemo<SphereItem[]>(
    () =>
      LOGOS.map(([key, name]) => ({
        id: key,
        node: (
          <div
            style={{ "--brand": brandColor(name) } as CSSProperties}
            className="grid size-full place-items-center rounded-[26%] border border-white/10 bg-[#151616] text-[clamp(20px,2.3vw,34px)] text-caption shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_10px_30px_-10px_rgb(0_0_0/0.8)] transition-[border-color,box-shadow] duration-300 [[data-lit]>&]:border-(--brand) [[data-lit]>&]:shadow-[0_0_34px_-4px_var(--brand)]"
          >
            <BrandIcon name={name} className="size-[46%]" />
          </div>
        ),
      })),
    []
  );

  const clear = () => setHighlight([]);

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative overflow-hidden">
      <div className="mx-auto max-w-[1680px] px-[clamp(16px,4vw,64px)] py-24 md:py-40">
        <Rise
          as="h2"
          by="lines"
          id="stack-title"
          className="font-display text-[clamp(64px,9.4vw,170px)] leading-[0.84] tracking-[-0.01em]"
        >
          Whatever your product needs
        </Rise>

        <div className="mt-12 grid gap-x-8 gap-y-6 md:mt-16 lg:grid-cols-12">
          <div className="relative lg:sticky lg:top-[max(5rem,calc(50svh-21rem))] lg:order-last lg:col-span-6 lg:self-start">
            <div
              aria-hidden
              className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(255_77_31/0.2),rgb(255_77_31/0.05)_60%,transparent)]"
            />
            <IconSphere items={items} highlight={highlight} className="mx-auto w-full max-w-[26rem] lg:max-w-[44rem]" />
          </div>

          <div className="space-y-3 lg:col-span-6" onPointerLeave={clear}>
            {SKILLS.map((group, i) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.06 }}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHighlight(keysOf(group.stack))}
                className="group/row grid gap-x-6 gap-y-3 rounded-[22px] border border-white/8 bg-[#101111] p-5 transition-colors duration-300 hover:border-white/20 sm:grid-cols-[11rem_minmax(0,1fr)] sm:p-6"
              >
                <h3 className="font-display text-[30px] leading-none text-caption transition-colors duration-300 group-hover/row:text-signal sm:pt-1.5">
                  {group.title}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.stack.map((name) => (
                    <li
                      key={name}
                      onPointerEnter={(e) => {
                        if (e.pointerType !== "mouse") return;
                        e.stopPropagation();
                        setHighlight(keysOf([name]));
                      }}
                      onPointerLeave={(e) => e.pointerType === "mouse" && setHighlight(keysOf(group.stack))}
                      className={CHIP}
                    >
                      <BrandIcon name={name} className="size-4 shrink-0" />
                      {bareName(name)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MySkills;
