import type { Metadata } from "next";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms for using the Siddhu Mathematics Classes website and its study material.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <>
      <PageHero title="Terms and Conditions" subtitle="The basics of using this website." />
      <section className="section pt-10 md:pt-16">
        <div className="wrap max-w-3xl space-y-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-2 [&_p]:text-muted">
          <div>
            <h2>Study material</h2>
            <p>Notes and PDFs on this website are shared for students&apos; personal study. Please do not sell them or republish them as your own.</p>
          </div>
          <div>
            <h2>Information on this website</h2>
            <p>Batch timings, curriculum outlines and other details are kept up to date but can change. Please confirm current timings and availability when you enquire.</p>
          </div>
          <div>
            <h2>Enquiries and admission</h2>
            <p>Sending a message does not confirm a seat. Admission, fees and batch allotment are discussed directly with Siddhu Sir.</p>
          </div>
          <div id="disclaimer" className="scroll-mt-28">
            <h2>Disclaimer – no guarantee of results</h2>
            <p>Classes are designed to build understanding and confidence. Examination results depend on each student&apos;s own effort and cannot be guaranteed.</p>
          </div>
          <div>
            <h2>External links</h2>
            <p>Links to Google Maps, Google Drive and WhatsApp open services run by other companies, which have their own terms.</p>
          </div>
        </div>
      </section>
    </>
  );
}
