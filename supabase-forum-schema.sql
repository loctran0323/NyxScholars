-- ============================================================
-- Nyx Scholars — Tutor Community Forum
-- Run AFTER supabase-portal-schema.sql + supabase-roles-schema.sql.
-- Tutors-only space for sharing approaches, lesson plans, and notes.
-- ============================================================

create table if not exists public.forum_threads (
  id          uuid default gen_random_uuid() primary key,
  author_id   uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  body        text not null,
  category    text not null check (category in ('approach', 'lesson_plan', 'win_story', 'tools', 'other')),
  pinned      boolean not null default false,
  reply_count int not null default 0,
  last_reply_at timestamptz default now(),
  created_at  timestamptz default now()
);

create index if not exists forum_threads_category_idx on public.forum_threads(category, last_reply_at desc);
create index if not exists forum_threads_author_idx   on public.forum_threads(author_id);

create table if not exists public.forum_replies (
  id          uuid default gen_random_uuid() primary key,
  thread_id   uuid references public.forum_threads(id) on delete cascade not null,
  author_id   uuid references auth.users(id) on delete cascade not null,
  body        text not null,
  created_at  timestamptz default now()
);

create index if not exists forum_replies_thread_idx on public.forum_replies(thread_id, created_at);

alter table public.forum_threads  enable row level security;
alter table public.forum_replies  enable row level security;

create policy "Teachers read all forum threads"
  on public.forum_threads for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher'));

create policy "Teachers create threads"
  on public.forum_threads for insert
  with check (auth.uid() = author_id and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher'));

create policy "Authors update their own threads"
  on public.forum_threads for update
  using (auth.uid() = author_id);

create policy "Teachers read all forum replies"
  on public.forum_replies for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher'));

create policy "Teachers create replies"
  on public.forum_replies for insert
  with check (auth.uid() = author_id and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher'));

create policy "Service role full access to forum_threads"
  on public.forum_threads for all using (true) with check (true);
create policy "Service role full access to forum_replies"
  on public.forum_replies for all using (true) with check (true);

-- Bump reply_count + last_reply_at when a reply is posted.
create or replace function public.bump_thread_after_reply()
returns trigger language plpgsql security definer as $$
begin
  update public.forum_threads
     set reply_count = reply_count + 1,
         last_reply_at = now()
   where id = new.thread_id;
  return new;
end;
$$;

drop trigger if exists on_forum_reply_created on public.forum_replies;
create trigger on_forum_reply_created
  after insert on public.forum_replies
  for each row execute procedure public.bump_thread_after_reply();
