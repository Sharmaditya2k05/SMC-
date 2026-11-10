/** Server-side whitelist of what each admin-managed collection may contain. */
type FieldType = "string" | "boolean" | "number";

export const COLLECTIONS: Record<string, { fields: Record<string, FieldType>; required: string[]; create: boolean }> = {
  resources: {
    fields: {
      title: "string", cls: "string", chapter: "string", category: "string", description: "string",
      driveId: "string", fileUrl: "string", published: "boolean",
    },
    required: ["title", "cls"],
    create: true,
  },
  announcements: { fields: { title: "string", body: "string", published: "boolean" }, required: ["title"], create: true },
  gallery: {
    fields: { url: "string", caption: "string", category: "string", order: "number" },
    required: ["url"],
    create: true,
  },
  testimonials: {
    fields: {
      name: "string", cls: "string", text: "string", photoUrl: "string", permission: "boolean", published: "boolean",
    },
    required: ["name", "text"],
    create: true,
  },
  achievements: {
    fields: { title: "string", detail: "string", year: "string", published: "boolean" },
    required: ["title"],
    create: true,
  },
  enquiries: { fields: { handled: "boolean" }, required: [], create: false },
};

/** Accepts a Drive share link or a bare id and returns the file id. */
export function driveIdFrom(input: string) {
  const s = input.trim();
  return s.match(/\/d\/([\w-]{20,})/)?.[1] ?? s.match(/[?&]id=([\w-]{20,})/)?.[1] ?? (/^[\w-]{20,}$/.test(s) ? s : "");
}

export function sanitize(collection: string, input: Record<string, unknown>, partial: boolean) {
  const spec = COLLECTIONS[collection];
  const out: Record<string, unknown> = {};
  for (const [key, type] of Object.entries(spec.fields)) {
    const v = input[key];
    if (v === undefined) continue;
    if (type === "string") out[key] = String(v ?? "").trim().slice(0, 4000);
    else if (type === "boolean") out[key] = Boolean(v);
    else out[key] = Number(v) || 0;
  }
  if (collection === "resources") {
    if (typeof out.driveId === "string") out.driveId = driveIdFrom(out.driveId);
    if (out.cls !== undefined && !["XI", "XII", "JEE"].includes(out.cls as string)) return { error: "Choose a class." };
    if (!partial && !out.driveId && !out.fileUrl) return { error: "Add a PDF file or a Google Drive link." };
    if (typeof out.fileUrl === "string" && out.fileUrl && !/^(https:\/\/|\/files\/)/.test(out.fileUrl))
      return { error: "File link must start with https://" };
  }
  if (!partial) for (const r of spec.required) if (!out[r]) return { error: `"${r}" is required.` };
  return { data: out };
}
