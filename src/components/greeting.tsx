import { motion } from 'framer-motion';
import Image from 'next/image';

export const Greeting = () => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto md:mt-16 px-5 size-full flex flex-col justify-center"
    >
      <div className="relative size-14 overflow-hidden rounded-full bg-secondary">
        <Image
          src="/images/me.png"
          alt=""
          fill
          sizes="56px"
          className="object-cover object-top"
          priority
        />
      </div>
      <h1 className="mt-6 text-[36px] md:text-[44px] font-semibold leading-[1.05] tracking-[-0.02em]">
        Ask me anything about my work.
      </h1>
      <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
        This assistant answers from my CV, projects and experience. Ask about
        a project, the stack I&apos;d use for your idea, or whether I&apos;m
        available.
      </p>
    </motion.div>
  );
};
