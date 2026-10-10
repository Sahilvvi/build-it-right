-- Fin-Envision Learning — initial schema.
-- Run in the Supabase SQL editor (or `supabase db push`).
--
-- Model
--   site_content  : two rows. 'public' = everything the website renders (readable by anyone);
--                   'private' = admin-only settings (SMTP, activity log).
--   leads         : visitors may INSERT only; only admins can read / edit / delete.
--   admin_profiles: one row per Supabase Auth user allowed into /admin.
--
-- Security is enforced by RLS below, not by the browser.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- tables

create table if not exists public.admin_profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  email      text not null,
  role       text not null default 'admin' check (role in ('super_admin', 'admin')),
  status     text not null default 'active' check (status in ('active', 'inactive')),
  last_login timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id         text primary key check (id in ('public', 'private')),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

create table if not exists public.leads (
  id         text primary key,
  data       jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

insert into public.site_content (id, data) values ('public', '{}'), ('private', '{}')
on conflict (id) do nothing;

-- ---------------------------------------------------------------- helpers

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid() and status = 'active'
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid() and status = 'active' and role = 'super_admin'
  );
$$;

-- Lets a signed-in admin stamp their own last_login without being able to touch role/status.
create or replace function public.touch_last_login()
returns void
language sql
security definer
set search_path = public
as $$
  update public.admin_profiles set last_login = now() where user_id = auth.uid();
$$;

-- Keep updated_at honest regardless of what the client sends.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before insert or update on public.site_content
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- RLS

alter table public.admin_profiles enable row level security;
alter table public.site_content   enable row level security;
alter table public.leads          enable row level security;

-- admin_profiles: you can read your own row (needed at login); admins can read everyone;
-- only super admins can change rows. Rows are created server-side with the service role.
drop policy if exists "profiles read own or admin" on public.admin_profiles;
create policy "profiles read own or admin" on public.admin_profiles
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "profiles update super admin" on public.admin_profiles;
create policy "profiles update super admin" on public.admin_profiles
  for update to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- site_content: the 'public' row is world-readable; everything else needs an admin.
drop policy if exists "content read" on public.site_content;
create policy "content read" on public.site_content
  for select to anon, authenticated
  using (id = 'public' or public.is_admin());

drop policy if exists "content insert admin" on public.site_content;
create policy "content insert admin" on public.site_content
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "content update admin" on public.site_content;
create policy "content update admin" on public.site_content
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- leads: anonymous visitors may only submit a fresh, small "Inquiry". They cannot read anything back.
drop policy if exists "leads insert public" on public.leads;
create policy "leads insert public" on public.leads
  for insert to anon, authenticated
  with check (
    data ->> 'leadStage' = 'Inquiry'
    and jsonb_array_length(coalesce(data -> 'notes', '[]'::jsonb)) = 0
    and pg_column_size(data) < 4000
  );

drop policy if exists "leads read admin" on public.leads;
create policy "leads read admin" on public.leads
  for select to authenticated using (public.is_admin());

drop policy if exists "leads update admin" on public.leads;
create policy "leads update admin" on public.leads
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads delete admin" on public.leads;
create policy "leads delete admin" on public.leads
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------- first admin
-- 1. Supabase dashboard -> Authentication -> Users -> "Add user" (email + password, auto-confirm).
-- 2. Run, with that user's email:
--
--   insert into public.admin_profiles (user_id, name, email, role)
--   select id, 'Manoj Rajgopal', email, 'super_admin'
--   from auth.users where email = 'you@example.com';
