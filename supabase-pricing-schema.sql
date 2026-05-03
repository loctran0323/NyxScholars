-- ============================================================
-- Nyx Scholars — Pricing config (admin-editable plan overrides)
-- Run AFTER supabase-portal-schema.sql.
-- ============================================================

create table if not exists public.pricing_config (
  id              text primary key,         -- 'session', 'monthly', 'two-month', 'three-month', 'admissions'
  name            text not null,            -- display name
  weeks           int,
  hours_per_week  int,
  total_hours     int,
  total_price     int,                      -- USD whole dollars
  effective_hourly int,
  discount_pct    int,
  summary         text,
  recommended     boolean default false,
  enabled         boolean default true,
  stripe_price_id text,
  updated_at      timestamptz default now()
);

alter table public.pricing_config enable row level security;

create policy "Anyone can read enabled pricing config"
  on public.pricing_config for select
  using (enabled = true);

create policy "Service role full access to pricing_config"
  on public.pricing_config for all
  using (true) with check (true);

-- Seed defaults — `on conflict do nothing` so re-running the migration
-- doesn't clobber admin edits.
insert into public.pricing_config
  (id, name, weeks, hours_per_week, total_hours, total_price, effective_hourly, discount_pct, summary, recommended)
values
  ('month',       'Monthly Cadence',     4,  2,  8,  1200, 150,  6,  'Two 60-minute sessions a week for four weeks. The sampler.', false),
  ('two-month',   'Two-Month Cadence',   8,  2,  16, 2240, 140,  12, 'Two sessions a week for eight weeks. Most students start here.', true),
  ('three-month', 'Three-Month Cadence', 12, 2,  24, 3120, 130,  19, 'Two sessions a week for twelve weeks. The full prep arc.', false)
on conflict (id) do nothing;
