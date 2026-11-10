"use client";

import Link from "next/link";
import { fmtDate, Notice, PageTitle, useCollection } from "@/components/admin/kit";

export default function Overview() {
  const resources = useCollection("resources");
  const announcements = useCollection("announcements");
  const gallery = useCollection("gallery");
  const error = resources.error || announcements.error || gallery.error;

  const stats = [
    { label: "Notes on the website", value: resources.items?.filter((r) => r.published).length, href: "/admin/resources" },
    { label: "Notes not yet published", value: resources.items?.filter((r) => !r.published).length, href: "/admin/resources" },
    { label: "Published announcements", value: announcements.items?.filter((a) => a.published).length, href: "/admin/announcements" },
    { label: "Gallery photographs", value: gallery.items?.length, href: "/admin/gallery" },
  ];

  return (
    <>
      <PageTitle title="Overview" intro="What is on the website now, and the things you do most often. Enquiries arrive on WhatsApp, not here." />
      {error && <Notice kind="error">{error}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card card-hover border-t-4 border-t-[var(--accent)] p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-display text-5xl font-bold tracking-[-0.04em]">{s.value ?? "–"}</p>
          </Link>
        ))}
      </div>

      <h2 className="bar-title mb-3 mt-10 text-lg">Quick actions</h2>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/resources" className="btn btn-primary btn-sm">Add study material</Link>
        <Link href="/admin/announcements" className="btn btn-outline btn-sm">Post an announcement</Link>
        <Link href="/admin/timetable" className="btn btn-outline btn-sm">Update timetable</Link>
        <Link href="/admin/settings" className="btn btn-outline btn-sm">Edit contact details</Link>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-2">
        <section>
          <h2 className="bar-title mb-3 text-lg">Latest study material</h2>
          {!resources.items ? (
            <div className="skeleton h-32" />
          ) : resources.items.length === 0 ? (
            <p className="card p-6 text-muted">No notes yet. Add a PDF or import them from Google Drive.</p>
          ) : (
            <ul className="card divide-y divide-line">
              {resources.items.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{String(r.title)}</p>
                    <p className="text-sm text-muted">{r.cls === "JEE" ? "JEE" : `Class ${r.cls}`} · {String(r.chapter || "No chapter")}</p>
                  </div>
                  <span className={`tag shrink-0 ${r.published ? "tag-XII" : "tag-JEE"}`}>{r.published ? "Published" : "Hidden"}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="bar-title mb-3 text-lg">Recent announcements</h2>
          {!announcements.items ? (
            <div className="skeleton h-32" />
          ) : announcements.items.length === 0 ? (
            <p className="card p-6 text-muted">No announcements yet. Post one to tell students about new notes, tests or timetable changes.</p>
          ) : (
            <ul className="card divide-y divide-line">
              {announcements.items.slice(0, 5).map((a) => (
                <li key={a.id} className="p-4">
                  <p className="font-medium">{String(a.title)} {!a.published && <span className="text-sm text-muted">(draft)</span>}</p>
                  <p className="text-sm text-muted">{fmtDate(a.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
