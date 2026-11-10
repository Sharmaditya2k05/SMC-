import type { Metadata } from "next";
import { ResourceLibrary } from "@/components/resources";
import { PageHero } from "@/components/ui";
import { getResources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Study Material & Notes Library",
  description: "Preview and download sample Mathematics notes for Class XI and Class XII from Siddhu Mathematics Classes – chapter-wise PDFs, free to access.",
  alternates: { canonical: "/study-material" },
};

export default async function StudyMaterial() {
  const resources = await getResources();
  return (
    <>
      <PageHero title={<>Learn. Revise. <em className="hi">Practice.</em></>} subtitle="Access selected learning resources and sample Mathematics notes." />
      <section className="pb-16 pt-4 md:pb-20">
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
