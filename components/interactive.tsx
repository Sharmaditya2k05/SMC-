"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Printer, X } from "lucide-react";
import type { GalleryImage } from "@/lib/types";

/* ---------- FAQ accordion ---------- */
export function Accordion({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-bold md:py-6 md:text-xl"
              >
                <span>{it.q}</span>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300 ${isOpen ? "rotate-45 border-goldink text-goldink" : ""}`}>
                  <Plus size={18} aria-hidden="true" />
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
                  <div className="max-w-3xl pb-6 pr-12 text-muted [&_a]:text-blue [&_a]:underline [&_a]:underline-offset-3">{it.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
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
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const cats = ["All", ...new Set(images.map((i) => i.category).filter(Boolean))];
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
      {cats.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter photographs">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => (setCat(c), setAt(null))}
              className={`min-h-10 rounded-md border px-3.5 text-sm font-medium ${cat === c ? "border-transparent bg-[var(--btn-bg)] text-[var(--btn-fg)]" : "border-line hover:border-ink"}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {shown.map((img, i) => (
          <figure key={img.id} className="mb-5 break-inside-avoid">
            <button type="button" onClick={() => setAt(i)} className="group block w-full overflow-hidden rounded-lg border border-line" aria-label={`Open photograph: ${img.caption || img.category || "gallery image"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.caption || `${img.category || "Gallery"} photograph`} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-[1.03]" />
            </button>
            {img.caption && <figcaption className="mt-2 text-sm text-muted">{img.caption}</figcaption>}
          </figure>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photograph viewer"
            className="fixed inset-0 z-50 flex flex-col bg-[#0a1227]/95 text-ivory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between p-4">
              <p className="text-sm text-ivory/70">{at! + 1} / {shown.length}</p>
              <button type="button" autoFocus onClick={() => setAt(null)} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-md border border-white/25 hover:border-white">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4" onClick={(e) => e.target === e.currentTarget && setAt(null)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img key={current.id} src={current.url} alt={current.caption || "Gallery photograph"} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-h-full max-w-full rounded-md object-contain" />
              {shown.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous photograph" className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-black/40 hover:bg-black/60">
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next photograph" className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-black/40 hover:bg-black/60">
                    <ChevronRight aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            <p className="min-h-14 p-4 text-center text-sm text-ivory/85">{current.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
