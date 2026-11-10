import type { Metadata } from "next";
import Link from "next/link";
import { ResourceRow } from "@/components/resources";
import { TimetableCard } from "@/components/timetable";
import { NavyCTA, PageHero, WaButton } from "@/components/ui";
import { getResources, getSettings, getTimetable } from "@/lib/content";
import { lines, waLink, WA_MESSAGES } from "@/lib/format";

export const metadata: Metadata = {
  title: "Courses & Classes – Class XI and XII Mathematics",
  description: "Mathematics classes for Class XI and Class XII at Siddhu Mathematics Classes: curriculum modules, batch timings and sample study material.",
  alternates: { canonical: "/courses" },
};

const COURSES = {
  XI: {
    heading: "Build Your Mathematical Foundation.",
    text: "Develop conceptual clarity and a strong foundation for higher-level mathematics.",
    approach: [
      "Every new idea starts from what you already know from Class X.",
      "Definitions and results are derived in class before they are applied.",
      "Regular practice moves from direct questions to mixed problems.",
    ],
  },
  XII: {
    heading: "Master Concepts. Strengthen Your Problem-Solving.",
    text: "Work through the Class XII syllabus with attention to method, accuracy and clear written solutions.",
    approach: [
      "Each chapter opens with the concept and the reasoning behind it.",
      "Standard methods are compared so you know when to use which.",
      "Revision focuses on analysing mistakes, not just repeating questions.",
    ],
  },
} as const;

export default async function Courses() {
  const [settings, timetable, resources] = await Promise.all([getSettings(), getTimetable(), getResources()]);
  return (
    <>
      <PageHero title="Mathematics for Class XI and Class XII." subtitle="Two dedicated courses, each with its own batches, curriculum outline and study material.">
        <a href="#class-xi" className="btn btn-primary">Class XI</a>
        <a href="#class-xii" className="btn btn-outline">Class XII</a>
      </PageHero>

      {(["XI", "XII"] as const).map((cls) => {
        const c = COURSES[cls];
        const modules = lines(cls === "XI" ? settings.syllabusXI : settings.syllabusXII);
        const samples = resources.filter((r) => r.cls === cls).sort((a, b) => a.chapter.localeCompare(b.chapter, "en", { numeric: true })).slice(0, 4);
        return (
          <section key={cls} id={`class-${cls.toLowerCase()}`} className={`section scroll-mt-20 ${cls === "XII" ? "border-y border-line bg-surface" : ""}`}>
            <div className="wrap">
              <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
                <div>
                  <p className={`tag tag-${cls} text-sm`}>Class {cls} Mathematics</p>
                  <h2 className="h2 mt-4">{c.heading}</h2>
                  <p className="lede mt-4">{c.text}</p>

                  <h3 className="mt-12 font-display text-lg font-bold">Curriculum modules</h3>
                  <ol className="mt-4 grid gap-x-8 sm:grid-cols-2">
                    {modules.map((m, i) => (
                      <li key={m} className="flex items-baseline gap-3 border-b border-line py-3">
                        <span className="w-6 shrink-0 font-serif text-goldink tabular-nums">{i + 1}</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 text-sm text-muted">
                    This is an outline of the curriculum areas for Class {cls}. The order and current coverage in class may differ – please ask for the chapter being taught now.
                  </p>
                </div>

                <div className="space-y-6">
                  <TimetableCard cls={cls} timetable={timetable} whatsapp={settings.whatsapp} actions={false} />
                  <div className="card p-6 md:p-8">
                    <h3 className="font-display text-lg font-bold">Learning approach</h3>
                    <ul className="mt-4 space-y-3">
                      {c.approach.map((a) => (
                        <li key={a} className="flex gap-3 text-muted">
                          <span className="mt-[0.7rem] h-px w-5 shrink-0 bg-[var(--gold-ink)]" aria-hidden="true" /> {a}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <WaButton href={waLink(settings.whatsapp, WA_MESSAGES[cls])}>Enquire on WhatsApp</WaButton>
                      <Link href="/contact#enquiry" className="btn btn-outline">Send Enquiry</Link>
                    </div>
                  </div>
                </div>
              </div>

              {samples.length > 0 && (
                <div className="mt-16">
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <h3 className="font-display text-2xl font-bold">Class {cls} study material</h3>
                    <Link href={`/study-material?class=${cls}`} className="link font-display font-semibold">All Class {cls} resources</Link>
                  </div>
                  <ResourceRow resources={samples} />
                </div>
              )}
            </div>
          </section>
        );
      })}

      <NavyCTA title="Not sure which batch suits you?" text={`Share the student's class and school timings and ${settings.teacherShortName || "we"} will help you choose.`}>
        <WaButton href={waLink(settings.whatsapp, WA_MESSAGES.home)}>Contact on WhatsApp</WaButton>
        <Link href="/timetable" className="btn btn-onnavy">View Timetable</Link>
      </NavyCTA>
    </>
  );
}
