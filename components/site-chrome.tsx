"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import type { Settings } from "@/lib/types";
import { softNav } from "./scroll-pager";
import { Logo, WhatsAppIcon } from "./ui";

type Chrome = { settings: Pick<Settings, "logoUrl" | "brandName">; wa: string; mapsUrl: string };

const COURSES = [
  { href: "/courses#class-xi", label: "Class XI Mathematics" },
  { href: "/courses#class-xii", label: "Class XII Mathematics" },
  { href: "/courses", label: "All courses" },
];
const MORE = [
  { href: "/methodology", label: "Learning Methodology" },
  { href: "/results", label: "Results & Achievements" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faqs", label: "FAQs" },
];
const MOBILE = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/timetable", label: "Timetable" },
  { href: "/study-material", label: "Study Material" },
  ...MORE,
  { href: "/contact", label: "Contact" },
];

function ThemeToggle() {
  const set = (theme: "light" | "dark") => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("smc-theme", theme);
    } catch {}
  };
  const cell = "grid h-9 w-9 place-items-center rounded-full transition-colors";
  return (
    <div role="group" aria-label="Colour theme" className="flex items-center rounded-full border border-line bg-surface p-0.5 shadow-[var(--shadow)]">
      <button type="button" onClick={() => set("light")} aria-label="Light theme" className={`${cell} bg-[#FFF1E1] text-[#F5861F] dark:bg-transparent dark:text-muted`}>
        <Sun size={17} aria-hidden="true" />
      </button>
      <button type="button" onClick={() => set("dark")} aria-label="Dark theme" className={`${cell} text-muted dark:bg-[#34363d] dark:text-white`}>
        <Moon size={16} aria-hidden="true" />
      </button>
    </div>
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
    <div data-banner className="relative z-50 hidden bg-deep text-white md:block">
      <div className="wrap flex items-center justify-between gap-4 py-1.5 text-sm">
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

function Dropdown({ label, items, active }: { label: string; items: { href: string; label: string }[]; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={`nav-link flex items-center gap-1 ${active ? "nav-active" : ""}`}>
        {label} <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="card absolute left-0 top-full z-50 mt-3 w-60 p-2"
          >
            {items.map((n) => (
              <Link key={n.href} href={n.href} onClick={(e) => (softNav(e, n.href), setOpen(false))} className="block rounded-md px-3 py-2.5 text-[0.92rem] font-medium hover:bg-raise">
                {n.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header({ settings, wa }: Chrome) {
  const waProps = wa.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [raised, setRaised] = useState(false);

  useEffect(() => {
    const onScroll = () => setRaised(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const is = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const link = (href: string, label: string) => (
    <Link href={href} onClick={(e) => softNav(e, href)} aria-current={is(href) ? "page" : undefined} className={`nav-link ${is(href) ? "nav-active" : ""}`}>
      {label}
    </Link>
  );

  return (
    <header className={`sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-md transition-shadow ${raised ? "shadow-[0_8px_24px_-18px_rgba(22,23,27,.45)]" : ""}`}>
      <style>{`.nav-link{position:relative;padding:.5rem .15rem;font-size:.92rem;font-weight:500;white-space:nowrap}.nav-link:hover{color:var(--blue)}.nav-active{font-weight:700}.nav-active::after{content:"";position:absolute;left:0;right:0;bottom:-.1rem;height:2.5px;border-radius:2px;background:#F5861F}`}</style>
      <div className="wrap flex h-[4.75rem] items-center justify-between gap-4">
        <Link href="/" onClick={(e) => softNav(e, "/")} aria-label="S.M.C – Siddhu Mathematics Classes, home" className="shrink-0">
          <span className="sm:hidden"><Logo settings={settings} compact /></span>
          <span className="hidden sm:inline-flex"><Logo settings={settings} /></span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {link("/", "Home")}
          {link("/about", "About")}
          <Dropdown label="Courses" items={COURSES} active={is("/courses")} />
          {link("/timetable", "Timetable")}
          {link("/study-material", "Study Material")}
          {link("/contact", "Contact")}
          <Dropdown label="More" items={MORE} active={MORE.some((m) => is(m.href))} />
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a href={wa} {...waProps} className="btn btn-primary btn-sm hidden whitespace-nowrap px-4 sm:inline-flex">
            Enquire Now <ArrowRight size={16} aria-hidden="true" />
          </a>
          <span className="hidden h-8 w-px bg-line sm:block" aria-hidden="true" />
          <ThemeToggle />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-surface lg:hidden"
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
            className="fixed inset-x-0 top-[4.75rem] overflow-y-auto bg-bg lg:hidden"
            style={{ height: "calc(100dvh - 4.75rem)" }}
          >
            <div className="wrap flex flex-col pb-10 pt-3">
              {MOBILE.map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.025 * i }}>
                  <Link
                    href={n.href}
                    onClick={(e) => softNav(e, n.href) && setMenu(false)}
                    aria-current={is(n.href) ? "page" : undefined}
                    className={`flex min-h-12 items-center border-b border-line font-display text-lg font-semibold ${is(n.href) ? "text-blue" : ""}`}
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <a href={wa} {...waProps} className="btn btn-wa mt-6">
                <WhatsAppIcon /> Enquire on WhatsApp
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Floating WhatsApp button, on every page. */
export function FloatingDock({ wa, teacher }: { wa: string; teacher: string }) {
  const ext = wa.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a
      data-dock
      href={wa}
      {...ext}
      aria-label={`Chat with ${teacher} on WhatsApp`}
      className="fixed bottom-4 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#1faa53] text-white shadow-[0_10px_28px_-8px_rgba(31,170,83,.85)] ring-4 ring-white/90 transition-transform hover:-translate-y-0.5 md:bottom-6 md:right-6 dark:ring-white/20"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
