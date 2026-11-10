"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronDown, Compass, FileText, MapPin, Menu, Moon, Sun, X } from "lucide-react";
import { MORE_NAV, NAV } from "@/lib/site";
import type { Settings } from "@/lib/types";
import { Logo, WhatsAppIcon } from "./ui";

type Chrome = { settings: Pick<Settings, "logoUrl" | "brandName">; wa: string; mapsUrl: string };

function ThemeToggle() {
  const toggle = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("smc-theme", next);
    } catch {}
  };
  return (
    <button type="button" onClick={toggle} aria-label="Switch between light and dark theme" className="grid h-11 w-11 place-items-center rounded-md border border-line hover:border-ink">
      <Sun size={18} className="hidden dark:block" aria-hidden="true" />
      <Moon size={18} className="dark:hidden" aria-hidden="true" />
    </button>
  );
}

export function Banner({ text }: { text: string }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("smc-banner") === text) setOpen(false);
    } catch {}
  }, [text]);
  if (!open) return null;
  return (
    <div data-banner className="relative z-50 bg-deep text-ivory">
      <div className="wrap flex items-center justify-between gap-4 py-2 text-sm">
        <Link href="/timetable" className="underline-offset-4 hover:underline">
          {text}
        </Link>
        <button
          type="button"
          aria-label="Dismiss notice"
          className="grid h-8 w-8 shrink-0 place-items-center rounded hover:bg-white/10"
          onClick={() => {
            setOpen(false);
            try {
              sessionStorage.setItem("smc-banner", text);
            } catch {}
          }}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function Header({ settings }: Chrome) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [more, setMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setMenu(false);
    setMore(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setMenu(false), setMore(false));
    const onClick = (e: MouseEvent) => moreRef.current && !moreRef.current.contains(e.target as Node) && setMore(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [menu]);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const moreActive = MORE_NAV.some((n) => active(n.href));

  return (
    <header
      className={`sticky top-0 z-40 -mb-[4.5rem] transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid || menu ? "border-b border-line bg-bg/92 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" aria-label="S.M.C – Siddhu Mathematics Classes, home" className="shrink-0">
          <span className="hidden sm:inline-flex lg:hidden xl:inline-flex"><Logo settings={settings} /></span>
          <span className="sm:hidden lg:inline-flex xl:hidden"><Logo settings={settings} compact /></span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-md px-2.5 py-2 text-[0.92rem] font-medium transition-colors hover:text-blue ${
                active(n.href) ? "text-blue underline decoration-gold decoration-2 underline-offset-8" : ""
              }`}
            >
              {n.label}
            </Link>
          ))}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              aria-expanded={more}
              aria-controls="more-menu"
              onClick={() => setMore((v) => !v)}
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-[0.92rem] font-medium hover:text-blue ${moreActive ? "text-blue" : ""}`}
            >
              More <ChevronDown size={15} className={`transition-transform ${more ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {more && (
                <motion.div
                  id="more-menu"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="card absolute right-0 top-full mt-2 w-60 p-2 shadow-[0_18px_40px_-18px_rgba(16,28,53,.35)]"
                >
                  {MORE_NAV.map((n) => (
                    <Link key={n.href} href={n.href} className="block rounded-md px-3 py-2.5 text-[0.92rem] hover:bg-raise">
                      {n.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/contact#enquiry" className="btn btn-primary btn-sm hidden whitespace-nowrap sm:inline-flex">
            Enquire Now
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-md border border-line lg:hidden"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu((v) => !v)}
          >
            {menu ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-bg lg:hidden"
            style={{ height: "calc(100dvh - 4.5rem)" }}
          >
            <div className="wrap flex flex-col gap-1 pb-10 pt-4">
              {[...NAV, ...MORE_NAV].map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.025 * i }}>
                  <Link
                    href={n.href}
                    aria-current={active(n.href) ? "page" : undefined}
                    className={`flex min-h-12 items-center border-b border-line font-display text-lg font-semibold ${active(n.href) ? "text-blue" : ""}`}
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <Link href="/contact#enquiry" className="btn btn-primary mt-6">
                Enquire Now
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Floating WhatsApp button + compact quick-access panel, on every page. */
export function FloatingDock({ wa, mapsUrl }: Pick<Chrome, "wa" | "mapsUrl">) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  const waExternal = wa.startsWith("http");
  const items = [
    { href: "/timetable", label: "View Timetable", icon: CalendarDays },
    { href: "/study-material", label: "Download Notes", icon: FileText },
    { href: mapsUrl, label: "Find Location", icon: MapPin, external: true },
  ];
  return (
    <div data-dock className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            id="quick-panel"
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="card w-60 origin-bottom-right p-2 shadow-[0_18px_40px_-14px_rgba(16,28,53,.4)]"
          >
            {items.map((it) =>
              it.external ? (
                <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 rounded-md px-3 text-[0.92rem] hover:bg-raise">
                  <it.icon size={17} className="text-goldink" aria-hidden="true" /> {it.label}
                </a>
              ) : (
                <Link key={it.label} href={it.href} className="flex min-h-11 items-center gap-3 rounded-md px-3 text-[0.92rem] hover:bg-raise">
                  <it.icon size={17} className="text-goldink" aria-hidden="true" /> {it.label}
                </Link>
              ),
            )}
            <a href={wa} {...(waExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex min-h-11 items-center gap-3 rounded-md px-3 text-[0.92rem] hover:bg-raise">
              <span className="text-[#17694a] dark:text-[#6fd0a6]"><WhatsAppIcon size={17} /></span> WhatsApp Teacher
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="quick-panel"
          aria-label="Quick access"
          className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface shadow-[0_8px_24px_-10px_rgba(16,28,53,.45)] hover:border-ink"
        >
          {open ? <X size={19} aria-hidden="true" /> : <Compass size={19} aria-hidden="true" />}
        </button>
        <a
          href={wa}
          {...(waExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label="Chat on WhatsApp"
          className="flex h-14 items-center gap-2 rounded-full bg-[#17694a] px-4 text-white shadow-[0_10px_28px_-10px_rgba(23,105,74,.8)] transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon size={24} />
          <span className="hidden pr-1 font-display text-sm font-semibold md:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
