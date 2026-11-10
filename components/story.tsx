"use client";

/** Scroll-storytelling pieces: chapter markers, section spy navigation and the pinned methodology graph. */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** True while the element crosses the middle band of the viewport. */
function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "-45% 0px -45% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/**
 * A numbered chapter of the home page. Draws the left rail segment and a dot
 * that glows orange while the chapter is the one being read.
 */
export function Chapter({ n, label, tone = "light", className = "", children, id }: { n: string; label: string; tone?: "light" | "dark"; className?: string; children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const active = useInView(ref);
  const dark = tone === "dark";
  return (
    <section ref={ref} id={id} className={`relative ${dark ? "bg-deep text-white" : ""} ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-4 hidden w-24 min-[1400px]:block" aria-hidden="true">
        <span className={`absolute inset-y-0 left-[5px] w-px ${dark ? "bg-white/25" : "bg-[var(--ink)] opacity-25"}`} />
        <span className="absolute left-0 top-14 flex items-start gap-4">
          <span className={`mt-1 h-[11px] w-[11px] rounded-full border-2 transition-all duration-500 ${active ? "scale-125 border-[#F5861F] bg-[#F5861F] shadow-[0_0_0_6px_rgba(245,134,31,.22)]" : dark ? "border-white bg-[#16171B]" : "border-[var(--ink)] bg-[var(--bg)]"}`} />
          <span>
            <span className={`block font-display text-sm font-bold transition-colors ${active ? "text-[#F5861F]" : ""}`}>{n}</span>
            <span className={`block max-w-14 text-xs leading-tight ${dark ? "text-white/70" : "text-muted"}`}>{label}</span>
          </span>
        </span>
      </div>
      {children}
    </section>
  );
}

/** In-page navigation that highlights the section currently in view. */
export function SpyNav({ items, tone = "light" }: { items: { id: string; label: string }[]; tone?: "light" | "dark" }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);
  return (
    <ul className={`relative space-y-3 border-l pl-0 ${tone === "dark" ? "border-white/25" : "border-line"}`}>
      {items.map((i) => {
        const on = active === i.id;
        return (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={on ? "true" : undefined} className={`-ml-[6px] flex items-center gap-3 text-sm ${on ? "font-display font-bold" : tone === "dark" ? "text-white/75 hover:text-white" : "text-muted hover:text-ink"}`}>
              <span className={`h-[11px] w-[11px] rounded-full border-2 transition-all ${on ? "border-[#F5861F] bg-[#F5861F] shadow-[0_0_0_4px_rgba(245,134,31,.22)]" : tone === "dark" ? "border-white/70 bg-[#16171B]" : "border-[var(--muted)] bg-[var(--bg)]"}`} />
              {i.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- methodology: steps on the left, a pinned graph whose points light up as you scroll ---------- */
export type Step = { n: string; title: string; text: string; ask: string };
const PTS = [
  { x: 150, y: 318 },
  { x: 372, y: 256 },
  { x: 596, y: 170 },
  { x: 820, y: 78 },
];

function MethodGraph({ steps, active }: { steps: Step[]; active: number }) {
  return (
    <svg viewBox="0 0 960 430" className="w-full" role="img" aria-label="A rising curve with four points: Understand, Explore, Practice and Master">
      <defs>
        <pattern id="mg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="var(--grid)" />
        </pattern>
        <linearGradient id="mg-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5861F" stopOpacity=".3" />
          <stop offset="1" stopColor="#F5861F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="960" height="430" fill="url(#mg-grid)" />
      <path d="M50 376C96 350 110 326 150 318S300 290 372 256S520 208 596 170S760 100 820 78L940 30V376Z" fill="url(#mg-fill)" />
      <path d="M50 376C96 350 110 326 150 318S300 290 372 256S520 208 596 170S760 100 820 78L940 30" fill="none" stroke="#F5861F" strokeWidth="3.5" strokeLinecap="round" />
      <g stroke="var(--ink)" strokeWidth="2" fill="var(--ink)">
        <path d="M50 400V28M20 376H935" fill="none" />
        <path d="M50 20l-6 12h12zM946 376l-12-6v12z" stroke="none" />
      </g>
      <g fontFamily="var(--font-serif)" fontStyle="italic" fontSize="22" fill="var(--ink)">
        <text x="62" y="30">y</text><text x="934" y="362">x</text><text x="26" y="398">0</text>
      </g>
      {PTS.map((p, i) => {
        const on = i === active;
        const w = 62 + steps[i].title.length * 11;
        return (
          <g key={i}>
            <path d={`M${p.x} ${p.y}V376`} stroke={on ? "#F5861F" : "var(--muted)"} strokeWidth={on ? 2 : 1} strokeDasharray="6 6" />
            <text x={p.x} y="404" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="19" fill="var(--ink)">
              x<tspan fontSize="13" dy="5">{i + 1}</tspan>
            </text>
            <path d={`M${p.x} ${p.y - 12}V${p.y - 38}`} stroke={on ? "#F5861F" : "var(--muted)"} strokeWidth="1.5" />
            <motion.g animate={{ scale: on ? 1.08 : 1 }} style={{ transformBox: "fill-box", transformOrigin: "bottom center" }} transition={{ duration: 0.3 }}>
              <rect x={p.x - w / 2} y={p.y - 76} width={w} height="38" rx="8" fill={on ? "#F5861F" : "var(--surface)"} stroke={on ? "#F5861F" : "var(--line)"} strokeWidth="1.5" />
              <text x={p.x} y={p.y - 51} textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700" fontSize="16" fill={on ? "#fff" : "var(--ink)"}>
                {steps[i].n}&#160;&#160;{steps[i].title}
              </text>
            </motion.g>
            {on && <circle cx={p.x} cy={p.y} r="20" fill="#F5861F" opacity=".25" />}
            <circle cx={p.x} cy={p.y} r={on ? 9 : 7} fill={on ? "#F5861F" : "var(--surface)"} stroke="#F5861F" strokeWidth="3" />
          </g>
        );
      })}
    </svg>
  );
}

/** The four steps play through on their own, in a loop. Clicking a step jumps to it. */
export function MethodStory({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  // run only while the section is on screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // restarts its timer whenever the step changes, so a click gets a full beat before moving on
  useEffect(() => {
    if (reduce || !visible) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % steps.length), 1700);
    return () => clearTimeout(t);
  }, [reduce, visible, steps.length, active]);

  return (
    <div ref={ref} className="wrap grid gap-8 py-8 md:py-14 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-12">
      <ol className="relative space-y-2">
        {/* rail */}
        <span className="absolute bottom-10 left-[5px] top-10 w-px bg-[var(--muted)] opacity-40" aria-hidden="true" />
        {steps.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.n} className="relative pl-8">
              <span
                className={`absolute left-0 top-1/2 h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 transition-all duration-300 ${on ? "border-[#F5861F] bg-[#F5861F] shadow-[0_0_0_5px_rgba(245,134,31,.25)]" : "border-[var(--muted)] bg-[var(--bg)]"}`}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={on ? "step" : undefined}
                className={`grid w-full grid-cols-[2.75rem_1fr] items-center gap-x-4 rounded-xl border px-4 py-3.5 text-left transition-[background-color,border-color,opacity] duration-300 sm:grid-cols-[2.75rem_1fr_10.5rem] ${on ? "border-[#F5861F]/50 bg-[var(--xii-soft)]" : "border-transparent opacity-55 hover:opacity-90"}`}
              >
                <span className={`rounded-md py-1 text-center font-display text-sm font-bold ${on ? "bg-[#F5861F]/20 text-[var(--blue)]" : "bg-raise"}`}>{s.n}</span>
                <span>
                  <span className="block font-display text-2xl font-bold tracking-[-0.03em]">{s.title}</span>
                  <span className="mt-0.5 block text-[0.95rem] leading-snug">{s.text}</span>
                </span>
                <span className={`math col-span-2 mt-2 border-line text-[0.95rem] sm:col-span-1 sm:mt-0 sm:border-l sm:pl-5 ${on ? "" : "text-muted"}`}>“{s.ask}”</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="hidden md:block">
        <MethodGraph steps={steps} active={active} />
      </div>
    </div>
  );
}
