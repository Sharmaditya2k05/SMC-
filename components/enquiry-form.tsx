"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { normaliseIndianMobile, slotDays, slotTime, waLink } from "@/lib/format";
import type { Timetable } from "@/lib/types";
import { WaButton } from "./ui";

type Errors = Partial<Record<"student" | "whatsapp" | "cls", string>>;

export function EnquiryForm({ timetable, whatsapp }: { timetable: Timetable; whatsapp: string }) {
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
    if (!normaliseIndianMobile(form.whatsapp)) e.whatsapp = "Enter a valid 10-digit Indian mobile number, for example 98765 43210.";
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
    `Hello, I have sent an enquiry on the website for ${form.student || "a student"} (Class ${form.cls || "XI/XII"} Mathematics). Please share the details.`,
  );
  const hasWa = followUp.startsWith("http");

  if (status === "sent") {
    return (
      <div className="card p-6 md:p-8" role="status">
        <CheckCircle2 size={36} className="text-[#17694a] dark:text-[#6fd0a6]" aria-hidden="true" />
        <h3 className="mt-4 font-display text-2xl font-bold">Enquiry sent</h3>
        <p className="mt-2 text-muted">
          Thank you, {form.student.trim()}. Your details for Class {form.cls} Mathematics have been received and you will be contacted on {normaliseIndianMobile(form.whatsapp)}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {hasWa && <WaButton href={followUp}>Follow up on WhatsApp</WaButton>}
          <button type="button" className="btn btn-outline" onClick={() => (setStatus("idle"), setForm((f) => ({ ...f, student: "", message: "" })))}>
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="card grid gap-5 p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">
          <span>Student name</span>
          <input id="enq-student" className="input" value={form.student} onChange={set("student")} autoComplete="name" aria-invalid={!!errors.student} aria-describedby={errors.student ? "err-student" : undefined} />
          {errors.student && <p id="err-student" className="err">{errors.student}</p>}
        </label>
        <label className="field">
          <span>Parent name <em className="font-normal not-italic text-muted">(optional)</em></span>
          <input className="input" value={form.parent} onChange={set("parent")} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">
          <span>WhatsApp number</span>
          <input id="enq-whatsapp" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" value={form.whatsapp} onChange={set("whatsapp")} aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? "err-whatsapp" : undefined} />
          {errors.whatsapp && <p id="err-whatsapp" className="err">{errors.whatsapp}</p>}
        </label>
        <label className="field">
          <span>Class</span>
          <select id="enq-cls" className="input" value={form.cls} onChange={set("cls")} aria-invalid={!!errors.cls} aria-describedby={errors.cls ? "err-cls" : undefined}>
            <option value="">Select class</option>
            <option value="XI">Class XI</option>
            <option value="XII">Class XII</option>
          </select>
          {errors.cls && <p id="err-cls" className="err">{errors.cls}</p>}
        </label>
      </div>
      <label className="field">
        <span>Preferred batch <em className="font-normal not-italic text-muted">(optional)</em></span>
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
        <span>Message <em className="font-normal not-italic text-muted">(optional)</em></span>
        <textarea className="input min-h-28" value={form.message} onChange={set("message")} maxLength={1500} />
      </label>
      {/* honeypot – hidden from people, attractive to bots */}
      <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {status === "failed" && (
        <div role="alert" className="flex items-start gap-3 rounded-md border border-[#b3392c]/40 bg-[#b3392c]/8 p-4 text-sm">
          <CircleAlert size={18} className="mt-0.5 shrink-0 text-[#b3392c] dark:text-[#ff9f93]" aria-hidden="true" />
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
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send Enquiry"}
        </button>
        <p className="text-sm text-muted">Your details are used only to respond to this enquiry.</p>
      </div>
    </form>
  );
}
