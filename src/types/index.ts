export interface AnimationContainerProps {
  children: React.ReactNode;
  customClassName?: string;
  customDelay?: number;
}

export interface TimelineItemProps {
  active?: boolean;
  children: React.ReactNode;
  last?: boolean;
}

export interface Project {
  title: string;
  /** One plain sentence, used in lists. */
  summary: string;
  description: string;
  github?: string;
  link: string;
  stack?: string[];
  featured?: boolean;
  role?: string;
  year?: string;
  /** Present when the project has a case-study page at /work/[slug]. */
  slug?: string;
  /** Screenshot of the live product, under /public. */
  image?: string;
  /** What the product is, in a few words. */
  kind?: string;
  /** The product's own brand colour, used to light its card. */
  accent?: string;
  /** A tall capture of the live site that scrolls inside the browser frame. */
  scroll?: { src: string; width: number; height: number };
}

export interface AboutProps {
  description: string[];
}

export interface CategoryProps {
  name: string;
  description: string;
}

export interface BlogProps {
  slug: string;
  title: string;
  views: number;
  description: string;
  content: any;
  categories: CategoryProps[];
  createdAt: string;
  publishedAt: string;
}

export interface ClientProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}
