"use client";

import Link from "next/link";
import { fmtDate, Notice, PageTitle, useCollection } from "@/components/admin/kit";

export default function Overview() {
  const enquiries = useCollection("enquiries");
  const resources = useCollection("resources");
  const announcements = useCollection("announcements");
  const error = enquiries.error || resources.error || announcements.error;

  const stats = [
    { label: "Total enquiries", value: enquiries.items?.length, href: "/admin/enquiries" },
    { label: "Awaiting a reply", value: enquiries.items?.filter((e) => !e.handled).length, href: "/admin/enquiries" },
    { label: "Published study resources", value: resources.items?.filter((r) => r.published).length, href: "/admin/resources" },
    { label: "Published announcements", value: announcements.items?.filter((a) => a.published).length, href: "/admin/announcements" },
  ];

  return (
    <>
      <PageTitle title="Overview" intro="What is new on the website, and the things you do most often." />
      {error && <Notice kind="error">{error}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card card-hover p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-serif text-5xl">{s.value ?? "–"}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-10 font-display text-lg font-bold">Quick actions</h2>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/resources" className="btn btn-primary btn-sm">Add study material</Link>
        <Link href="/admin/announcements" className="btn btn-outline btn-sm">Post an announcement</Link>
        <Link href="/admin/timetable" className="btn btn-outline btn-sm">Update timetable</Link>
        <Link href="/admin/settings" className="btn btn-outline btn-sm">Edit contact details</Link>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Recent enquiries</h2>
          {!enquiries.items ? (
            <div className="skeleton h-32" />
          ) : enquiries.items.length === 0 ? (
            <p className="card p-6 text-muted">No enquiries yet. They appear here as soon as someone submits the form on the Contact page.</p>
          ) : (
            <ul className="card divide-y divide-line">
              {enquiries.items.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{String(e.student)} <span className="text-muted">· Class {String(e.cls)}</span></p>
                    <p className="text-sm text-muted">{fmtDate(e.createdAt)}</p>
                  </div>
                  {!e.handled && <span className="tag tag-XII shrink-0">New</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Recent announcements</h2>
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
