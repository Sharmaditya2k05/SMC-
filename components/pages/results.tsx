import type { Metadata } from "next";
import Link from "next/link";
import { Award, MessageCircle, PlayCircle, Trophy as TrophyIcon, UserRound } from "lucide-react";
import { Trophy } from "@/components/math-art";
import { Arc, ArrowLink, NavyCTA, PageHero } from "@/components/ui";
import { getAchievements, getTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Results & Achievements",
  description: "Student achievements and success stories from Siddhu Mathematics Classes.",
  alternates: { canonical: "/results" },
};

export default async function Results() {
  const [achievements, testimonials] = await Promise.all([getAchievements(), getTestimonials()]);
  const empty = !achievements.length && !testimonials.length;
  return (
    <>
      <PageHero
        title={<>Every Improvement Deserves <em className="hi">Recognition.</em></>}
        subtitle="Verified student achievements and words from students and parents, shared with their permission."
      />

      {empty && (
        <section className="section">
          <div className="wrap">
            <div className="card grid-paper relative overflow-hidden px-6 py-16 text-center md:py-20">
              <Arc className="-left-6 -top-4 w-80" flip />
              <Arc className="-bottom-12 right-0 w-80" />
              <Trophy className="mx-auto w-56 md:w-64" />
              <p className="mx-auto mt-6 max-w-xl font-display text-[clamp(1.6rem,3.2vw,2.3rem)] font-bold leading-tight tracking-[-0.035em]">
                Student achievements and success stories will be featured here.
              </p>
              <span className="mx-auto mt-5 block h-0.5 w-10 rounded bg-accent" aria-hidden="true" />
              <p className="mx-auto mt-5 max-w-lg text-muted">Only verified results are published, and only with the student&apos;s or parent&apos;s consent.</p>
            </div>
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="section pb-8">
          <div className="wrap">
            <h2 className="bar-title text-[clamp(1.6rem,2.8vw,2.1rem)]">Student Achievements</h2>
            {/* a timeline that scrolls sideways */}
            <ul className="-mx-5 mt-8 flex snap-x gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0" aria-label="Achievements by year">
              {achievements.map((a, i) => {
                const Icon = i % 2 ? Award : TrophyIcon;
                return (
                  <li key={a.id} className="relative w-72 shrink-0 snap-start pt-14">
                    <span className="absolute left-0 right-[-1.25rem] top-[2.6rem] h-px bg-[var(--muted)] opacity-50" aria-hidden="true" />
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-md bg-[var(--xii-soft)] px-3 py-0.5 font-display text-sm font-bold">{a.year || "—"}</span>
                    <span className="absolute left-1/2 top-[2.25rem] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[2.5px] border-[#F5861F] bg-[var(--bg)]" aria-hidden="true" />
                    <article className="card h-full p-5">
                      <div className="flex items-start gap-4">
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-[var(--xii-soft)] text-accent"><Icon size={28} aria-hidden="true" /></span>
                        <h3 className="font-display text-lg font-bold leading-snug">{a.title}</h3>
                      </div>
                      {a.detail && <p className="mt-3 whitespace-pre-line text-[0.95rem] text-muted">{a.detail}</p>}
                      <span className="mt-4 block h-0.5 w-9 rounded bg-accent" aria-hidden="true" />
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section pt-8">
          <div className="wrap">
            <h2 className="bar-title text-[clamp(1.6rem,2.8vw,2.1rem)]">In their words</h2>
            <p className="mt-1 pl-4 text-muted">Experiences shared by our students and parents.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.id} className="card p-6 md:p-7">
                  <blockquote className="relative border-l-2 border-accent pl-12">
                    <span className="absolute left-4 top-[-0.4rem] font-serif text-5xl leading-none text-accent" aria-hidden="true">“</span>
                    <p className="math text-lg leading-snug md:text-xl">{t.text}</p>
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-4 border-t border-line pt-4">
                    {t.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.photoUrl} alt="" className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-raise text-muted"><UserRound size={26} aria-hidden="true" /></span>
                    )}
                    <span>
                      <span className="block font-display font-bold">{t.name}</span>
                      {t.cls && <span className="text-sm text-muted">{t.cls}</span>}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <NavyCTA title={<>Start with one concept, <em className="hi">properly understood.</em></>}>
        <ArrowLink href="/courses" className="btn-onnavy"><PlayCircle size={18} aria-hidden="true" /> Explore Classes</ArrowLink>
        <Link href="/contact" className="btn btn-light"><MessageCircle size={17} aria-hidden="true" /> Contact Siddhu Sir</Link>
      </NavyCTA>
    </>
  );
}
