import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { LocationCard, MapEmbed } from "@/components/blocks";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero, Placeholder, WaButton, WhatsAppIcon } from "@/components/ui";
import { getSettings, getTimetable } from "@/lib/content";
import { normaliseIndianMobile, slotDays, slotTime, waLink, WA_MESSAGES } from "@/lib/format";

export const metadata: Metadata = {
  title: "Location & Contact",
  description: "Contact Siddhu Mathematics Classes on WhatsApp, send an enquiry for Class XI or XII Mathematics, and get directions to the classroom.",
  alternates: { canonical: "/contact" },
};

export default async function Contact() {
  const [settings, timetable] = await Promise.all([getSettings(), getTimetable()]);
  const wa = waLink(settings.whatsapp, WA_MESSAGES.home);
  const waNumber = normaliseIndianMobile(settings.whatsapp);
  return (
    <>
      <PageHero title="Let's Connect." subtitle="Ask about a batch, the syllabus or admission. WhatsApp is the quickest way to reach the teacher." />

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-bold">{settings.brandName}</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              <div className="flex gap-4 py-5">
                <span className="mt-0.5 text-[#17694a] dark:text-[#6fd0a6]"><WhatsAppIcon size={20} /></span>
                <div>
                  <dt className="text-sm text-muted">WhatsApp</dt>
                  <dd className="font-medium">{waNumber ? `+91 ${waNumber.slice(0, 5)} ${waNumber.slice(5)}` : <Placeholder>Number to be updated – please use the enquiry form</Placeholder>}</dd>
                </div>
              </div>
              <div className="flex gap-4 py-5">
                <Phone size={20} className="mt-0.5 text-goldink" aria-hidden="true" />
                <div>
                  <dt className="text-sm text-muted">Phone</dt>
                  <dd className="font-medium">
                    {settings.phone ? <a className="link" href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a> : <Placeholder>Number to be updated</Placeholder>}
                  </dd>
                </div>
              </div>
              <div className="flex gap-4 py-5">
                <MapPin size={20} className="mt-0.5 text-goldink" aria-hidden="true" />
                <div>
                  <dt className="text-sm text-muted">Location</dt>
                  <dd className="font-medium">
                    {settings.address || <Placeholder>Address to be updated</Placeholder>}
                    <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="link mt-1 block font-normal">Open in Google Maps</a>
                  </dd>
                </div>
              </div>
            </dl>

            <h3 className="mt-10 font-display text-lg font-bold">Classes</h3>
            <ul className="mt-3 space-y-4">
              {(["XI", "XII"] as const).map((cls) => (
                <li key={cls} className="card p-4">
                  <p className={`tag tag-${cls}`}>Class {cls} Mathematics</p>
                  <ul className="mt-2.5 space-y-1 text-[0.95rem]">
                    {timetable.slots.filter((s) => s.cls === cls).map((s) => (
                      <li key={s.id} className="flex flex-wrap justify-between gap-x-4">
                        <span className="text-muted">{slotDays(s)}</span>
                        <span className="font-semibold tabular-nums">{slotTime(s)}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <WaButton href={wa} className="mt-8">Contact on WhatsApp</WaButton>
          </div>

          <div id="enquiry" className="scroll-mt-24">
            <h2 className="font-display text-2xl font-bold">Send an enquiry</h2>
            <p className="mb-6 mt-2 text-muted">Share the student&apos;s details and you will be contacted on WhatsApp.</p>
            <EnquiryForm timetable={timetable} whatsapp={settings.whatsapp} />
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-surface">
        <div className="wrap">
          <h2 className="h2 mb-10">Find Your Classroom.</h2>
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <MapEmbed settings={settings} className="min-h-[380px]" />
            <LocationCard settings={settings} />
          </div>
        </div>
      </section>
    </>
  );
}
