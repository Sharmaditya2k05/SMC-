import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/interactive";
import { NavyCTA, PageHero, WaButton } from "@/components/ui";
import { getSettings, getTimetable } from "@/lib/content";
import { slotDays, slotTime, waLink, WA_MESSAGES } from "@/lib/format";
import type { Timetable } from "@/lib/types";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about classes, batch timings, study material, location and admission enquiries at Siddhu Mathematics Classes.",
  alternates: { canonical: "/faqs" },
};

const timings = (t: Timetable, cls: "XI" | "XII") =>
  t.slots.filter((s) => s.cls === cls).map((s) => `${slotDays(s)}: ${slotTime(s)}`).join("; ");

export default async function Faqs() {
  const [settings, timetable] = await Promise.all([getSettings(), getTimetable()]);
  const xi = timings(timetable, "XI");
  const xii = timings(timetable, "XII");
  const where = settings.address ? `Classes are conducted at ${settings.address}.` : "Classes are conducted at the Siddhu Mathematics Classes classroom.";

  // Plain-text answers feed both the page and the FAQ structured data.
  const faqs: { q: string; text: string; a?: React.ReactNode }[] = [
    { q: "Which classes are taught?", text: "Siddhu Mathematics Classes teaches Mathematics for Class XI and Class XII." },
    { q: "Do you teach Class XI Mathematics?", text: `Yes. Class XI Mathematics has its own dedicated batch. Timings – ${xi}.`, a: <p>Yes. Class XI Mathematics has its own dedicated batch. Timings – {xi}. See <Link href="/courses#class-xi">the Class XI course</Link>.</p> },
    { q: "Do you teach Class XII Mathematics?", text: `Yes. Class XII Mathematics has its own dedicated batch. Timings – ${xii}.`, a: <p>Yes. Class XII Mathematics has its own dedicated batch. Timings – {xii}. See <Link href="/courses#class-xii">the Class XII course</Link>.</p> },
    { q: "What are the batch timings?", text: `Class XI – ${xi}. Class XII – ${xii}. All timings are in IST, Monday to Saturday.`, a: <><p><strong>Class XI</strong> – {xi}.</p><p className="mt-2"><strong>Class XII</strong> – {xii}.</p><p className="mt-2">All timings are in IST, Monday to Saturday. The <Link href="/timetable">timetable page</Link> always has the current schedule.</p></> },
    { q: "Are study materials available online?", text: "Yes. Selected notes are available as PDFs in the Study Material section of this website.", a: <p>Yes. Selected notes are available as PDFs in the <Link href="/study-material">Study Material</Link> section, where you can preview or download them.</p> },
    { q: "Can students access sample notes?", text: "Yes. Sample chapter-wise notes for Class XI and XII can be previewed and downloaded without signing in.", a: <p>Yes. Sample chapter-wise notes for Class XI and XII can be previewed and downloaded from the <Link href="/study-material">notes library</Link> without signing in.</p> },
    { q: "Where are the classes conducted?", text: `${where} The exact location is available on Google Maps.`, a: <p>{where} <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">Open the location in Google Maps</a> for directions.</p> },
    { q: "How can I enquire about admission?", text: "Send a message on WhatsApp or fill in the enquiry form on the Contact page with the student's name and class.", a: <p>Send a message on WhatsApp or fill in the <Link href="/contact#enquiry">enquiry form</Link> with the student&apos;s name and class. Details about admission and fees are shared directly when you enquire.</p> },
    { q: "How can parents contact the teacher?", text: "Parents can contact the teacher on WhatsApp or through the enquiry form on the Contact page.", a: <p>Parents can contact the teacher on WhatsApp or through the <Link href="/contact">Contact page</Link>.</p> },
    { q: "Is there a separate timetable for Class XI and XII?", text: "Yes. Class XI and Class XII are taught in separate batches at different times on every teaching day.", a: <p>Yes. Class XI and Class XII are taught in separate batches at different times on every teaching day. See both on the <Link href="/timetable">timetable page</Link>.</p> },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.text } })),
  };

  return (
    <>
      <PageHero title="Questions, answered." subtitle="The things students and parents ask most often." />
      <section className="section pt-10 md:pt-16">
        <div className="wrap max-w-4xl">
          <Accordion items={faqs.map((f) => ({ q: f.q, a: f.a ?? <p>{f.text}</p> }))} />
        </div>
      </section>
      <NavyCTA title="Still have a question?" text="Ask directly – you will get a clear answer.">
        <WaButton href={waLink(settings.whatsapp, WA_MESSAGES.home)}>Contact on WhatsApp</WaButton>
        <Link href="/contact#enquiry" className="btn btn-onnavy">Send an Enquiry</Link>
      </NavyCTA>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
