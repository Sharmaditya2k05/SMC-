import type { Metadata } from "next";
import { CalendarDays, Target, User, Users } from "lucide-react";
import { NamePlate, Portrait } from "@/components/blocks";
import { Reveal } from "@/components/motion";
import { Placeholder } from "@/components/ui";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Siddhu Sir",
  description: "Meet Siddhu Sir, the Mathematics teacher behind Siddhu Mathematics Classes, and a teaching philosophy that puts understanding before formulas.",
  alternates: { canonical: "/about" },
};

const PHILOSOPHY = [
  { title: "Understand the Why", text: "Focus on the reasoning and intuition behind every concept.", mark: "∵" },
  { title: "Practice with Purpose", text: "Solve a variety of problems to build depth, accuracy and speed.", mark: "∑" },
  { title: "Learn with Confidence", text: "Develop a strong foundation and the confidence to tackle new problems independently.", mark: "∴" },
];

export default async function About() {
  const s = await getSettings();
  const fullName = [s.teacherShortName, s.teacherName && (s.teacherShortName ? `(${s.teacherName})` : s.teacherName)].filter(Boolean).join(" ");
  const profile = [
    { icon: User, label: "Teacher", value: fullName },
    { icon: CalendarDays, label: "Teaching Experience", value: s.experience },
    { icon: Target, label: "Areas of Expertise", value: s.expertise },
    { icon: Users, label: "Approach Towards Students", value: s.approach },
  ];
  const paragraphs = s.bio.split(/\n\s*\n/);

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap grid gap-8 py-8 md:gap-12 md:py-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:py-16">
          {/* portrait stays pinned while the story scrolls */}
          <div className="relative lg:sticky lg:top-28 lg:h-fit">
            <Portrait settings={s} priority className="mx-auto w-full max-w-[19rem] sm:max-w-[26rem]" />
            <NamePlate settings={s} className="-mt-9" />
          </div>

          <div className="space-y-9 md:space-y-12">
            <div>
              <p className="eyebrow">About the teacher</p>
              <h1 className="h1 mt-4 text-[clamp(2.1rem,4vw,3.3rem)]">
                Beyond Formulas. <span className="text-accent">Towards Understanding.</span>
              </h1>
              <p className="lede mt-4">
                Meet {fullName || "the educator"}, the educator behind Siddhu Mathematics Classes.
              </p>
              <blockquote className="mt-8 border-l-4 border-accent pl-6">
                <p className="math text-[clamp(1.35rem,2.4vw,1.85rem)] leading-snug">{paragraphs[0]}</p>
              </blockquote>
              {paragraphs.slice(1).map((p, i) => (
                <p key={i} className="mt-5 pl-7 text-lg text-muted">{p}</p>
              ))}
              {s.philosophy && <p className="mt-5 pl-7 text-lg text-muted">{s.philosophy}</p>}
            </div>

            <dl className="card divide-y divide-line px-5 py-1 md:px-7">
              {profile.map((p) => (
                <div key={p.label} className="grid gap-1 py-3 sm:grid-cols-[1fr_1.2fr] sm:items-center sm:gap-6">
                  <dt className="flex items-center gap-4 font-display font-bold">
                    <p.icon size={19} className="shrink-0 text-accent" aria-hidden="true" /> {p.label}
                  </dt>
                  <dd className="whitespace-pre-line pl-9 sm:pl-0">{p.value || <Placeholder />}</dd>
                </div>
              ))}
            </dl>

            <div>
              <h2 className="eyebrow text-[1.6rem] normal-case tracking-[-0.03em]">Teaching Philosophy</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {PHILOSOPHY.map((p, i) => (
                  <Reveal key={p.title} delay={i * 0.07}>
                    <div className="card flex h-full gap-4 p-5">
                      <span className="font-display text-4xl font-bold leading-none text-accent" aria-hidden="true">{p.mark}</span>
                      <div>
                        <h3 className="font-display text-lg font-bold leading-tight">{p.title}</h3>
                        <p className="mt-1.5 text-sm text-muted">{p.text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <h2 className="eyebrow text-[1.6rem] normal-case tracking-[-0.03em]">A Message for My Students</h2>
              <blockquote className="card mt-6 border-l-4 border-l-[var(--accent)] p-6 md:p-7">
                {s.studentMessage ? (
                  s.studentMessage.split(/\n\s*\n/).map((p, i) => <p key={i} className="math mb-3 text-xl leading-snug last:mb-0 md:text-[1.4rem]">“{p}”</p>)
                ) : (
                  <p><Placeholder>A personal message from {s.teacherShortName || "the teacher"} will be shared here.</Placeholder></p>
                )}
                {(s.teacherShortName || s.teacherName) && <footer className="mt-4 font-display text-sm font-bold">— {s.teacherShortName || s.teacherName}</footer>}
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
