import type { Metadata } from "next";
import { GalleryGrid } from "@/components/interactive";
import { PageHero } from "@/components/ui";
import { getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs of the classroom and learning environment at Siddhu Mathematics Classes.",
  alternates: { canonical: "/gallery" },
};

export default async function Gallery() {
  const images = await getGallery();
  return (
    <>
      <PageHero title={<>Inside the <em className="hi">classroom.</em></>} subtitle="The classroom, teaching moments and student activities." />
      <section className="section pt-10">
        <div className="wrap">
          <GalleryGrid images={images} />
        </div>
      </section>
    </>
  );
}
