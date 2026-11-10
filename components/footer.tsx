import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { normaliseIndianMobile, waLink, WA_MESSAGES } from "@/lib/format";
import type { Settings } from "@/lib/types";
import { Logo, WhatsAppIcon } from "./ui";

const QUICK = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/timetable", label: "Timetable" },
  { href: "/study-material", label: "Study Material" },
  { href: "/methodology", label: "Methodology" },
  { href: "/results", label: "Results" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ settings, year }: { settings: Settings; year: number }) {
  const wa = waLink(settings.whatsapp, WA_MESSAGES.home);
  const number = normaliseIndianMobile(settings.whatsapp);
  const socials = [
    { label: "Instagram", href: settings.instagram },
    { label: "YouTube", href: settings.youtube },
    { label: "Facebook", href: settings.facebook },
  ].filter((s) => s.href);
  const h = "mb-3 font-display text-[0.95rem] font-bold text-white";
  const a = "hover:text-white hover:underline underline-offset-4";
  return (
    <footer className="mt-auto bg-deep text-white/75">
      <div className="wrap grid gap-7 py-9 text-[0.9rem] md:gap-10 md:py-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_1.25fr_.8fr_1.5fr_1.2fr] lg:gap-0 lg:divide-x lg:divide-white/15 [&>*]:lg:px-6 [&>*:first-child]:lg:pl-0 [&>*:last-child]:lg:pr-0">
        <div className="text-white">
          <Logo settings={settings} />
          <p className="mt-5 max-w-[15rem] text-white/75">{settings.tagline}</p>
          {settings.teacherShortName && (
            <p className="mt-2 text-white/60">
              with {settings.teacherShortName}
              {settings.teacherName ? ` (${settings.teacherName})` : ""}
            </p>
          )}
        </div>
        <nav aria-label="Footer – quick links">
          <h2 className={h}>Quick Links</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {QUICK.map((n) => (
              <li key={n.href}><Link href={n.href} className={a}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer – classes" className="hidden lg:block">
          <h2 className={h}>Classes</h2>
          <ul className="space-y-2.5">
            {(["XI", "XII"] as const).map((c) => (
              <li key={c}>
                <Link href={`/courses#class-${c.toLowerCase()}`} className="group flex items-center gap-3 font-display font-semibold text-white">
                  <span className={`h-5 w-1.5 rounded-full ${c === "XI" ? "bg-white/45" : "bg-[#F5861F]"}`} aria-hidden="true" />
                  Class {c}
                  <ArrowRight size={15} className="ml-auto transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className={h}>Location</h2>
          <p className="flex gap-2.5">
            <MapPin size={18} className="mt-0.5 shrink-0 text-white" aria-hidden="true" />
            <span>
              {settings.brandName}
              {settings.address && <span className="block">{settings.address}</span>}
              <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 font-medium text-[#FFA54A] hover:underline">
                View on Google Maps <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </span>
          </p>
        </div>
        <div>
          <h2 className={h}>Get in Touch</h2>
          <a href={wa} {...(wa.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-start gap-2.5 font-display font-semibold text-white hover:underline">
            <span className="text-[#2bd46c]"><WhatsAppIcon size={22} /></span>
            <span>
              Chat on WhatsApp
              {number && <span className="block font-sans font-medium text-white/80">+91 {number.slice(0, 5)} {number.slice(5)}</span>}
            </span>
          </a>
          {socials.length > 0 && (
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-medium text-white/85">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={a}>{s.label}</a>
              ))}
            </p>
          )}
        </div>
      </div>
      <div className="wrap">
        <div className="flex flex-col gap-3 border-t border-white/15 py-5 text-sm md:flex-row md:items-center md:justify-between">
          <p>© {year} S.M.C – Siddhu Mathematics Classes. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <Link href="/privacy" className={a}>Privacy</Link>
            <span aria-hidden="true" className="text-white/30">|</span>
            <Link href="/terms" className={a}>Terms</Link>
            <span aria-hidden="true" className="text-white/30">|</span>
            <Link href="/terms#disclaimer" className={a}>Disclaimer</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
