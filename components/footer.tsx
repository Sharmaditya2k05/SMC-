import Link from "next/link";
import { MapPin } from "lucide-react";
import { waLink, WA_MESSAGES } from "@/lib/format";
import { MORE_NAV, NAV } from "@/lib/site";
import type { Settings } from "@/lib/types";
import { Logo, WhatsAppIcon } from "./ui";

export function Footer({ settings, year }: { settings: Settings; year: number }) {
  const wa = waLink(settings.whatsapp, WA_MESSAGES.home);
  const socials = [
    { label: "Instagram", href: settings.instagram },
    { label: "YouTube", href: settings.youtube },
    { label: "Facebook", href: settings.facebook },
  ].filter((s) => s.href);
  const col = "flex flex-col gap-2.5 text-[0.93rem] text-ivory/70";
  const a = "hover:text-ivory hover:underline underline-offset-4";
  return (
    <footer className="mt-auto bg-deep text-ivory">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo settings={settings} onNavy />
          <p className="mt-5 max-w-xs font-serif text-xl leading-snug text-ivory/90">{settings.tagline}</p>
        </div>
        <nav aria-label="Footer – pages" className={col}>
          <h2 className="mb-1 font-display text-sm font-bold text-gold">Explore</h2>
          {[...NAV, ...MORE_NAV].map((n) => (
            <Link key={n.href} href={n.href} className={a}>{n.label}</Link>
          ))}
        </nav>
        <nav aria-label="Footer – classes" className={col}>
          <h2 className="mb-1 font-display text-sm font-bold text-gold">Classes</h2>
          <Link href="/courses#class-xi" className={a}>Class XI Mathematics</Link>
          <Link href="/courses#class-xii" className={a}>Class XII Mathematics</Link>
          <Link href="/timetable" className={a}>Batch Timetable</Link>
          <Link href="/study-material" className={a}>Study Material</Link>
        </nav>
        <div className={col}>
          <h2 className="mb-1 font-display text-sm font-bold text-gold">Visit &amp; contact</h2>
          <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className={`${a} inline-flex items-start gap-2`}>
            <MapPin size={16} className="mt-1 shrink-0" aria-hidden="true" />
            <span>{settings.address || "Open classroom location in Google Maps"}</span>
          </a>
          <a href={wa} {...(wa.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${a} inline-flex items-center gap-2`}>
            <WhatsAppIcon size={16} /> Contact on WhatsApp
          </a>
          {settings.phone && <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className={a}>{settings.phone}</a>}
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={a}>{s.label}</a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-3 py-6 text-sm text-ivory/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} S.M.C – Siddhu Mathematics Classes. All rights reserved.</p>
          <p className="flex gap-5">
            <Link href="/privacy" className={a}>Privacy Policy</Link>
            <Link href="/terms" className={a}>Terms and Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
