import { ResourceSkeletons } from "@/components/resources";
import { PageHero } from "@/components/ui";

export default function Loading() {
  return (
    <>
      <PageHero title="Learn. Revise. Practice." subtitle="Access selected learning resources and sample Mathematics notes." />
      <section className="section pt-10 md:pt-14">
        <div className="wrap">
          <div className="skeleton mb-8 h-44" />
          <ResourceSkeletons />
        </div>
      </section>
    </>
  );
}
