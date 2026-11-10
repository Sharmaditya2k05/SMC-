"use client";

/**
 * Continuous reading: every page is followed directly by the next one
 * (see components/page-stack.tsx). These client pieces keep the address bar,
 * tab title and navbar in step with whichever page is on screen.
 */
import { useEffect } from "react";
import { motion } from "framer-motion";

/** Gentle entrance when a route is opened directly or from the navbar. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/** Watches the stacked pages and updates the URL and title as each one arrives. */
export function PageSpy() {
  useEffect(() => {
    const pages = [...document.querySelectorAll<HTMLElement>("[data-page]")];
    if (pages.length < 2) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const href = el.dataset.page!;
          if (window.location.pathname !== href) {
            // replaceState keeps Back/Forward clean and lets the navbar highlight follow along
            window.history.replaceState(null, "", href);
            if (el.dataset.title) document.title = el.dataset.title;
          }
        }
      },
      // a thin band below the navbar: the page crossing it is the one being read
      { rootMargin: "-22% 0px -72% 0px" },
    );
    pages.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);
  return null;
}

/**
 * Navbar helper: if the destination page (or anchor) is already part of the
 * current scroll, glide to it instead of loading the route again.
 * Returns true when it handled the click.
 */
export function softNav(e: { preventDefault: () => void }, href: string) {
  const [path, hash] = href.split("#");
  const target = (hash && document.getElementById(hash)) || document.querySelector<HTMLElement>(`[data-page="${path || "/"}"]`);
  if (!target) return false;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY - 76;
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  return true;
}
