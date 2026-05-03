-- ============================================================
-- Phase B — Tutors satellite table (1-to-1 with profiles)
-- Run AFTER supabase-portal-schema.sql.
-- Depends on set_updated_at() from supabase-questions-schema-phase-a.sql.
-- ============================================================

create table if not exists public.tutors (
  id                 uuid default gen_random_uuid() primary key,
  profile_id         uuid not null unique references public.profiles(id) on delete cascade,
  display_name       text not null,
  headline           text,
  bio                text,
  photo_url          text,
  subjects           text[] not null default '{}'::text[],
  tests              text[] not null default '{}'::text[],
  hourly_rate_cents  int,
  calendar_url       text,
  meeting_url        text,
  timezone           text,
  status             text not null default 'active' check (status in ('active', 'paused', 'archived')),
  capacity_weekly    int default 8,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists tutors_status_idx     on public.tutors(status);
create index if not exists tutors_profile_id_idx on public.tutors(profile_id);

alter table public.tutors enable row level security;

create policy "Tutors manage their own row"
  on public.tutors for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "Authenticated users read active tutors"
  on public.tutors for select
  using (status = 'active');

create policy "Service role full access to tutors"
  on public.tutors for all
  using (true) with check (true);

drop trigger if exists set_tutors_updated_at on public.tutors;
create trigger set_tutors_updated_at
  before update on public.tutors
  for each row execute function public.set_updated_at();
