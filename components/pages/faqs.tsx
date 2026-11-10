import type { Metadata } from "next";
import Link from "next/link";
import { FaqExplorer } from "@/components/interactive";
import { PageHero } from "@/components/ui";
import { getSettings, getTimetable } from "@/lib/content";
import { slotDays, slotTime } from "@/lib/format";
import type { Timetable } from "@/lib/types";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about classes, batch timings, study material, location and admission enquiries at Siddhu Mathematics Classes.",
  alternates: { canonical: "/faqs" },
};

const timings = (t: Timetable, cls: "XI" | "XII") =>
  t.slots.filter((s) => s.cls === cls).map((s) => `${slotDays(s)}: ${slotTime(s)}`).join("; ");

function Timings({ t }: { t: Timetable }) {
  return (
    <>
      <ul className="space-y-3">
        {(["XI", "XII"] as const).map((cls) => (
          <li key={cls} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span className={`tag h-fit bg-[var(--xii-soft)] text-[0.95rem] text-[var(--ink)]`}>Class {cls}</span>
            <span>
              {t.slots.filter((s) => s.cls === cls).map((s) => (
                <span key={s.id} className="block">– {slotDays(s)}: <span className="tabular-nums">{slotTime(s)}</span></span>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <p className="math mt-3 text-sm text-muted">All timings are in IST. The <Link href="/timetable">timetable page</Link> always has the current schedule.</p>
    </>
  );
}

export default async function Faqs() {
  const [settings, timetable] = await Promise.all([getSettings(), getTimetable()]);
  const xi = timings(timetable, "XI");
  const xii = timings(timetable, "XII");
  const sir = settings.teacherShortName || "the teacher";
  const who = settings.teacherShortName || "The teacher";
  const where = settings.address ? `Classes are conducted at the Siddhu Mathematics Classes classroom in ${settings.address}.` : "Classes are conducted at the Siddhu Mathematics Classes classroom.";

  // `text` feeds the FAQ structured data; `a` is the richer on-page answer.
  const faqs: { q: string; topic: string; text: string; a?: React.ReactNode }[] = [
    { topic: "Classes", q: "Which classes are taught?", text: `${who} teaches Mathematics for Class XI and Class XII at Siddhu Mathematics Classes.` },
    { topic: "Classes", q: "Do you teach Class XI Mathematics?", text: "Yes. Class XI Mathematics has its own dedicated batch.", a: <p>Yes. Class XI Mathematics has its own dedicated batch. See <Link href="/courses#class-xi">the Class XI course</Link> and the <Link href="/timetable">timetable</Link>.</p> },
    { topic: "Classes", q: "Do you teach Class XII Mathematics?", text: "Yes. Class XII Mathematics has its own dedicated batch.", a: <p>Yes. Class XII Mathematics has its own dedicated batch. See <Link href="/courses#class-xii">the Class XII course</Link> and the <Link href="/timetable">timetable</Link>.</p> },
    { topic: "Timings", q: "What are the batch timings?", text: `Class XI – ${xi}. Class XII – ${xii}. All timings are in IST, Monday to Saturday.`, a: <Timings t={timetable} /> },
    { topic: "Study material", q: "Are study materials available online?", text: "Yes. Selected notes are available as PDFs in the Study Material section of this website.", a: <p>Yes. Selected notes are available as PDFs in the <Link href="/study-material">Study Material</Link> section, where you can preview or download them.</p> },
    { topic: "Study material", q: "Can students access sample notes?", text: "Yes. Sample chapter-wise notes for Class XI and XII can be previewed and downloaded without signing in.", a: <p>Yes. Sample chapter-wise notes for Class XI and XII can be previewed and downloaded from the <Link href="/study-material">notes library</Link> without signing in.</p> },
    { topic: "Location", q: "Where are the classes conducted?", text: `${where} The exact location is available on Google Maps.`, a: <p>{where} <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">Open the location in Google Maps</a> for directions.</p> },
    { topic: "Admission", q: "How can I enquire about admission?", text: "Send a message on WhatsApp with the student's name and class.", a: <p>Send a message on WhatsApp with the student&apos;s name and class – the buttons on the <Link href="/contact">Contact page</Link> open the chat for you. Details about admission and fees are shared directly when you enquire.</p> },
    { topic: "Admission", q: `How can parents contact ${sir}?`, text: `Parents can contact ${sir} on WhatsApp – the number is on the Contact page.`, a: <p>Parents can contact {sir} on WhatsApp – the number is on the <Link href="/contact">Contact page</Link>.</p> },
    { topic: "Timings", q: "Is there a separate timetable for Class XI and XII?", text: "Yes. Class XI and Class XII are taught in separate batches at different times on every teaching day.", a: <p>Yes. Class XI and Class XII are taught in separate batches at different times on every teaching day. See both on the <Link href="/timetable">timetable page</Link>.</p> },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.text } })),
  };

  return (
    <>
      <PageHero title={<>Questions, <em className="hi">answered.</em></>} subtitle="The things students and parents ask most often." />
      <section className="section pt-10">
        <div className="wrap">
          <FaqExplorer items={faqs.map((f) => ({ q: f.q, topic: f.topic, a: f.a ?? <p>{f.text}</p> }))} />
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
