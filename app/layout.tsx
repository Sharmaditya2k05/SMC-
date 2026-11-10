import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter, Manrope } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const dmSerif = DM_Serif_Display({ variable: "--font-dmserif", weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" });

const description =
  "Siddhu Mathematics Classes (S.M.C) – concept-focused Mathematics classes for Class XI and Class XII, with structured batches and study material.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "S.M.C – Siddhu Mathematics Classes | Mathematics for Class XI & XII",
    template: "%s | S.M.C – Siddhu Mathematics Classes",
  },
  description,
  applicationName: "Siddhu Mathematics Classes",
  keywords: [
    "Siddhu Mathematics Classes", "S.M.C", "Mathematics classes for Class XI", "Mathematics classes for Class XII",
    "Class 11 Maths coaching", "Class 12 Maths coaching", "Mathematics teacher",
  ],
  openGraph: {
    type: "website",
    siteName: "S.M.C – Siddhu Mathematics Classes",
    title: "S.M.C – Siddhu Mathematics Classes",
    description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F6F0" },
    { media: "(prefers-color-scheme: dark)", color: "#101C35" },
  ],
};

// Applies the saved theme before first paint (light is the default experience).
const themeScript = `try{var t=localStorage.getItem("smc-theme");if(t==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-theme="light" suppressHydrationWarning className={`${manrope.variable} ${inter.variable} ${dmSerif.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
