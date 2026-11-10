import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, BookOpen, Brain, FileText, Layers, PlayCircle } from "lucide-react";
import { SquareIdentity } from "@/components/math-art";
import { MethodStory, type Step } from "@/components/story";
import { Arc, LightCTA } from "@/components/ui";

export const metadata: Metadata = {
  title: "Learning Methodology",
  description: "How Mathematics is taught at Siddhu Mathematics Classes: understand, explore, practice and master – a four-step approach built on conceptual learning.",
  alternates: { canonical: "/methodology" },
};

const STEPS: Step[] = [
  { n: "01", title: "Understand", text: "Introduce the concept and explain the fundamentals.", ask: "Where does this come from?" },
  { n: "02", title: "Explore", text: "Work through examples and understand different approaches.", ask: "Is there another way?" },
  { n: "03", title: "Practice", text: "Solve questions with increasing difficulty.", ask: "Can I do it unaided?" },
  { n: "04", title: "Master", text: "Revise, analyse mistakes and strengthen understanding.", ask: "Why did I go wrong?" },
];

const WHY = [
  { icon: BookOpen, title: "Reduces dependence on memorisation.", text: "Focus on understanding ideas, not just remembering formulas." },
  { icon: Brain, title: "Develops analytical thinking.", text: "Builds the ability to reason, analyse and approach new problems effectively." },
  { icon: BarChart3, title: "Improves confidence.", text: "Helps you solve a wide variety of questions with clarity and a structured approach." },
  { icon: Layers, title: "Builds a stronger mathematical foundation.", text: "Creates a solid base for higher classes and further study." },
];

export default function Methodology() {
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap pt-10 text-center md:pt-14">
          <h1 className="h1 mx-auto text-[clamp(2rem,4.2vw,3.4rem)]">
            Not Just Learning Mathematics. <em className="hi">Understanding It.</em>
          </h1>
          <p className="lede mx-auto mt-4">Every chapter follows the same four stages.<span className="hidden lg:inline"> Scroll to move along the curve.</span></p>
        </div>
        <MethodStory steps={STEPS} />
      </section>

      <section className="relative overflow-hidden bg-deep text-white">
        <Arc className="-left-10 -top-6 w-[22rem]" flip />
        <div className="wrap relative grid items-center gap-6 py-10 md:gap-10 md:py-20 lg:grid-cols-[.8fr_1.6fr_1fr] lg:gap-12">
          <h2 className="statement text-[clamp(2.2rem,4vw,3.4rem)]">
            Why Conceptual Learning <em className="hi">Matters.</em>
          </h2>
          <ul className="divide-y divide-white/20 lg:border-x lg:border-white/20 lg:px-10">
            {WHY.map((w) => (
              <li key={w.title} className="flex items-center gap-5 py-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/10 text-[#FFA54A]">
                  <w.icon size={24} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-lg font-bold">{w.title}</span>
                  <span className="block text-[0.95rem] text-white/75">{w.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="hidden md:block [&_figure]:flex-col">
            <SquareIdentity tone="dark" />
          </div>
        </div>
      </section>

      <LightCTA title={<>Take the <em className="hi">Right Approach</em> to Mathematics.</>}>
        <Link href="/study-material" className="btn btn-primary min-w-52"><FileText size={18} aria-hidden="true" /> Get Study Material</Link>
        <Link href="/courses" className="btn btn-outline min-w-52"><PlayCircle size={18} aria-hidden="true" /> Explore Classes</Link>
      </LightCTA>
    </>
  );
}
