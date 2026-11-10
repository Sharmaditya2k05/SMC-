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
      <PageHero title="Inside the classroom." subtitle="The classroom, teaching moments and student activities at Siddhu Mathematics Classes." />
      <section className="section pt-10 md:pt-14">
        <div className="wrap">
          {images.length ? (
            <GalleryGrid images={images} />
          ) : (
            <div className="card grid-paper px-6 py-20 text-center">
              <p className="mx-auto max-w-xl font-serif text-3xl leading-snug">Photographs from the classroom will be added here.</p>
              <p className="mx-auto mt-4 max-w-md text-muted">Until then, you are welcome to visit and see a class for yourself.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
