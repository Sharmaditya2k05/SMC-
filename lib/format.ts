import { DAY_NAMES } from "./defaults";
import type { Resource, Slot } from "./types";

export function time12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const hh = ((h + 11) % 12) + 1;
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
export const slotTime = (s: Slot) => `${time12(s.start)} – ${time12(s.end)}`;
export const slotDays = (s: Slot) => s.days.map((d) => DAY_NAMES[d] ?? d).join(", ");

export const WA_MESSAGES = {
  home: "Hello, I would like to enquire about Siddhu Mathematics Classes.",
  XI: "Hello, I am interested in Class XI Mathematics classes. Please share the details.",
  XII: "Hello, I am interested in Class XII Mathematics classes. Please share the details.",
};

/** 10-digit Indian mobile (starts 6–9), tolerating +91 / 0 prefixes and spaces. */
export function normaliseIndianMobile(input: string): string | null {
  const d = input.replace(/[\s\-()]/g, "").replace(/^(\+?91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

/**
 * Click-to-chat link. Until a WhatsApp number is saved in the admin settings
 * there is nothing real to link to, so we send visitors to the enquiry form
 * rather than to a made-up number.
 */
export function waLink(number: string, message: string) {
  const n = normaliseIndianMobile(number || "");
  if (!n) return "/contact#enquiry";
  return `https://wa.me/91${n}?text=${encodeURIComponent(message)}`;
}

export function resourceLinks(r: Resource) {
  if (r.driveId) {
    return {
      preview: `https://drive.google.com/file/d/${r.driveId}/preview`,
      open: `https://drive.google.com/file/d/${r.driveId}/view`,
      download: `https://drive.google.com/uc?export=download&id=${r.driveId}`,
      thumb: `https://drive.google.com/thumbnail?id=${r.driveId}&sz=w480`,
    };
  }
  const u = r.fileUrl ?? "";
  return { preview: u, open: u, download: u, thumb: "" };
}

export const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
