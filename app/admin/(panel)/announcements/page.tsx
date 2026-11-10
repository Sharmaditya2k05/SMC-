"use client";

import { CollectionManager, fmtDate } from "@/components/admin/kit";

export default function Announcements() {
  return (
    <CollectionManager
      collection="announcements"
      title="Announcements"
      intro="Short notices shown on the home page – new notes, timetable changes, upcoming tests. The three most recent published notices are displayed."
      addLabel="Post an announcement"
      defaults={{ title: "", body: "", published: true }}
      primary={(i) => String(i.title)}
      secondary={(i) => `${fmtDate(i.createdAt)}${i.published ? "" : " · Draft"}`}
      fields={[
        { name: "title", label: "Title", type: "text", placeholder: "New notes uploaded for Integrals" },
        { name: "body", label: "Details (optional)", type: "textarea" },
        { name: "published", label: "Published", type: "checkbox", help: "visible on the website" },
      ]}
    />
  );
}
