import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Check, Info, Mail, Target } from "lucide-react";
import { shortTime } from "@/components/blocks";
import { MiniGraph } from "@/components/math-art";
import { ResourceRow } from "@/components/resources";
import { SpyNav } from "@/components/story";
import { LightCTA, PageHero, WaButton } from "@/components/ui";
import { getResources, getSettings, getTimetable } from "@/lib/content";
import { lines, waLink, WA_MESSAGES } from "@/lib/format";

export const metadata: Metadata = {
  title: "Courses & Classes – Class XI and XII Mathematics",
  description: "Mathematics classes for Class XI and Class XII with Siddhu Sir at Siddhu Mathematics Classes: curriculum modules, batch timings and sample study material.",
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

export default async function Courses() {
  const [settings, timetable, resources] = await Promise.all([getSettings(), getTimetable(), getResources()]);
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
        const k = cls.toLowerCase();
        const modules = lines(cls === "XI" ? settings.syllabusXI : settings.syllabusXII);
        const slots = timetable.slots.filter((s) => s.cls === cls);
        const samples = resources.filter((r) => r.cls === cls).sort((a, b) => a.chapter.localeCompare(b.chapter, "en", { numeric: true })).slice(0, 3);
        const sub = dark ? "text-white/75" : "text-muted";
        return (
          <section key={cls} id={`class-${k}`} className={`scroll-mt-20 ${dark ? "bg-deep text-white" : ""}`}>
            <div className="wrap grid gap-5 py-10 md:gap-8 md:py-16 lg:grid-cols-[10.5rem_1fr] lg:gap-10">
              {/* sticky chapter label + in-section navigation */}
              <aside className={`lg:border-r lg:pr-6 ${dark ? "lg:border-white/15" : "lg:border-line"}`}>
                <div className="hidden lg:sticky lg:top-28 lg:block">
                  <p className="font-display text-xl font-bold text-accent">{c.n}</p>
                  <p className="font-display text-2xl font-bold leading-tight tracking-[-0.03em]">Class {cls}</p>
                  <p className={`text-lg ${sub}`}>Mathematics</p>
                  <div className="mt-6 hidden lg:block">
                    <SpyNav tone={dark ? "dark" : "light"} items={[{ id: `${k}-syllabus`, label: "Syllabus" }, { id: `${k}-timetable`, label: "Timetable" }, { id: `${k}-material`, label: "Study Material" }]} />
                  </div>
                  {dark && <MiniGraph kind="sine" tone="dark" className="mt-16 hidden h-28 w-full lg:block" />}
                </div>
              </aside>

              <div>
                <p className="eyebrow">Class {cls} Mathematics</p>
                <h2 className="h2 mt-3">{c.heading}</h2>
                <p className={`mt-3 text-lg ${sub}`}>{c.text}</p>

                <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_.85fr]">
                  <div id={`${k}-syllabus`} className="order-2 scroll-mt-28 xl:order-1">
                    <ol className="relative space-y-1.5">
                      <span className="absolute bottom-4 left-[6px] top-4 w-0.5 bg-accent" aria-hidden="true" />
                      {modules.map((m, i) => (
                        <li key={m} className="relative flex items-center gap-4 pl-8">
                          <span className={`absolute left-0 h-3.5 w-3.5 rounded-full border-[2.5px] border-[#F5861F] ${dark ? "bg-[#16171B]" : "bg-[var(--bg)]"}`} aria-hidden="true" />
                          <span className={`flex min-h-9 flex-1 items-center gap-4 rounded-md px-3 font-display text-[0.95rem] font-semibold ${dark ? "bg-white/[0.07]" : "bg-surface shadow-[0_1px_2px_rgba(22,23,27,.06)]"}`}>
                            <span className="w-6 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                            {m}
                          </span>
                        </li>
                      ))}
                    </ol>
                    <p className={`math mt-4 flex items-center gap-2 text-sm ${sub}`}>
                      <Info size={15} className="shrink-0 not-italic" aria-hidden="true" /> An outline of curriculum areas. Ask for the chapter being taught now.
                    </p>
                  </div>

                  <div id={`${k}-timetable`} className="order-1 scroll-mt-28 space-y-5 xl:order-2">
                    <div className={`rounded-xl border p-5 md:p-6 ${dark ? "border-white/15 bg-white/[0.04]" : "card"}`}>
                      <h3 className="flex items-center gap-3 font-display text-lg font-bold">
                        <CalendarDays size={21} className="text-accent" aria-hidden="true" /> Class {cls} Timetable
                        <span className={`ml-auto text-sm font-normal ${sub}`}>(IST)</span>
                      </h3>
                      <ul className="mt-4 space-y-2.5">
                        {slots.map((s) => (
                          <li key={s.id} className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-3 font-display text-[0.95rem] font-semibold"><CalendarDays size={17} aria-hidden="true" /> {s.days.join(", ")}</span>
                            <span className="rounded-md bg-[#F9E4D2] px-3 py-1.5 font-display text-sm font-bold tabular-nums text-[#16171B]">{shortTime(s)}</span>
                          </li>
                        ))}
                      </ul>
                      <h3 className={`mt-5 flex items-center gap-3 border-t pt-5 font-display text-lg font-bold ${dark ? "border-white/15" : "border-line"}`}>
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
                    <div className="flex flex-wrap gap-3 [&>*]:flex-1 [&>*]:whitespace-nowrap">
                      <WaButton href={waLink(settings.whatsapp, WA_MESSAGES[cls])}>Enquire on WhatsApp</WaButton>
                      <Link href="/contact#enquiry" className={`btn ${dark ? "btn-onnavy" : "btn-outline"}`}><Mail size={17} aria-hidden="true" /> Send Enquiry</Link>
                    </div>
                  </div>
                </div>

                <div id={`${k}-material`} className="mt-10 scroll-mt-28">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="bar-title text-xl">Class {cls} Study Material <span className={`font-sans font-normal tracking-normal ${sub}`}>(PDF Notes)</span></h3>
                    <Link href={`/study-material?class=${cls}`} className={`inline-flex items-center gap-1.5 font-display text-sm font-semibold underline underline-offset-4 ${dark ? "text-[#FFA54A]" : "text-blue"}`}>
                      All Class {cls} resources <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                  {samples.length ? (
                    <ResourceRow resources={samples} tone={dark ? "dark" : "light"} cols={3} />
                  ) : (
                    <p className={sub}>Notes for Class {cls} will be added here.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <LightCTA title={<>Choose Your Class<span className="text-accent">.</span> <em className="hi">Start Your Journey.</em></>}>
        <a href="#class-xi" className="btn btn-primary min-w-40"><BookOpen size={18} aria-hidden="true" /> Class XI <ArrowRight size={17} aria-hidden="true" /></a>
        <a href="#class-xii" className="btn btn-outline min-w-40"><BookOpen size={18} aria-hidden="true" /> Class XII <ArrowRight size={17} aria-hidden="true" /></a>
      </LightCTA>
    </>
  );
}
