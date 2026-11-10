"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { api, Notice, PageTitle } from "@/components/admin/kit";
import { DAYS } from "@/lib/defaults";
import type { Slot, Timetable } from "@/lib/types";

export default function TimetableAdmin() {
  const [tt, setTt] = useState<Timetable | null>(null);
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ timetable: Timetable }>("/api/admin/site").then((d) => setTt(d.timetable)).catch((e) => setNote({ kind: "error", text: e.message }));
  }, []);

  const patch = (id: string, change: Partial<Slot>) => setTt((t) => t && { ...t, slots: t.slots.map((s) => (s.id === id ? { ...s, ...change } : s)) });

  async function save() {
    if (!tt) return;
    setSaving(true);
    try {
      await api("/api/admin/site", { method: "PUT", json: { timetable: tt } });
      setNote({ kind: "ok", text: "Timetable saved. The website updates within a minute." });
    } catch (e) {
      setNote({ kind: "error", text: (e as Error).message });
    }
    setSaving(false);
  }

  return (
    <>
      <PageTitle title="Timetable" intro="Each row is one batch: a class, the days it meets and its timing (IST).">
        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={!tt || saving}>{saving ? "Saving…" : "Save timetable"}</button>
      </PageTitle>
      {note && <Notice kind={note.kind}>{note.text}</Notice>}
      {!tt ? (
        <div className="skeleton h-64" />
      ) : (
        <div className="space-y-4">
          {tt.slots.map((s) => (
            <fieldset key={s.id} className="card grid gap-4 p-5 md:grid-cols-[9rem_1fr_auto] md:items-end">
              <legend className="sr-only">Batch</legend>
              <label className="field">
                <span>Class</span>
                <select className="input" value={s.cls} onChange={(e) => patch(s.id, { cls: e.target.value as Slot["cls"] })}>
                  <option value="XI">Class XI</option>
                  <option value="XII">Class XII</option>
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
                <div>
                  <span className="mb-1.5 block font-display text-sm font-semibold">Days</span>
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS.map((d) => {
                      const on = s.days.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={on}
                          onClick={() => patch(s.id, { days: on ? s.days.filter((x) => x !== d) : DAYS.filter((x) => x === d || s.days.includes(x)) })}
                          className={`h-11 w-12 rounded-md border text-sm font-semibold ${on ? "border-transparent bg-[var(--btn-bg)] text-[var(--btn-fg)]" : "border-line"}`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label className="field">
                  <span>Start</span>
                  <input type="time" className="input" value={s.start} onChange={(e) => patch(s.id, { start: e.target.value })} />
                </label>
                <label className="field">
                  <span>End</span>
                  <input type="time" className="input" value={s.end} onChange={(e) => patch(s.id, { end: e.target.value })} />
                </label>
              </div>
              <button type="button" className="btn btn-outline btn-sm" aria-label="Remove this batch" onClick={() => setTt({ ...tt, slots: tt.slots.filter((x) => x.id !== s.id) })}>
                <Trash2 size={16} aria-hidden="true" /> Remove
              </button>
            </fieldset>
          ))}
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setTt({ ...tt, slots: [...tt.slots, { id: crypto.randomUUID(), cls: "XI", days: ["Mon"], start: "15:30", end: "17:00" }] })}
          >
            Add a batch
          </button>
          <label className="field pt-4">
            <span>Special notice (optional)</span>
            <textarea className="input min-h-24" value={tt.notice} placeholder="Shown under the weekly schedule, e.g. a holiday or a one-off change." onChange={(e) => setTt({ ...tt, notice: e.target.value })} />
          </label>
        </div>
      )}
    </>
  );
}
