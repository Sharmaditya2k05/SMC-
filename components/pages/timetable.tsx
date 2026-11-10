import type { Metadata } from "next";
import { PrintButton } from "@/components/interactive";
import { TimetableCard, WeekPlot } from "@/components/timetable";
import { PageHero } from "@/components/ui";
import { getTimetable } from "@/lib/content";

export const metadata: Metadata = {
  title: "Batch Timetable – Class XI and XII",
  description: "Weekly batch timings for Class XI and Class XII Mathematics at Siddhu Mathematics Classes, Monday to Saturday (IST).",
  alternates: { canonical: "/timetable" },
};

/** The one place on the site where batch timings are listed. */
export default async function TimetablePage() {
  const timetable = await getTimetable();
  return (
    <>
      <div className="no-print">
        <PageHero
          title={<>Find Your Perfect <em className="hi">Learning Schedule.</em></>}
          subtitle="Separate batches for Class XI and Class XII, Monday to Saturday. All timings are in Indian Standard Time (IST)."
        >
          <PrintButton />
        </PageHero>
      </div>

      {/* heading used only on the printed page */}
      <div className="print-only mb-6 border-b border-[#bbb] pb-4">
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "26px" }}>S.M.C – Siddhu Mathematics Classes</p>
        <p>Batch Timetable · Class XI &amp; XII Mathematics · All timings in IST</p>
      </div>

      <section className="section">
        <div className="wrap space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <TimetableCard cls="XI" timetable={timetable} />
            <TimetableCard cls="XII" timetable={timetable} />
          </div>
          <WeekPlot timetable={timetable} />
          <p className="text-sm text-muted">
            The two classes exchange time slots midweek. Sunday is not a listed teaching day. Timings can change – any update is published on this page.
          </p>
        </div>
      </section>
    </>
  );
}
