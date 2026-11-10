import type { Metadata } from "next";
import { ArrowUpRight, MapPin, Navigation, Phone } from "lucide-react";
import { MapEmbed } from "@/components/blocks";
import { PageHero, Placeholder, WaButton, WhatsAppIcon } from "@/components/ui";
import { getSettings } from "@/lib/content";
import { normaliseIndianMobile, waLink, WA_MESSAGES } from "@/lib/format";

export const metadata: Metadata = {
  title: "Location & Contact",
  description: "Contact Siddhu Sir at Siddhu Mathematics Classes on WhatsApp about Class XI or XII Mathematics, and get directions to the classroom.",
  alternates: { canonical: "/contact" },
};

/** The one place for contact details: WhatsApp, phone and the classroom location. */
export default async function Contact() {
  const settings = await getSettings();
  const n = normaliseIndianMobile(settings.whatsapp);
  const sir = settings.teacherShortName || "the teacher";
  const socials = [
    { label: "Instagram", href: settings.instagram },
    { label: "Facebook", href: settings.facebook },
    { label: "YouTube", href: settings.youtube },
  ].filter((s) => s.href);

  return (
    <>
      <PageHero title={<>Let&apos;s <em className="hi">Connect.</em></>} subtitle={`Ask about a batch, the syllabus or admission. WhatsApp is the quickest way to reach ${sir}.`} />

      <section className="section">
        <div className="wrap grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="card flex flex-col p-6 md:p-8">
            <h2 className="bar-title text-2xl">Message {sir} on WhatsApp</h2>
            <p className="mt-3 pl-4 text-muted">
              Pick the class and WhatsApp opens with your message ready. Add the student&apos;s name and school before you send.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <WaButton href={waLink(settings.whatsapp, WA_MESSAGES.XI)}>Class XI</WaButton>
              <WaButton href={waLink(settings.whatsapp, WA_MESSAGES.XII)}>Class XII</WaButton>
            </div>

            <dl className="mt-7 divide-y divide-line border-t border-line">
              <div className="flex items-center gap-5 py-4">
                <span className="text-[#1faa53]"><WhatsAppIcon size={26} /></span>
                <div>
                  <dt className="text-sm text-muted">WhatsApp and phone</dt>
                  <dd className="font-display text-lg font-bold tabular-nums">
                    {n ? <a href={`tel:+91${n}`} className="hover:underline">+91 {n.slice(0, 5)} {n.slice(5)}</a> : <Placeholder />}
                  </dd>
                </div>
                {settings.phone && (
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn btn-outline btn-sm ml-auto"><Phone size={15} aria-hidden="true" /> Call</a>
                )}
              </div>
              <div className="flex items-center gap-5 py-4">
                <MapPin size={26} className="shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-sm text-muted">Classroom</dt>
                  <dd className="font-medium">{settings.brandName}{settings.address ? `, ${settings.address}` : ""}</dd>
                </div>
              </div>
            </dl>

            {socials.length > 0 && (
              <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-4 text-sm">
                <span className="font-display font-bold">Follow</span>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                    {s.label} <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                ))}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <MapEmbed settings={settings} className="min-h-[340px] flex-1" />
            <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <Navigation size={17} aria-hidden="true" /> Get Directions in Google Maps
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
