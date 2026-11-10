import About from "./pages/about";
import Contact from "./pages/contact";
import Courses from "./pages/courses";
import Faqs from "./pages/faqs";
import Gallery from "./pages/gallery";
import Home from "./pages/home";
import Methodology from "./pages/methodology";
import Results from "./pages/results";
import StudyMaterial from "./pages/study-material";
import TimetablePage from "./pages/timetable";
import { PageSpy } from "./scroll-pager";

const SUFFIX = " | S.M.C – Siddhu Mathematics Classes";

/** Reading order of the site. Each route shows its own page first, then every page after it. */
const PAGES = [
  { href: "/", title: "S.M.C – Siddhu Mathematics Classes | Mathematics for Class XI & XII", View: Home },
  { href: "/about", title: "About Siddhu Sir" + SUFFIX, View: About },
  { href: "/courses", title: "Courses & Classes – Class XI and XII Mathematics" + SUFFIX, View: Courses },
  { href: "/timetable", title: "Batch Timetable – Class XI and XII" + SUFFIX, View: TimetablePage },
  { href: "/study-material", title: "Study Material & Notes Library" + SUFFIX, View: StudyMaterial },
  { href: "/methodology", title: "Learning Methodology" + SUFFIX, View: Methodology },
  { href: "/results", title: "Results & Achievements" + SUFFIX, View: Results },
  { href: "/gallery", title: "Gallery" + SUFFIX, View: Gallery },
  { href: "/faqs", title: "Frequently Asked Questions" + SUFFIX, View: Faqs },
  { href: "/contact", title: "Location & Contact" + SUFFIX, View: Contact },
] as const;

/**
 * One continuous scroll: the requested page, immediately followed by the rest
 * of the site in order. The footer (in the layout) comes only after the last page.
 */
export function PageStack({ from }: { from: (typeof PAGES)[number]["href"] }) {
  const start = PAGES.findIndex((p) => p.href === from);
  return (
    <>
      {PAGES.slice(start).map((p) => (
        <div key={p.href} data-page={p.href} data-title={p.title}>
          <p.View />
        </div>
      ))}
      <PageSpy />
    </>
  );
}
