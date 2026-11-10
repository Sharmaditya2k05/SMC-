"use client";

import { CollectionManager } from "@/components/admin/kit";

export default function Stories() {
  return (
    <div className="space-y-16">
      <CollectionManager
        collection="achievements"
        title="Student achievements"
        intro="Verified results and milestones for the Results page. Add only achievements you can confirm."
        addLabel="Add achievement"
        defaults={{ title: "", detail: "", year: "", published: true }}
        primary={(i) => String(i.title)}
        secondary={(i) => `${i.year || "No year"}${i.published ? "" : " · Not published"}`}
        fields={[
          { name: "title", label: "Achievement", type: "text", placeholder: "Student name – result or milestone" },
          { name: "detail", label: "Details (optional)", type: "textarea" },
          { name: "year", label: "Year", type: "text", placeholder: "2026" },
          { name: "published", label: "Published", type: "checkbox", help: "visible on the website" },
        ]}
      />
      <CollectionManager
        collection="testimonials"
        title="Testimonials"
        intro="Words from students and parents. A testimonial appears on the website only when it is published and permission has been given."
        addLabel="Add testimonial"
        defaults={{ name: "", cls: "", text: "", photoUrl: "", permission: false, published: false }}
        thumb={(i) => (i.photoUrl ? String(i.photoUrl) : undefined)}
        primary={(i) => `${i.name}${i.cls ? ` · ${i.cls}` : ""}`}
        secondary={(i) => `${i.permission ? "Permission given" : "Permission not recorded"}${i.published ? "" : " · Not published"}`}
        fields={[
          { name: "name", label: "Student / parent name", type: "text" },
          { name: "cls", label: "Class", type: "text", placeholder: "Class XII, 2026" },
          { name: "text", label: "Testimonial", type: "textarea" },
          { name: "photoUrl", label: "Photograph (optional)", type: "file", accept: "image/jpeg,image/png,image/webp" },
          { name: "permission", label: "Permission given", type: "checkbox", help: "the student or parent has agreed to this being published" },
          { name: "published", label: "Published", type: "checkbox" },
        ]}
      />
    </div>
  );
}
