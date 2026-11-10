import type { Metadata } from "next";
import { ArrowRight, BookOpen, Check, Info, Target } from "lucide-react";
import { MiniGraph } from "@/components/math-art";
import { PageHero } from "@/components/ui";
import { getSettings } from "@/lib/content";
import { lines } from "@/lib/format";

export const metadata: Metadata = {
  title: "Courses & Classes – Class XI and XII Mathematics",
  description: "Mathematics for Class XI and Class XII with Siddhu Sir at Siddhu Mathematics Classes: what each course covers and how it is taught.",
  alternates: { canonical: "/courses" },
};

const COURSES = {
  XI: {
    n: "01",
    heading: <>Build Your Mathematical Foundation.</>,
    text: "Develop conceptual clarity and a strong foundation for higher-level mathematics.",
  },
  XII: {
    n: "02",
    heading: <>Master Concepts. Strengthen Your <em className="hi">Problem-Solving.</em></>,
    text: "A comprehensive and in-depth learning of key concepts with a strong focus on problem-solving.",
  },
} as const;

const APPROACH = [
  "Concept-based and application-oriented teaching.",
  "Step-by-step explanation with illustrative examples.",
  "Regular practice through curated question sets.",
  "Doubt resolution and concept reinforcement.",
];

/** What each course covers. Batch timings live on the Timetable page, notes on Study Material. */
export default async function Courses() {
  const settings = await getSettings();
  return (
    <>
      <PageHero
        title={<>Mathematics for <span className="text-accent">Class XI</span> and <span className="text-accent">Class XII.</span></>}
        subtitle="Structured courses, focused teaching and a clear path through the syllabus for Classes XI and XII."
      >
        <a href="#class-xi" className="btn btn-primary min-w-44"><BookOpen size={18} aria-hidden="true" /> Class XI <ArrowRight size={17} aria-hidden="true" /></a>
        <a href="#class-xii" className="btn btn-outline min-w-44"><BookOpen size={18} aria-hidden="true" /> Class XII <ArrowRight size={17} aria-hidden="true" /></a>
      </PageHero>

      {(["XI", "XII"] as const).map((cls) => {
        const c = COURSES[cls];
        const dark = cls === "XII";
        const modules = lines(cls === "XI" ? settings.syllabusXI : settings.syllabusXII);
        const sub = dark ? "text-white/75" : "text-muted";
        return (
          <section key={cls} id={`class-${cls.toLowerCase()}`} className={`scroll-mt-20 ${dark ? "bg-deep text-white" : ""}`}>
            <div className="wrap grid gap-5 py-10 md:gap-8 md:py-16 lg:grid-cols-[10.5rem_1fr] lg:gap-10">
              <aside className={`hidden lg:block lg:border-r lg:pr-6 ${dark ? "lg:border-white/15" : "lg:border-line"}`}>
                <div className="lg:sticky lg:top-28">
                  <p className="font-display text-xl font-bold text-accent">{c.n}</p>
                  <p className="font-display text-2xl font-bold leading-tight tracking-[-0.03em]">Class {cls}</p>
                  <p className={`text-lg ${sub}`}>Mathematics</p>
                  <MiniGraph kind={dark ? "sine" : "parabola"} tone={dark ? "dark" : "light"} className="mt-10 h-28 w-full" />
                </div>
              </aside>

              <div>
                <p className="eyebrow">Class {cls} Mathematics</p>
                <h2 className="h2 mt-3">{c.heading}</h2>
                <p className={`mt-3 text-lg ${sub}`}>{c.text}</p>

                <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_.8fr] xl:items-start">
                  <div>
                    <ol className="relative grid gap-1.5 sm:grid-cols-2 sm:gap-x-4">
                      {modules.map((m, i) => (
                        <li key={m} className={`flex min-h-10 items-center gap-3 rounded-md px-3 font-display text-[0.93rem] font-semibold ${dark ? "bg-white/[0.07]" : "bg-surface shadow-[0_1px_2px_rgba(22,23,27,.06)]"}`}>
                          <span className="w-6 shrink-0 tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                          {m}
                        </li>
                      ))}
                    </ol>
                    <p className={`math mt-4 flex items-center gap-2 text-sm ${sub}`}>
                      <Info size={15} className="shrink-0 not-italic" aria-hidden="true" /> An outline of curriculum areas. Ask for the chapter being taught now.
                    </p>
                  </div>

                  <div className={`rounded-xl border p-5 md:p-6 ${dark ? "border-white/15 bg-white/[0.04]" : "card"}`}>
                    <h3 className="flex items-center gap-3 font-display text-lg font-bold">
                      <Target size={21} className="text-accent" aria-hidden="true" /> Learning Approach
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {APPROACH.map((a) => (
                        <li key={a} className="flex gap-3 text-[0.95rem]">
                          <Check size={18} strokeWidth={3} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" /> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
