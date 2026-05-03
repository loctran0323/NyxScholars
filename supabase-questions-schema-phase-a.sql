-- ============================================================
-- Phase A — Real Question Bank
-- Additive migration. Run AFTER supabase-questions-schema.sql.
-- ============================================================

-- Idempotency key for seed scripts and CSV imports.
alter table public.diagnostic_questions
  add column if not exists external_key text;

-- Partial unique index so two rows can both have NULL external_key
-- (hand-written questions don't need one), but seeded rows can't dup.
create unique index if not exists diagnostic_questions_external_key_unique
  on public.diagnostic_questions(external_key)
  where external_key is not null;

-- Updated-at trigger so the editor can show "last edited" without
-- the app having to set it on every PATCH.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

alter table public.diagnostic_questions
  add column if not exists updated_at timestamptz default now();

drop trigger if exists set_diagnostic_questions_updated_at on public.diagnostic_questions;
create trigger set_diagnostic_questions_updated_at
  before update on public.diagnostic_questions
  for each row execute function public.set_updated_at();
