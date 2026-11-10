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

    // Every link to one of the stacked pages (logo, menu, footer, buttons) goes
    // through softNav, so it works the same wherever it is tapped.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || !STACKED.includes(url.pathname)) return;
      softNav(e, url.pathname + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      io.disconnect();
      document.removeEventListener("click", onClick, true);
    };
  }, []);
  return null;
}

const STACKED = ["/", "/about", "/courses", "/timetable", "/study-material", "/methodology", "/results", "/gallery", "/faqs", "/contact"];
let pendingCheck: ReturnType<typeof setTimeout> | undefined;

/**
 * Navbar helper: if the destination page (or anchor) is already part of the
 * current scroll, move to it instead of loading the route again. A page that
 * is not in the current scroll (for example Home, when the visit started on a
 * later page) is opened with a normal page load, because the address bar has
 * been following the scroll and no longer matches what the router has loaded.
 * Always handles the click and returns true.
 */
export function softNav(e: { preventDefault: () => void }, href: string) {
  e.preventDefault();
  const [path, hash] = href.split("#");
  const target = (hash && document.getElementById(hash)) || document.querySelector<HTMLElement>(`[data-page="${path || "/"}"]`);
  if (!target) {
    window.location.assign(href);
    return true;
  }
  // The open mobile menu locks the page; phones ignore a scroll while it is locked.
  document.body.style.overflow = "";
  clearTimeout(pendingCheck);
  const top = path === "/" && !hash ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - 76);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const far = Math.abs(top - window.scrollY) > window.innerHeight * 3;
  if (reduce || far) {
    window.scrollTo({ top, behavior: "instant" });
    return true;
  }
  window.scrollTo({ top, behavior: "smooth" });
  // Some phones drop a smooth scroll half way. If it did not arrive, jump.
  let touched = false;
  const stop = () => (touched = true);
  window.addEventListener("touchstart", stop, { once: true, passive: true });
  window.addEventListener("wheel", stop, { once: true, passive: true });
  pendingCheck = setTimeout(() => {
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("wheel", stop);
    if (!touched && Math.abs(window.scrollY - top) > 24) window.scrollTo({ top, behavior: "instant" });
  }, 1100);
  return true;
}
