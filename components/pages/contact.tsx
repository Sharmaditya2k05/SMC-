import type { Metadata } from "next";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { ClassTimeCard, LocationCard, MapEmbed, shortTime } from "@/components/blocks";
import { PageHero, Placeholder, WaButton, WhatsAppIcon } from "@/components/ui";
import { getSettings, getTimetable } from "@/lib/content";
import { normaliseIndianMobile, waLink, WA_MESSAGES } from "@/lib/format";

export const metadata: Metadata = {
  title: "Location & Contact",
  description: "Contact Siddhu Sir at Siddhu Mathematics Classes on WhatsApp about Class XI or XII Mathematics, and get directions to the classroom.",
  alternates: { canonical: "/contact" },
};

export default async function Contact() {
  const [settings, timetable] = await Promise.all([getSettings(), getTimetable()]);
  const wa = waLink(settings.whatsapp, WA_MESSAGES.home);
  const n = normaliseIndianMobile(settings.whatsapp);
  const sir = settings.teacherShortName || "the teacher";
  const row = "flex items-center gap-5 border-b border-line py-3.5";
  return (
    <>
      <PageHero title={<>Let&apos;s <em className="hi">Connect.</em></>} subtitle={`Ask about a batch, the syllabus or admission. WhatsApp is the quickest way to reach ${sir}.`} />

      <section className="section pt-10">
        <div className="wrap grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="card p-6 lg:sticky lg:top-28 lg:h-fit">
            <h2 className="bar-title text-2xl">{settings.brandName}</h2>
            {settings.teacherName && <p className="mt-1 pl-4 text-muted">with {settings.teacherShortName ? `${settings.teacherShortName} (${settings.teacherName})` : settings.teacherName}</p>}
            <dl className="mt-3">
              <div className={row}>
                <span className="text-[#1faa53]"><WhatsAppIcon size={30} /></span>
                <div>
                  <dt className="font-display text-sm font-bold">WhatsApp</dt>
                  <dd className="font-display text-lg font-bold tabular-nums">{n ? `+91 ${n.slice(0, 5)} ${n.slice(5)}` : <Placeholder>To be updated – please use the enquiry form</Placeholder>}</dd>
                </div>
              </div>
              <div className={row}>
                <Phone size={28} aria-hidden="true" />
                <div>
                  <dt className="font-display text-sm font-bold">Phone</dt>
                  <dd className="font-display text-lg font-bold tabular-nums">
                    {settings.phone ? <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:underline">{settings.phone}</a> : <Placeholder />}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-5 py-3.5">
                <MapPin size={30} className="fill-[var(--ink)] text-[var(--surface)]" aria-hidden="true" />
                <div>
                  <dt className="font-display text-sm font-bold">Location</dt>
                  <dd>
                    <span className="text-muted">{settings.address || <Placeholder>Address to be updated</Placeholder>}</span>
                    <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-semibold text-blue hover:underline">
                      Open in Google Maps <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <ClassTimeCard cls="XI" timetable={timetable} />
              <ClassTimeCard cls="XII" timetable={timetable} />
            </div>
            <WaButton href={wa} className="mt-5 w-full">Contact on WhatsApp</WaButton>
            {(settings.instagram || settings.facebook || settings.youtube) && (
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-display font-bold">Follow</span>
                {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="link">Instagram</a>}
                {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="link">Facebook</a>}
                {settings.youtube && <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="link">YouTube</a>}
              </p>
            )}
          </div>

          <div className="card relative overflow-hidden p-6 md:p-9">
            <h2 className="bar-title text-2xl">Message {sir} on WhatsApp</h2>
            <p className="mt-3 max-w-lg pl-4 text-muted">
              Choose the class and WhatsApp opens with your message ready to send. Add the student&apos;s name and school, and ask anything about batches, the syllabus or admission.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {(["XI", "XII"] as const).map((cls) => (
                <div key={cls} className="rounded-xl border border-line p-5">
                  <p><span className={`tag tag-${cls}`}>Class {cls}</span></p>
                  <p className="mt-3 font-display text-xl font-bold tracking-[-0.03em]">Class {cls} Mathematics</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {timetable.slots.filter((x) => x.cls === cls).map((x) => (
                      <li key={x.id} className="flex justify-between gap-3"><span>{x.days.join(", ")}</span><span className="font-semibold tabular-nums text-ink">{shortTime(x)}</span></li>
                    ))}
                  </ul>
                  <WaButton href={waLink(settings.whatsapp, WA_MESSAGES[cls])} className="mt-5 w-full">Enquire for Class {cls}</WaButton>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-4 rounded-xl bg-[var(--xii-soft)] p-5 sm:flex-row sm:items-center sm:justify-between">
              <p>
                <span className="block font-display font-bold">Prefer to call?</span>
                <span className="text-muted">{settings.phone ? "Phone and WhatsApp are on the same number." : "Use WhatsApp for the quickest reply."}</span>
              </p>
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn btn-outline shrink-0"><Phone size={17} aria-hidden="true" /> {settings.phone}</a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap">
          <h2 className="bar-title mb-6 text-[clamp(1.7rem,3vw,2.3rem)]">Find Your&nbsp;<em className="hi">Classroom.</em></h2>
          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <MapEmbed settings={settings} className="min-h-[320px]" />
            <LocationCard settings={settings} />
          </div>
        </div>
      </section>
    </>
  );
}
