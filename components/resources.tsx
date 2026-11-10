"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, Eye, Search, X } from "lucide-react";
import { resourceLinks } from "@/lib/format";
import { CATEGORIES, type Resource } from "@/lib/types";

/* ---------- cover: a typeset "front page", with the real first page on top when Drive provides it ---------- */
function Cover({ r }: { r: Resource }) {
  const { thumb } = resourceLinks(r);
  const [state, setState] = useState<"loading" | "ok" | "none">(thumb ? "loading" : "none");
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-t-[9px] border-b border-line bg-raise">
      <div className="grid-paper absolute inset-0 flex flex-col justify-between p-4">
        <span className="font-serif text-4xl leading-none text-goldink/70" aria-hidden="true">{r.cls}</span>
        <span className="font-serif text-[1.35rem] leading-tight">{r.title.replace(/ – .*$/, "")}</span>
      </div>
      {state !== "none" && (
        <>
          {state === "loading" && <div className="skeleton absolute inset-0 rounded-none" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={`First page of ${r.title}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setState("ok")}
            onError={() => setState("none")}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${state === "ok" ? "opacity-100" : "opacity-0"}`}
          />
        </>
      )}
      <span className="absolute right-3 top-3 rounded bg-[#101C35] px-1.5 py-0.5 font-display text-[0.68rem] font-bold tracking-wide text-[#F8F6F0]">PDF</span>
    </div>
  );
}

export function ResourceCard({ r, onPreview }: { r: Resource; onPreview: (r: Resource) => void }) {
  const links = resourceLinks(r);
  return (
    <article className="card card-hover flex flex-col">
      <Cover r={r} />
      <div className="flex flex-1 flex-col p-4">
        <p className="flex flex-wrap items-center gap-2">
          <span className={`tag tag-${r.cls}`}>{r.cls === "JEE" ? "JEE" : `Class ${r.cls}`}</span>
          <span className="text-xs text-muted">{r.category}</span>
        </p>
        <h3 className="mt-2.5 font-display text-[1.05rem] font-bold leading-snug">{r.title}</h3>
        <p className="mt-1 text-sm text-muted">{r.chapter}</p>
        {r.description && <p className="mt-2 text-sm text-muted">{r.description}</p>}
        <div className="mt-auto flex gap-2 pt-4">
          <button type="button" onClick={() => onPreview(r)} className="btn btn-outline btn-sm flex-1">
            <Eye size={16} aria-hidden="true" /> Preview<span className="sr-only"> {r.title}</span>
          </button>
          <a href={links.download} target="_blank" rel="noopener noreferrer" download className="btn btn-primary btn-sm flex-1">
            <Download size={16} aria-hidden="true" /> Download<span className="sr-only"> {r.title}</span>
          </a>
        </div>
      </div>
    </article>
  );
}

/* ---------- in-browser PDF preview ---------- */
export function PdfModal({ r, onClose }: { r: Resource | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!r) return;
    setLoaded(false);
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [r, onClose]);
  const links = r ? resourceLinks(r) : null;
  return (
    <AnimatePresence>
      {r && links && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Preview: ${r.title}`}
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-[#0a1227]/80 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex w-full max-w-5xl flex-col overflow-hidden bg-surface md:rounded-xl"
          >
            <div className="flex items-center gap-2 border-b border-line px-3 py-2.5 md:px-5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-bold">{r.title}</p>
                <p className="truncate text-xs text-muted">{r.cls === "JEE" ? "JEE" : `Class ${r.cls}`} · {r.chapter}</p>
              </div>
              <a href={links.open} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" aria-label="Open PDF in a new tab">
                <ExternalLink size={16} aria-hidden="true" /> <span className="hidden sm:inline">Open in new tab</span>
              </a>
              <a href={links.download} target="_blank" rel="noopener noreferrer" download className="btn btn-primary btn-sm" aria-label="Download PDF">
                <Download size={16} aria-hidden="true" /> <span className="hidden sm:inline">Download</span>
              </a>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close preview" className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line hover:border-ink">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="relative flex-1 bg-raise">
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-muted">
                  <p>Loading preview… If it does not appear, use “Open in new tab”.</p>
                </div>
              )}
              <iframe src={links.preview} title={`${r.title} (PDF)`} className="relative h-full w-full" onLoad={() => setLoaded(true)} allow="autoplay" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** A small set of cards with preview (home and course pages). */
export function ResourceRow({ resources }: { resources: Resource[] }) {
  const [preview, setPreview] = useState<Resource | null>(null);
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((r) => (
          <ResourceCard key={r.id} r={r} onPreview={setPreview} />
        ))}
      </div>
      <PdfModal r={preview} onClose={() => setPreview(null)} />
    </>
  );
}

/* ---------- the full library: search, filters, sort ---------- */
const PAGE = 12;

export function ResourceLibrary({ resources }: { resources: Resource[] }) {
  const [q, setQ] = useState("");
  const [cls, setCls] = useState<"All" | Resource["cls"]>("All");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<"recent" | "chapter" | "az">("recent");
  const [shown, setShown] = useState(PAGE);
  const [preview, setPreview] = useState<Resource | null>(null);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("class")?.toUpperCase();
    if (c === "XI" || c === "XII" || c === "JEE") setCls(c);
  }, []);
  useEffect(() => setShown(PAGE), [q, cls, cat, sort]);

  const classes = useMemo(() => ["All", ...(["XI", "XII", "JEE"] as const).filter((c) => resources.some((r) => r.cls === c))], [resources]);
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = resources.filter(
      (r) =>
        (cls === "All" || r.cls === cls) &&
        (cat === "All" || r.category === cat) &&
        (!needle || `${r.title} ${r.chapter} ${r.category} class ${r.cls}`.toLowerCase().includes(needle)),
    );
    if (sort === "az") out.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "chapter") out.sort((a, b) => a.cls.localeCompare(b.cls) || a.chapter.localeCompare(b.chapter, "en", { numeric: true }));
    else out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return out;
  }, [resources, q, cls, cat, sort]);

  const chip = (on: boolean) =>
    `min-h-10 rounded-md border px-3.5 text-sm font-medium transition-colors ${on ? "border-transparent bg-[var(--btn-bg)] text-[var(--btn-fg)]" : "border-line hover:border-ink"}`;

  return (
    <div>
      <div className="card mb-8 p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search resources</span>
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by chapter or topic, e.g. Integrals" className="input pl-11" />
          </label>
          <label className="md:w-56">
            <span className="sr-only">Sort resources</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="input">
              <option value="recent">Recently added</option>
              <option value="chapter">Chapter order</option>
              <option value="az">Title A–Z</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by class">
          {classes.map((c) => (
            <button key={c} type="button" aria-pressed={cls === c} onClick={() => setCls(c as typeof cls)} className={chip(cls === c)}>
              {c === "All" ? "All Resources" : c === "JEE" ? "JEE Notes" : `Class ${c}`}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={chip(cat === c)}>
              {c === "All" ? "All types" : c}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-5 text-sm text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "resource" : "resources"}
        {cls !== "All" || cat !== "All" || q ? " match your filters" : " available"}
      </p>

      {results.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.slice(0, shown).map((r) => (
            <ResourceCard key={r.id} r={r} onPreview={setPreview} />
          ))}
        </div>
      ) : (
        <div className="card grid-paper px-6 py-16 text-center">
          <p className="font-serif text-2xl">Nothing here yet.</p>
          <p className="mx-auto mt-2 max-w-md text-muted">
            {resources.length
              ? "No resources match these filters. Try another class or type, or clear the search."
              : "Study material will appear here as soon as it is published."}
          </p>
          {resources.length > 0 && (
            <button type="button" className="btn btn-outline btn-sm mt-5" onClick={() => (setQ(""), setCls("All"), setCat("All"))}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {results.length > shown && (
        <div className="mt-10 text-center">
          <button type="button" className="btn btn-outline" onClick={() => setShown((n) => n + PAGE)}>
            Show more resources
          </button>
        </div>
      )}
      <PdfModal r={preview} onClose={() => setPreview(null)} />
    </div>
  );
}

export function ResourceSkeletons({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card">
          <div className="skeleton aspect-[4/3] rounded-b-none" />
          <div className="space-y-3 p-4">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-5 w-4/5" />
            <div className="skeleton h-4 w-3/5" />
            <div className="skeleton h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
