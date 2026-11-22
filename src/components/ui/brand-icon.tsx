import {
  siClaude,
  siClerk,
  siCloudflare,
  siConvex,
  siCursor,
  siDeepgram,
  siDocker,
  siDrizzle,
  siElevenlabs,
  siExpo,
  siFastapi,
  siFirebase,
  siGithubactions,
  siGooglecloud,
  siGooglegemini,
  siHono,
  siLangchain,
  siLanggraph,
  siMapbox,
  siMongodb,
  siNeon,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siResend,
  siSentry,
  siSnowflake,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTrpc,
  siTypescript,
  siUpstash,
  siUpwork,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

/** Keyed by the name as the site writes it, lower-cased. */
const ICONS: Record<string, SimpleIcon> = {
  typescript: siTypescript,
  "next.js": siNextdotjs,
  nextjs: siNextdotjs,
  react: siReact,
  reactjs: siReact,
  "react native with expo": siExpo,
  "node.js": siNodedotjs,
  nodejs: siNodedotjs,
  nestjs: siNestjs,
  hono: siHono,
  trpc: siTrpc,
  "python with fastapi": siFastapi,
  postgresql: siPostgresql,
  supabase: siSupabase,
  neon: siNeon,
  convex: siConvex,
  mongodb: siMongodb,
  firebase: siFirebase,
  "redis on upstash": siUpstash,
  upstash: siUpstash,
  drizzle: siDrizzle,
  prisma: siPrisma,
  "anthropic claude": siClaude,
  "the claude api": siClaude,
  claude: siClaude,
  gemini: siGooglegemini,
  "the gemini api": siGooglegemini,
  cursor: siCursor,
  "the vercel ai sdk": siVercel,
  "vercel ai": siVercel,
  vercel: siVercel,
  langchain: siLangchain,
  langgraph: siLanggraph,
  stripe: siStripe,
  "stripe connect": siStripe,
  clerk: siClerk,
  elevenlabs: siElevenlabs,
  deepgram: siDeepgram,
  cloudflare: siCloudflare,
  "google cloud": siGooglecloud,
  "google cloud run": siGooglecloud,
  mapbox: siMapbox,
  sentry: siSentry,
  docker: siDocker,
  "github actions": siGithubactions,
  resend: siResend,
  tailwindcss: siTailwindcss,
  snowflake: siSnowflake,
  upwork: siUpwork,
};

/**
 * A brand colour too dark or too light to show on every ground is drawn in the colour of
 * the text beside it instead.
 */
const onDark = (hex: string) => {
  const n = parseInt(hex, 16);
  const luma = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return luma < 0.32 || luma > 0.8 ? "currentColor" : `#${hex}`;
};

/** "the Vercel AI SDK" reads well in a sentence; a label wants the bare name. */
export const bareName = (name: string) => {
  const bare = name.replace(/^the /, "");
  // "tool calling" is a plain phrase and takes a capital; "tRPC" is a name and keeps its own.
  return /^[a-z]+( |$)/.test(bare) ? bare[0].toUpperCase() + bare.slice(1) : bare;
};

export const brandColor = (name: string) => {
  const icon = ICONS[name.toLowerCase()];
  return icon ? onDark(icon.hex) : "currentColor";
};

/** The brand's slug where an open mark exists for it, so two names for one brand share a logo. */
export const brandKey = (name: string) => ICONS[name.toLowerCase()]?.slug ?? null;

interface BrandIconProps {
  name: string;
  className?: string;
  /** Draw in the brand's own colour rather than the surrounding text colour. */
  colored?: boolean;
}

/**
 * The logo for a technology. Some brands publish no open mark; those render
 * nothing, and the name beside it stands on its own. Always decorative.
 */
const BrandIcon = ({ name, className, colored = true }: BrandIconProps) => {
  const icon = ICONS[name.toLowerCase()];
  if (!icon) return null;
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill={colored ? onDark(icon.hex) : "currentColor"}>
      <path d={icon.path} />
    </svg>
  );
};

export default BrandIcon;
