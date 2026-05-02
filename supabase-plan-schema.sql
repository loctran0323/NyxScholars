-- ============================================================
-- Nyx Scholars — Plan / Subscription Schema Migration
-- Run this in the Supabase SQL Editor after supabase-portal-schema.sql
-- ============================================================

alter table public.profiles
  add column if not exists plan        text check (plan in ('session', 'monthly', 'counseling')),
  add column if not exists plan_status text check (plan_status in ('active', 'paused', 'cancelled')),
  -- For session plan: which subject category ('SAT', 'ACT', 'AP', 'College Admissions')
  add column if not exists plan_subject text,
  -- Add-ons for the monthly plan, e.g. ['counseling']
  add column if not exists plan_addons  text[] default '{}';
