"use client";

import { CollectionManager } from "@/components/admin/kit";

export default function Gallery() {
  return (
    <CollectionManager
      collection="gallery"
      title="Gallery"
      intro="Photographs for the Gallery page. Please upload only photographs you have permission to publish, especially those showing students."
      addLabel="Add photograph"
      reorder
      defaults={{ url: "", caption: "", category: "Classroom" }}
      thumb={(i) => String(i.url || "")}
      primary={(i) => String(i.caption || "No caption")}
      secondary={(i) => String(i.category || "")}
      fields={[
        { name: "url", label: "Photograph", type: "file", accept: "image/jpeg,image/png,image/webp", help: "JPG, PNG or WebP, up to 8 MB." },
        { name: "caption", label: "Caption", type: "text" },
        { name: "category", label: "Category", type: "select", options: ["Classroom", "Teaching Moments", "Learning Environment", "Events", "Student Activities"] },
      ]}
    />
  );
}
