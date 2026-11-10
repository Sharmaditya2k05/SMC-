import type { Metadata } from "next";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { ClassTimeCard, LocationCard, MapEmbed } from "@/components/blocks";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero, Placeholder, WaButton, WhatsAppIcon } from "@/components/ui";
import { getSettings, getTimetable } from "@/lib/content";
import { normaliseIndianMobile, waLink, WA_MESSAGES } from "@/lib/format";

export const metadata: Metadata = {
  title: "Location & Contact",
  description: "Contact Siddhu Sir at Siddhu Mathematics Classes on WhatsApp, send an enquiry for Class XI or XII Mathematics, and get directions to the classroom.",
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
          </div>

          <div id="enquiry" className="card scroll-mt-28 p-6 md:p-8">
            <h2 className="bar-title mb-5 text-2xl">Send an enquiry</h2>
            <EnquiryForm timetable={timetable} whatsapp={settings.whatsapp} teacher={settings.teacherShortName || "The teacher"} />
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
