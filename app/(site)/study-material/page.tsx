import type { Metadata } from "next";
import { ResourceLibrary } from "@/components/resources";
import { PageHero } from "@/components/ui";
import { getResources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Study Material & Notes Library",
  description: "Preview and download Mathematics notes for Class XI and Class XII from Siddhu Mathematics Classes – chapter-wise PDFs, free to access.",
  alternates: { canonical: "/study-material" },
};

export default async function StudyMaterial() {
  const resources = await getResources();
  return (
    <>
      <PageHero title="Learn. Revise. Practice." subtitle="Access selected learning resources and sample Mathematics notes." />
      <section className="section pt-10 md:pt-14">
        <div className="wrap">
          <ResourceLibrary resources={resources} />
          <p className="mt-10 max-w-2xl text-sm text-muted">
            These notes are shared for students&apos; personal study. PDFs open without signing in. If a file does not load, try “Open in new tab” from the preview.
          </p>
        </div>
      </section>
    </>
  );
}
