export const SITE = {
  name: "Zuhayr Tariq",
  // Vercel serves www and redirects the bare domain to it.
  url: "https://www.zuhayrr.com",
  description:
    "Zuhayr Tariq is a full-stack web and AI developer who takes products from idea to launch, on time. Top Rated Plus on Upwork with 100% job success.",
  email: "zuhayrtariq4@gmail.com",
  phone: "+92 304 1420123",
  whatsapp: "https://wa.link/vk5n28",
  github: "https://github.com/zuhayrtariq",
  linkedin: "https://linkedin.com/in/zuhayrtariq",
  upwork: "https://www.upwork.com/freelancers/zuhayr",
  resume: "/cv.pdf",
};

export const NAV_LINKS = [
  { name: "Work", href: "/#work" },
  { name: "Process", href: "/#about" },
  { name: "Experience", href: "/#experience" },
  { name: "Talk to me", href: "/talk" },
];

export const askAiHref = (question: string) => `/talk?q=${encodeURIComponent(question)}`;
