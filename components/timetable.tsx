import Link from "next/link";
import { DAYS, DAY_NAMES } from "@/lib/defaults";
import { slotDays, slotTime, time12, waLink, WA_MESSAGES } from "@/lib/format";
import type { Timetable } from "@/lib/types";
import { WaButton } from "./ui";

const fill = { XI: "bg-xi text-white dark:text-[#101C35]", XII: "bg-[var(--gold)] text-[#101C35]" } as const;

/**
 * The week as a plot: days across, time bands down. The two classes swap
 * slots mid-week, which this view makes obvious at a glance.
 */
export function WeekPlot({ timetable }: { timetable: Timetable }) {
  const bands = [...new Map(timetable.slots.map((s) => [`${s.start}-${s.end}`, s])).values()].sort((a, b) => a.start.localeCompare(b.start));
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-6">
        <p className="font-display text-sm font-bold">Weekly schedule <span className="font-sans font-normal text-muted">· Monday to Saturday · IST</span></p>
        <p className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-xi" aria-hidden="true" /> Class XI</span>
          <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-[var(--gold)]" aria-hidden="true" /> Class XII</span>
        </p>
      </div>
      <table className="w-full table-fixed border-collapse text-center">
        <caption className="sr-only">Weekly batch schedule for Class XI and Class XII, Indian Standard Time</caption>
        <thead>
          <tr>
            <th scope="col" className="w-[4.6rem] border-b border-r border-line p-2 text-left text-xs font-semibold text-muted md:w-44 md:px-6">
              Time
            </th>
            {DAYS.map((d) => (
              <th key={d} scope="col" className="border-b border-line p-2 font-display text-sm font-bold md:py-3">
                <abbr title={DAY_NAMES[d]} className="no-underline">
                  <span className="md:hidden">{d[0]}</span>
                  <span className="hidden md:inline">{d}</span>
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="grid-paper">
          {bands.map((band) => (
            <tr key={band.start}>
              <th scope="row" className="border-r border-line bg-surface p-2 text-left align-middle text-[0.7rem] font-medium leading-tight text-muted md:px-6 md:text-sm">
                {time12(band.start)}
                <span className="block md:inline"> – {time12(band.end)}</span>
              </th>
              {DAYS.map((d) => {
                const here = timetable.slots.filter((s) => s.start === band.start && s.end === band.end && s.days.includes(d));
                return (
                  <td key={d} className="h-20 p-1 md:h-24 md:p-1.5">
                    <div className="flex h-full flex-col gap-1">
                      {here.map((s) => (
                        <div key={s.id} className={`grid flex-1 place-items-center rounded-[5px] font-serif text-lg md:text-2xl ${fill[s.cls]}`}>
                          <span>
                            <span className="sr-only">Class </span>
                            {s.cls}
                          </span>
                        </div>
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

export function TimetableCard({ cls, timetable, whatsapp, actions = true }: { cls: "XI" | "XII"; timetable: Timetable; whatsapp: string; actions?: boolean }) {
  const slots = timetable.slots.filter((s) => s.cls === cls);
  return (
    <article className="card relative overflow-hidden">
      <div className={`h-1.5 ${cls === "XI" ? "bg-xi" : "bg-[var(--gold)]"}`} />
      <div className="p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <h3 className="font-display text-xl font-bold">
            Class {cls} <span className="block text-base font-medium text-muted">Mathematics</span>
          </h3>
          <span className={`font-serif text-6xl leading-none ${cls === "XI" ? "text-xi" : "text-xii"}`} aria-hidden="true">{cls}</span>
        </div>
        <table className="mt-6 w-full text-left">
          <thead>
            <tr className="text-sm text-muted">
              <th scope="col" className="border-b border-line py-2 font-medium">Days</th>
              <th scope="col" className="border-b border-line py-2 font-medium">Timing (IST)</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s.id}>
                <td className="border-b border-line py-3.5 pr-3 align-top">{slotDays(s)}</td>
                <td className="whitespace-nowrap border-b border-line py-3.5 align-top font-display font-bold tabular-nums">{slotTime(s)}</td>
              </tr>
            ))}
            {!slots.length && (
              <tr><td colSpan={2} className="py-4 text-muted">Batch timings will be announced.</td></tr>
            )}
          </tbody>
        </table>
        {actions && (
          <div className="no-print mt-6 flex flex-wrap gap-3">
            <WaButton href={waLink(whatsapp, WA_MESSAGES[cls])} className="btn-sm">Enquire on WhatsApp</WaButton>
            <Link href={`/courses#class-${cls.toLowerCase()}`} className="btn btn-outline btn-sm">About Class {cls}</Link>
          </div>
        )}
      </div>
    </article>
  );
}
