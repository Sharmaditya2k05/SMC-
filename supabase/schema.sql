-- S.M.C website – run once in Supabase → SQL Editor.
--
-- How access works: every table has Row Level Security on and NO policies, so
-- nothing can be read or written with the public key directly. The website's
-- server calls the functions below with the project's publishable key plus an
-- app secret (SMC_API_SECRET). Each function checks the secret against the
-- SHA-256 hash stored in app_config before doing anything.
--
-- After running this file, set the hash of your secret:
--   insert into public.app_config (key, value)
--   values ('api_secret_sha256', '<sha256 hex of SMC_API_SECRET>')
--   on conflict (key) do update set value = excluded.value;

create table if not exists public.documents (
  collection text        not null,
  id         text        not null,
  data       jsonb       not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (collection, id)
);
alter table public.documents enable row level security;

create table if not exists public.app_config (
  key   text primary key,
  value text not null
);
alter table public.app_config enable row level security;

create table if not exists public.smc_files (
  name         text primary key,
  content_type text not null,
  bytes        bytea not null,
  created_at   timestamptz not null default now()
);
alter table public.smc_files enable row level security;

create or replace function public.smc_guard(p_secret text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_secret is null or not exists (
    select 1 from public.app_config
    where key = 'api_secret_sha256'
      and value = encode(sha256(convert_to(p_secret, 'UTF8')), 'hex')
  ) then
    raise exception 'not authorised' using errcode = '42501';
  end if;
end;
$$;
revoke all on function public.smc_guard(text) from public, anon, authenticated;

create or replace function public.smc_list(p_secret text, p_collection text)
returns table (id text, data jsonb, created_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  perform public.smc_guard(p_secret);
  return query select d.id, d.data, d.created_at from public.documents d where d.collection = p_collection;
end;
$$;

create or replace function public.smc_upsert(p_secret text, p_collection text, p_id text, p_data jsonb, p_created_at timestamptz default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.smc_guard(p_secret);
  insert into public.documents (collection, id, data, created_at)
  values (p_collection, p_id, p_data, coalesce(p_created_at, now()))
  on conflict (collection, id) do update
    set data = excluded.data,
        created_at = coalesce(p_created_at, public.documents.created_at);
end;
$$;

create or replace function public.smc_delete(p_secret text, p_collection text, p_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.smc_guard(p_secret);
  delete from public.documents where collection = p_collection and id = p_id;
end;
$$;

create or replace function public.smc_put_file(p_secret text, p_name text, p_content_type text, p_base64 text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.smc_guard(p_secret);
  insert into public.smc_files (name, content_type, bytes)
  values (p_name, p_content_type, decode(p_base64, 'base64'));
end;
$$;

-- uploaded PDFs and photographs are public by design, so reading needs no secret
create or replace function public.smc_get_file(p_name text)
returns table (content_type text, base64 text)
language sql security definer set search_path = public stable as $$
  select f.content_type, encode(f.bytes, 'base64') from public.smc_files f where f.name = p_name;
$$;

grant execute on function public.smc_list(text, text) to anon;
grant execute on function public.smc_upsert(text, text, text, jsonb, timestamptz) to anon;
grant execute on function public.smc_delete(text, text, text) to anon;
grant execute on function public.smc_put_file(text, text, text, text) to anon;
grant execute on function public.smc_get_file(text) to anon;
