"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays, FileText, Image as ImageIcon, LayoutDashboard, LogOut, Megaphone, Settings, Trophy, ArrowUp, ArrowDown,
} from "lucide-react";

/* ---------- API helper: every call re-checks the session on the server ---------- */
export async function api<T = Record<string, unknown>>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await fetch(path, {
    ...init,
    ...(init?.json !== undefined ? { body: JSON.stringify(init.json), headers: { "Content-Type": "application/json" } } : {}),
  });
  if (res.status === 401 && !path.endsWith("/session")) {
    window.location.href = "/admin/login";
    throw new Error("Signed out.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data as T;
}

export async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  return (await api<{ url: string }>("/api/admin/upload", { method: "POST", body })).url;
}

/* ---------- layout ---------- */
const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/resources", label: "Study materials", icon: FileText },
  { href: "/admin/timetable", label: "Timetable", icon: CalendarDays },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/stories", label: "Results & testimonials", icon: Trophy },
  { href: "/admin/settings", label: "Website settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = async () => {
    await api("/api/admin/session", { method: "DELETE" }).catch(() => {});
    window.location.href = "/admin/login";
  };
  const item = "flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 font-display text-[0.9rem] font-semibold transition-colors";
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* charcoal sidebar, like the site's dark sections */}
      <aside className="relative overflow-hidden bg-deep text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-[17rem] lg:shrink-0 lg:flex-col">
        <div className="flex items-center justify-between gap-4 p-4 lg:p-5">
          <Link href="/admin" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/smc-bulb.png" alt="" className="h-11 w-11 rounded-full bg-[#FBF6F3] object-cover" />
            <span className="leading-none">
              <span className="block font-display text-2xl font-extrabold tracking-[-0.04em]">SMC</span>
              <span className="mt-1 block font-display text-[0.6rem] font-bold tracking-[0.2em] text-[#FFA54A]">ADMIN</span>
            </span>
          </Link>
          <Link href="/" className="text-sm text-white/75 underline underline-offset-4 lg:hidden">View site</Link>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible">
          {LINKS.map((l) => {
            const on = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={on ? "page" : undefined} className={`${item} ${on ? "bg-[#F5861F] text-[#16171B]" : "text-white/80 hover:bg-white/10 hover:text-white"}`}>
                <l.icon size={17} aria-hidden="true" /> {l.label}
              </Link>
            );
          })}
          <div className="hidden lg:mt-auto lg:block lg:border-t lg:border-white/15 lg:pt-3">
            <Link href="/" target="_blank" className={`${item} text-white/80 hover:bg-white/10 hover:text-white`}>View website</Link>
          </div>
          <button type="button" onClick={logout} className={`${item} text-white/80 hover:bg-white/10 hover:text-white lg:mb-3`}>
            <LogOut size={17} aria-hidden="true" /> Sign out
          </button>
        </nav>
      </aside>
      <main className="grid-paper min-w-0 flex-1 p-5 md:p-8 lg:p-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

export function PageTitle({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="bar-title text-3xl">{title}</h1>
        {intro && <p className="mt-1.5 max-w-2xl text-muted">{intro}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Notice({ kind, children }: { kind: "ok" | "error"; children: React.ReactNode }) {
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`mb-5 rounded-md border px-4 py-3 text-sm ${kind === "error" ? "border-[#b3392c]/40 bg-[#b3392c]/8" : "border-[#17694a]/40 bg-[#17694a]/8"}`}>
      {children}
    </p>
  );
}

/* ---------- generic collection manager ---------- */
export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "file" | "number";
  options?: string[] | { value: string; label: string }[];
  accept?: string;
  help?: string;
  placeholder?: string;
};
type Item = { id: string; createdAt?: string; published?: boolean; order?: number } & Record<string, unknown>;

export function useCollection(collection: string) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setItems((await api<{ items: Item[] }>(`/api/admin/${collection}`)).items);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, [collection]);
  useEffect(() => {
    load();
  }, [load]);
  return { items, error, load, setError };
}

export function FieldInput({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  if (f.type === "checkbox")
    return (
      <label className="flex min-h-11 items-center gap-3">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-[var(--blue)]" />
        <span className="font-medium">{f.label}</span>
        {f.help && <span className="text-sm text-muted">– {f.help}</span>}
      </label>
    );
  return (
    <label className="field">
      <span>{f.label}</span>
      {f.type === "textarea" && <textarea className="input min-h-28" value={String(value ?? "")} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />}
      {(f.type === "text" || f.type === "number") && (
        <input className="input" type={f.type} value={String(value ?? "")} placeholder={f.placeholder} onChange={(e) => onChange(f.type === "number" ? Number(e.target.value) : e.target.value)} />
      )}
      {f.type === "select" && (
        <select className="input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {f.options?.map((o) => {
            const opt = typeof o === "string" ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
      )}
      {f.type === "file" && (
        <div className="space-y-2">
          <input
            type="file"
            accept={f.accept}
            className="input py-2"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setErr("");
              try {
                onChange(await uploadFile(file));
              } catch (x) {
                setErr((x as Error).message);
              }
              setBusy(false);
            }}
          />
          {busy && <p className="text-sm text-muted">Uploading…</p>}
          {err && <p className="err">{err}</p>}
          {value ? (
            <p className="flex flex-wrap items-center gap-3 text-sm">
              <a href={String(value)} target="_blank" rel="noopener noreferrer" className="link break-all">Current file</a>
              <button type="button" className="text-muted underline" onClick={() => onChange("")}>Remove</button>
            </p>
          ) : null}
        </div>
      )}
      {f.help && <p className="mt-1.5 text-sm text-muted">{f.help}</p>}
    </label>
  );
}

export function CollectionManager({
  collection, title, intro, fields, defaults, primary, secondary, addLabel, reorder = false, headerActions, thumb,
}: {
  collection: string;
  title: string;
  intro?: string;
  fields: Field[];
  defaults: Record<string, unknown>;
  primary: (i: Item) => React.ReactNode;
  secondary?: (i: Item) => React.ReactNode;
  addLabel: string;
  reorder?: boolean;
  headerActions?: (reload: () => void, say: (m: string) => void) => React.ReactNode;
  thumb?: (i: Item) => string | undefined;
}) {
  const { items, error, load, setError } = useCollection(collection);
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const sorted = items && reorder ? [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : items;

  async function run(fn: () => Promise<unknown>, done?: string) {
    setError("");
    setMessage("");
    try {
      await fn();
      await load();
      if (done) setMessage(done);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    const ok = await run(
      () => api(isNew ? `/api/admin/${collection}` : `/api/admin/${collection}/${editing.id}`, { method: isNew ? "POST" : "PUT", json: editing }),
      "Saved.",
    );
    setSaving(false);
    if (ok) setEditing(null);
  }

  async function move(i: number, d: number) {
    if (!sorted) return;
    const a = sorted[i], b = sorted[i + d];
    if (!b) return;
    const order = sorted.map((x, n) => ({ id: x.id, order: n }));
    order[i].order = i + d;
    order[i + d].order = i;
    await run(() => Promise.all([a, b].map((x) => api(`/api/admin/${collection}/${x.id}`, { method: "PUT", json: { order: order.find((o) => o.id === x.id)!.order } }))));
  }

  return (
    <>
      <PageTitle title={title} intro={intro}>
        {headerActions?.(load, setMessage)}
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing({ id: "", ...defaults, ...(reorder ? { order: items?.length ?? 0 } : {}) })}>
          {addLabel}
        </button>
      </PageTitle>
      {error && <Notice kind="error">{error}</Notice>}
      {message && <Notice kind="ok">{message}</Notice>}

      {editing && (
        <form onSubmit={save} className="card mb-8 grid gap-5 p-5 md:p-7">
          <h2 className="font-display text-xl font-bold">{editing.id ? "Edit" : addLabel}</h2>
          {fields.map((f) => (
            <FieldInput key={f.name} f={f} value={editing[f.name]} onChange={(v) => setEditing((s) => (s ? { ...s, [f.name]: v } : s))} />
          ))}
          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      {!sorted ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-16" />)}</div>
      ) : sorted.length === 0 ? (
        <p className="card p-10 text-center text-muted">Nothing here yet. Use “{addLabel}” to add the first one.</p>
      ) : (
        <ul className="card divide-y divide-line">
          {sorted.map((it, i) => (
            <li key={it.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              {thumb?.(it) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb(it)} alt="" className="h-14 w-14 shrink-0 rounded object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{primary(it)}</p>
                {secondary && <p className="mt-0.5 text-sm text-muted">{secondary(it)}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {reorder && (
                  <>
                    <button type="button" className="btn btn-outline btn-sm px-2.5" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={16} aria-hidden="true" /></button>
                    <button type="button" className="btn btn-outline btn-sm px-2.5" aria-label="Move down" disabled={i === sorted.length - 1} onClick={() => move(i, 1)}><ArrowDown size={16} aria-hidden="true" /></button>
                  </>
                )}
                {"published" in it && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => run(() => api(`/api/admin/${collection}/${it.id}`, { method: "PUT", json: { published: !it.published } }))}>
                    {it.published ? "Unpublish" : "Publish"}
                  </button>
                )}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => (setEditing(it), window.scrollTo({ top: 0, behavior: "smooth" }))}>Edit</button>
                {confirm === it.id ? (
                  <>
                    <button type="button" className="btn btn-sm bg-[#b3392c] text-white" onClick={() => (setConfirm(null), run(() => api(`/api/admin/${collection}/${it.id}`, { method: "DELETE" }), "Deleted."))}>Confirm delete</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirm(null)}>Keep</button>
                  </>
                ) : (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirm(it.id)}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export const fmtDate = (iso?: string) =>
  iso ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(iso)) : "";
