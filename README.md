# S.M.C – Siddhu Mathematics Classes

Website for a Mathematics teacher's Class XI and XII coaching: ten public pages, a PDF notes library fed from a public Google Drive folder, WhatsApp and Google Maps integration, an enquiry form, and a password-protected admin dashboard so the site can be maintained without touching code.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide · Supabase (Postgres + Storage)

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run hash-password -- "choose a long password"   # paste the two lines it prints into .env.local
npm run dev
```

Open http://localhost:3000. The admin is at http://localhost:3000/admin (username from `ADMIN_USERNAME`).

With the Supabase variables left empty, content is stored as JSON files in `.data/` and uploads in `.data/uploads/`. That is for development only.

## Before going live – details to fill in

Nothing about the teacher has been invented. These are empty until entered in **Admin → Website settings**:

| Detail | Until it is set |
|---|---|
| WhatsApp number | WhatsApp buttons lead to the enquiry form instead of `wa.me` |
| Phone number, classroom address | Shown as "to be updated" |
| Teacher's name, qualifications, experience, message | Shown as "To be updated" on the About page |
| Teacher photograph | A geometric S.M.C plate fills the portrait frame |
| Logo image | The S.M.C text wordmark is used |
| Results, testimonials, gallery photographs | Tasteful empty states |

## Deploy (Vercel + Supabase)

1. **Supabase** – create a project, open *SQL Editor* and run [`supabase/schema.sql`](supabase/schema.sql). Copy the project URL and the **service-role** key from *Project Settings → API*.
2. **Vercel** – import this repository and add the variables from [`.env.example`](.env.example): `NEXT_PUBLIC_SITE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Deploy, sign in at `/admin`, then:
   - **Study materials → Import new PDFs from Google Drive** to load the notes library.
   - **Website settings** to add the WhatsApp number, address, teacher profile and photograph.

Without Supabase the site still renders (using the bundled Drive seed and defaults), but enquiries and admin changes cannot be saved on Vercel – the enquiry form says so honestly rather than pretending to succeed.

## How things work

### Content and caching
All public content is read through `lib/content.ts`, cached with `"use cache"` and tagged `content`. Every admin write calls `revalidateTag("content")`, so pages stay static and fast and refresh shortly after an edit.

### Storage (`lib/store.ts`)
A small document store with two drivers behind one interface: Supabase (`documents` table + `smc-files` bucket) or local files. The Supabase service-role key is used only on the server; Row Level Security blocks the public key entirely.

### Study material and Google Drive
- The folder link in settings must be shared as *Anyone with the link*. `lib/drive.ts` reads that public folder listing server-side – no API key, and it can only ever see files that are already public.
- `npm run sync-drive` rebuilds `data/seed/resources.json` (the initial library). In production, the admin's **Import new PDFs from Google Drive** button adds files that are not in the library yet.
- Each resource is either a Drive file (previewed with Drive's viewer, real first-page thumbnail) or an uploaded PDF. The teacher can edit titles, chapters and categories, unpublish or delete.
- The public-folder reader depends on Google's page markup. If it ever stops working, swap `listFolder()` in `lib/drive.ts` for the Drive API with a server-side key – nothing else needs to change.
- Vercel limits request bodies to about 4.5 MB, so for larger PDFs use a Drive link rather than an upload.

### Admin security
- Password stored only as a salted scrypt hash in an environment variable.
- Session is an HMAC-signed, `HttpOnly`, `SameSite=Lax` cookie (7 days; `Secure` in production).
- `proxy.ts` redirects signed-out visitors away from `/admin`; every `/api/admin/*` route verifies the session again.
- Login is rate-limited; uploads are checked for type, size and file signature; admin input is whitelisted per collection (`lib/schema.ts`).

### WhatsApp
`waLink()` in `lib/format.ts` builds `https://wa.me/91<number>?text=…` with the pre-filled messages from the brief (home, Class XI, Class XII).

### SEO
Per-page titles and descriptions, Open Graph image, `sitemap.xml`, `robots.txt` (admin and API excluded), `EducationalOrganization` and `FAQPage` structured data.

### Timetable printing
The "Download / Print Timetable" button uses a print stylesheet that produces a single clean A4 page – choose *Save as PDF* in the print dialog.

## Project map

```
app/(site)/        public pages (home, about, courses, timetable, study-material,
                   methodology, results, gallery, contact, faqs, privacy, terms)
app/admin/         login + dashboard (overview, enquiries, resources, timetable,
                   announcements, gallery, results & testimonials, settings)
app/api/           enquiry endpoint and admin API
components/        header/footer, mathematical artwork, timetable, notes library,
                   enquiry form, admin kit
lib/               store, auth, cached content, Drive reader, defaults, helpers
data/seed/         initial notes library generated from the Drive folder
supabase/          database schema
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Develop, build, serve |
| `npm run lint` | ESLint |
| `npm run hash-password -- "…"` | Prints `ADMIN_PASSWORD_HASH` and a `SESSION_SECRET` |
| `npm run sync-drive` | Regenerates the seed library from the Drive folder |
