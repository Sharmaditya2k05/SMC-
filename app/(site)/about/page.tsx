import type { Metadata } from "next";
import Link from "next/link";
import { Portrait } from "@/components/blocks";
import { Reveal, Rise } from "@/components/motion";
import { NavyCTA, Placeholder } from "@/components/ui";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About the Teacher",
  description: "Meet the educator behind Siddhu Mathematics Classes and the teaching philosophy that puts understanding before formulas.",
  alternates: { canonical: "/about" },
};

const PHILOSOPHY = [
  { title: "Understand the Why", text: "Focus on understanding the logic behind concepts.", mark: "∵" },
  { title: "Practice with Purpose", text: "Build confidence through meaningful practice.", mark: "∑" },
  { title: "Learn with Confidence", text: "Encourage students to approach difficult questions without fear.", mark: "∴" },
];

export default async function About() {
  const s = await getSettings();
  const profile = [
    { label: "Teacher", value: s.teacherName },
    { label: "Educational qualifications", value: s.qualifications },
    { label: "Teaching experience", value: s.experience },
    { label: "Areas of expertise", value: s.expertise },
    { label: "Approach towards students", value: s.approach },
  ];
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-paper absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" aria-hidden="true" />
        <div className="wrap relative grid items-center gap-12 pb-16 pt-32 md:grid-cols-[1.2fr_.8fr] md:gap-20 md:pb-24 md:pt-44">
          <Rise>
            <h1 className="h1">Beyond Formulas. Towards Understanding.</h1>
            <p className="lede mt-6">Meet the educator behind Siddhu Mathematics Classes.</p>
            {s.teacherName && <p className="note mt-6 text-3xl">{s.teacherName}</p>}
          </Rise>
          <Rise delay={0.15}>
            <Portrait settings={s} priority className="mx-auto w-full max-w-[22rem] md:max-w-none" />
          </Rise>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-[1.2fr_.8fr] lg:gap-20">
          <div>
            <h2 className="h2">About</h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed">
              {s.bio.split(/\n\s*\n/).map((p, i) => (
                <p key={i} className={i === 0 ? "font-serif text-2xl leading-snug md:text-[1.75rem]" : "text-muted"}>{p}</p>
              ))}
              {s.philosophy && <p className="text-muted">{s.philosophy}</p>}
            </div>
          </div>
          <aside className="card h-fit p-6 md:p-8" aria-label="Teacher profile">
            <h2 className="font-display text-lg font-bold">Profile</h2>
            <dl className="mt-4 divide-y divide-line">
              {profile.map((p) => (
                <div key={p.label} className="py-3.5">
                  <dt className="text-sm text-muted">{p.label}</dt>
                  <dd className="mt-0.5 whitespace-pre-line font-medium">{p.value || <Placeholder />}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="section border-y border-line bg-surface">
        <div className="wrap">
          <h2 className="h2">Teaching philosophy</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {PHILOSOPHY.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="border-t-2 border-[var(--gold)] pt-6">
                  <span className="font-serif text-5xl text-blue" aria-hidden="true">{p.mark}</span>
                  <h3 className="mt-4 font-display text-2xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-lg text-muted">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap max-w-3xl">
          <h2 className="h2">A Message for My Students</h2>
          <blockquote className="mt-8 border-l-2 border-[var(--gold)] pl-6 md:pl-8">
            {s.studentMessage ? (
              s.studentMessage.split(/\n\s*\n/).map((p, i) => <p key={i} className="mb-4 font-serif text-2xl leading-snug">{p}</p>)
            ) : (
              <p className="text-lg"><Placeholder>A personal message from the teacher will be shared here.</Placeholder></p>
            )}
            {s.teacherName && <footer className="mt-4 text-muted">— {s.teacherName}</footer>}
          </blockquote>
        </div>
      </section>

      <NavyCTA title="Let's Make Mathematics Easier Together.">
        <Link href="/courses" className="btn btn-gold">Explore My Classes</Link>
        <Link href="/contact#enquiry" className="btn btn-onnavy">Send an Enquiry</Link>
      </NavyCTA>
    </>
  );
}
