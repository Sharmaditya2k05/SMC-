"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download, ExternalLink, Eye, Layers, RefreshCw, Search, X } from "lucide-react";
import { resourceLinks } from "@/lib/format";
import { CATEGORIES, type Resource } from "@/lib/types";

const clsLabel = (c: Resource["cls"]) => (c === "JEE" ? "JEE" : `Class ${c}`);
const short = (r: Resource) => r.title.replace(/ – .*$/, "");

function PdfBadge({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-md bg-[#E5402B] font-display font-bold text-white ${size === "sm" ? "h-5 px-1 text-[0.55rem]" : "h-11 w-10 text-[0.62rem]"}`}>
      PDF
    </span>
  );
}

/* ---------- cover: typeset title page, with the real first page on top when Drive provides it ---------- */
function Cover({ r }: { r: Resource }) {
  const { thumb } = resourceLinks(r);
  const [state, setState] = useState<"loading" | "ok" | "none">(thumb ? "loading" : "none");
  return (
    <div className="relative h-full min-h-40 overflow-hidden rounded-lg border border-line bg-surface">
      <div className="grid-paper absolute inset-0 flex flex-col justify-end p-3">
        <span className="math text-lg leading-tight underline decoration-accent decoration-2 underline-offset-4">{short(r)}</span>
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
      <span className="absolute left-2 top-2"><PdfBadge size="sm" /></span>
    </div>
  );
}

/** Library card: first page on the left, details and actions on the right. */
export function ResourceCard({ r, onPreview }: { r: Resource; onPreview: (r: Resource) => void }) {
  const links = resourceLinks(r);
  return (
    <article className="card card-hover grid grid-cols-[46%_1fr] gap-3 p-2.5">
      <Cover r={r} />
      <div className="flex min-w-0 flex-col py-1 pr-1">
        <p><span className={`tag tag-${r.cls}`}>{clsLabel(r.cls)}</span></p>
        <h3 className="mt-2 font-display text-[0.98rem] font-bold leading-snug">{r.title}</h3>
        <p className="mt-1 text-xs leading-snug text-muted">{r.chapter}</p>
        {r.description && <p className="mt-1 text-xs text-muted">{r.description}</p>}
        <div className="mt-auto flex flex-col gap-2 pt-3">
          <button type="button" onClick={() => onPreview(r)} className="btn btn-outline btn-sm min-h-9 border-line">
            <Eye size={15} aria-hidden="true" /> Preview<span className="sr-only"> {r.title}</span>
          </button>
          <a href={links.download} target="_blank" rel="noopener noreferrer" download className="btn btn-primary btn-sm min-h-9">
            <Download size={15} aria-hidden="true" /> Download<span className="sr-only"> {r.title}</span>
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
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-[#16171B]/75 backdrop-blur-sm md:p-6"
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
            className="flex w-full max-w-5xl flex-col overflow-hidden bg-surface md:rounded-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-3 py-3 md:px-5">
              <PdfBadge />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-bold">{r.title}</p>
                <p className="truncate text-xs text-muted">{clsLabel(r.cls)} · {r.chapter}</p>
              </div>
              <a href={links.open} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm border-line" aria-label="Open PDF in a new tab">
                <ExternalLink size={16} aria-hidden="true" /> <span className="hidden sm:inline">Open in new tab</span>
              </a>
              <a href={links.download} target="_blank" rel="noopener noreferrer" download className="btn btn-primary btn-sm" aria-label="Download PDF">
                <Download size={16} aria-hidden="true" /> <span className="hidden sm:inline">Download</span>
              </a>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close preview" className="grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-raise">
                <X size={22} aria-hidden="true" />
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

/** Compact strip of notes (home and course pages): PDF icon, title, class and chapter, download. */
export function ResourceRow({ resources, tone = "light", cols = 4 }: { resources: Resource[]; tone?: "light" | "dark"; cols?: 3 | 4 }) {
  const [preview, setPreview] = useState<Resource | null>(null);
  return (
    <>
      <ul className={`grid gap-4 sm:grid-cols-2 ${cols === 3 ? "xl:grid-cols-3" : "lg:grid-cols-4"}`}>
        {resources.map((r) => (
          <li key={r.id} className={`flex items-center gap-3 rounded-xl border p-3 shadow-[var(--shadow)] transition-colors hover:border-accent ${tone === "dark" ? "border-transparent bg-white text-[#16171B]" : "border-line bg-surface"}`}>
            <PdfBadge />
            <button type="button" onClick={() => setPreview(r)} className="min-w-0 flex-1 text-left">
              <span className="block truncate font-display text-[0.95rem] font-bold">{short(r)}</span>
              <span className={`block truncate text-xs ${tone === "dark" ? "text-[#6A6E77]" : "text-muted"}`}>
                {clsLabel(r.cls)} • {r.chapter.split(" · ")[0]}
              </span>
              <span className="sr-only">Preview {r.title}</span>
            </button>
            <a href={resourceLinks(r).download} target="_blank" rel="noopener noreferrer" download aria-label={`Download ${r.title}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-black/5">
              <Download size={19} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <PdfModal r={preview} onClose={() => setPreview(null)} />
    </>
  );
}

/* ---------- the full library: search, filters, sort, grouped by class ---------- */
const PAGE = 12;
const GROUPS = [
  { cls: "XI", title: "Class XI Mathematics" },
  { cls: "XII", title: "Class XII Mathematics" },
  { cls: "JEE", title: "JEE Notes" },
] as const;

export function ResourceLibrary({ resources }: { resources: Resource[] }) {
  const [q, setQ] = useState("");
  const [cls, setCls] = useState<"All" | Resource["cls"]>("All");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<"recent" | "chapter" | "az">("chapter");
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
    else if (sort === "chapter") out.sort((a, b) => a.chapter.localeCompare(b.chapter, "en", { numeric: true }));
    else out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return out;
  }, [resources, q, cls, cat, sort]);

  const visible = results.slice(0, shown);
  const filtered = cls !== "All" || cat !== "All" || q;

  return (
    <div>
      <div className="top-[4.75rem] z-20 -mx-2 mb-6 bg-bg/95 px-2 py-4 backdrop-blur-md md:sticky md:mb-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative md:w-[26rem]">
            <span className="sr-only">Search resources</span>
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by chapter or topic, e.g. Integrals" className="input pl-11" />
          </label>
          <span className="hidden h-7 w-px bg-line md:block" aria-hidden="true" />
          <label className="relative hidden md:block md:w-48">
            <span className="sr-only">Sort resources</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="input appearance-none pr-9 font-display text-sm font-semibold">
              <option value="chapter">Chapter order</option>
              <option value="recent">Recently added</option>
              <option value="az">Title A–Z</option>
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          </label>
          <p className="flex items-center gap-2 font-display text-sm font-semibold md:ml-auto" aria-live="polite">
            <Layers size={18} aria-hidden="true" /> {results.length} {results.length === 1 ? "resource" : "resources"} {filtered ? "found" : "available"}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by class">
            {classes.map((c) => (
              <button key={c} type="button" aria-pressed={cls === c} onClick={() => setCls(c as typeof cls)} className="chip">
                {c === "All" ? "All Resources" : c === "JEE" ? "JEE Notes" : `Class ${c}`}
              </button>
            ))}
          </div>
          <span className="mx-1 hidden h-7 w-px bg-line md:block" aria-hidden="true" />
          <div className="hidden flex-wrap gap-2 md:flex" role="group" aria-label="Filter by type">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(cat === c ? "All" : c)} className="chip">
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results.length ? (
        <div className="space-y-12">
          {GROUPS.map((g) => {
            const items = visible.filter((r) => r.cls === g.cls);
            if (!items.length) return null;
            return (
              <section key={g.cls} aria-labelledby={`group-${g.cls}`}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 id={`group-${g.cls}`} className="bar-title text-2xl md:text-[1.75rem]">{g.title}</h2>
                  <p className="text-sm text-muted">{results.filter((r) => r.cls === g.cls).length} resources</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {items.map((r) => (
                    <ResourceCard key={r.id} r={r} onPreview={setPreview} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="card grid-paper px-6 py-16 text-center">
          <p className="font-display text-2xl font-bold">Nothing here yet.</p>
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
            <RefreshCw size={16} aria-hidden="true" /> Show more resources
          </button>
        </div>
      )}
      <PdfModal r={preview} onClose={() => setPreview(null)} />
    </div>
  );
}

export function ResourceSkeletons({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card grid grid-cols-[46%_1fr] gap-3 p-2.5">
          <div className="skeleton h-44" />
          <div className="space-y-3 py-1">
            <div className="skeleton h-5 w-16" />
            <div className="skeleton h-5 w-4/5" />
            <div className="skeleton h-3 w-3/5" />
            <div className="skeleton h-9 w-full" />
            <div className="skeleton h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
