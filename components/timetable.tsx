import { CalendarDays, Clock } from "lucide-react";
import { DAYS, DAY_NAMES } from "@/lib/defaults";
import { slotDays, slotTime, time12 } from "@/lib/format";
import type { Timetable } from "@/lib/types";

const pill = {
  XI: "bg-[var(--xi)] text-[var(--xi-fg)]",
  XII: "bg-[var(--xii)] text-white",
} as const;

/** Weekly class schedule: days across, time bands down, one pill per class. */
export function WeekPlot({ timetable }: { timetable: Timetable }) {
  const bands = [...new Map(timetable.slots.map((s) => [`${s.start}-${s.end}`, s])).values()].sort((a, b) => a.start.localeCompare(b.start));
  return (
    <div className="card overflow-hidden">
      <table className="w-full table-fixed border-collapse text-center">
        <caption className="sr-only">Weekly batch schedule for Class XI and Class XII, Indian Standard Time</caption>
        <thead>
          <tr className="bg-raise">
            <th scope="col" className="w-[4.75rem] border-b border-line p-2 font-display text-sm font-bold md:w-48 md:py-3">Time</th>
            {DAYS.map((d) => (
              <th key={d} scope="col" className="border-b border-l border-line p-2 font-display text-sm font-bold md:py-3">
                <abbr title={DAY_NAMES[d]} className="no-underline">
                  <span className="lg:hidden">{d[0]}<span className="hidden sm:inline">{d.slice(1)}</span></span>
                  <span className="hidden lg:inline">{DAY_NAMES[d]}</span>
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bands.map((band) => (
            <tr key={band.start}>
              <th scope="row" className="border-b border-line p-2 text-left font-display text-[0.68rem] font-semibold leading-tight last:border-b-0 md:px-5 md:text-sm">
                <span className="flex items-center gap-2.5">
                  <Clock size={16} className="hidden shrink-0 md:block" aria-hidden="true" />
                  <span className="tabular-nums">
                    {time12(band.start).replace(/ [AP]M$/, "")} –<span className="block md:inline"> {time12(band.end)}</span>
                  </span>
                </span>
              </th>
              {DAYS.map((d) => {
                const here = timetable.slots.filter((s) => s.start === band.start && s.end === band.end && s.days.includes(d));
                return (
                  <td key={d} className="border-b border-l border-line p-1 md:p-2">
                    <div className="flex flex-col gap-1">
                      {here.map((s) => (
                        <span key={s.id} className={`rounded-md py-2 font-display text-xs font-bold md:text-sm ${pill[s.cls]}`}>
                          <span className="hidden lg:inline">Class </span>
                          <span className="sr-only lg:hidden">Class </span>
                          {s.cls}
                        </span>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {timetable.notice && <p className="border-t border-line px-4 py-3 text-sm md:px-6"><strong className="font-semibold">Note:</strong> {timetable.notice}</p>}
    </div>
  );
}

/** Large per-class timetable card with a coloured header bar. */
export function TimetableCard({ cls, timetable }: { cls: "XI" | "XII"; timetable: Timetable }) {
  const slots = timetable.slots.filter((s) => s.cls === cls);
  return (
    <article className="card relative overflow-hidden">
      <div className={`flex items-center justify-between gap-4 px-6 py-4 md:px-8 ${pill[cls]}`}>
        <h3 className="font-display text-xl font-bold">Class {cls} Mathematics</h3>
        <span className="font-display text-3xl font-extrabold leading-none opacity-90" aria-hidden="true">{cls}</span>
      </div>
      <div className="p-6 md:p-8">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-muted">
              <th scope="col" className="border-b border-line pb-2 font-medium">Days</th>
              <th scope="col" className="border-b border-line pb-2 font-medium">Timing (IST)</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s.id}>
                <td className="border-b border-line py-3.5 pr-3 align-middle">
                  <span className="flex items-center gap-2.5"><CalendarDays size={17} className="shrink-0 text-accent" aria-hidden="true" /> {slotDays(s)}</span>
                </td>
                <td className="border-b border-line py-3.5 align-middle">
                  <span className="inline-block whitespace-nowrap rounded-md bg-[var(--xii-soft)] px-2.5 py-1 font-display font-bold tabular-nums">{slotTime(s)}</span>
                </td>
              </tr>
            ))}
            {!slots.length && (
              <tr><td colSpan={2} className="py-4 text-muted">Batch timings will be announced.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}
