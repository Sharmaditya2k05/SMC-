import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, MapPin, Navigation } from "lucide-react";
import { time12 } from "@/lib/format";
import type { Settings, Slot, Timetable } from "@/lib/types";
import { MiniGraph } from "./math-art";
import { BulbMark } from "./ui";

/** "Mon – Wed" for consecutive days, otherwise "Mon, Wed, Fri". */
const ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export function dayRange(s: Slot, long = false) {
  const idx = s.days.map((d) => ORDER.indexOf(d)).sort((a, b) => a - b);
  const consecutive = idx.length > 2 && idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (long) return s.days.join(", ");
  return consecutive ? `${ORDER[idx[0]]} – ${ORDER[idx[idx.length - 1]]}` : s.days.join(", ");
}
export const shortTime = (s: Slot) => `${time12(s.start).replace(/ [AP]M$/, "")} – ${time12(s.end)}`;

/**
 * Teacher portrait. The default artwork (public/brand/hero.webp) already includes
 * the orbit ring and equations, so it is shown as it is in a soft rounded frame.
 */
export function Portrait({ settings, className = "", priority = false }: { settings: Settings; className?: string; priority?: boolean; decorated?: boolean }) {
  const name = [settings.teacherShortName, settings.teacherName && `(${settings.teacherName})`].filter(Boolean).join(" ");
  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-[2rem] bg-[#FBF1E6] shadow-[0_30px_60px_-36px_rgba(22,23,27,.5)] ring-1 ring-black/5">
        {settings.portraitUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.portraitUrl}
            alt={name ? `${name}, Mathematics teacher at Siddhu Mathematics Classes` : "The Mathematics teacher at Siddhu Mathematics Classes"}
            width={1195}
            height={1316}
            className="block h-auto w-full"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <div className="grid aspect-[10/11] place-items-center bg-[#16171B] text-white"><BulbMark size={120} /></div>
        )}
      </div>
    </div>
  );
}

/**
 * The "SIDDHU SIR" nameplate artwork that sits under the portrait. The artwork
 * has the name drawn into it, so any other name falls back to a plain card.
 */
export function NamePlate({ settings, className = "" }: { settings: Settings; className?: string }) {
  const name = settings.teacherShortName || settings.teacherName;
  if (!name) return null;
  if (name.trim().toLowerCase() === "siddhu sir") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/brand/nameplate.webp" alt="Siddhu Sir" width={1000} height={291} className={`relative z-10 mx-auto block h-auto w-[82%] max-w-[22rem] drop-shadow-[0_10px_18px_rgba(22,23,27,.22)] ${className}`} />
    );
  }
  return (
    <div className={`card relative z-10 mx-auto w-fit px-6 py-2.5 text-center ${className}`}>
      <p className="font-display text-lg font-bold leading-tight">{name}</p>
    </div>
  );
}

export function MapEmbed({ settings, className = "" }: { settings: Settings; className?: string }) {
  return (
    <div className={`card overflow-hidden ${className}`}>
      <iframe
        src={settings.mapsEmbedUrl}
        title="Map showing the Siddhu Mathematics Classes classroom"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-full min-h-[300px] w-full border-0 dark:[filter:invert(.92)_hue-rotate(180deg)_saturate(.7)]"
      />
    </div>
  );
}

export function LocationCard({ settings }: { settings: Settings }) {
  return (
    <div className="card flex flex-col gap-5 p-6 md:p-8">
      <div className="flex gap-4">
        <MapPin size={30} className="mt-0.5 shrink-0 fill-accent text-surface" aria-hidden="true" />
        <div>
          <h3 className="font-display text-xl font-bold">{settings.brandName}</h3>
          <p className="mt-1.5 text-muted">
            {settings.address || "The full classroom address will be added here."}
            <span className="mt-1 block text-sm">The map pin and directions lead to the exact classroom.</span>
          </p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-3">
        <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1">
          <Navigation size={17} aria-hidden="true" /> Get Directions
        </a>
        <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline flex-1">
          <MapPin size={17} className="text-accent" aria-hidden="true" /> Open in Google Maps
        </a>
      </div>
    </div>
  );
}

/** Timing rows: "MTW : 03:30 – 05:00 PM" */
export function SlotRows({ slots, tone = "light", pill = false }: { slots: Slot[]; tone?: "light" | "dark"; pill?: boolean }) {
  return (
    <ul className="space-y-2">
      {slots.map((s) => (
        <li key={s.id} className="flex items-center gap-3 text-[0.95rem]">
          <CalendarDays size={17} className="shrink-0" aria-hidden="true" />
          <span className="w-[5.5rem] shrink-0 whitespace-nowrap font-display font-semibold">{dayRange(s)}</span>
          <span className={`whitespace-nowrap font-display font-semibold tabular-nums ${pill ? `rounded-md px-2.5 py-1 ${tone === "dark" ? "bg-[#F4DCC7] text-[#16171B]" : "bg-[#F9E4D2] text-[#16171B]"}` : ""}`}>{shortTime(s)}</span>
        </li>
      ))}
      {!slots.length && <li className="text-muted">Batch timings will be announced.</li>}
    </ul>
  );
}

const COURSE_COPY = {
  XI: { text: "Build conceptual clarity and a strong foundation for higher-level mathematics.", graph: "parabola", label: <>y = x²</> },
  XII: { text: "Master the key concepts of Class XII with a strong focus on problem-solving.", graph: "cos", label: <>y = cos x</> },
} as const;

/** Home page course card: Class XI on white, Class XII on charcoal. */
export function CourseCard({ cls }: { cls: "XI" | "XII" }) {
  const dark = cls === "XII";
  const c = COURSE_COPY[cls];
  return (
    <article className={`relative overflow-hidden rounded-xl border p-6 md:p-8 ${dark ? "border-transparent bg-deep text-white" : "border-line bg-surface shadow-[var(--shadow)]"}`}>
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <h3 className="bar-title text-2xl md:text-[1.7rem]">Class {cls} Mathematics</h3>
          <p className={`mt-3 max-w-sm pl-4 ${dark ? "text-white/75" : "text-muted"}`}>{c.text}</p>
          <Link href={`/courses#class-${cls.toLowerCase()}`} className={`btn btn-sm ml-4 mt-6 ${dark ? "btn-onnavy" : "btn-outline"}`}>
            <BookOpen size={16} aria-hidden="true" /> View the course <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <MiniGraph kind={c.graph} label={c.label} tone={dark ? "dark" : "light"} className="hidden h-28 w-48 sm:block" />
      </div>
    </article>
  );
}

/** Compact class card with a coloured header bar (Contact page). */
export function ClassTimeCard({ cls, timetable }: { cls: "XI" | "XII"; timetable: Timetable }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow)]">
      <p className={`flex items-center gap-2.5 px-4 py-2.5 font-display font-bold ${cls === "XI" ? "bg-[var(--xi)] text-[var(--xi-fg)]" : "bg-[var(--xii)] text-white"}`}>
        <BookOpen size={18} aria-hidden="true" /> Class {cls}
      </p>
      <ul className="space-y-2 p-3">
        {timetable.slots.filter((s) => s.cls === cls).map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 font-display font-semibold"><CalendarDays size={15} aria-hidden="true" /> {dayRange(s)}</span>
            <span className="rounded-md bg-[var(--xii-soft)] px-2 py-1 font-display font-semibold tabular-nums">{shortTime(s)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
