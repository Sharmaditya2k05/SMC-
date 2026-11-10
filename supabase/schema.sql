-- S.M.C website – run once in Supabase → SQL Editor.

-- One table holds every kind of content (settings, timetable, resources,
-- announcements, gallery, testimonials, achievements, enquiries).
create table if not exists public.documents (
  collection text        not null,
  id         text        not null,
  data       jsonb       not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (collection, id)
);

-- Row Level Security on, with no policies: the table is unreachable with the
-- public (anon) key. Only the website's server, using the service-role key,
-- can read or write. Enquiries therefore stay private.
alter table public.documents enable row level security;

-- Public bucket for uploaded PDFs and photographs (files are meant to be
-- downloadable by students). Uploads still require the service-role key.
insert into storage.buckets (id, name, public)
values ('smc-files', 'smc-files', true)
on conflict (id) do nothing;
