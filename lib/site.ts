export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/timetable", label: "Timetable" },
  { href: "/study-material", label: "Study Material" },
  { href: "/contact", label: "Contact" },
];

export const MORE_NAV = [
  { href: "/methodology", label: "Learning Methodology" },
  { href: "/results", label: "Results & Achievements" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faqs", label: "FAQs" },
];
