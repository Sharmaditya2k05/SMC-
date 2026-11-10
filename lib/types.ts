export type Cls = "XI" | "XII" | "JEE";

export const CATEGORIES = [
  "Chapter-wise Notes",
  "Formula Sheets",
  "Practice Questions",
  "Sample Papers",
] as const;

export type Resource = {
  id: string;
  title: string;
  cls: Cls;
  chapter: string;
  category: string;
  description?: string;
  /** Google Drive file id (publicly shared) – or – an uploaded file URL */
  driveId?: string;
  fileUrl?: string;
  published: boolean;
  createdAt: string;
};

export type Slot = {
  id: string;
  cls: "XI" | "XII";
  days: string[]; // "Mon".."Sat"
  start: string; // "15:30"
  end: string; // "17:00"
};
export type Timetable = { slots: Slot[]; notice: string };

export type Announcement = { id: string; title: string; body: string; published: boolean; createdAt: string };
export type GalleryImage = { id: string; url: string; caption: string; category: string; order: number; createdAt: string };
export type Testimonial = {
  id: string; name: string; cls: string; text: string; photoUrl?: string;
  permission: boolean; published: boolean; createdAt: string;
};
export type Achievement = { id: string; title: string; detail: string; year: string; published: boolean; createdAt: string };
export type Enquiry = {
  id: string; student: string; parent: string; whatsapp: string; cls: string;
  batch: string; message: string; handled: boolean; createdAt: string;
};

export type Settings = {
  brandName: string;
  tagline: string;
  teacherName: string;
  /** what students call the teacher, e.g. "Siddhu Sir" */
  teacherShortName: string;
  qualifications: string;
  experience: string;
  expertise: string;
  approach: string;
  bio: string;
  philosophy: string;
  studentMessage: string;
  portraitUrl: string;
  logoUrl: string;
  phone: string;
  whatsapp: string; // 10-digit Indian mobile, no country code
  address: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  driveFolderUrl: string;
  instagram: string;
  youtube: string;
  facebook: string;
  bannerEnabled: boolean;
  bannerText: string;
  syllabusXI: string; // one module per line
  syllabusXII: string;
};
