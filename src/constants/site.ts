export const SITE = {
  name: "Zuhayr Tariq",
  email: "zuhayrtariq4@gmail.com",
  phone: "+92 304 1420123",
  whatsapp: "https://wa.link/vk5n28",
  github: "https://github.com/zuhayrtariq",
  linkedin: "https://linkedin.com/in/zuhayrtariq",
  upwork: "https://www.upwork.com/freelancers/zuhayr",
  resume: "/cv.pdf",
};

export const NAV_LINKS = [
  { name: "Projects", href: "/#projects" },
  { name: "Experience", href: "/#experience" },
  { name: "About", href: "/#about" },
  { name: "Ask my AI", href: "/chat" },
];

export const askAiHref = (question: string) =>
  `/chat?query=${encodeURIComponent(question)}`;
