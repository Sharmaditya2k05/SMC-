import type { Settings, Timetable } from "./types";

/**
 * Everything here is editable from Admin → Website settings.
 * Fields left empty are details the teacher has not supplied yet; the site
 * shows a neutral "to be updated" state instead of inventing them.
 */
export const DEFAULT_SETTINGS: Settings = {
  brandName: "Siddhu Mathematics Classes",
  tagline: "Focused Mathematics Coaching for Class XI & XII.",
  teacherName: "",
  teacherShortName: "Siddhu Sir",
  qualifications: "",
  experience: "10+ years",
  expertise: "Mathematics for Classes XI and XII",
  approach:
    "Every student learns differently. Complex concepts are simplified, fundamentals are strengthened and each student gets individual attention – building confidence and logical thinking.",
  bio:
    "Mathematics is not simply about remembering formulas or solving equations. It is about understanding patterns, developing logical thinking and learning how to approach problems with confidence.\n\nAt Siddhu Mathematics Classes, the focus is on making mathematical concepts approachable, building strong fundamentals and encouraging students to think independently.",
  philosophy: "",
  studentMessage:
    "Be curious, ask questions, and never hesitate to go a step deeper. Mathematics can be truly enjoyable when you focus on understanding rather than just getting the right answer.",
  portraitUrl: "/brand/hero.webp",
  logoUrl: "",
  phone: "+91 99112 85808",
  whatsapp: "9911285808",
  address: "Ghaziabad, Uttar Pradesh",
  mapsUrl: "https://maps.app.goo.gl/GfRVqvpeP3Zei4M48",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Siddhu+Mathematics+Class&ll=28.6703477,77.4565317&z=16&output=embed",
  driveFolderUrl: "https://drive.google.com/drive/folders/1-1FSZXIS-XwbuXO9ZGFMaCh_Hd-eA_0Z",
  instagram: "https://www.instagram.com/siddhumathsclasses",
  youtube: "",
  facebook: "https://www.facebook.com/SiddhuClasses/",
  bannerEnabled: true,
  bannerText: "Class XI & XII Mathematics – Explore Available Batches.",
  syllabusXI: [
    "Sets and Functions",
    "Trigonometric Functions",
    "Complex Numbers and Quadratic Equations",
    "Linear Inequalities",
    "Permutations and Combinations",
    "Binomial Theorem",
    "Sequences and Series",
    "Straight Lines",
    "Conic Sections",
    "Introduction to Three-Dimensional Geometry",
    "Limits and Derivatives",
    "Statistics",
    "Probability",
  ].join("\n"),
  syllabusXII: [
    "Relations and Functions",
    "Inverse Trigonometric Functions",
    "Matrices",
    "Determinants",
    "Continuity and Differentiability",
    "Applications of Derivatives",
    "Integrals",
    "Applications of Integrals",
    "Differential Equations",
    "Vector Algebra",
    "Three-Dimensional Geometry",
    "Linear Programming",
    "Probability",
  ].join("\n"),
};

export const DEFAULT_TIMETABLE: Timetable = {
  notice: "",
  slots: [
    { id: "xi-a", cls: "XI", days: ["Mon", "Tue", "Wed"], start: "15:30", end: "17:00" },
    { id: "xi-b", cls: "XI", days: ["Thu", "Fri", "Sat"], start: "17:15", end: "18:45" },
    { id: "xii-a", cls: "XII", days: ["Mon", "Tue", "Wed"], start: "17:15", end: "18:45" },
    { id: "xii-b", cls: "XII", days: ["Thu", "Fri", "Sat"], start: "15:30", end: "17:00" },
  ],
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const DAY_NAMES: Record<string, string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};
