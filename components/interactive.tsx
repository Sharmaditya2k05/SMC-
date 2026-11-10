"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Clock, GraduationCap, Image as ImageIcon, MapPin, Plus, Printer, Users, X } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { PhotoStack, QuestionArc } from "./math-art";
import { Arc } from "./ui";

/* ---------- FAQ: topic index on the left, numbered accordion on the right ---------- */
export type Faq = { q: string; a: React.ReactNode; topic: string };
const TOPIC_ICONS: Record<string, typeof Clock> = { Classes: GraduationCap, Timings: Clock, "Study material": BookOpen, Location: MapPin, Admission: Users };

export function FaqExplorer({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(3);
  const topics = [...new Set(items.map((i) => i.topic))];
  const activeTopic = open === null ? null : items[open].topic;

  const jump = (topic: string) => {
    const i = items.findIndex((x) => x.topic === topic);
    setOpen(i);
    document.getElementById(`faq-q-${i}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[17rem_1fr] lg:gap-12">
      <aside className="relative hidden lg:sticky lg:top-28 lg:block lg:h-fit">
        <div className="relative hidden h-52 lg:block" aria-hidden="true">
          <QuestionArc className="absolute left-12 top-0 w-36" />
          <p className="absolute bottom-3 left-0 font-display text-4xl font-bold tracking-[-0.04em]">FAQs</p>
        </div>
        <ul className="flex flex-wrap gap-2 lg:mt-4 lg:flex-col lg:gap-3" aria-label="FAQ topics">
          {topics.map((t) => {
            const Icon = TOPIC_ICONS[t] ?? BookOpen;
            const on = activeTopic === t;
            return (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => jump(t)}
                  aria-pressed={on}
                  className={`relative flex min-h-11 w-full items-center gap-3 rounded-lg border px-4 font-display text-[0.95rem] font-semibold transition-colors ${on ? "border-transparent bg-[var(--xii-soft)]" : "border-line bg-surface hover:border-ink"}`}
                >
                  {on && <span className="absolute -left-3 top-1.5 hidden h-8 w-1 rounded bg-accent lg:block" aria-hidden="true" />}
                  <Icon size={19} aria-hidden="true" /> {t}
                </button>
              </li>
            );
          })}
        </ul>
        <Arc className="-bottom-24 -left-10 hidden w-64 lg:block" />
      </aside>

      <div className="card overflow-hidden px-2 md:px-4">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={it.q} className={`border-b border-line last:border-b-0 ${isOpen ? "-mx-2 rounded-xl border border-[#F5861F]/60 bg-[var(--xii-soft)] px-2 md:-mx-4 md:px-4" : ""}`}>
              <h3>
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 py-3.5 text-left font-display text-[1.02rem] font-bold md:gap-6 md:text-lg"
                >
                  <span className={`w-11 shrink-0 rounded-md py-1 text-center text-[0.95rem] ${isOpen ? "text-[var(--blue)]" : "bg-raise"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{it.q}</span>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-[1.5px] border-current transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    <Plus size={15} aria-hidden="true" />
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="max-w-3xl pb-5 pl-[3.75rem] pr-10 md:pl-[4.25rem] [&_a]:font-medium [&_a]:text-blue [&_a]:underline [&_a]:underline-offset-3">{it.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- print ---------- */
export function PrintButton({ children = "Download / Print Timetable (PDF)" }: { children?: React.ReactNode }) {
  return (
    <button type="button" className="btn btn-outline no-print" onClick={() => window.print()}>
      <Printer size={17} aria-hidden="true" /> {children}
    </button>
  );
}

/* ---------- gallery with lightbox ---------- */
const GALLERY_CATS = ["Classroom", "Teaching Moments", "Learning Environment", "Events", "Student Activities"];

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [cat, setCat] = useState("All");
  const [at, setAt] = useState<number | null>(null);
  const shown = images.filter((i) => cat === "All" || i.category === cat);

  const step = useCallback((d: number) => setAt((i) => (i === null ? i : (i + d + shown.length) % shown.length)), [shown.length]);
  useEffect(() => {
    if (at === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAt(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [at, step]);

  const current = at === null ? null : shown[at];
  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2.5" role="group" aria-label="Filter photographs">
        {["All", ...GALLERY_CATS].map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => (setCat(c), setAt(null))} className="chip">
            {c}
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {shown.map((img, i) => (
            <figure key={img.id} className="card mb-5 break-inside-avoid overflow-hidden p-2">
              <button type="button" onClick={() => setAt(i)} className="group block w-full overflow-hidden rounded-lg" aria-label={`Open photograph: ${img.caption || img.category || "gallery image"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.caption || `${img.category || "Gallery"} photograph`} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-[1.03]" />
              </button>
              {img.caption && <figcaption className="px-2 pb-1.5 pt-3 text-[0.95rem] font-medium">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      ) : (
        <GalleryEmpty filtered={images.length > 0} />
      )}

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photograph viewer"
            className="fixed inset-0 z-50 flex flex-col bg-[#16171B]/95 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative flex items-center justify-center p-4">
              <p className="font-display font-semibold">{at! + 1} / {shown.length}</p>
              <button type="button" autoFocus onClick={() => setAt(null)} aria-label="Close" className="absolute right-4 grid h-11 w-11 place-items-center rounded-md hover:bg-white/10">
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-16" onClick={(e) => e.target === e.currentTarget && setAt(null)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img key={current.id} src={current.url} alt={current.caption || "Gallery photograph"} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-h-full max-w-full rounded-xl object-contain" />
              {shown.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous photograph" className="absolute left-3 grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-white hover:bg-white/15">
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next photograph" className="absolute right-3 grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-white hover:bg-white/15">
                    <ChevronRight aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            <p className="min-h-10 px-4 pt-4 text-center font-medium">{current.caption}</p>
            <div className="flex justify-center gap-2.5 pb-6 pt-2" aria-hidden="true">
              {shown.slice(0, 12).map((s, i) => (
                <span key={s.id} className={`h-2 w-2 rounded-full ${i === at ? "bg-[#F5861F]" : "bg-white/35"}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function GalleryEmpty({ filtered = false }: { filtered?: boolean }) {
  return (
    <div className="card grid-paper relative overflow-hidden px-6 py-16 text-center">
      <Arc className="-left-6 -top-4 w-72" flip />
      <Arc className="-bottom-10 right-0 w-72" />
      {filtered ? <ImageIcon size={56} className="mx-auto text-accent" aria-hidden="true" /> : <PhotoStack className="mx-auto w-36" />}
      <p className="mx-auto mt-5 max-w-lg font-display text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-tight tracking-[-0.03em]">
        {filtered ? "No photographs in this category yet." : "Photographs from the classroom will be added here."}
      </p>
      <span className="mx-auto mt-5 block h-0.5 w-10 rounded bg-accent" aria-hidden="true" />
    </div>
  );
}
