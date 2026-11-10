"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { api, Notice, PageTitle } from "@/components/admin/kit";

export default function PasswordAdmin() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setNote(null);
    if (next.length < 8) return setNote({ kind: "error", text: "The new password must be at least 8 characters." });
    if (next !== confirm) return setNote({ kind: "error", text: "The new password and its confirmation do not match." });
    setSaving(true);
    try {
      await api("/api/admin/password", { method: "POST", json: { current, next } });
      setNote({ kind: "ok", text: "Password changed. Use the new password the next time you sign in." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (x) {
      setNote({ kind: "error", text: (x as Error).message });
    }
    setSaving(false);
  }

  const type = show ? "text" : "password";
  return (
    <>
      <PageTitle title="Admin password" intro="Change the password used to sign in to this dashboard. The username stays the same." />
      {note && <Notice kind={note.kind}>{note.text}</Notice>}
      <form onSubmit={save} className="card grid max-w-lg gap-5 p-5 md:p-7">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--xii-soft)] text-accent">
          <KeyRound size={24} aria-hidden="true" />
        </span>
        <label className="field">
          <span>Current password</span>
          <input className="input" type={type} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
        </label>
        <label className="field">
          <span>New password</span>
          <input className="input" type={type} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" minLength={8} required />
          <p className="mt-1.5 text-sm text-muted">At least 8 characters. A longer phrase that is not your phone number is harder to guess.</p>
        </label>
        <label className="field">
          <span>Confirm new password</span>
          <input className="input" type={type} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
        </label>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="h-5 w-5 accent-[#F5861F]" /> Show passwords
        </label>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Change password"}</button>
      </form>
    </>
  );
}
