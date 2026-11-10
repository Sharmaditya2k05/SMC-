import type { Metadata } from "next";
import { PrintButton } from "@/components/interactive";
import { TimetableCard, WeekPlot } from "@/components/timetable";
import { NavyCTA, PageHero, WaButton } from "@/components/ui";
import { getSettings, getTimetable } from "@/lib/content";
import { waLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Batch Timetable – Class XI and XII",
  description: "Weekly batch timings for Class XI and Class XII Mathematics at Siddhu Mathematics Classes, Monday to Saturday (IST).",
  alternates: { canonical: "/timetable" },
};

export default async function TimetablePage() {
  const [settings, timetable] = await Promise.all([getSettings(), getTimetable()]);
  const wa = waLink(settings.whatsapp, `Hello ${settings.teacherShortName || ""}, I need help choosing a Mathematics batch at Siddhu Mathematics Classes.`.replace("Hello ,", "Hello,"));
  return (
    <>
      <div className="no-print">
        <PageHero
          title={<>Find Your Perfect <em className="hi">Learning Schedule.</em></>}
          subtitle="Separate batches for Class XI and Class XII, Monday to Saturday. All timings are in Indian Standard Time (IST)."
        >
          <PrintButton />
          <WaButton href={wa}>Ask about a batch</WaButton>
        </PageHero>
      </div>

      {/* heading used only on the printed page */}
      <div className="print-only mb-6 border-b border-[#bbb] pb-4">
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "26px" }}>S.M.C – Siddhu Mathematics Classes</p>
        <p>Batch Timetable · Class XI &amp; XII Mathematics · All timings in IST</p>
      </div>

      <section className="section">
        <div className="wrap space-y-10">
          <div className="grid gap-6 md:grid-cols-2">
            <TimetableCard cls="XI" timetable={timetable} whatsapp={settings.whatsapp} />
            <TimetableCard cls="XII" timetable={timetable} whatsapp={settings.whatsapp} />
          </div>
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="h2 text-[clamp(1.6rem,2.8vw,2.2rem)]">Weekly <span className="text-accent">Class Schedule</span></h2>
              <p className="flex items-center gap-5 font-display text-sm font-semibold">
                <span className="flex items-center gap-2"><i className="h-3.5 w-3.5 rounded bg-[var(--xi)]" aria-hidden="true" /> Class XI</span>
                <span className="flex items-center gap-2"><i className="h-3.5 w-3.5 rounded bg-[var(--xii)]" aria-hidden="true" /> Class XII</span>
              </p>
            </div>
            <WeekPlot timetable={timetable} />
            <p className="mt-4 text-sm text-muted">
              The two classes exchange time slots midweek. Sunday is not a listed teaching day. Timings can change – any update is published on this page.
            </p>
          </div>
        </div>
      </section>

      <NavyCTA title={<>Need Help Choosing a Batch? <em className="hi">Contact Us.</em></>}>
        <WaButton href={wa}>Contact on WhatsApp</WaButton>
      </NavyCTA>
    </>
  );
}
