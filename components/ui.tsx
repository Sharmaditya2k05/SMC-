import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Settings } from "@/lib/types";

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.93 9.93 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.18-3.06.8.82-2.98-.2-.31A8.1 8.1 0 0 1 12.04 3.8Zm-3.5 3.9c-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.14s.92 2.49 1.05 2.66c.13.17 1.8 2.86 4.44 3.9 2.2.86 2.64.69 3.12.65.48-.05 1.54-.63 1.76-1.24.22-.6.22-1.13.15-1.24-.06-.1-.24-.17-.5-.3-.26-.13-1.54-.76-1.78-.85-.24-.08-.41-.13-.59.13-.17.26-.67.85-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.3a7.9 7.9 0 0 1-1.45-1.8c-.15-.27-.02-.4.11-.54.12-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.07-.13-.58-1.42-.8-1.94-.2-.5-.42-.44-.58-.45h-.5Z" />
    </svg>
  );
}

/** The SMC bulb: a light bulb with rays and the orange orbit ring from the logo. */
export function BulbMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <g stroke="#F5861F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 3.5v4M11.5 8.5l2.6 3M36.5 8.5l-2.6 3" />
        <path d="M24 12.5c-5.6 0-9.6 4.2-9.6 9.3 0 3.3 1.6 5.6 3.4 7.4 1.2 1.2 1.7 2.3 1.7 3.8h9c0-1.5.5-2.6 1.7-3.8 1.8-1.8 3.4-4.1 3.4-7.4 0-5.1-4-9.3-9.6-9.300Z" />
        <path d="M14.2 27.800C7 30 2.8 33.2 4.2 35.600c1.9 3.2 13.8 1.2 24.4-3.8 6.3-3 10.9-6.3 12.7-9" />
      </g>
      <path d="M20 37.200h8M21 41h6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Logo lock-up: the bulb emblem cut from the SMC logo, with the name set in type so it works on light and dark. */
export function Logo({ settings, compact = false }: { settings: Pick<Settings, "logoUrl" | "brandName">; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={settings.logoUrl || "/brand/smc-bulb.png"} alt="" width={52} height={52} className={`${compact ? "h-11 w-11" : "h-[3.25rem] w-[3.25rem]"} rounded-full bg-[#FBF6F3] object-cover ring-1 ring-black/5`} />
      <span className="inline-flex flex-col leading-none">
        <span className="font-display text-[1.75rem] font-extrabold tracking-[-0.04em]">SMC</span>
        {!compact && <span className="mt-1 font-display text-[0.5rem] font-bold tracking-[0.2em]">SIDDHU MATHEMATICS CLASSES</span>}
      </span>
      <span className="sr-only">{settings.brandName}</span>
    </span>
  );
}

/** Thin orange arc, like the logo's orbit ring. */
export function Arc({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 400 160" fill="none" aria-hidden="true" className={`pointer-events-none absolute max-md:hidden ${className}`} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M2 158C60 60 190 6 398 2" stroke="#F5861F" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---- small typeset equations used as decoration ---- */
export const EqEuler = () => (
  <span className="math whitespace-nowrap">e<sup>iπ</sup> + 1 = 0</span>
);
export const EqPythagoras = () => (
  <span className="math whitespace-nowrap">a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></span>
);
export const EqIntegral = () => (
  <span className="math inline-flex items-center whitespace-nowrap">
    <span className="mr-0.5 text-[1.7em] font-normal not-italic leading-none">∫</span>x<sup>2</sup>&thinsp;dx&nbsp;=&nbsp;
    <span className="inline-flex flex-col items-center text-[0.8em] leading-[1.05]">
      <span className="border-b border-current px-0.5">x<sup>3</sup></span>
      <span>3</span>
    </span>
    &nbsp;+&nbsp;C
  </span>
);

export function MiniSine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 90" fill="none" aria-hidden="true" className={className}>
      <path d="M14 82V8M6 52h136" stroke="var(--muted)" strokeWidth="1" />
      <path d="M14 8l-3 6h6zM142 52l-6-3v6z" fill="var(--muted)" />
      <path d="M14 52c14-40 30-40 46 0s32 40 46 0" stroke="#F5861F" strokeWidth="2" strokeLinecap="round" />
      <text x="20" y="13" fontSize="11" fill="var(--muted)" fontFamily="var(--font-serif)" fontStyle="italic">y</text>
      <text x="134" y="46" fontSize="11" fill="var(--muted)" fontFamily="var(--font-serif)" fontStyle="italic">x</text>
    </svg>
  );
}

/** Centred page header with the quiet equation decoration from the designs. */
export function PageHero({ title, subtitle, children }: { title: React.ReactNode; subtitle?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grid-paper absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" aria-hidden="true" />
      <Arc className="-bottom-10 right-0 hidden w-[32rem] md:block" />
      <div className="pointer-events-none absolute inset-0 hidden text-muted xl:block" aria-hidden="true">
        <span className="absolute left-12 top-10 text-xl"><EqEuler /></span>
        <MiniSine className="absolute left-10 top-[4.5rem] w-36" />
        <span className="absolute right-14 top-10 text-xl"><EqPythagoras /></span>
        <span className="absolute right-16 top-[5.5rem] text-lg"><EqIntegral /></span>
      </div>
      <div className="wrap relative py-9 text-center md:py-20">
        <h1 className="h1 mx-auto max-w-4xl">
          <span className="relative inline-block">
            <span className="absolute right-full top-1/2 mr-6 hidden h-0.5 w-14 rounded bg-accent lg:block" aria-hidden="true" />
            {title}
            <span className="absolute left-full top-1/2 ml-6 hidden h-0.5 w-14 rounded bg-accent lg:block" aria-hidden="true" />
          </span>
        </h1>
        {subtitle && <p className="lede mx-auto mt-5">{subtitle}</p>}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ title, lede, children }: { title: React.ReactNode; lede?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="h2">{title}</h2>
        {lede && <p className="lede mt-3">{lede}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
    </div>
  );
}

/** Always-dark closing band: heading on the left, a divider, actions on the right. */
export function NavyCTA({ title, text, children }: { title: React.ReactNode; text?: string; children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-deep text-white no-print">
      <Arc className="-left-10 -top-6 w-[26rem] opacity-90" flip />
      <Arc className="-bottom-16 right-0 w-[30rem] opacity-80" />
      <div className="wrap relative flex flex-col gap-6 py-10 md:gap-8 md:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="lg:max-w-[38rem]">
          <h2 className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.035em]">{title}</h2>
          {text && <p className="mt-4 text-white/70">{text}</p>}
        </div>
        <span className="hidden h-16 w-px bg-white/25 lg:block" aria-hidden="true" />
        <div className="flex flex-wrap gap-3">{children}</div>
      </div>
    </section>
  );
}

/** Light closing band (same layout, on the page background). */
export function LightCTA({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-t border-line no-print">
      <Arc className="-left-16 top-0 w-[24rem]" flip />
      <Arc className="-bottom-14 right-0 w-[24rem]" />
      <div className="wrap relative flex flex-col gap-5 py-9 md:gap-6 md:py-14 lg:flex-row lg:items-center lg:justify-center lg:gap-10">
        <h2 className="font-display text-[clamp(1.7rem,3vw,2.4rem)] font-bold tracking-[-0.035em]">{title}</h2>
        <span className="hidden h-12 w-px bg-line lg:block" aria-hidden="true" />
        <div className="flex flex-wrap gap-3">{children}</div>
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

/** Link styled as a button, with the trailing arrow used throughout the designs. */
export function ArrowLink({ href, children, className = "btn-primary" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`btn ${className}`}>
      {children} <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}

export function Placeholder({ children = "To be updated" }: { children?: React.ReactNode }) {
  return <span className="text-muted">{children}</span>;
}
