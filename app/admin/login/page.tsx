"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { api } from "@/components/admin/kit";
import { Arc, EqEuler, EqIntegral, EqPythagoras, MiniSine } from "@/components/ui";

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
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_.95fr]">
      {/* brand panel */}
      <section className="relative hidden overflow-hidden bg-deep p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Arc className="-left-10 -top-6 w-[26rem]" flip />
        <Arc className="-bottom-16 right-0 w-[30rem]" />
        <div className="relative flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/smc-bulb.png" alt="" className="h-14 w-14 rounded-full bg-[#FBF6F3] object-cover" />
          <span className="leading-none">
            <span className="block font-display text-3xl font-extrabold tracking-[-0.04em]">SMC</span>
            <span className="mt-1 block font-display text-[0.55rem] font-bold tracking-[0.2em]">SIDDHU MATHEMATICS CLASSES</span>
          </span>
        </div>
        <div className="relative">
          <h2 className="font-display text-[clamp(2.2rem,3.6vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.04em]">
            Keep the website <em className="hi">up to date.</em>
          </h2>
          <p className="mt-5 max-w-md text-white/70">Reply to enquiries, publish notes, update the timetable and edit what students see – without touching any code.</p>
        </div>
        <div className="relative flex items-end justify-between text-white/60" aria-hidden="true">
          <span className="text-lg"><EqEuler /></span>
          <MiniSine className="w-32" />
          <span className="text-lg"><EqPythagoras /></span>
          <span><EqIntegral /></span>
        </div>
      </section>

      {/* sign-in */}
      <section className="grid-paper grid place-items-center p-5">
        <form onSubmit={submit} className="card w-full max-w-sm p-7 md:p-9">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--xii-soft)] text-accent">
            <LockKeyhole size={24} aria-hidden="true" />
          </span>
          <p className="eyebrow mt-6">Admin</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.035em]">Sign in</h1>
          <p className="mt-1 text-sm text-muted">For Siddhu Sir only.</p>
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
            <button type="submit" className="btn btn-primary mt-1" disabled={busy}>
              {busy ? "Signing in…" : <>Sign in <ArrowRight size={17} aria-hidden="true" /></>}
            </button>
          </div>
          <Link href="/" className="link mt-7 inline-flex items-center gap-1.5 text-sm">
            <ArrowLeft size={15} aria-hidden="true" /> Back to website
          </Link>
        </form>
      </section>
    </main>
  );
}
