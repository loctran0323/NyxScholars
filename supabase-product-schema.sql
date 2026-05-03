-- ============================================================
-- Nyx Scholars — Tutoring Product Schema
-- Adds: homework, session recordings, session summaries, SRS cards,
--       availability, tutor verification, gift card codes.
-- Run AFTER supabase-portal-schema.sql + supabase-notifications-schema.sql.
-- ============================================================

-- ----- session media + summary ------------------------------------------
alter table public.sessions
  add column if not exists recording_url    text,
  add column if not exists recording_provider text,        -- 'mux' | 'cloudflare' | etc.
  add column if not exists recording_duration_sec int,
  add column if not exists transcript_url   text,
  add column if not exists summary_topics   text[],
  add column if not exists summary_mistakes text[],
  add column if not exists summary_homework text[],
  add column if not exists summary_status   text default 'pending'
    check (summary_status in ('pending', 'drafted', 'sent')),
  add column if not exists summary_sent_at  timestamptz,
  add column if not exists is_group         boolean default false,
  add column if not exists group_capacity   int default 1,
  add column if not exists timezone         text;

-- ----- homework ---------------------------------------------------------
create table if not exists public.homework (
  id          uuid default gen_random_uuid() primary key,
  student_id  uuid references auth.users(id) on delete cascade not null,
  tutor_id    uuid references auth.users(id) on delete set null,
  session_id  uuid references public.sessions(id) on delete set null,
  title       text not null,
  body        text,
  due_at      timestamptz,
  questions   jsonb default '[]'::jsonb,    -- array of {prompt, choices, correct_index, rationale}
  results     jsonb,                        -- array of {picked_index, correct, ms}
  completed_at timestamptz,
  created_at  timestamptz default now()
);

create index if not exists homework_student_idx on public.homework(student_id, created_at desc);

alter table public.homework enable row level security;

create policy "Students read their own homework"
  on public.homework for select
  using (auth.uid() = student_id);
create policy "Students update their own homework completion"
  on public.homework for update
  using (auth.uid() = student_id) with check (auth.uid() = student_id);
create policy "Tutors read homework they created"
  on public.homework for select
  using (auth.uid() = tutor_id);
create policy "Service role full access to homework"
  on public.homework for all using (true) with check (true);


-- ----- spaced-repetition cards ------------------------------------------
create table if not exists public.srs_cards (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  skill_id    text not null,
  prompt      text not null,
  answer      text not null,
  interval_days int not null default 0,
  ease        numeric not null default 2.5,
  due_at      timestamptz not null default now(),
  reps        int not null default 0,
  lapses      int not null default 0,
  created_at  timestamptz default now()
);
create index if not exists srs_cards_user_due_idx on public.srs_cards(user_id, due_at);

alter table public.srs_cards enable row level security;
create policy "Users read own SRS cards"
  on public.srs_cards for select using (auth.uid() = user_id);
create policy "Users insert own SRS cards"
  on public.srs_cards for insert with check (auth.uid() = user_id);
create policy "Users update own SRS cards"
  on public.srs_cards for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Service role full access to srs_cards"
  on public.srs_cards for all using (true) with check (true);


-- ----- tutor availability -----------------------------------------------
create table if not exists public.tutor_availability (
  id          uuid default gen_random_uuid() primary key,
  tutor_id    uuid references auth.users(id) on delete cascade not null,
  weekday     int not null check (weekday between 0 and 6),    -- 0=Sun
  start_min   int not null check (start_min between 0 and 1439), -- minutes from midnight
  end_min     int not null check (end_min between 1 and 1440),
  timezone    text not null default 'America/New_York',
  created_at  timestamptz default now()
);
create index if not exists tutor_availability_tutor_idx on public.tutor_availability(tutor_id);

create table if not exists public.tutor_unavailability (
  id          uuid default gen_random_uuid() primary key,
  tutor_id    uuid references auth.users(id) on delete cascade not null,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  reason      text,
  created_at  timestamptz default now()
);
create index if not exists tutor_unavailability_tutor_idx on public.tutor_unavailability(tutor_id, starts_at);


-- ----- tutor verification + payouts -------------------------------------
alter table public.profiles
  add column if not exists verified_at         timestamptz,
  add column if not exists verified_by         text,
  add column if not exists nda_signed_at       timestamptz,
  add column if not exists background_check_status text
    check (background_check_status in ('not_started', 'pending', 'cleared', 'flagged')),
  add column if not exists background_check_at timestamptz,
  add column if not exists stripe_account_id   text,
  add column if not exists stripe_account_status text;


-- ----- gift cards -------------------------------------------------------
create table if not exists public.gift_cards (
  id              uuid default gen_random_uuid() primary key,
  code            text unique not null,
  amount_cents    int not null,
  remaining_cents int not null,
  recipient_name  text,
  recipient_email text,
  sender_name     text,
  message         text,
  deliver_at      timestamptz,
  delivered_at    timestamptz,
  redeemed_by     uuid references auth.users(id),
  redeemed_at     timestamptz,
  stripe_session_id text,
  created_at      timestamptz default now()
);

alter table public.gift_cards enable row level security;
create policy "Service role full access to gift_cards"
  on public.gift_cards for all using (true) with check (true);


-- ----- experiments (A/B) ------------------------------------------------
create table if not exists public.experiment_assignments (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade,
  anonymous_id text,
  experiment   text not null,
  variant      text not null,
  assigned_at  timestamptz default now()
);
create index if not exists experiment_user_idx on public.experiment_assignments(user_id, experiment);
create index if not exists experiment_anon_idx on public.experiment_assignments(anonymous_id, experiment);
