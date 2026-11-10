"use client";

import { useState } from "react";
import { api, CollectionManager } from "@/components/admin/kit";
import { CATEGORIES } from "@/lib/types";

function SyncButton({ reload, say }: { reload: () => void; say: (m: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const r = await api<{ added: number; found: number }>("/api/admin/sync-drive", { method: "POST" });
          say(r.added ? `Imported ${r.added} new PDF${r.added === 1 ? "" : "s"} from Google Drive as unpublished. Publish the ones you want students to see.` : `Google Drive checked – all ${r.found} files are already in the library.`);
          reload();
        } catch (e) {
          say((e as Error).message);
        }
        setBusy(false);
      }}
    >
      {busy ? "Checking Drive…" : "Import new PDFs from Google Drive"}
    </button>
  );
}

export default function Resources() {
  return (
    <CollectionManager
      collection="resources"
      title="Study materials"
      intro="PDFs shown in the notes library. Upload a file, or paste the share link of a PDF in your public Google Drive folder."
      addLabel="Add study material"
      defaults={{ title: "", cls: "XI", chapter: "", category: CATEGORIES[0], description: "", driveId: "", fileUrl: "", published: true }}
      headerActions={(reload, say) => <SyncButton reload={reload} say={say} />}
      primary={(i) => String(i.title)}
      secondary={(i) => `${i.cls === "JEE" ? "JEE" : `Class ${i.cls}`} · ${i.chapter || "No chapter"} · ${i.category}${i.published ? "" : " · Not published"}`}
      fields={[
        { name: "title", label: "Resource title", type: "text" },
        { name: "cls", label: "Class", type: "select", options: [{ value: "XI", label: "Class XI" }, { value: "XII", label: "Class XII" }, { value: "JEE", label: "JEE Notes" }] },
        { name: "chapter", label: "Chapter name", type: "text" },
        { name: "category", label: "Category", type: "select", options: [...CATEGORIES] },
        { name: "description", label: "Description (optional)", type: "textarea" },
        { name: "fileUrl", label: "PDF file", type: "file", accept: "application/pdf", help: "Up to 25 MB (about 4 MB on Vercel's free plan – use a Drive link for larger files)." },
        { name: "driveId", label: "…or Google Drive link", type: "text", placeholder: "https://drive.google.com/file/d/…/view", help: "The file must be shared as “Anyone with the link”." },
        { name: "published", label: "Published", type: "checkbox", help: "visible on the website" },
      ]}
    />
  );
}
