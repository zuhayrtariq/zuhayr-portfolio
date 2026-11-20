import { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "Starling MX",
    slug: "starling-mx",
    kind: "Enterprise AI platform",
    accent: "#E08A3C",
    scroll: { src: "/work/starling-mx-long.webp", width: 1280, height: 3022 },
    image: "/work/starling-mx.jpg",
    summary:
      "An enterprise AI platform that loads an organization's knowledge into every model call. I lead engineering, from the web platform to the agent layer.",
    description:
      "JARVIS for your business. Starling MX is an enterprise AI platform built on the Universal Cognitive Architecture — a sovereign Org Brain that loads your organization's knowledge into every LLM conversation. I lead engineering across the Next.js web platform, the live Domain Language Model (DLM) playgrounds, and the agent orchestration layer that turns stateless models into context-aware assistants.",
    stack: ["NextJS", "TypeScript", "OpenAI", "Vercel AI", "TailwindCSS", "Supabase", "Pinecone"],
    link: "https://www.starlingmx.com",
    featured: true,
    role: "Lead Developer",
    year: "2026",
  },
  {
    title: "ZFit-AI",
    slug: "zfit-ai",
    kind: "Voice AI fitness coach",
    accent: "#22D3EE",
    scroll: { src: "/work/zfit-ai-long.webp", width: 1280, height: 2228 },
    image: "/work/zfit-ai.jpg",
    summary:
      "A fitness coach you talk to: a voice agent on Vapi and Gemini that turns a short conversation into a workout and diet plan.",
    description:
      "ZFit-AI is a modern AI-powered fitness assistant built with Next.js, React, Tailwind, and Shadcn UI. It features a voice-based AI (Vapi + Gemini AI) that creates personalized workout and diet plans based on user goals, injuries, and preferences.",
    stack: ["NextJS", "Convex", "Vapi AI", "TypeScript", "Clerk", "TailwindCSS", "Gemini"],
    link: "https://zfit-ai.vercel.app",
    github: "https://github.com/zuhayrtariq/zfit-ai",
    featured: true,
  },
  {
    title: "Hypecaster",
    slug: "hypecaster",
    kind: "AI video agent",
    accent: "#9B6BFF",
    scroll: { src: "/work/hypecaster-long.webp", width: 1280, height: 3022 },
    image: "/work/hypecaster.jpg",
    summary:
      "An AI agent that writes a script, voices it, matches B-roll and adds captions to produce a short video.",
    description:
      "The HypeCaster AI Agent creates a viral script, generates a natural voiceover, matches it with amazing B-roll, and adds scroll-stopping captions to create a realistic AI video.",
    stack: ["NextJS", "Open AI", "Supabase", "TypeScript", "Clerk", "TailwindCSS"],
    link: "https://hypecaster.ai",
    featured: true,
  },
  {
    title: "Analytra",
    slug: "analytra",
    kind: "AI analytics",
    accent: "#35B8B3",
    scroll: { src: "/work/analytra-long.webp", width: 1280, height: 3022 },
    image: "/work/analytra.jpg",
    summary:
      "AI analytics that connects websites, ad platforms, CRMs and Stripe, and answers questions about the data in plain language.",
    description:
      "Analytra is an AI-powered analytics platform that connects data from websites, ad platforms, CRMs, Stripe, and social media. It offers natural language insights, automated dashboard summaries with trends and recommendations, and dynamic, collaborative reporting with chart-rich PDF exports.",
    stack: ["NextJS", "Open AI", "Supabase", "TypeScript", "Vercel AI", "Snowflake"],
    link: "https://analytra.io",
    featured: true,
  },
  {
    title: "The Ticket Zone",
    slug: "the-ticket-zone",
    image: "/work/the-ticket-zone.jpg",
    summary:
      "Event ticketing with real-time queues, waiting lists, automatic refunds and Stripe Connect payouts.",
    description:
      "Modern event ticketing platform with real-time queuing and instant payments. Built with NextJS, Convex, Clerk, and Stripe Connect. Features include smart waiting lists, automatic refunds, rate limiting, and beautiful UI with shadcn.",
    stack: ["NextJS", "Convex", "Stripe", "TypeScript", "Clerk", "TailwindCSS", "Upstash"],
    link: "https://the-ticket-zone.vercel.app",
    github: "https://github.com/zuhayrtariq/the-ticket-zone",
  },
  {
    title: "Contract Monitoring Dashboard",
    slug: "contract-monitoring",
    summary:
      "A contract tool fed by SAP data that sends automated alerts. It cut missed call-offs and expiries from about 20% to nearly zero.",
    description:
      "Built with NestJS, TypeScript, MSSQL, TypeORM, TailwindCSS, ReactJS, DaisyUI, and Nodemailer,\nthis dashboard streamlines contract management by integrating SAP data and automating alerts.\nIt ensures timely updates for representatives, provides one-click access to PDFs, and offers\na comprehensive view of all contract-related data. The tool successfully reduced missed call-offs\nand contract expirations from ~20% to nearly 0%.",
    stack: ["NestJS", "TypeScript", "MSSQL", "TypeORM", "TailwindCSS", "ReactJS", "DaisyUI", "Nodemailer"],
    link: "https://zee-contracts-dashboard.vercel.app/",
    github: "https://github.com/zuhayrtariq/contract-tool-client",
  },
  {
    title: "TrakLien",
    summary:
      "A fast, SEO-focused website for a US company that handles medical billing and lien management.",
    description:
      "Developed a modern, SEO-optimized website for TrakLien LLC, a US-based company specializing in medical billing, coding, and lien management for Personal Injury and Workers' Compensation providers.",
    stack: ["NextJS", "Open AI", "Supabase", "TypeScript", "Vercel AI", "Snowflake"],
    link: "https://traklienwc.com",
  },
  {
    title: "ZeeTube",
    summary: "A YouTube clone built with Next.js, tRPC, Drizzle, Upstash and Gemini.",
    description:
      "A youtube clone built using NextJS, TypeScript, Upstash, TailwindCSS, drizzleORM, TRPC, Gemini AI",
    stack: ["NextJS", "ReactJS", "TypeScript", "Gemini", "DrizzleORM", "TailwindCSS", "Upstash", "TRPC"],
    link: "https://zee-tube.vercel.app/",
    github: "https://github.com/zuhayrtariq/youtube-clone",
  },
  {
    title: "Zee Docs",
    summary: "A real-time collaborative document editor, a Google Docs clone on Liveblocks.",
    description:
      "Built with NextJS to handle the user interface, LiveBlocks for real-time features and styled with TailwindCSS, LiveDocs is a clone of Google Docs. The primary goal is to demonstrate the developer's skills in realtime environment that creates a lasting impact.",
    stack: ["NextJS", "ShadCN", "Clerk", "LiveBlocks", "Typescript"],
    link: "https://zeedocs.vercel.app",
    github: "https://github.com/zuhayrtariq/zee-docs",
  },
  {
    title: "Zee Store",
    summary: "An e-commerce storefront on Wix Headless with Wix authentication.",
    description:
      "An e-commerce website built using NextJS, Wix Headless CMS and Wix Auth. The data collected for this website was scrapper from outfitters.com. ShadCN and AceternityUI were used for styling",
    stack: ["NextJS", "ShadCN", "Wix", "Typescript"],
    link: "https://z-store.vercel.app/",
    github: "https://github.com/zuhayrtariq/zee-store",
  },
  {
    title: "Startup Hub",
    summary: "A platform where founders share pitches, vote on ideas and compete in virtual competitions.",
    description:
      "Join the platform to share your ideas, vote on innovative pitches, and gain recognition in exciting virtual competitions. Connect with entrepreneurs, showcase your startup, and take your ideas to the next level!",
    stack: ["NextJS", "Github", "ReactJS", "TailwindCSS", "ShadCN", "Typescript"],
    link: "https://startuphubb.vercel.app",
    github: "https://github.com/zuhayrtariq/startup-hub",
  },
  {
    title: "Zee Blogs",
    summary: "A blog platform with a writing dashboard, Clerk authentication and MongoDB.",
    description:
      "This is my personal blog app, built using NextJS, a robust React framework, to build server-side rendered and statically generated web applications.Integrated Clerk for seamless user authentication, providing a secure and user-friendly login experience.The backend is powered by MongoDB, a NoSQL database, and used Mongoose for elegant MongoDB object modeling in NodeJS.This project is designed as a full-featured blog application with dashboard.",
    stack: ["NextJS", "ShadCN", "Clerk", "MongoDB", "Typescript"],
    link: "https://zee-blogs.vercel.app/",
    github: "https://github.com/zuhayrtariq/zee-blog-app",
  },
  {
    title: "Uniboard",
    summary: "A university management system for students, faculty and administrators, on Node, Express and MySQL.",
    description:
      "A University Management System that deals with all the routine tasks performed by Students, Faculty, Administrators and Head of Departments. Main technologies used were NodeJS, ExpressJS, EJS, MySQL",
    stack: ["NodeJS", "MySQL", "ExpressJS"],
    link: "https://uniboard.cyclic.app/",
    github: "https://github.com/zuhayrtariq/FYP",
  },
  {
    title: "Airbnb booking app",
    summary: "A MERN booking app modeled on Airbnb.",
    description:
      "A Full-Stack booking app built using MERN(Mongo, Express, React, Node). The design and the idea was inspired by AirBnb. Front-end built using React and Tailwindcss. Backend based on Node.",
    stack: ["ReactJS", "MongoDB", "ExpressJS", "TailwindCSS"],
    link: "https://zuhayr-booking-app.vercel.app/",
    github: "https://github.com/zuhayrtariq/airbnb-clone",
  },
  {
    title: "Cinemate",
    summary: "A movie search app on the TMDB API, with ratings and details.",
    description:
      "A React Application built with the help of TMDB API. The App allows you to search for a movie and check the rating and the details. Allows user to toggle dark and light mode as well.",
    stack: ["TailwindCSS", "TMDB API", "NodeJS"],
    link: "https://cinemate-f2ojoomp8-zuhayrtariq.vercel.app/",
    github: "https://github.com/zuhayrtariq/cinemate-app",
  },
  {
    title: "Nike landing page",
    summary: "A Nike-inspired landing page in React and Tailwind.",
    description:
      "Nike Landing Page built using TailwindCSS.The design and the idea was inspired by Nike. Front-end built using React and Tailwindcss.",
    stack: ["ReactJS", "TailwindCSS"],
    link: "https://nike-z.vercel.app/",
    github: "https://github.com/zuhayrtariq/nike-landing-page",
  },
  {
    title: "Fitness app",
    summary: "An exercise finder by body part, on the ExerciseDB API.",
    description:
      "A Fitness App that tells you different exercises for different parts of the body. This was built using ReactJS, TailwindCSS and ExerciseDB API.",
    stack: ["ReactJS", "TailwindCSS", "API"],
    link: "https://fitness-app-z.vercel.app/",
    github: "https://github.com/zuhayrtariq/Fitness-App",
  },
  {
    title: "Gamers Den",
    summary: "A game browser with genre filters, on the RAWG API.",
    description:
      "A Web App that provides information about different games which can be also filtered by their genres. This was built using ReactJS, TailwindCSS and RAWG API.",
    stack: ["ReactJS", "TailwindCSS", "API"],
    link: "https://gamers-den-z.vercel.app/",
    github: "https://github.com/zuhayrtariq/games-list-app",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const caseStudies = projects.filter((p) => p.slug);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
