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
              When you send an enquiry, we receive the student&apos;s name, the parent&apos;s name (if given), a WhatsApp number, the class, a preferred batch and any message you write. This is used only to respond to your enquiry about classes.
            </p>
          </div>
          <div>
            <h2>What we do not do</h2>
            <p>Enquiry details are not sold, rented or shared for marketing. They are visible only to the teacher through a password-protected dashboard.</p>
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
              To have an enquiry removed, <Link href="/contact" className="link">contact us</Link> with the number you used and it will be deleted.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
