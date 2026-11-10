"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { api, Notice, PageTitle } from "@/components/admin/kit";
import type { Settings } from "@/lib/types";

type Theme = "light" | "dark";

const THEMES: { value: Theme; name: string; text: string; bg: string; fg: string; card: string }[] = [
  { value: "light", name: "Light", text: "Warm white pages with charcoal text.", bg: "#FBF6F3", fg: "#16171B", card: "#FFFFFF" },
  { value: "dark", name: "Dark", text: "Charcoal pages with light text.", bg: "#16171B", fg: "#FBF6F3", card: "#22242A" },
];

/** One theme for the whole website. Visitors have no switch of their own. */
export default function ThemeAdmin() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState<Theme | null>(null);
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    api<{ settings: Settings }>("/api/admin/site")
      .then((d) => setSettings(d.settings))
      .catch((e) => setNote({ kind: "error", text: e.message }));
  }, []);

  const current: Theme = settings?.siteTheme === "dark" ? "dark" : "light";

  async function choose(theme: Theme) {
    if (!settings || saving || theme === current) return;
    setSaving(theme);
    setNote(null);
    try {
      const next = { ...settings, siteTheme: theme };
      await api("/api/admin/site", { method: "PUT", json: { settings: next } });
      setSettings(next);
      document.documentElement.dataset.theme = theme;
      setNote({ kind: "ok", text: `The website now uses the ${theme} theme. Visitors see it within a minute.` });
    } catch (x) {
      setNote({ kind: "error", text: (x as Error).message });
    }
    setSaving(null);
  }

  return (
    <>
      <PageTitle title="Website theme" intro="Choose how the website looks for every visitor. There is no theme switch on the website itself." />
      {note && <Notice kind={note.kind}>{note.text}</Notice>}
      {!settings ? (
        <div className="skeleton h-64" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {THEMES.map((t) => {
            const on = t.value === current;
            return (
              <button
                key={t.value}
                type="button"
                aria-pressed={on}
                disabled={saving !== null}
                onClick={() => choose(t.value)}
                className={`card overflow-hidden p-0 text-left transition-shadow ${on ? "ring-2 ring-[#F5861F]" : "hover:shadow-lg"}`}
              >
                {/* small picture of a page in this theme */}
                <div className="p-5" style={{ background: t.bg, color: t.fg }} aria-hidden="true">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-extrabold">SMC</span>
                    <span className="h-2.5 w-16 rounded-full" style={{ background: "#F5861F" }} />
                  </div>
                  <div className="mt-5 h-3 w-4/5 rounded-full" style={{ background: t.fg }} />
                  <div className="mt-2 h-3 w-3/5 rounded-full" style={{ background: t.fg, opacity: 0.85 }} />
                  <div className="mt-4 rounded-lg p-3" style={{ background: t.card }}>
                    <div className="h-2 w-2/3 rounded-full" style={{ background: t.fg, opacity: 0.45 }} />
                    <div className="mt-2 h-2 w-1/2 rounded-full" style={{ background: t.fg, opacity: 0.3 }} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-display text-xl font-bold">{t.name}</p>
                    <p className="mt-0.5 text-sm text-muted">{t.text}</p>
                  </div>
                  {on ? (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#F5861F] px-3 py-1.5 font-display text-sm font-bold text-[#16171B]">
                      <Check size={15} strokeWidth={3} aria-hidden="true" /> In use
                    </span>
                  ) : (
                    <span className="btn btn-outline btn-sm shrink-0">{saving === t.value ? "Saving…" : `Use ${t.name.toLowerCase()}`}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
