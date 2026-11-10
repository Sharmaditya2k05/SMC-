import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Siddhu Mathematics Classes handles the information you share through this website.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="What this website collects, and what it is used for." />
      <section className="section pt-10 md:pt-16">
        <div className="wrap max-w-3xl space-y-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-2 [&_p]:text-muted">
          <div>
            <h2>Information you give us</h2>
            <p>
              This website has no forms and does not collect personal details. When you message us on WhatsApp, we see your number and whatever you choose to write, and use it only to reply to you.
            </p>
          </div>
          <div>
            <h2>What we do not do</h2>
            <p>Your number and messages are not sold, rented or shared for marketing.</p>
          </div>
          <div>
            <h2>Stored on your device</h2>
            <p>The website remembers your light or dark theme choice and a dismissed notice in your browser. It does not use advertising or tracking cookies.</p>
          </div>
          <div>
            <h2>Third-party services</h2>
            <p>
              The map is provided by Google Maps and study material is served from Google Drive. WhatsApp links open WhatsApp. When you use these, the respective provider&apos;s own privacy policy applies.
            </p>
          </div>
          <div>
            <h2>Removing your details</h2>
            <p>
              To have your details removed from our contacts, <Link href="/contact" className="link">contact us</Link> and they will be deleted.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
