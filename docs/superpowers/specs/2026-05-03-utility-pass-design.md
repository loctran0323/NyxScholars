# Utility Pass — Cleanup, Question Bank, Tutoring Portal

**Date:** 2026-05-03
**Author:** Charles + Claude (brainstorm)
**Sequence:** Phase C → Phase A → Phase B

## Context

The audit of NyxScholars found a real-vs-stale split: diagnostic, homework, sessions, schedule, match, messages, forum, profile, billing, parental consent, and gift cards are DB-backed and working. Lessons (4 hand-written), Mock Tests (sampled from the diagnostic bank), Materials (25 external links), and the tutor roster (`lib/mock/tutors.ts`) are hardcoded. The question bank itself is 62 hand-written items in `lib/diagnostic/bank.ts` plus auto-generators — the `diagnostic_questions` DB table exists but is empty. Several admin pages (`broadcast`, `payouts`, `revenue`, `students`, `tutors`) are thin or stubbed.

Goal of this work: walk every link, make the surface honest (Phase C), give the platform a real DB-backed question bank with admin authoring (Phase A), then put the tutoring backbone on a real DB model with an admin-driven match queue (Phase B). Quality + maintainability lens throughout.

## Non-goals

- Tutor self-serve onboarding (verification, photo moderation, background checks). Deferred to a later phase.
- AI-assisted question generation tooling. Considered and rejected for v1 — quality of curation matters more than volume.
- A real algorithmic tutor matcher. v1 ranks on subject overlap + load only; richer fit signals come later.
- Pricing-table editing in admin. Pricing stays in `lib/pricing.ts`.
- Real full-length proctored mock tests. Mock-tests routes are gated behind Coming Soon in Phase C and remain so until a dedicated phase later.

---

## Phase C — Cleanup-First Pass (Honest Surface)

### Goal
Every link a user clicks lands on something real or on a polished placeholder. No dead admin links. No "video drops next quarter" embarrassments.

### Student-facing changes

- **New shared component** `components/portal/coming-soon-panel.tsx` — props: `feature`, `eta` (optional), `whatIsComing` (string or list), optional `notifyMeAction`. Single source of truth for the "Coming Soon" surface.
- **New shared nav badge** `components/portal/nav-badge.tsx` — used by sidebar entries to render a "Soon" pill consistently.
- `app/portal/lessons/page.tsx` and `app/portal/lessons/[id]/page.tsx` → render `<ComingSoonPanel>`. The `content.ts` file stays on disk but is no longer imported by routes (parked for later).
- `app/portal/mock-tests/page.tsx` and `app/portal/mock-tests/[id]/page.tsx` → render `<ComingSoonPanel>`. Mock-test runner code is preserved — it will be reused when real mock-tests ship.
- `app/portal/practice/page.tsx` — both modes (Skill Drill + SRS Review) stay live. A small `<InfoBanner>` appears above Skill Drill: *"Expanded question bank arriving — current pool is a starter set."* The banner is removed automatically when `/api/practice/drill` reports ≥30 published items per active skill (see Phase A).
- `app/portal/materials/page.tsx` — unchanged. The curated external-link hub is honest as-is.

### Admin-facing changes

- New `app/admin/_nav.ts` — single source of truth for admin sidebar entries (the original config in `app/admin/layout.tsx` was inline). This makes adding/removing entries a one-line edit.
- **Correction to the original audit:** `/admin/broadcast`, `/admin/payouts`, and `/admin/revenue` are not stubs — they're functional admin/ops surfaces (audience-segmented `notifyMany`, Stripe Connect linking, MRR/ARR derived from real `profiles`/`sessions` rows). They stay visible. No admin pages are deleted in Phase C.
- `/admin/students` and `/admin/tutors` stay as basic list views (already useful for ops; `/admin/tutors` will be promoted to full CRUD in Phase B).

### Acceptance

- Walking the portal as a student → no thin/embarrassing surfaces.
- Walking admin → no dead-end stubs.
- `npm run build` clean.

---

## Phase A — Real Question Bank

### Goal
Replace the static `lib/diagnostic/bank.ts` pool with a DB-backed bank that powers Diagnostic and Practice (Skill Drill). Give admin real authoring tools. Seed 50 starter items as drafts; user grows the bank from there.

### Data model

Reuse the existing `diagnostic_questions` table from `supabase-questions-schema.sql`. Extend it (additive migration, no breaking changes):

```sql
alter table diagnostic_questions
  add column if not exists status        text not null default 'draft',  -- 'draft'|'published'|'retired'
  add column if not exists source        text not null default 'hand',   -- 'hand'|'ai-seed'|'imported'
  add column if not exists author_id     uuid references profiles(id),
  add column if not exists explanation   text,
  add column if not exists assets        jsonb,
  add column if not exists external_key  text,                            -- for idempotent seeding
  add column if not exists retired_at    timestamptz,
  add column if not exists updated_at    timestamptz not null default now();

create index if not exists questions_status_test_section_skill_diff
  on diagnostic_questions(status, test, section, skill, difficulty);
create unique index if not exists questions_external_key_unique
  on diagnostic_questions(external_key) where external_key is not null;
```

Existing IRT params (`a_param`, `b_param`, `c_param`) are preserved.

### RLS

- Students: read where `status='published'`.
- Tutors: read where `status='published'`.
- Admin (`role='admin'` in profiles): full read/write.

### Read paths

- `lib/questions/repo.ts` — single source of truth for question reads.
  - `getPublishedPool({test, section?, skills?, limit, excludeIds})`
  - `getById(id)`
  - `searchAdmin(filters)`
  - `countsBy({test, section, skill, status})`
- `app/api/diagnostic/pool/route.ts` → calls `getPublishedPool`. **Graceful migration:** if the DB returns < N for the requested skill, fall back to the existing `lib/diagnostic/bank.ts` static pool and log a one-line warning. The fallback is removed once the bank is seeded above threshold.
- New `app/api/practice/drill/route.ts` → wraps `getPublishedPool` for Skill Drill.
- `app/portal/practice/page.tsx` — Skill Drill calls `/api/practice/drill?skill=…&n=10` instead of the static `POOL`.

### Admin authoring (`/admin/questions`)

Real authoring surface, not a JSON editor. Components live under `components/admin/questions/`.

- **List view** — filters (test, section, skill, status, source); search; per-cell counts. Bulk actions: publish, retire, export CSV.
- **Editor drawer** — fields: test, section, skill, difficulty, stem (Markdown + KaTeX), choices builder, answer picker, explanation, assets uploader (Supabase Storage bucket `question-assets`), tags. Live "preview as student" panel beside editor.
- **Draft/Publish workflow** — every new item starts as `draft`. Publish requires: stem non-empty, valid answer, ≥2 choices for MCQ (or grid-in flag), explanation non-empty. Retire is non-destructive (sets `retired_at`, hides from student reads).
- **CSV importer** — upload CSV with documented schema; preview parsed rows + validation errors before commit. Imported rows land as `draft` for review.
- **Stats panel** — coverage matrix (skill × difficulty count, published only), so the user sees where the bank is thin.

### Seeding

- `scripts/seed-questions.ts` — idempotent, matches by `(source='ai-seed', external_key)`. Inserts 50 starter items (~30 SAT, ~20 ACT) across the existing skill taxonomy with varied difficulty. **All items land as `draft`** — nothing reaches students until the user clicks Publish in `/admin/questions`.
- `scripts/README-seeding.md` documents CSV format and idempotency rules.

### Tests

- Unit: `repo.ts` — pool selection respects `published` only, excludes ids, honors limit.
- Unit: validators — draft → publish gate rejects malformed.
- Integration: hit `/api/practice/drill` against a seeded test DB, assert published-only.
- Manual checklist: admin creates → previews → publishes → student sees in drill.

### Acceptance

- `/admin/questions` is a usable curation tool.
- 50 items seeded as drafts.
- Practice Skill Drill, Diagnostic, and `/admin/questions` all read from `diagnostic_questions`.
- Static `lib/diagnostic/bank.ts` retained only as named-fallback during transition; banner removes itself when threshold crossed.

---

## Phase B — Tutoring Portal Backbone

### Goal
Replace the hardcoded tutor roster + manual SQL assignment with a DB-backed tutor model and an admin match-queue with suggested matches.

### Data model

```sql
create table tutors (
  id                 uuid primary key default gen_random_uuid(),
  profile_id         uuid not null unique references profiles(id) on delete cascade,
  display_name       text not null,
  headline           text,
  bio                text,                       -- markdown
  photo_url          text,
  subjects           text[] not null default '{}', -- e.g. ['sat-math','sat-reading']
  tests              text[] not null default '{}', -- ['sat','act']
  hourly_rate_cents  int,
  calendar_url       text,
  meeting_url        text,
  timezone           text,
  status             text not null default 'active', -- 'active'|'paused'|'archived'
  capacity_weekly    int default 8,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index tutors_status_subjects on tutors(status) include (subjects);
```

`assignments` table stays as-is.

### RLS

- Students: read `status='active'` rows of tutors they're assigned to (or all active tutors when assignment-creation flow needs preview).
- Tutors: read/write their own row (matched by `profile_id = auth.uid()`).
- Admins: full read/write.

### Read paths

- `lib/tutors/repo.ts` — single source of truth.
  - `listActive({test?, subject?})`
  - `getById(id)`
  - `getByProfileId(profileId)`
  - `searchAdmin(filters)`
  - `countLoad(tutorId)` — active assignment count for current week
- `lib/mock/tutors.ts` is **deleted**. Any import is replaced with `tutorsRepo.listActive()`.
- `app/portal/schedule/page.tsx` → reads from repo; tutor cards render real DB data.
- `app/portal/match/page.tsx` → already DB-backed via `assignments`; the only change is removing the mock fallback.
- New `app/portal/teacher/profile/page.tsx` — tutor edits their own `tutors` row (bio, headline, photo, calendar/meeting URLs, subjects, capacity, timezone). Hourly rate and status are admin-only and not exposed here.

### Admin tutor CRUD (`/admin/tutors`)

Promote the existing thin list page:

- **List view** — table with photo, name, subjects, status, current load (`countLoad`), capacity, hourly rate. Filters by status/subject.
- **Create tutor** — form that:
  1. Looks up an existing `profiles` row by email, or creates one with `role='tutor'`.
  2. Inserts the matching `tutors` row.
  3. Sends a "your tutor profile is ready, complete your bio" email.
- **Edit tutor** — drawer with all `tutors` fields; admin can edit any field including rate/status.
- **Archive** — sets `status='archived'`; tutor hidden from match suggestions; historical assignments preserved.

### Match queue (`/admin/match-queue`)

New admin surface for assigning students to tutors with suggested matches:

- **Queue list** — students in state `intake_done AND no_active_assignment`. Each row shows student name, target test/score, diagnostic summary (top weak skills, theta), days waiting.
- **Suggested matches panel (per student)** — top 3 tutors ranked by:
  1. Subject overlap with student's target test/section (hard filter — must match at least one subject).
  2. Active load relative to `capacity_weekly` (lower load is better).
  3. Tie-broken by tutor `created_at` (longer-tenured first), so ranking is deterministic.
  Each suggestion shows the tutor card + reason ("3 of 4 target subjects match · 2 of 5 weekly slots used").
- **Confirm assignment** — admin clicks "Assign" → inserts `assignments` row → fires `assignment.created` event → student notified (existing notification infra) → tutor emailed.
- **Override** — admin can pick any active tutor outside the top 3 from a searchable dropdown.

The ranker lives in `lib/match/rank.ts` as a pure function:
```ts
rankTutors(student: StudentForMatch, tutors: TutorWithLoad[]): RankedTutor[]
```
so it can be unit-tested without DB.

### Admin nav

`/admin/match-queue` and the now-real `/admin/tutors` and `/admin/students` are added to `app/admin/_nav.ts` (introduced in Phase C). The deleted stubs (`broadcast`, `payouts`, `revenue`) remain absent.

### Migration of existing data

- `scripts/migrate-mock-tutors.ts` — one-time, idempotent script:
  1. For each entry in `lib/mock/tutors.ts`, find `profiles` row by email or create one with `role='tutor'`.
  2. Upsert into `tutors` (idempotent on `profile_id`).
- After running, `lib/mock/tutors.ts` is deleted and any remaining imports are removed.
- Existing `assignments` rows are untouched; they already point at `profiles.id`, which is `tutors.profile_id`.

### Tests

- Unit: `rankTutors` — subject filter, load weighting, deterministic tiebreak.
- Unit: `tutorsRepo.listActive` honors status filter; `countLoad` counts only active week.
- Integration: admin creates a tutor, edits, archives — round-trips through DB and reflects in `/portal/schedule`.
- Integration: match-queue assignment writes the `assignments` row and triggers notification.
- Manual checklist: walk a fresh student diagnostic → match-queue → assignment → first session booking.

### Acceptance

- Hardcoded tutor roster is gone (`lib/mock/tutors.ts` deleted).
- Admin can create/edit tutors with no SQL.
- Match-queue surfaces suggested tutors with visible reasoning; admin assigns in two clicks.
- Student and tutor are notified.
- Schedule page renders tutors from DB.

---

## Cross-cutting concerns

- **Auth:** All new routes use the `requirePortalUser` / `getPortalApi` / `requireTutorUser` helpers from `lib/portal-auth.ts` (no inline supabase boilerplate).
- **Boundaries:** Each feature has a `repo.ts` for DB reads and a thin route layer. Admin authoring uses dedicated server actions or API routes; no DB calls from client components.
- **Migration safety:** All schema changes are additive (`add column if not exists`, `create index if not exists`). No destructive renames in v1.
- **Observability:** Server-side console.warn on bank-fallback events (Phase A) so we can tell when seeding is enough to remove the fallback.

## Sequencing

1. Phase C lands first as a self-contained PR — quick win, removes the embarrassment.
2. Phase A lands second; the Skill Drill banner from Phase C auto-removes once threshold is crossed.
3. Phase B lands third; depends on no part of A but is the largest scope, so it goes last.

Each phase ships its own implementation plan via the writing-plans skill.
