import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/interactive";
import { TimetableCard, WeekPlot } from "@/components/timetable";
import { PageHero, WaButton } from "@/components/ui";
import { getSettings, getTimetable } from "@/lib/content";
import { waLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Batch Timetable – Class XI and XII",
  description: "Weekly batch timings for Class XI and Class XII Mathematics at Siddhu Mathematics Classes, Monday to Saturday (IST).",
  alternates: { canonical: "/timetable" },
};

export default async function TimetablePage() {
  const [settings, timetable] = await Promise.all([getSettings(), getTimetable()]);
  const wa = waLink(settings.whatsapp, "Hello, I need help choosing a Mathematics batch at Siddhu Mathematics Classes.");
  return (
    <>
      <div className="no-print">
        <PageHero title="Find Your Perfect Learning Schedule." subtitle="Separate batches for Class XI and Class XII, Monday to Saturday. All timings are in Indian Standard Time (IST).">
          <PrintButton />
          <WaButton href={wa}>Ask about a batch</WaButton>
        </PageHero>
      </div>

      {/* heading used only on the printed page */}
      <div className="print-only mb-6 border-b border-[#bbb] pb-4">
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "28px" }}>S.M.C – Siddhu Mathematics Classes</p>
        <p>Batch Timetable · Class XI &amp; XII Mathematics · All timings in IST</p>
      </div>

      <section className="section">
        <div className="wrap space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <TimetableCard cls="XI" timetable={timetable} whatsapp={settings.whatsapp} />
            <TimetableCard cls="XII" timetable={timetable} whatsapp={settings.whatsapp} />
          </div>
          <WeekPlot timetable={timetable} />
          <p className="text-sm text-muted">
            Classes are listed for Monday to Saturday. Sunday is not a listed teaching day. Timings can change – any update is published on this page.
          </p>
        </div>
      </section>

      <section className="no-print border-t border-line bg-surface">
        <div className="wrap flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <h2 className="h2 max-w-xl">Need Help Choosing a Batch? Contact Us.</h2>
          <div className="flex flex-wrap gap-3">
            <WaButton href={wa}>Contact on WhatsApp</WaButton>
            <Link href="/contact#enquiry" className="btn btn-outline">Send Enquiry</Link>
          </div>
        </div>
      </section>
    </>
  );
}
