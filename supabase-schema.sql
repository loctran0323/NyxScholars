-- Nyx Scholars: Supabase Schema
-- Run this in the Supabase SQL Editor to set up the leads table.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  parent_name text,
  email text not null,
  phone text,
  grade text,
  service text not null,
  ap_subject text,
  current_score text,
  target_score text,
  test_date text,
  tutoring_format text,
  availability_notes text,
  help_needed text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table leads enable row level security;

-- Only allow service role (server-side) to insert and read
-- The anon key cannot read or write leads directly from the browser
create policy "service_role_all" on leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Index for quick listing by date
create index if not exists leads_created_at_idx on leads (created_at desc);
