"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/components/admin/kit";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/session", { method: "POST", json: { username, password } });
      window.location.href = "/admin";
    } catch (x) {
      setError((x as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="grid-paper grid min-h-dvh place-items-center p-5">
      <form onSubmit={submit} className="card w-full max-w-sm p-7 md:p-9">
        <p className="inline-block rounded-[4px_14px_4px_4px] bg-[var(--btn-bg)] px-2.5 py-1.5 font-serif text-[var(--btn-fg)]">S.M.C</p>
        <h1 className="mt-5 font-display text-2xl font-bold">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted">For the teacher only.</p>
        <div className="mt-6 grid gap-4">
          <label className="field">
            <span>Username</span>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          </label>
          <label className="field">
            <span>Password</span>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </label>
          {error && <p role="alert" className="err">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </div>
        <Link href="/" className="link mt-6 inline-block text-sm">Back to website</Link>
      </form>
    </main>
  );
}
