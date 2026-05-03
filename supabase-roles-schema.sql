-- ============================================================
-- Nyx Scholars — Role + Assignment Migration
-- Adds:
--   • profiles.role            ('student' | 'teacher')
--   • assignments              one row per (student, teacher) link
-- Run AFTER supabase-portal-schema.sql and supabase-plan-schema.sql.
-- ============================================================

-- ----- profiles.role ----------------------------------------------------
alter table public.profiles
  add column if not exists role text
    check (role in ('student', 'teacher'))
    default 'student';

-- Backfill any null roles to 'student'.
update public.profiles set role = 'student' where role is null;

-- Update the auto-create trigger so new auth users get a role from
-- their signup metadata (raw_user_meta_data.role), defaulting to 'student'.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;


-- ----- assignments ------------------------------------------------------
-- Many-to-many link between students and teachers. The most common case
-- will be one teacher per student, but a student can have multiple
-- teachers (e.g. one for SAT, one for admissions).
create table if not exists public.assignments (
  id          uuid default gen_random_uuid() primary key,
  student_id  uuid references auth.users(id) on delete cascade not null,
  teacher_id  uuid references auth.users(id) on delete cascade not null,
  subject     text,
  active      boolean not null default true,
  created_at  timestamptz default now(),
  unique (student_id, teacher_id, subject)
);

create index if not exists assignments_student_id_idx on public.assignments(student_id);
create index if not exists assignments_teacher_id_idx on public.assignments(teacher_id);

alter table public.assignments enable row level security;

-- Students can see who they are assigned to.
create policy "Students can view their own assignments"
  on public.assignments for select
  using (auth.uid() = student_id);

-- Teachers can see the students assigned to them.
create policy "Teachers can view students assigned to them"
  on public.assignments for select
  using (auth.uid() = teacher_id);

-- Only the service role (admin) can create or modify assignments.
create policy "Service role full access to assignments"
  on public.assignments for all
  using (true)
  with check (true);


-- ----- session visibility for teachers ----------------------------------
-- Allow a teacher to view sessions belonging to their assigned students.
drop policy if exists "Teachers can view assigned students' sessions" on public.sessions;
create policy "Teachers can view assigned students' sessions"
  on public.sessions for select
  using (
    exists (
      select 1 from public.assignments a
      where a.teacher_id = auth.uid()
        and a.student_id = sessions.student_id
        and a.active = true
    )
  );

-- Allow a teacher to view messages with their assigned students.
drop policy if exists "Teachers can view assigned students' messages" on public.messages;
create policy "Teachers can view assigned students' messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.assignments a
      where a.teacher_id = auth.uid()
        and a.student_id = messages.student_id
        and a.active = true
    )
  );
