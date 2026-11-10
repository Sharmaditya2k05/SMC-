import Link from "next/link";
import { ArrowRight, CalendarDays, Check, FileText } from "lucide-react";
import { CourseCard, Portrait } from "@/components/blocks";
import { MiniGraph, SquareIdentity } from "@/components/math-art";
import { Reveal, Rise } from "@/components/motion";
import { ResourceRow } from "@/components/resources";
import { Chapter } from "@/components/story";
import { WeekPlot } from "@/components/timetable";
import { Arc, ArrowLink, WaButton } from "@/components/ui";
import { getAnnouncements, getResources, getSettings, getTimetable } from "@/lib/content";
import { waLink, WA_MESSAGES } from "@/lib/format";

const FEATURES = [
  { kind: "parabola", label: null, title: "Conceptual Clarity", text: "Build a strong and lasting understanding of every topic from the basics." },
  { kind: "steps", label: null, title: "Structured Learning", text: "Learn in a planned, topic-wise manner with a clear and systematic progression." },
  { kind: "sine", label: <>y = sin x</>, title: "Consistent Practice", text: "Strengthen concepts through regular practice and carefully chosen questions." },
  { kind: "recip", label: <>y = 1/x</>, title: "Personal Attention", text: "Clear your doubts, strengthen weak areas and get the support you need to improve." },
] as const;

export default async function Home() {
  const [settings, timetable, resources, announcements] = await Promise.all([getSettings(), getTimetable(), getResources(), getAnnouncements()]);
  const wa = waLink(settings.whatsapp, WA_MESSAGES.home);
  const pick = (cls: string) => resources.filter((r) => r.cls === cls).sort((a, b) => a.chapter.localeCompare(b.chapter, "en", { numeric: true })).slice(0, 2);
  const samples = [...pick("XI"), ...pick("XII")];
  const preview = samples.length ? samples : resources.slice(0, 4);
  const sir = settings.teacherShortName;

  return (
    <>
      {/* 01 Hero */}
      <Chapter n="01" label="Hero" className="overflow-hidden">
        <div className="grid-paper absolute inset-y-0 right-0 w-1/2 [mask-image:linear-gradient(to_left,black,transparent)]" aria-hidden="true" />
        <div className="wrap relative grid items-center gap-8 py-8 md:gap-12 md:py-16 lg:grid-cols-[1.08fr_.92fr] lg:gap-8">
          <div>
            <Rise>
              <p className="eyebrow">
                <span><span className="text-accent">S.M.C</span> <span className="mx-1 font-normal text-muted">|</span> Siddhu Mathematics Classes</span>
              </p>
            </Rise>
            <Rise delay={0.08}>
              <h1 className="h1 mt-5 text-[clamp(2.2rem,4.3vw,3.6rem)]">
                Making Mathematics Understandable, One <em className="hi">Concept</em> at a Time.
              </h1>
            </Rise>
            <Rise delay={0.16}>
              <p className="lede mt-5">
                Strong mathematical foundations begin with clear concepts, structured learning and consistent practice. Discover a better approach to learning Mathematics for Classes XI and XII{sir ? ` with ${sir}` : ""}.
              </p>
            </Rise>
            <Rise delay={0.24} className="mt-8 flex flex-wrap items-center gap-3">
              <ArrowLink href="/courses">Explore Classes</ArrowLink>
              <Link href="/study-material" className="btn btn-outline"><FileText size={17} aria-hidden="true" /> Get Study Material</Link>
              <WaButton href={wa} className="sm:hidden">Chat on WhatsApp</WaButton>
            </Rise>
            <Rise delay={0.32}>
              <ul className="mt-7 hidden flex-wrap gap-y-3 text-sm font-medium sm:flex sm:divide-x sm:divide-line">
                {["Concept-Focused Learning", "Structured Classroom Teaching", "Dedicated XI & XII Batches"].map((t, i) => (
                  <li key={t} className={`flex w-1/2 items-center gap-2.5 sm:w-auto ${i ? "sm:pl-5" : ""} sm:pr-5`}>
                    <Check size={20} strokeWidth={3} className="shrink-0 text-accent" aria-hidden="true" />
                    <span className="max-w-32 leading-tight">{t}</span>
                  </li>
                ))}
              </ul>
            </Rise>
          </div>

          <Rise delay={0.2} className="relative mx-auto w-full max-w-[19rem] sm:max-w-[27rem] lg:max-w-[30rem]">
            <Portrait settings={settings} priority />
            {(sir || settings.teacherName) && (
              <div className="card relative z-10 mx-auto -mt-7 w-fit px-6 py-2.5 text-center">
                <p className="font-display text-lg font-bold leading-tight">{sir || settings.teacherName}</p>
                {sir && settings.teacherName && <p className="text-sm text-muted">({settings.teacherName})</p>}
              </div>
            )}
          </Rise>
        </div>
      </Chapter>

      {/* 02 Concept */}
      <Chapter n="02" label="Concept" tone="dark" className="overflow-hidden">
        <Arc className="-left-10 -top-4 w-[24rem]" flip />
        <div className="wrap relative grid items-center gap-10 py-10 md:py-20 lg:grid-cols-[1fr_auto_1.15fr] lg:gap-14">
          <h2 className="statement">
            Where Concepts Come Before Calculations<span className="text-accent">.</span>
          </h2>
          <span className="hidden h-28 w-px bg-white/25 lg:block" aria-hidden="true" />
          <Reveal className="hidden md:block"><SquareIdentity tone="dark" /></Reveal>
        </div>
      </Chapter>

      {/* 03 Why SMC */}
      <Chapter n="03" label="Why SMC?">
        <div className="wrap py-10 md:py-20">
          <h2 className="h2 mb-5 md:mb-8">What makes <span className="text-accent">S.M.C</span> different?</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <article className="card card-hover h-full p-4 md:p-5">
                  <MiniGraph kind={f.kind} label={f.label} className="hidden h-24 w-full md:block" />
                  <h3 className="inline-block border-b-2 border-accent pb-1 font-display text-lg font-bold md:mt-4 md:text-xl">{f.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-muted md:mt-3">{f.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Chapter>

      {/* 04 Courses */}
      <Chapter n="04" label="Courses">
        <div className="wrap pb-10 md:pb-20">
          <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
            <CourseCard cls="XI" timetable={timetable} whatsapp={settings.whatsapp} />
            <CourseCard cls="XII" timetable={timetable} whatsapp={settings.whatsapp} />
          </div>
        </div>
      </Chapter>

      {/* 05 Timetable */}
      <Chapter n="05" label="Timetable" className="overflow-hidden">
        <Arc className="-right-10 top-0 hidden w-[22rem] md:block" />
        <div className="wrap relative pb-10 md:pb-20">
          <h2 className="h2 mb-5 md:mb-6">Weekly <span className="text-accent">Class Schedule</span></h2>
          <Reveal><WeekPlot timetable={timetable} /></Reveal>
          <p className="mt-6 text-center">
            <Link href="/timetable" className="btn btn-outline btn-sm px-5">
              <CalendarDays size={16} aria-hidden="true" /> View Complete Timetable <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </Chapter>

      {/* Notices – only what the teacher has published */}
      {announcements.length > 0 && (
        <section className="wrap pb-14 md:pb-20">
          <h2 className="bar-title mb-5 text-2xl">Notices</h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {announcements.slice(0, 3).map((a) => (
              <li key={a.id} className="card border-l-4 border-l-[var(--accent)] p-5">
                <p className="text-sm text-muted">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(a.createdAt))}</p>
                <h3 className="mt-1 font-display text-lg font-bold">{a.title}</h3>
                {a.body && <p className="mt-1.5 text-muted">{a.body}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 06 Resources */}
      <Chapter n="06" label="Resources" className="overflow-hidden">
        <Arc className="-bottom-8 -right-10 hidden w-[20rem] md:block" />
        <div className="wrap relative pb-10 md:pb-20">
          <h2 className="h2 mb-5 md:mb-6">Your <span className="text-accent">Learning Resources,</span> All in One Place.</h2>
          {preview.length ? (
            <ResourceRow resources={preview} />
          ) : (
            <p className="card grid-paper p-10 text-center text-muted">Study material will appear here as soon as it is published.</p>
          )}
          <p className="mt-6 text-center">
            <Link href="/study-material" className="link inline-flex items-center gap-2 font-display font-semibold">
              Explore All Study Materials <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </Chapter>

      {/* 07 Get started */}
      <Chapter n="07" label="Get Started" tone="dark" className="overflow-hidden no-print">
        <Arc className="-bottom-14 right-0 w-[28rem]" />
        <div className="wrap relative flex flex-col gap-6 py-10 md:gap-8 md:py-16 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.035em] lg:max-w-[34rem]">
            Your Journey Towards Mathematical Excellence <em className="hi">Starts Here.</em>
          </h2>
          <span className="hidden h-16 w-px bg-white/25 lg:block" aria-hidden="true" />
          <div className="flex flex-wrap gap-3">
            <WaButton href={wa}>Contact on WhatsApp</WaButton>
            <Link href="/timetable" className="btn btn-onnavy"><CalendarDays size={17} aria-hidden="true" /> Explore Timetable <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </Chapter>
    </>
  );
}
