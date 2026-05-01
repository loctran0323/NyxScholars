-- ============================================================
-- Nyx Scholars Student Portal — Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";


-- ============================================================
-- PROFILES
-- Extended data linked to Supabase Auth users.
-- ============================================================
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  full_name     text,
  grade         text,
  school        text,
  target_score  text,
  target_test   text check (target_test in ('SAT', 'ACT')),
  phone         text,
  created_at    timestamptz default now()
);

-- Auto-create a blank profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Service role has full access to profiles"
  on public.profiles for all
  using (true)
  with check (true);


-- ============================================================
-- SESSIONS
-- Tutoring session requests and confirmations.
-- ============================================================
create table if not exists public.sessions (
  id               uuid default gen_random_uuid() primary key,
  student_id       uuid references auth.users(id) on delete cascade not null,
  tutor_name       text,
  subject          text not null,
  scheduled_at     timestamptz not null,
  duration_minutes integer not null default 60,
  status           text not null default 'pending'
                   check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  meeting_link     text,
  student_notes    text,
  admin_notes      text,
  created_at       timestamptz default now()
);

-- Index for fast lookup by student
create index if not exists sessions_student_id_idx on public.sessions(student_id);
create index if not exists sessions_scheduled_at_idx on public.sessions(scheduled_at);

-- RLS
alter table public.sessions enable row level security;

create policy "Students can view own sessions"
  on public.sessions for select
  using (auth.uid() = student_id);

create policy "Students can insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = student_id);

create policy "Service role has full access to sessions"
  on public.sessions for all
  using (true)
  with check (true);


-- ============================================================
-- MESSAGES
-- Chat messages between students and the Nyx team.
-- ============================================================
create table if not exists public.messages (
  id         uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users(id) on delete cascade not null,
  sender     text not null check (sender in ('student', 'nyx')),
  content    text not null,
  read       boolean not null default false,
  created_at timestamptz default now()
);

-- Index for fast lookup by student
create index if not exists messages_student_id_idx on public.messages(student_id);
create index if not exists messages_created_at_idx on public.messages(created_at);

-- RLS
alter table public.messages enable row level security;

create policy "Students can view own messages"
  on public.messages for select
  using (auth.uid() = student_id);

create policy "Students can insert own messages (student sender only)"
  on public.messages for insert
  with check (auth.uid() = student_id and sender = 'student');

create policy "Students can update read status of own messages"
  on public.messages for update
  using (auth.uid() = student_id);

create policy "Service role has full access to messages"
  on public.messages for all
  using (true)
  with check (true);


-- ============================================================
-- OPTIONAL: Enable Realtime for live message updates
-- Run these in the Supabase Dashboard → Realtime section,
-- or uncomment here if using the Supabase CLI.
-- ============================================================
-- alter publication supabase_realtime add table public.messages;
-- alter publication supabase_realtime add table public.sessions;


-- ============================================================
-- NOTES
-- • The service_role key bypasses RLS — keep it server-side only.
-- • The anon key is safe to expose in the browser.
-- • Supabase Auth handles password hashing, JWTs, and sessions.
-- • Email confirmation is enabled by default in Supabase Auth.
--   Disable it in Dashboard → Auth → Email if you want instant login.
-- ============================================================
