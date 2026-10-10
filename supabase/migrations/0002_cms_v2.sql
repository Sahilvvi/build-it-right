-- Fin-Envision Learning — CMS v2.
--   * draft / publish workflow with revision history
--   * roles enforced in the database (not just the UI)
--   * append-only activity log
--   * media library (Storage bucket + asset table)
--   * lead capture only through the server (rate-limited), no open anonymous insert
--
-- Run after 0001_init.sql.

-- ------------------------------------------------------------------ site_content: draft row

do $$
declare c text;
begin
  select conname into c from pg_constraint
  where conrelid = 'public.site_content'::regclass and contype = 'c';
  if c is not null then execute format('alter table public.site_content drop constraint %I', c); end if;
end $$;

alter table public.site_content
  add constraint site_content_id_check check (id in ('public', 'draft', 'private'));

-- An empty draft ('{}') means "no unpublished changes".
insert into public.site_content (id, data) values ('draft', '{}') on conflict (id) do nothing;

-- Visibility: live content is world-readable. The draft is admin-only. SMTP settings ('private') are super-admin only.
drop policy if exists "content read" on public.site_content;
create policy "content read" on public.site_content
  for select to anon, authenticated
  using (
    id = 'public'
    or (id = 'draft' and public.is_admin())
    or (id = 'private' and public.is_super_admin())
  );

-- Writes: the live row is never writable through the API; it only changes via publish_site().
drop policy if exists "content insert admin" on public.site_content;
drop policy if exists "content update admin" on public.site_content;

create policy "content insert scoped" on public.site_content
  for insert to authenticated
  with check (
    (id = 'draft' and public.is_admin())
    or (id = 'private' and public.is_super_admin())
  );

create policy "content update scoped" on public.site_content
  for update to authenticated
  using (
    (id = 'draft' and public.is_admin())
    or (id = 'private' and public.is_super_admin())
  )
  with check (
    (id = 'draft' and public.is_admin())
    or (id = 'private' and public.is_super_admin())
  );

-- Custom <head>/<body> scripts run on every public page, so only a Super Admin may introduce them.
-- Promoting a draft that already carries a Super Admin's scripts is fine for any admin.
create or replace function public.tracking_scripts(d jsonb)
returns text
language sql
immutable
as $$
  select coalesce(d #>> '{tracking,customHeadScript}', '') || E'\u0001' || coalesce(d #>> '{tracking,customBodyScript}', '');
$$;

create or replace function public.guard_tracking_scripts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  baseline text;
  draft_scripts text;
begin
  if new.id not in ('draft', 'public') or public.is_super_admin() then
    return new;
  end if;
  -- Clearing a draft, or a service-role/system write without a user, is never a script change.
  if new.data = '{}'::jsonb or auth.uid() is null then
    return new;
  end if;

  if new.id = 'draft' then
    if tg_op = 'UPDATE' and old.data <> '{}'::jsonb then
      baseline := public.tracking_scripts(old.data);
    else
      select public.tracking_scripts(data) into baseline from public.site_content where id = 'public';
    end if;
    if public.tracking_scripts(new.data) is distinct from coalesce(baseline, public.tracking_scripts('{}')) then
      raise exception 'Only a Super Admin can change custom tracking scripts.' using errcode = '42501';
    end if;
  else
    select public.tracking_scripts(data) into draft_scripts from public.site_content where id = 'draft';
    if public.tracking_scripts(new.data) is distinct from public.tracking_scripts(old.data)
       and public.tracking_scripts(new.data) is distinct from draft_scripts then
      raise exception 'Only a Super Admin can change custom tracking scripts.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists site_content_guard_scripts on public.site_content;
create trigger site_content_guard_scripts
  before insert or update on public.site_content
  for each row execute function public.guard_tracking_scripts();

-- ------------------------------------------------------------------ revisions

create table if not exists public.site_revisions (
  id         uuid primary key default gen_random_uuid(),
  data       jsonb not null,
  note       text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);
create index if not exists site_revisions_created_at_idx on public.site_revisions (created_at desc);

alter table public.site_revisions enable row level security;
drop policy if exists "revisions read admin" on public.site_revisions;
create policy "revisions read admin" on public.site_revisions
  for select to authenticated using (public.is_admin());
-- No insert/update/delete policies: revisions are written only by publish_site().

create or replace function public.prune_revisions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.site_revisions
  where id in (select id from public.site_revisions order by created_at desc offset 40);
  return null;
end;
$$;

drop trigger if exists site_revisions_prune on public.site_revisions;
create trigger site_revisions_prune
  after insert on public.site_revisions
  for each statement execute function public.prune_revisions();

-- ------------------------------------------------------------------ publish / discard / restore

create or replace function public.publish_site(note text default null)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  d jsonb;
  ts timestamptz;
begin
  if not public.is_admin() then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  select data into d from public.site_content where id = 'draft';
  if d is null or d = '{}'::jsonb then
    raise exception 'There are no unpublished changes.';
  end if;

  update public.site_content set data = d where id = 'public' returning updated_at into ts;
  insert into public.site_revisions (data, note, created_by) values (d, note, auth.uid());
  update public.site_content set data = '{}'::jsonb where id = 'draft';
  return ts;
end;
$$;

create or replace function public.discard_draft()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  update public.site_content set data = '{}'::jsonb where id = 'draft';
end;
$$;

create or replace function public.restore_revision(rev uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  d jsonb;
begin
  if not public.is_admin() then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  select data into d from public.site_revisions where id = rev;
  if d is null then
    raise exception 'Revision not found.';
  end if;
  update public.site_content set data = d where id = 'draft';
end;
$$;

revoke all on function public.publish_site(text), public.discard_draft(), public.restore_revision(uuid)
  from public, anon;
grant execute on function public.publish_site(text), public.discard_draft(), public.restore_revision(uuid)
  to authenticated;

-- ------------------------------------------------------------------ activity log

create table if not exists public.activity_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id),
  user_name  text not null,
  action     text not null,
  target     text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists activity_log_created_at_idx on public.activity_log (created_at desc);

alter table public.activity_log enable row level security;
drop policy if exists "activity read admin" on public.activity_log;
create policy "activity read admin" on public.activity_log
  for select to authenticated using (public.is_admin());
drop policy if exists "activity insert own" on public.activity_log;
create policy "activity insert own" on public.activity_log
  for insert to authenticated with check (public.is_admin() and user_id = auth.uid());
-- Append-only: no update or delete policies.

-- ------------------------------------------------------------------ leads: server-only creation

drop policy if exists "leads insert public" on public.leads;
drop policy if exists "leads insert admin" on public.leads;
create policy "leads insert admin" on public.leads
  for insert to authenticated with check (public.is_admin());

-- Visitors submit through the server function, which rate-limits and then inserts with the service role.
create table if not exists public.lead_submissions (
  id         bigint generated always as identity primary key,
  ip_hash    text not null,
  created_at timestamptz not null default now()
);
create index if not exists lead_submissions_ip_idx on public.lead_submissions (ip_hash, created_at desc);
alter table public.lead_submissions enable row level security;
-- No policies at all: only the service role can touch this table.

-- ------------------------------------------------------------------ media library

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media read" on storage.objects;
create policy "media read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "media insert admin" on storage.objects;
create policy "media insert admin" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media update admin" on storage.objects;
create policy "media update admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media delete admin" on storage.objects;
create policy "media delete admin" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

create table if not exists public.media_assets (
  id         uuid primary key default gen_random_uuid(),
  path       text not null unique,
  name       text not null,
  mime_type  text not null default 'application/octet-stream',
  size_bytes bigint not null default 0,
  alt_text   text not null default '',
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users (id)
);
create index if not exists media_assets_created_at_idx on public.media_assets (created_at desc);

alter table public.media_assets enable row level security;
drop policy if exists "media_assets admin all" on public.media_assets;
create policy "media_assets admin all" on public.media_assets
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
