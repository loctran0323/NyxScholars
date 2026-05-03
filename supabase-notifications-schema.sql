-- ============================================================
-- Nyx Scholars — Notifications, Audit Log, Webhook Idempotency
-- Run AFTER supabase-portal-schema.sql.
-- ============================================================

-- ----- notifications ----------------------------------------------------
create table if not exists public.notifications (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  kind        text not null,           -- e.g. 'session.reminder', 'message.tutor', 'billing.failed'
  title       text not null,
  body        text,
  href        text,                    -- click-through target inside the portal
  meta        jsonb,
  read_at     timestamptz,
  created_at  timestamptz default now()
);

create index if not exists notifications_user_idx
  on public.notifications(user_id, created_at desc);
create index if not exists notifications_user_unread_idx
  on public.notifications(user_id) where read_at is null;

alter table public.notifications enable row level security;

create policy "Users read their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users mark their own notifications read"
  on public.notifications for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Service role full access to notifications"
  on public.notifications for all
  using (true) with check (true);

-- ----- audit_log --------------------------------------------------------
create table if not exists public.audit_log (
  id          uuid default gen_random_uuid() primary key,
  actor_id    uuid,                    -- the user (or admin) who took the action
  actor_email text,
  subject_id  uuid,                    -- the affected user (when applicable)
  action      text not null,           -- e.g. 'profile.update', 'session.cancel', 'admin.role.change'
  details     jsonb,
  ip          text,
  user_agent  text,
  created_at  timestamptz default now()
);

create index if not exists audit_log_subject_idx on public.audit_log(subject_id, created_at desc);
create index if not exists audit_log_actor_idx   on public.audit_log(actor_id,   created_at desc);

alter table public.audit_log enable row level security;

-- Only service role writes; admins (separate auth) read via service-role API.
create policy "Service role full access to audit_log"
  on public.audit_log for all
  using (true) with check (true);

-- ----- webhook_events (idempotency) -------------------------------------
create table if not exists public.webhook_events (
  id            text primary key,        -- the provider event id (Stripe evt_...)
  provider      text not null default 'stripe',
  type          text not null,
  received_at   timestamptz default now(),
  processed_at  timestamptz,
  payload       jsonb,
  error         text
);

create index if not exists webhook_events_processed_idx
  on public.webhook_events(processed_at);

alter table public.webhook_events enable row level security;
create policy "Service role full access to webhook_events"
  on public.webhook_events for all
  using (true) with check (true);

-- ----- profile timezone + notification prefs ----------------------------
alter table public.profiles
  add column if not exists timezone text,
  add column if not exists locale text default 'en-US',
  add column if not exists onboarding_state jsonb default '{}'::jsonb,
  add column if not exists parent_email text,
  add column if not exists parent_name  text,
  add column if not exists parental_consent_at timestamptz,
  add column if not exists nps_score    int,
  add column if not exists nps_at       timestamptz,
  add column if not exists notif_prefs  jsonb default '{}'::jsonb;
