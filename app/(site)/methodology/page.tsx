import type { Metadata } from "next";
import Link from "next/link";
import { SquareIdentity } from "@/components/blocks";
import { ProgressionCurve } from "@/components/math-art";
import { Reveal } from "@/components/motion";
import { NavyCTA, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Learning Methodology",
  description: "How Mathematics is taught at Siddhu Mathematics Classes: understand, explore, practice and master – a four-step approach built on conceptual learning.",
  alternates: { canonical: "/methodology" },
};

const STEPS = [
  { n: "01", title: "Understand", text: "Introduce the concept and explain the fundamentals.", note: "Where does this come from?" },
  { n: "02", title: "Explore", text: "Work through examples and understand different approaches.", note: "Is there another way?" },
  { n: "03", title: "Practice", text: "Solve questions with increasing difficulty.", note: "Can I do it unaided?" },
  { n: "04", title: "Master", text: "Revise, analyse mistakes and strengthen understanding.", note: "Why did I go wrong?" },
];

const WHY = [
  { title: "Reduces dependence on memorisation", text: "A result you can derive is one you do not have to remember under pressure." },
  { title: "Develops analytical thinking", text: "Asking why a method works trains you to break an unfamiliar problem into familiar parts." },
  { title: "Improves confidence", text: "When each step has a reason, a difficult question becomes something to work through, not something to fear." },
  { title: "Builds a stronger mathematical foundation", text: "Class XII rests on Class XI, and both rest on ideas. Concepts learnt properly carry forward." },
];

export default function Methodology() {
  return (
    <>
      <PageHero title="Not Just Learning Mathematics. Understanding It." subtitle="Every chapter follows the same four stages, so students always know where they are and what comes next." />

      <section className="section">
        <div className="wrap">
          <h2 className="h2">The four-step method</h2>
          <div className="card mt-10 hidden overflow-hidden p-4 md:block md:p-6">
            <ProgressionCurve />
          </div>
          <ol className="mt-8 grid gap-5 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.07}>
                <li className="card h-full p-6">
                  <span className="font-serif text-5xl text-blue">{s.n}</span>
                  <h3 className="mt-3 font-display text-2xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-muted">{s.text}</p>
                  <p className="note mt-5 border-t border-line pt-4">{s.note}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-y border-line bg-surface">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 className="h2">Why Conceptual Learning Matters</h2>
            <dl className="mt-8">
              {WHY.map((w) => (
                <div key={w.title} className="border-t border-line py-5">
                  <dt className="font-display text-lg font-bold">{w.title}</dt>
                  <dd className="mt-1.5 text-muted">{w.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:pt-20">
            <SquareIdentity />
            <p className="mt-5 text-sm text-muted">
              One example of the approach: an identity from earlier classes, shown as an area instead of stated as a rule.
            </p>
          </div>
        </div>
      </section>

      <NavyCTA title="See the method in a real chapter." text="Browse the notes, or come and ask about the batch for your class.">
        <Link href="/study-material" className="btn btn-gold">Get Study Material</Link>
        <Link href="/courses" className="btn btn-onnavy">Explore Classes</Link>
      </NavyCTA>
    </>
  );
}
