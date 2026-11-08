export const SITE = {
  name: "Zuhayr Tariq",
  url: "https://zuhayrr.com",
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
  { name: "Experience", href: "/#experience" },
  { name: "About", href: "/#about" },
  { name: "Talk to me", href: "/talk" },
];

export const askAiHref = (question: string) => `/talk?q=${encodeURIComponent(question)}`;
