import { Footer } from "@/components/footer";
import { Motion } from "@/components/motion";
import { Banner, FloatingDock, Header } from "@/components/site-chrome";
import { currentYear, getSettings } from "@/lib/content";
import { waLink, WA_MESSAGES } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, year] = await Promise.all([getSettings(), currentYear()]);
  const wa = waLink(settings.whatsapp, WA_MESSAGES.home);
  const geo = settings.mapsEmbedUrl.match(/ll=(-?[\d.]+),(-?[\d.]+)/);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Siddhu Mathematics Classes",
    alternateName: "S.M.C",
    url: SITE_URL,
    description: "Mathematics classes for Class XI and Class XII with a focus on conceptual understanding.",
    hasMap: settings.mapsUrl,
    ...(settings.teacherName
      ? { founder: { "@type": "Person", name: settings.teacherName, ...(settings.teacherShortName ? { alternateName: settings.teacherShortName } : {}), jobTitle: "Mathematics Teacher" } }
      : {}),
    ...(settings.address ? { address: settings.address } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(geo ? { geo: { "@type": "GeoCoordinates", latitude: Number(geo[1]), longitude: Number(geo[2]) } } : {}),
    sameAs: [settings.instagram, settings.youtube, settings.facebook].filter(Boolean),
  };

  return (
    <Motion>
      <a href="#main" className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]">
        Skip to content
      </a>
      {settings.bannerEnabled && settings.bannerText && <Banner text={settings.bannerText} />}
      <Header settings={{ logoUrl: settings.logoUrl, brandName: settings.brandName }} wa={wa} mapsUrl={settings.mapsUrl} />
      <main id="main" className="flex-1">{children}</main>
      <Footer settings={settings} year={year} />
      <FloatingDock wa={wa} teacher={settings.teacherShortName || "Teacher"} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </Motion>
  );
}
