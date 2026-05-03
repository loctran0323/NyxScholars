-- ============================================================
-- Nyx Scholars — Diagnostic Question Bank Migration
-- Run AFTER supabase-portal-schema.sql.
-- Adds a database-backed question pipeline. Static + generated items
-- live in lib/diagnostic/, but admins can also push custom items here
-- via /api/admin/questions, and the diagnostic API can mix them in.
-- ============================================================

create table if not exists public.diagnostic_questions (
  id            uuid default gen_random_uuid() primary key,
  skill_id      text not null,
  skill_name    text not null,
  section       text not null check (section in ('Math', 'Reading & Writing')),
  difficulty    int  not null check (difficulty between 1 and 5),
  prompt        text not null,
  choices       jsonb not null,           -- array of strings
  correct_index int  not null,
  rationale     text,
  source        text,
  status        text not null default 'active'
                  check (status in ('active', 'draft', 'retired')),
  origin        text not null default 'admin'
                  check (origin in ('admin', 'generated', 'static', 'community')),
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz default now()
);

create index if not exists diagnostic_questions_skill_idx
  on public.diagnostic_questions(skill_id);
create index if not exists diagnostic_questions_status_idx
  on public.diagnostic_questions(status);

alter table public.diagnostic_questions enable row level security;

-- Anyone signed in can read ACTIVE questions (needed by the runner).
create policy "Authenticated users can read active questions"
  on public.diagnostic_questions for select
  using (status = 'active');

-- Service role full access (for admin endpoint).
create policy "Service role full access to questions"
  on public.diagnostic_questions for all
  using (true) with check (true);


-- ============================================================
-- Per-attempt log so we can re-tune difficulty parameters later.
-- ============================================================
create table if not exists public.diagnostic_attempts (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade,
  question_id  text not null,    -- can be a static id like "alg-eq-1" OR a uuid
  skill_id     text not null,
  picked_index int  not null,
  correct      boolean not null,
  ms           int,
  theta_after  numeric,
  ci_after     numeric,
  created_at   timestamptz default now()
);

create index if not exists diagnostic_attempts_user_idx
  on public.diagnostic_attempts(user_id);

alter table public.diagnostic_attempts enable row level security;

create policy "Users can insert their own attempts"
  on public.diagnostic_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own attempts"
  on public.diagnostic_attempts for select
  using (auth.uid() = user_id);

create policy "Service role full access to attempts"
  on public.diagnostic_attempts for all
  using (true) with check (true);
