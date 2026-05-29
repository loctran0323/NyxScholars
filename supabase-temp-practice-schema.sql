-- ============================================================
-- Nyx Scholars — Temporary practice portal (Arush ↔ Talija)
-- Run this in the Supabase SQL editor. Idempotent and safe to re-run.
--
-- Backs the no-login /students/[slug] portal and the /talija tutor view.
-- Written exclusively via the service-role key from server routes, so no
-- per-user RLS policy is required; the tables are not readable with the
-- anon key. If this migration is NOT run, the app still works — practice
-- runs fully client-side and /talija simply shows "no synced results yet".
-- ============================================================

create table if not exists public.temp_practice_results (
  id            uuid default gen_random_uuid() primary key,
  slug          text not null,                 -- e.g. 'arush'
  mode          text not null,                 -- 'pacing' | 'content'
  module_id     text,                          -- pacing module id, if any
  skill         text,                          -- content skill key, if any
  answers       jsonb not null default '[]',   -- [{questionId, picked, ms, flagged}]
  total         int  not null default 0,
  correct_count int  not null default 0,
  duration_ms   int,
  created_at    timestamptz default now()
);

create index if not exists temp_practice_results_slug_idx
  on public.temp_practice_results(slug, created_at desc);

create table if not exists public.temp_homework (
  id            uuid default gen_random_uuid() primary key,
  slug          text not null,
  skills        jsonb not null default '[]',   -- array of skill keys
  question_ids  jsonb not null default '[]',   -- assigned question ids
  include_worked boolean not null default false,
  note          text,
  created_at    timestamptz default now()
);

create index if not exists temp_homework_slug_idx
  on public.temp_homework(slug, created_at desc);

-- Lock both tables down: RLS on, no anon policies. Only the service role
-- (used by the server routes) can read or write.
alter table public.temp_practice_results enable row level security;
alter table public.temp_homework enable row level security;

drop policy if exists "service role temp results" on public.temp_practice_results;
create policy "service role temp results"
  on public.temp_practice_results for all
  using (true) with check (true);

drop policy if exists "service role temp homework" on public.temp_homework;
create policy "service role temp homework"
  on public.temp_homework for all
  using (true) with check (true);
