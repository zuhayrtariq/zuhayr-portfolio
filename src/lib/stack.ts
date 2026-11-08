const NAMES: Record<string, string> = {
  nextjs: "Next.js",
  reactjs: "React",
  typescript: "TypeScript",
  openai: "OpenAI",
  "open ai": "OpenAI",
  "vercel ai": "Vercel AI SDK",
  tailwindcss: "Tailwind CSS",
  "vapi ai": "Vapi",
  shadcn: "shadcn/ui",
  liveblocks: "Liveblocks",
  trpc: "tRPC",
  drizzleorm: "Drizzle",
  nodejs: "Node.js",
  expressjs: "Express",
  nestjs: "NestJS",
  mssql: "SQL Server",
  typeorm: "TypeORM",
  daisyui: "daisyUI",
  mongodb: "MongoDB",
  mysql: "MySQL",
  "tmdb api": "TMDB API",
};

/** Normalizes the loose tech names in the project data for display. */
export const stackName = (raw: string) => NAMES[raw.toLowerCase()] ?? raw;
