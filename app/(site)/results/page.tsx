import type { Metadata } from "next";
import Link from "next/link";
import { NavyCTA, PageHero } from "@/components/ui";
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
      <PageHero title="Every Improvement Deserves Recognition." subtitle="Verified student achievements and words from students and parents, shared with their permission." />

      {empty && (
        <section className="section">
          <div className="wrap">
            <div className="card grid-paper px-6 py-20 text-center">
              <p className="mx-auto max-w-xl font-serif text-3xl leading-snug">Student achievements and success stories will be featured here.</p>
              <p className="mx-auto mt-4 max-w-md text-muted">Only verified results are published, and only with the student&apos;s or parent&apos;s consent.</p>
            </div>
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="section">
          <div className="wrap">
            <h2 className="h2">Student achievements</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((a) => (
                <li key={a.id} className="card border-t-4 border-t-[var(--gold)] p-6">
                  {a.year && <p className="font-serif text-2xl text-goldink">{a.year}</p>}
                  <h3 className="mt-1 font-display text-xl font-bold">{a.title}</h3>
                  {a.detail && <p className="mt-2 whitespace-pre-line text-muted">{a.detail}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section border-t border-line bg-surface">
          <div className="wrap">
            <h2 className="h2">In their words</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.id} className="card p-6 md:p-8">
                  <blockquote className="font-serif text-xl leading-snug md:text-2xl">“{t.text}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-4">
                    {t.photoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.photoUrl} alt="" className="h-12 w-12 rounded-full object-cover" loading="lazy" />
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

      <NavyCTA title="Start with one concept, properly understood.">
        <Link href="/courses" className="btn btn-gold">Explore Classes</Link>
        <Link href="/contact#enquiry" className="btn btn-onnavy">Send an Enquiry</Link>
      </NavyCTA>
    </>
  );
}
