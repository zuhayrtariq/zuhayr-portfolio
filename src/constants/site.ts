export const SITE = {
  name: "Zuhayr Tariq",
  role: "Full-stack web and AI developer",
  // Vercel serves www and redirects the bare domain to it.
  url: "https://www.zuhayrr.com",
  description:
    "Zuhayr Tariq is a full-stack web and AI developer. You describe the product, he builds it, and it goes live on the agreed date. Top Rated Plus on Upwork.",
  email: "zuhayrtariq4@gmail.com",
  phone: "+92 304 1420123",
  whatsapp: "https://wa.link/vk5n28",
  github: "https://github.com/zuhayrtariq",
  linkedin: "https://linkedin.com/in/zuhayrtariq",
  upwork: "https://www.upwork.com/freelancers/zuhayr",
  resume: "/cv.pdf",
};

export const NAV_LINKS = [
  { name: "Work", href: "/work" },
  { name: "How I work", href: "/how-i-work" },
  { name: "Experience", href: "/experience" },
  { name: "Talk to me", href: "/talk" },
];

/** What the main call to action says, for each audience. It keeps one name everywhere it appears. */
export const HIRE_LABEL = { direct: "Start a project", upwork: "Message me on Upwork" } as const;

export const askAiHref = (question: string) => `/talk?q=${encodeURIComponent(question)}`;
