"use client";

import { useState } from "react";
import { api, fmtDate, Notice, PageTitle, useCollection } from "@/components/admin/kit";
import { WhatsAppIcon } from "@/components/ui";

export default function Enquiries() {
  const { items, error, load, setError } = useCollection("enquiries");
  const [confirm, setConfirm] = useState<string | null>(null);

  const act = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      <PageTitle title="Enquiries" intro="Everyone who has submitted the enquiry form. Reply on WhatsApp, then mark the enquiry as replied." />
      {error && <Notice kind="error">{error}</Notice>}
      {!items ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-28" />)}</div>
      ) : items.length === 0 ? (
        <p className="card p-10 text-center text-muted">No enquiries yet. They appear here as soon as someone submits the form on the Contact page.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((e) => {
            const text = `Hello ${e.parent || e.student}, thank you for your enquiry about Class ${e.cls} Mathematics at Siddhu Mathematics Classes.`;
            return (
              <li key={e.id} className={`card p-5 ${e.handled ? "opacity-75" : "border-l-4 border-l-[var(--gold)]"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-bold">
                      {String(e.student)} <span className={`tag tag-${e.cls} ml-1 align-middle`}>Class {String(e.cls)}</span>
                    </p>
                    <p className="text-sm text-muted">{fmtDate(e.createdAt)}{e.handled ? " · Replied" : ""}</p>
                  </div>
                  <a href={`https://wa.me/91${e.whatsapp}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm">
                    <WhatsAppIcon size={16} /> Reply on WhatsApp
                  </a>
                </div>
                <dl className="mt-4 grid gap-x-8 gap-y-2 text-[0.95rem] sm:grid-cols-2">
                  <div><dt className="inline text-muted">WhatsApp: </dt><dd className="inline font-medium">+91 {String(e.whatsapp)}</dd></div>
                  {e.parent ? <div><dt className="inline text-muted">Parent: </dt><dd className="inline">{String(e.parent)}</dd></div> : null}
                  {e.batch ? <div className="sm:col-span-2"><dt className="inline text-muted">Preferred batch: </dt><dd className="inline">{String(e.batch)}</dd></div> : null}
                  {e.message ? <div className="sm:col-span-2"><dt className="text-muted">Message</dt><dd className="whitespace-pre-line">{String(e.message)}</dd></div> : null}
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => act(() => api(`/api/admin/enquiries/${e.id}`, { method: "PUT", json: { handled: !e.handled } }))}>
                    {e.handled ? "Mark as not replied" : "Mark as replied"}
                  </button>
                  {confirm === e.id ? (
                    <>
                      <button type="button" className="btn btn-sm bg-[#b3392c] text-white" onClick={() => (setConfirm(null), act(() => api(`/api/admin/enquiries/${e.id}`, { method: "DELETE" })))}>Confirm delete</button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirm(null)}>Keep</button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirm(e.id)}>Delete</button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
