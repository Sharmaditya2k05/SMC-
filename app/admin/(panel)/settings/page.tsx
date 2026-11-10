"use client";

import { useEffect, useState } from "react";
import { api, FieldInput, Notice, PageTitle, type Field } from "@/components/admin/kit";
import type { Settings } from "@/lib/types";

const GROUPS: { title: string; note?: string; fields: Field[] }[] = [
  {
    title: "Contact",
    note: "WhatsApp buttons across the website start working as soon as a number is saved here.",
    fields: [
      { name: "whatsapp", label: "WhatsApp number", type: "text", placeholder: "10-digit mobile number", help: "Without +91. Used for every WhatsApp button." },
      { name: "phone", label: "Phone number shown on the website", type: "text", placeholder: "+91 …" },
      { name: "address", label: "Classroom address", type: "textarea" },
      { name: "mapsUrl", label: "Google Maps link", type: "text", help: "Used by “Get Directions” and “Open in Google Maps”." },
      { name: "mapsEmbedUrl", label: "Google Maps embed link", type: "text", help: "In Google Maps: Share → Embed a map → copy the link inside src=\"…\"." },
    ],
  },
  {
    title: "About the teacher",
    note: "Anything left empty shows as “To be updated” on the About page.",
    fields: [
      { name: "teacherName", label: "Teacher's full name (optional – shown in brackets after the name students use)", type: "text" },
      { name: "teacherShortName", label: "Name students use", type: "text", placeholder: "Siddhu Sir", help: "Used in buttons and sentences across the website." },
      { name: "portraitUrl", label: "Teacher photograph", type: "file", accept: "image/jpeg,image/png,image/webp", help: "A portrait (taller than wide) works best. Shown on the home and About pages." },
      { name: "experience", label: "Teaching experience", type: "text" },
      { name: "expertise", label: "Areas of expertise", type: "text" },
      { name: "approach", label: "Approach towards students", type: "textarea" },
      { name: "bio", label: "Biography", type: "textarea", help: "Leave a blank line between paragraphs." },
      { name: "philosophy", label: "Teaching philosophy (optional extra paragraph)", type: "textarea" },
      { name: "studentMessage", label: "A message for my students", type: "textarea" },
    ],
  },
  {
    title: "Brand",
    fields: [
      { name: "siteTheme", label: "Website theme", type: "select", options: [{ value: "light", label: "Light (warm white)" }, { value: "dark", label: "Dark (charcoal)" }], help: "Every visitor sees this theme. There is no switch on the website itself." },
      { name: "brandName", label: "Name", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "logoUrl", label: "Logo image", type: "file", accept: "image/png,image/webp,image/jpeg", help: "Optional. Without it, the S.M.C wordmark is used." },
    ],
  },
  {
    title: "Notice banner",
    fields: [
      { name: "bannerEnabled", label: "Show the banner at the top of the website", type: "checkbox" },
      { name: "bannerText", label: "Banner text", type: "text" },
    ],
  },
  {
    title: "Curriculum",
    note: "One module per line. These appear on the Courses page.",
    fields: [
      { name: "syllabusXI", label: "Class XI modules", type: "textarea" },
      { name: "syllabusXII", label: "Class XII modules", type: "textarea" },
    ],
  },
  {
    title: "Links",
    fields: [
      { name: "driveFolderUrl", label: "Google Drive folder for study material", type: "text", help: "Must be shared as “Anyone with the link”. Used by “Import new PDFs from Google Drive”." },
      { name: "instagram", label: "Instagram link", type: "text" },
      { name: "youtube", label: "YouTube link", type: "text" },
      { name: "facebook", label: "Facebook link", type: "text" },
    ],
  },
];

export default function SettingsAdmin() {
  const [s, setS] = useState<Settings | null>(null);
  const [driver, setDriver] = useState("");
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ settings: Settings; driver: string }>("/api/admin/site")
      .then((d) => (setS(d.settings), setDriver(d.driver)))
      .catch((e) => setNote({ kind: "error", text: e.message }));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api("/api/admin/site", { method: "PUT", json: { settings: s } });
      setNote({ kind: "ok", text: "Settings saved. The website updates within a minute." });
    } catch (x) {
      setNote({ kind: "error", text: (x as Error).message });
    }
    setSaving(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form onSubmit={save}>
      <PageTitle title="Website settings" intro="Contact details, the teacher's profile and other text used across the website.">
        <button type="submit" className="btn btn-primary btn-sm" disabled={!s || saving}>{saving ? "Saving…" : "Save settings"}</button>
      </PageTitle>
      {note && <Notice kind={note.kind}>{note.text}</Notice>}
      {driver === "local" && (
        <Notice kind="error">
          Storage is running in local file mode. This is fine on your own computer, but on a hosted website changes will not be kept – connect Supabase (see README) before going live.
        </Notice>
      )}
      {!s ? (
        <div className="skeleton h-96" />
      ) : (
        <div className="space-y-8">
          {GROUPS.map((g) => (
            <section key={g.title} className="card grid gap-5 p-5 md:p-7">
              <div>
                <h2 className="font-display text-xl font-bold">{g.title}</h2>
                {g.note && <p className="mt-1 text-sm text-muted">{g.note}</p>}
              </div>
              {g.fields.map((f) => (
                <FieldInput key={f.name} f={f} value={s[f.name as keyof Settings]} onChange={(v) => setS((cur) => cur && ({ ...cur, [f.name]: v }))} />
              ))}
            </section>
          ))}
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save settings"}</button>
        </div>
      )}
    </form>
  );
}
