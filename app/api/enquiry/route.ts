import { randomUUID } from "node:crypto";
import { clientKey, throttled } from "@/lib/auth";
import { normaliseIndianMobile } from "@/lib/format";
import { upsert } from "@/lib/store";

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  // honeypot: real visitors never fill this hidden field
  if (body.website) return Response.json({ ok: true });
  if (throttled("enq:" + clientKey(req), 8))
    return Response.json({ error: "Too many enquiries from this device. Please try again later." }, { status: 429 });

  const student = String(body.student ?? "").trim().slice(0, 80);
  const whatsapp = normaliseIndianMobile(String(body.whatsapp ?? ""));
  const cls = String(body.cls ?? "");
  const errors: Record<string, string> = {};
  if (student.length < 2) errors.student = "Enter the student's name.";
  if (!whatsapp) errors.whatsapp = "Enter a valid 10-digit Indian mobile number.";
  if (!["XI", "XII"].includes(cls)) errors.cls = "Choose Class XI or XII.";
  if (Object.keys(errors).length) return Response.json({ error: "Please check the form.", errors }, { status: 422 });

  try {
    await upsert("enquiries", {
      id: randomUUID(),
      student,
      parent: String(body.parent ?? "").trim().slice(0, 80),
      whatsapp: whatsapp!,
      cls,
      batch: String(body.batch ?? "").trim().slice(0, 120),
      message: String(body.message ?? "").trim().slice(0, 1500),
      handled: false,
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[enquiry] not stored:", e);
    return Response.json(
      { error: "Your enquiry could not be saved right now. Please contact us on WhatsApp instead." },
      { status: 503 },
    );
  }
  return Response.json({ ok: true });
}
