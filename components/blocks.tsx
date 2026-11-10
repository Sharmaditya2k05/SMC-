import Link from "next/link";
import { CalendarDays, MapPin, Navigation } from "lucide-react";
import { slotDays, slotTime, waLink, WA_MESSAGES } from "@/lib/format";
import type { Settings, Timetable } from "@/lib/types";
import { ConstructionArt } from "./math-art";
import { WaButton } from "./ui";

/** Teacher portrait in the brand's architectural frame. Falls back to a geometric plate until a photo is uploaded. */
export function Portrait({ settings, className = "", priority = false }: { settings: Settings; className?: string; priority?: boolean }) {
  return (
    <div className={`relative ${className}`}>
      <div className="frame absolute -right-3 -top-3 h-full w-full border border-[var(--gold)]" aria-hidden="true" />
      <div className="frame relative aspect-[4/5] overflow-hidden bg-[#101C35] shadow-[0_30px_60px_-30px_rgba(16,28,53,.55)]">
        {settings.portraitUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.portraitUrl}
            alt={settings.teacherName ? `${settings.teacherName}${settings.teacherShortName ? ` (${settings.teacherShortName})` : ""}, Mathematics teacher at Siddhu Mathematics Classes` : "The Mathematics teacher at Siddhu Mathematics Classes"}
            className="h-full w-full object-cover object-top"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <ConstructionArt />
        )}
      </div>
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
        className="h-full min-h-[320px] w-full border-0 dark:[filter:invert(.92)_hue-rotate(180deg)_saturate(.7)]"
      />
    </div>
  );
}

export function LocationCard({ settings }: { settings: Settings }) {
  return (
    <div className="card flex flex-col gap-5 p-6 md:p-8">
      <MapPin className="text-goldink" aria-hidden="true" />
      <div>
        <h3 className="font-display text-xl font-bold">{settings.brandName}</h3>
        <p className="mt-2 text-muted">
          {settings.address || "The full classroom address will be added here. Until then, the map pin and directions link lead to the exact location."}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap gap-3">
        <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <Navigation size={17} aria-hidden="true" /> Get Directions
        </a>
        <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}

const COURSE_COPY = {
  XI: "Develop conceptual clarity and a strong foundation for higher-level mathematics.",
  XII: "Master the concepts of Class XII and strengthen your problem-solving, one chapter at a time.",
};

export function CourseCard({ cls, timetable, whatsapp }: { cls: "XI" | "XII"; timetable: Timetable; whatsapp: string }) {
  const slots = timetable.slots.filter((s) => s.cls === cls);
  const navy = cls === "XII";
  return (
    <article className={`relative overflow-hidden rounded-[10px] border p-7 md:p-10 ${navy ? "border-transparent bg-deep text-ivory" : "border-line bg-surface"}`}>
      <span aria-hidden="true" className={`pointer-events-none absolute -right-2 -top-8 font-serif text-[11rem] leading-none md:text-[14rem] ${navy ? "text-white/[0.06]" : "text-[var(--xi-soft)]"}`}>
        {cls}
      </span>
      <div className="relative">
        <p className={`font-display text-sm font-bold ${navy ? "text-gold" : "text-blue"}`}>Class {cls}</p>
        <h3 className="mt-1 font-display text-3xl font-bold md:text-4xl">Mathematics</h3>
        <p className={`mt-4 max-w-md ${navy ? "text-ivory/75" : "text-muted"}`}>{COURSE_COPY[cls]}</p>
        <ul className={`mt-7 divide-y border-y ${navy ? "divide-white/15 border-white/15" : "divide-line border-line"}`}>
          {slots.map((s) => (
            <li key={s.id} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="flex items-center gap-2.5 text-[0.95rem]">
                <CalendarDays size={16} className={navy ? "text-gold" : "text-goldink"} aria-hidden="true" /> {slotDays(s)}
              </span>
              <span className="font-display font-bold tabular-nums">{slotTime(s)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/timetable" className={`btn ${navy ? "btn-gold" : "btn-primary"}`}>View Timetable</Link>
          <WaButton href={waLink(whatsapp, WA_MESSAGES[cls])}>Enquire on WhatsApp</WaButton>
        </div>
      </div>
    </article>
  );
}

/** (a + b)² shown as an area – the idea the whole site is about, in one figure. */
export function SquareIdentity() {
  return (
    <figure className="card grid-paper p-6 md:p-8">
      <svg viewBox="0 0 320 250" className="mx-auto w-full max-w-sm" role="img" aria-label="A square of side a plus b divided into a squared, two rectangles of area a b, and b squared">
        <g stroke="var(--ink)" strokeWidth="1.25">
          <rect x="50" y="20" width="130" height="130" fill="var(--xi-soft)" />
          <rect x="180" y="20" width="70" height="130" fill="var(--xii-soft)" />
          <rect x="50" y="150" width="130" height="70" fill="var(--xii-soft)" />
          <rect x="180" y="150" width="70" height="70" fill="var(--xi-soft)" />
        </g>
        <g fontFamily="var(--font-serif)" fontStyle="italic" fontSize="22" fill="var(--ink)" textAnchor="middle">
          <text x="115" y="92">a²</text><text x="215" y="92">ab</text><text x="115" y="192">ab</text><text x="215" y="192">b²</text>
        </g>
        <g fontFamily="var(--font-serif)" fontStyle="italic" fontSize="17" fill="var(--gold-ink)" textAnchor="middle">
          <text x="115" y="242">a</text><text x="215" y="242">b</text><text x="34" y="90">a</text><text x="34" y="190">b</text>
        </g>
      </svg>
      <figcaption className="mt-5 text-center">
        <span className="font-serif text-2xl italic">(a + b)² = a² + 2ab + b²</span>
        <span className="mt-2 block text-sm text-muted">Memorised, it is a formula. Drawn, it is obvious – and hard to forget.</span>
      </figcaption>
    </figure>
  );
}
