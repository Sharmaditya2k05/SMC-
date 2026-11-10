import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Sora } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", style: ["normal", "italic"], subsets: ["latin"], display: "swap" });

const description =
  "Siddhu Mathematics Classes (S.M.C) – concept-focused Mathematics classes for Class XI and Class XII by Siddhu Sir, with structured batches and study material.";

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
    "Class 11 Maths coaching", "Class 12 Maths coaching", "Mathematics teacher", "Siddhu Sir",
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
    { media: "(prefers-color-scheme: light)", color: "#FBF6F3" },
    { media: "(prefers-color-scheme: dark)", color: "#16171B" },
  ],
};

// Applies the saved theme before first paint (light is the default experience).
const themeScript = `try{var t=localStorage.getItem("smc-theme");if(t==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-theme="light" suppressHydrationWarning className={`${sora.variable} ${inter.variable} ${playfair.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
