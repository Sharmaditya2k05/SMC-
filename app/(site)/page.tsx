import Link from "next/link";
import { Check } from "lucide-react";
import { CourseCard, LocationCard, MapEmbed, Portrait, SquareIdentity } from "@/components/blocks";
import { Glyph, HeroPlot } from "@/components/math-art";
import { Reveal, Rise } from "@/components/motion";
import { ResourceRow } from "@/components/resources";
import { WeekPlot } from "@/components/timetable";
import { NavyCTA, SectionHead, WaButton, WhatsAppIcon } from "@/components/ui";
import { getAnnouncements, getResources, getSettings, getTimetable } from "@/lib/content";
import { waLink, WA_MESSAGES } from "@/lib/format";

const FEATURES = [
  { kind: "clarity", title: "Conceptual Clarity", text: "Understand the logic behind every formula and mathematical concept." },
  { kind: "structure", title: "Structured Learning", text: "Follow an organised learning approach designed around academic requirements." },
  { kind: "practice", title: "Consistent Practice", text: "Develop confidence through regular problem-solving and practice." },
  { kind: "attention", title: "Personal Attention", text: "Focus on understanding, improvement and individual learning progress." },
] as const;

export default async function Home() {
  const [settings, timetable, resources, announcements] = await Promise.all([getSettings(), getTimetable(), getResources(), getAnnouncements()]);
  const wa = waLink(settings.whatsapp, WA_MESSAGES.home);
  const pick = (cls: string) => resources.filter((r) => r.cls === cls).sort((a, b) => a.chapter.localeCompare(b.chapter, "en", { numeric: true })).slice(0, 2);
  const samples = [...pick("XI"), ...pick("XII")];
  const preview = samples.length ? samples : resources.slice(0, 4);

  return (
    <>
      {/* B. Hero */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-12 pb-16 pt-28 md:pt-36 lg:grid-cols-[1.08fr_.92fr] lg:gap-10 lg:pb-24 lg:pt-40">
          <div>
            <Rise>
              <p className="font-display text-[0.78rem] font-bold tracking-[0.16em] text-goldink">S.M.C | SIDDHU MATHEMATICS CLASSES</p>
            </Rise>
            <Rise delay={0.08}>
              <h1 className="h1 mt-5">Making Mathematics Understandable, One Concept at a Time.</h1>
            </Rise>
            <Rise delay={0.16}>
              <p className="lede mt-6">
                Strong mathematical foundations begin with clear concepts, structured learning and consistent practice. Discover a better approach to learning Mathematics for Classes XI and XII.
              </p>
            </Rise>
            <Rise delay={0.24} className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/courses" className="btn btn-primary">Explore Classes</Link>
              <Link href="/study-material" className="btn btn-outline">Get Study Material</Link>
              <a href={wa} {...(wa.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex min-h-12 items-center gap-2 px-2 font-display text-[0.95rem] font-semibold text-[#17694a] underline-offset-4 hover:underline dark:text-[#6fd0a6]">
                <WhatsAppIcon /> Chat on WhatsApp
              </a>
            </Rise>
            <Rise delay={0.34}>
              <ul className="mt-10 grid gap-3 border-t border-line pt-6 text-[0.95rem] sm:grid-cols-3">
                {["Concept-Focused Learning", "Structured Classroom Teaching", "Dedicated XI & XII Batches"].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 font-medium">
                    <Check size={17} className="mt-1 shrink-0 text-goldink" aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>

          <Rise delay={0.2} className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
            <div className="relative aspect-[560/620]">
              <HeroPlot />
              <Portrait settings={settings} priority className="absolute left-[14%] top-[9%] w-[62%]" />
              <div className="card absolute bottom-[5%] right-0 max-w-[13.5rem] border-l-4 border-l-[var(--gold)] p-4 shadow-[0_20px_40px_-20px_rgba(16,28,53,.4)] md:right-[2%]">
                <p className="font-display font-bold">Classes XI &amp; XII</p>
                <p className="mt-0.5 text-sm text-muted">Focused Mathematics Learning</p>
              </div>
            </div>
          </Rise>
        </div>
      </section>

      {/* C. Brand introduction */}
      <section className="section border-y border-line bg-surface">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-20">
          <div>
            <h2 className="statement">Where Concepts Come Before Calculations.</h2>
            <div className="mt-8 max-w-xl space-y-4 text-lg text-muted">
              <p>
                S.M.C is a place to learn Mathematics by understanding it. Before a formula is used, students see where it comes from and why it works – so it stays with them long after the chapter ends.
              </p>
              <p>
                That is the difference between remembering a method and knowing what to do when a question looks unfamiliar.
              </p>
            </div>
            <Link href="/methodology" className="link mt-7 inline-block font-display font-semibold">See how a concept is taught</Link>
          </div>
          <Reveal><SquareIdentity /></Reveal>
        </div>
      </section>

      {/* D. What makes S.M.C different */}
      <section className="section">
        <div className="wrap">
          <SectionHead title="What makes S.M.C different?" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <article key={f.title} className="card card-hover p-6">
                <Glyph kind={f.kind} />
                <h3 className="h3 mt-5">{f.title}</h3>
                <p className="mt-2 text-muted">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* E. Courses */}
      <section className="section pt-0">
        <div className="wrap">
          <SectionHead title="Two classes. One subject, taught properly." lede="Separate, dedicated batches for Class XI and Class XII Mathematics." />
          <div className="grid gap-6 lg:grid-cols-2">
            <CourseCard cls="XI" timetable={timetable} whatsapp={settings.whatsapp} />
            <CourseCard cls="XII" timetable={timetable} whatsapp={settings.whatsapp} />
          </div>
        </div>
      </section>

      {/* F. Weekly schedule */}
      <section className="section border-y border-line bg-surface">
        <div className="wrap">
          <SectionHead title="The week at a glance." lede="Each class meets six days a week. The two batches exchange time slots midweek.">
            <Link href="/timetable" className="btn btn-primary">View Complete Timetable</Link>
          </SectionHead>
          <Reveal><WeekPlot timetable={timetable} /></Reveal>
        </div>
      </section>

      {/* Announcements – only what the teacher has published */}
      {announcements.length > 0 && (
        <section className="section pb-0">
          <div className="wrap">
            <SectionHead title="Notices" />
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {announcements.slice(0, 3).map((a) => (
                <li key={a.id} className="card border-l-4 border-l-[var(--gold)] p-5">
                  <p className="text-sm text-muted">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(a.createdAt))}</p>
                  <h3 className="mt-1 font-display text-lg font-bold">{a.title}</h3>
                  {a.body && <p className="mt-1.5 text-muted">{a.body}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* G. Study material */}
      <section className="section">
        <div className="wrap">
          <SectionHead title="Your Learning Resources, All in One Place." lede="Chapter-wise notes for Class XI and XII, ready to preview or download as PDF.">
            <Link href="/study-material" className="btn btn-outline">Explore All Study Materials</Link>
          </SectionHead>
          {preview.length ? (
            <ResourceRow resources={preview} />
          ) : (
            <p className="card grid-paper p-10 text-center text-muted">Study material will appear here as soon as it is published.</p>
          )}
        </div>
      </section>

      {/* H. Teacher */}
      <section className="section border-y border-line bg-surface">
        <div className="wrap grid items-center gap-12 md:grid-cols-[.7fr_1.3fr] md:gap-20">
          <Portrait settings={settings} className="mx-auto w-full max-w-[18rem] md:max-w-none" />
          <div>
            <h2 className="h2">Meet Your Mathematics Teacher.</h2>
            {settings.teacherName && <p className="note mt-3 text-2xl">{settings.teacherName}</p>}
            <p className="lede mt-5">Teaching Mathematics with an emphasis on clarity, understanding and confidence.</p>
            <Link href="/about" className="btn btn-primary mt-8">Know More About Me</Link>
          </div>
        </div>
      </section>

      {/* I. Location */}
      <section className="section">
        <div className="wrap">
          <SectionHead title="Find Your Classroom." />
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <MapEmbed settings={settings} className="min-h-[340px]" />
            <LocationCard settings={settings} />
          </div>
        </div>
      </section>

      {/* J. Final CTA */}
      <NavyCTA title="Your Journey Towards Mathematical Excellence Starts Here." text="Explore the classes, find your batch and get in touch to begin learning.">
        <WaButton href={wa}>Contact on WhatsApp</WaButton>
        <Link href="/timetable" className="btn btn-onnavy">Explore Timetable</Link>
      </NavyCTA>
    </>
  );
}
