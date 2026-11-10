"use client";

import { useState } from "react";
import { Check, CircleAlert, Send } from "lucide-react";
import { normaliseIndianMobile, slotDays, slotTime, waLink } from "@/lib/format";
import type { Timetable } from "@/lib/types";
import { WhatsAppIcon } from "./ui";

type Errors = Partial<Record<"student" | "whatsapp" | "cls", string>>;

export function EnquiryForm({ timetable, whatsapp, teacher }: { timetable: Timetable; whatsapp: string; teacher: string }) {
  const [form, setForm] = useState({ student: "", parent: "", whatsapp: "", cls: "", batch: "", message: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [failure, setFailure] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value, ...(k === "cls" ? { batch: "" } : {}) }));
  const batches = timetable.slots.filter((s) => s.cls === form.cls);

  function validate(): Errors {
    const e: Errors = {};
    if (form.student.trim().length < 2) e.student = "Enter the student's name.";
    if (!normaliseIndianMobile(form.whatsapp)) e.whatsapp = "Enter a valid 10-digit Indian mobile number.";
    if (!form.cls) e.cls = "Choose Class XI or XII.";
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`enq-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) return setStatus("sent");
      if (data.errors) setErrors(data.errors);
      setFailure(data.error || "Your enquiry could not be sent. Please try again.");
      setStatus("failed");
    } catch {
      setFailure("No connection. Check your internet and try again.");
      setStatus("failed");
    }
  }

  const followUp = waLink(
    whatsapp,
    `Hello ${teacher}, I have sent an enquiry on the website for ${form.student || "a student"} (Class ${form.cls || "XI/XII"} Mathematics). Please share the details.`,
  );
  const hasWa = followUp.startsWith("http");

  if (status === "sent") {
    return (
      <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-xl border border-[#1faa53]/40 bg-[#1faa53]/[0.07] p-8 text-center" role="status">
        <span className="relative grid h-16 w-16 place-items-center rounded-full bg-[#1faa53] text-white shadow-[0_0_0_10px_rgba(31,170,83,.15)]">
          <Check size={32} strokeWidth={3} aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-display text-3xl font-bold tracking-[-0.03em]">Enquiry sent</h3>
        <p className="mt-3 max-w-sm text-muted">
          Thank you, {form.student.trim()}. {teacher} will get back to you on WhatsApp at {normaliseIndianMobile(form.whatsapp)}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {hasWa && (
            <a href={followUp} target="_blank" rel="noopener noreferrer" className="btn border-[#1faa53] bg-surface text-[#128a3f] hover:bg-[#1faa53] hover:text-white">
              <WhatsAppIcon /> Follow up on WhatsApp
            </a>
          )}
          <button type="button" className="btn btn-outline" onClick={() => (setStatus("idle"), setForm((f) => ({ ...f, student: "", message: "" })))}>
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  const req = <span className="text-[#d0342c]" aria-hidden="true"> *</span>;
  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          <span>Student name{req}</span>
          <input id="enq-student" className="input" placeholder="Enter student's name" value={form.student} onChange={set("student")} autoComplete="name" aria-required="true" aria-invalid={!!errors.student} aria-describedby={errors.student ? "err-student" : undefined} />
          {errors.student && <p id="err-student" className="err">{errors.student}</p>}
        </label>
        <label className="field">
          <span>Parent name (optional)</span>
          <input className="input" placeholder="Enter parent's name" value={form.parent} onChange={set("parent")} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          <span>WhatsApp number{req}</span>
          <input id="enq-whatsapp" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" value={form.whatsapp} onChange={set("whatsapp")} aria-required="true" aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? "err-whatsapp" : undefined} />
          {errors.whatsapp && (
            <p id="err-whatsapp" className="err flex items-center gap-1.5"><CircleAlert size={14} aria-hidden="true" /> {errors.whatsapp}</p>
          )}
        </label>
        <fieldset className="field">
          <legend className="mb-[0.4rem] font-display text-sm font-semibold">Class{req}</legend>
          <div className={`grid grid-cols-2 rounded-lg border bg-surface p-1 ${errors.cls ? "border-[#d0342c]" : "border-line"}`}>
            {(["XI", "XII"] as const).map((c, i) => (
              <label key={c} className={`flex min-h-10 cursor-pointer items-center gap-2.5 rounded-md px-3 font-display text-sm font-semibold ${form.cls === c ? "bg-[var(--xii-soft)]" : ""}`}>
                <input id={i === 0 ? "enq-cls" : undefined} type="radio" name="cls" value={c} checked={form.cls === c} onChange={set("cls")} className="h-4 w-4 accent-[#F5861F]" />
                Class {c}
              </label>
            ))}
          </div>
          {errors.cls && <p id="err-cls" className="err">{errors.cls}</p>}
        </fieldset>
      </div>
      <label className="field sm:max-w-[60%]">
        <span>Preferred batch (optional)</span>
        <select className="input" value={form.batch} onChange={set("batch")} disabled={!form.cls}>
          <option value="">{form.cls ? "No preference" : "Choose a class first"}</option>
          {batches.map((s) => (
            <option key={s.id} value={`${slotDays(s)} · ${slotTime(s)}`}>
              {slotDays(s)} · {slotTime(s)}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Message (optional)</span>
        <textarea className="input min-h-24" placeholder="Ask about the syllabus, batch timings or admission…" value={form.message} onChange={set("message")} maxLength={1500} />
      </label>
      {/* honeypot – hidden from people, attractive to bots */}
      <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {status === "failed" && (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-[#d0342c]/40 bg-[#d0342c]/[0.07] p-4 text-sm">
          <CircleAlert size={18} className="mt-0.5 shrink-0 text-[#c22d25] dark:text-[#ff9f93]" aria-hidden="true" />
          <div>
            <p>{failure}</p>
            {hasWa && (
              <a href={followUp} target="_blank" rel="noopener noreferrer" className="link mt-1 inline-block">
                Send these details on WhatsApp instead
              </a>
            )}
          </div>
        </div>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={status === "sending"}>
        <Send size={17} aria-hidden="true" /> {status === "sending" ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="text-center text-sm text-muted">Your details are used only to respond to this enquiry.</p>
    </form>
  );
}
