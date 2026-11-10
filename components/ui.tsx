import Link from "next/link";
import type { Settings } from "@/lib/types";

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.93 9.93 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.18-3.06.8.82-2.98-.2-.31A8.1 8.1 0 0 1 12.04 3.8Zm-3.5 3.9c-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.14s.92 2.49 1.05 2.66c.13.17 1.8 2.86 4.44 3.9 2.2.86 2.64.69 3.12.65.48-.05 1.54-.63 1.76-1.24.22-.6.22-1.13.15-1.24-.06-.1-.24-.17-.5-.3-.26-.13-1.54-.76-1.78-.85-.24-.08-.41-.13-.59.13-.17.26-.67.85-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.3a7.9 7.9 0 0 1-1.45-1.8c-.15-.27-.02-.4.11-.54.12-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.07-.13-.58-1.42-.8-1.94-.2-.5-.42-.44-.58-.45h-.5Z" />
    </svg>
  );
}

/** Text wordmark (used until a logo image is added in the admin settings). */
export function Logo({ settings, compact = false, onNavy = false }: { settings: Pick<Settings, "logoUrl" | "brandName">; compact?: boolean; onNavy?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      {settings.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={settings.logoUrl} alt="S.M.C logo" className="h-10 w-auto rounded-[4px_14px_4px_4px] bg-[#FBF6F3] px-2.5 py-2" />
      ) : (
        <span
          aria-hidden="true"
          className={`grid h-10 place-items-center rounded-[4px_14px_4px_4px] px-2.5 font-serif text-[1.05rem] leading-none tracking-wide ${onNavy ? "bg-gold text-[#101C35]" : "bg-[var(--btn-bg)] text-[var(--btn-fg)]"}`}
        >
          S.M.C
        </span>
      )}
      {!compact && (
        <span className="font-display text-[0.95rem] font-bold leading-tight">
          {settings.brandName}
        </span>
      )}
      {compact && <span className="sr-only">{settings.brandName}</span>}
    </span>
  );
}

export function PageHero({ title, subtitle, children, note }: { title: string; subtitle?: string; note?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grid-paper absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden="true" />
      <div className="wrap relative pb-14 pt-32 md:pb-20 md:pt-44">
        {note && <p className="note mb-4 text-lg">{note}</p>}
        <h1 className="h1 max-w-4xl">{title}</h1>
        {subtitle && <p className="lede mt-6">{subtitle}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ title, lede, children }: { title: string; lede?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="h2 max-w-2xl">{title}</h2>
        {lede && <p className="lede mt-4">{lede}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
    </div>
  );
}

/** Always-dark closing section. */
export function NavyCTA({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-deep text-ivory no-print">
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1200 400">
        <defs>
          <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(248,246,240,.06)" />
          </pattern>
        </defs>
        <rect width="1200" height="400" fill="url(#cta-grid)" />
        <path d="M0 330 C 240 330, 380 60, 620 180 S 980 320, 1200 40" fill="none" stroke="#D4B477" strokeWidth="1.5" opacity=".7" vectorEffect="non-scaling-stroke" />
        <path d="M0 360 C 300 360, 420 200, 700 250 S 1000 300, 1200 160" fill="none" stroke="#8FB0F0" strokeWidth="1" opacity=".35" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="wrap relative py-20 md:py-28">
        <h2 className="statement max-w-3xl">{title}</h2>
        {text && <p className="mt-6 max-w-xl text-lg text-ivory/75">{text}</p>}
        <div className="mt-9 flex flex-wrap gap-3">{children}</div>
      </div>
    </section>
  );
}

export function WaButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`btn btn-wa ${className}`}>
      <WhatsAppIcon /> {children}
    </a>
  ) : (
    <Link href={href} className={`btn btn-wa ${className}`}>
      <WhatsAppIcon /> {children}
    </Link>
  );
}

export function Placeholder({ children = "To be updated" }: { children?: React.ReactNode }) {
  return <span className="italic text-muted">{children}</span>;
}
