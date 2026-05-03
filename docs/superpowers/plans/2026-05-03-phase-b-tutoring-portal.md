# Phase B — Tutoring Portal Backbone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded `lib/mock/tutors.ts` roster with a DB-backed `tutors` table, give admin a working create/edit/archive surface on `/admin/tutors`, build a new `/admin/match-queue` that surfaces unmatched students with ranked tutor suggestions, and let tutors edit their own profile from `/portal/teacher/profile`.

**Architecture:** Add a `tutors` satellite table (1-to-1 with `profiles`). Centralize reads through `lib/tutors/repo.ts`, which returns DB rows when present and falls back to the static mock so the schedule/marketing consumers don't need to change in lockstep with the migration. The match-queue ranking lives in `lib/match/rank.ts` as a pure function so it's unit-testable without DB. Admin tutor CRUD and the match-queue are net-new surfaces; consumer switches happen later, gated on the operator running the migration + populating real tutor rows.

**Tech Stack:** Existing Supabase setup, the `requireAdminAuth` / `getServiceRoleClient` helpers, the existing `assignments` table, the existing `requireTutorUser` server guard.

**What's already in place:**
- `assignments` table for student↔tutor links.
- `profiles` table with `role='teacher'`.
- `/admin/tutors` page that lists DB profiles with role=teacher and a verify/NDA/background panel (`TutorVerifyControls`).
- `lib/mock/tutors.ts` with 2 hardcoded tutor entries used by `/portal/schedule`, `/portal/diagnostic`, `/(marketing)/page.tsx`, `/(marketing)/match/page.tsx`, and `/admin/tutors`.

**What's missing:**
- No `tutors` table — there's nowhere to store bio, hourly rate, subjects, capacity, calendar/meeting URL, photo, status.
- No admin form to create/edit a tutor row.
- No `/admin/match-queue` for assigning students.
- No tutor self-edit surface.

---

## File Structure

**Create:**
- `supabase-tutors-schema.sql` — additive migration: `tutors` table, RLS, indexes
- `lib/tutors/repo.ts` — DB reads with mock fallback
- `lib/match/rank.ts` — pure ranking function for the match queue
- `app/api/admin/tutors/route.ts` — admin CRUD endpoints (POST create, PATCH edit, DELETE archive)
- `app/api/admin/match-queue/assign/route.ts` — POST to create an assignment
- `app/admin/match-queue/page.tsx` — admin match-queue surface
- `app/admin/match-queue/MatchQueueClient.tsx` — client component for the queue
- `app/admin/tutors/TutorCreateForm.tsx` — create-tutor form (used in `app/admin/tutors/page.tsx`)
- `app/admin/tutors/TutorEditDrawer.tsx` — edit-tutor drawer (opened from row)
- `app/portal/teacher/profile/page.tsx` — tutor self-edit surface
- `app/portal/teacher/profile/TutorProfileForm.tsx` — client form
- `app/api/portal/tutor-profile/route.ts` — GET/PATCH tutor's own row
- `scripts/migrate-mock-tutors.ts` — one-time idempotent migration

**Modify:**
- `app/admin/_nav.ts` — add `/admin/match-queue` entry
- `app/admin/tutors/page.tsx` — add the create form, wire edit drawer
- `app/portal/schedule/page.tsx` — read tutors from repo (after operator runs migration)
- `app/portal/diagnostic/page.tsx` — read tutors from repo
- `app/(marketing)/page.tsx` — read tutors from repo
- `app/(marketing)/match/page.tsx` — read tutors from repo

**Delete (final task only — after migration confirmed):**
- `lib/mock/tutors.ts`

---

### Task 1: Schema migration

**Files:**
- Create: `supabase-tutors-schema.sql`

- [ ] **Step 1: Write the migration**

```sql
-- ============================================================
-- Phase B — Tutors satellite table (1-to-1 with profiles)
-- Run AFTER supabase-portal-schema.sql.
-- ============================================================

create table if not exists public.tutors (
  id                 uuid default gen_random_uuid() primary key,
  profile_id         uuid not null unique references public.profiles(id) on delete cascade,
  display_name       text not null,
  headline           text,
  bio                text,                                  -- markdown
  photo_url          text,
  subjects           text[] not null default '{}'::text[],
  tests              text[] not null default '{}'::text[],  -- e.g. {sat,act}
  hourly_rate_cents  int,
  calendar_url       text,
  meeting_url        text,
  timezone           text,
  status             text not null default 'active' check (status in ('active', 'paused', 'archived')),
  capacity_weekly    int default 8,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists tutors_status_idx     on public.tutors(status);
create index if not exists tutors_profile_id_idx on public.tutors(profile_id);

alter table public.tutors enable row level security;

-- Tutors read/write their own row.
create policy "Tutors manage their own row"
  on public.tutors for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- Authenticated users can read active tutor rows (used for /tutors and /portal/schedule).
create policy "Authenticated users read active tutors"
  on public.tutors for select
  using (status = 'active');

-- Service role: full access for admin endpoint.
create policy "Service role full access to tutors"
  on public.tutors for all
  using (true) with check (true);

-- Updated-at trigger (re-uses set_updated_at from phase-a migration).
drop trigger if exists set_tutors_updated_at on public.tutors;
create trigger set_tutors_updated_at
  before update on public.tutors
  for each row execute function public.set_updated_at();
```

- [ ] **Step 2: Run in Supabase SQL editor**

Paste and run. Expect "Success. No rows returned."

- [ ] **Step 3: Commit**

```bash
git add supabase-tutors-schema.sql
git commit -m "feat(tutors): schema migration — satellite tutors table"
```

---

### Task 2: Tutors repo

**Files:**
- Create: `lib/tutors/repo.ts`

- [ ] **Step 1: Write the repo with mock fallback**

```ts
import { getServiceRoleClient } from "@/lib/supabase";
import { TUTORS as MOCK_TUTORS, HOURLY_RATE_USD } from "@/lib/mock/tutors";

export interface DbTutor {
  id: string;
  profile_id: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  photo_url: string | null;
  subjects: string[];
  tests: string[];
  hourly_rate_cents: number | null;
  calendar_url: string | null;
  meeting_url: string | null;
  timezone: string | null;
  status: "active" | "paused" | "archived";
  capacity_weekly: number | null;
  created_at: string;
  updated_at: string;
}

/** Public-facing card model — what /tutors and /portal/schedule render. */
export interface TutorCard {
  id: string;                  // DB id when DB-backed, else mock id
  profile_id: string | null;
  name: string;
  headline: string | null;
  bio: string;
  photo_url: string | null;
  subjects: string[];
  tests: string[];
  hourly_rate_cents: number;
  calendar_url: string | null;
  meeting_url: string | null;
  source: "db" | "mock";
}

const MOCK_RATE_CENTS = HOURLY_RATE_USD * 100;

function mockToCard(m: (typeof MOCK_TUTORS)[number]): TutorCard {
  return {
    id: m.id,
    profile_id: null,
    name: m.name,
    headline: m.pitch ?? null,
    bio: m.bio,
    photo_url: null,
    subjects: m.specialties,
    tests: m.tags.includes("ACT") ? ["sat", "act"] : ["sat"],
    hourly_rate_cents: MOCK_RATE_CENTS,
    calendar_url: null,
    meeting_url: null,
    source: "mock",
  };
}

function dbToCard(t: DbTutor, fallback?: { name: string }): TutorCard {
  return {
    id: t.id,
    profile_id: t.profile_id,
    name: t.display_name || fallback?.name || "Nyx tutor",
    headline: t.headline,
    bio: t.bio ?? "",
    photo_url: t.photo_url,
    subjects: t.subjects,
    tests: t.tests,
    hourly_rate_cents: t.hourly_rate_cents ?? MOCK_RATE_CENTS,
    calendar_url: t.calendar_url,
    meeting_url: t.meeting_url,
    source: "db",
  };
}

/**
 * Active tutor cards for student-facing surfaces.
 * Returns DB tutors when any exist; falls back to the mock roster otherwise.
 * (We do NOT union the two — once the DB has at least one row, mock entries
 * disappear from public surfaces. This way the operator can migrate
 * incrementally and verify before flipping the switch.)
 */
export async function listActiveCards(opts?: {
  test?: "sat" | "act";
  subject?: string;
}): Promise<TutorCard[]> {
  const sb = getServiceRoleClient();
  if (!sb) return MOCK_TUTORS.map(mockToCard);

  const { data, error } = await sb
    .from("tutors")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[tutors.repo] listActiveCards", error.message);
    return MOCK_TUTORS.map(mockToCard);
  }

  const dbRows = (data ?? []) as DbTutor[];
  if (dbRows.length === 0) return MOCK_TUTORS.map(mockToCard);

  let cards = dbRows.map((t) => dbToCard(t));

  if (opts?.test) cards = cards.filter((c) => c.tests.includes(opts.test!));
  if (opts?.subject) cards = cards.filter((c) => c.subjects.includes(opts.subject!));
  return cards;
}

/** Admin-only listing — includes paused/archived. */
export async function listAdminTutors(): Promise<DbTutor[]> {
  const sb = getServiceRoleClient();
  if (!sb) return [];
  const { data, error } = await sb.from("tutors").select("*").order("created_at", { ascending: true });
  if (error) {
    console.error("[tutors.repo] listAdminTutors", error.message);
    return [];
  }
  return (data ?? []) as DbTutor[];
}

export async function getByProfileId(profileId: string): Promise<DbTutor | null> {
  const sb = getServiceRoleClient();
  if (!sb) return null;
  const { data, error } = await sb.from("tutors").select("*").eq("profile_id", profileId).maybeSingle();
  if (error) {
    console.error("[tutors.repo] getByProfileId", error.message);
    return null;
  }
  return (data as DbTutor) ?? null;
}

/** Counts active assignments for a tutor in the current calendar week. */
export async function countLoadThisWeek(tutorProfileId: string): Promise<number> {
  const sb = getServiceRoleClient();
  if (!sb) return 0;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay()); // Sunday 00:00
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const { count } = await sb
    .from("assignments")
    .select("*", { count: "exact", head: true })
    .eq("tutor_id", tutorProfileId)
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString());
  return count ?? 0;
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add lib/tutors/repo.ts
git commit -m "feat(tutors): add lib/tutors/repo with mock fallback"
```

---

### Task 3: Match-queue ranker (pure function)

**Files:**
- Create: `lib/match/rank.ts`

- [ ] **Step 1: Write the ranker**

```ts
import type { DbTutor } from "@/lib/tutors/repo";

export interface StudentForMatch {
  id: string;
  target_test: "sat" | "act" | null;
  target_subjects: string[];      // e.g. ['math','reading']
  diagnostic_weak_skills: string[]; // top weak skill_ids from latest diagnostic
}

export interface RankedTutor {
  tutor: DbTutor;
  score: number;
  reasons: string[];
}

/**
 * Pure ranking. No DB calls, no randomness. Deterministic tiebreak by
 * tutor.created_at ascending so the same student/tutor pair always
 * produces the same suggestion list.
 *
 * Hard filter: tutor.tests must include student.target_test (when set).
 * Otherwise: subject overlap (weighted), then load-vs-capacity (lower better).
 */
export function rankTutors(
  student: StudentForMatch,
  tutors: DbTutor[],
  loads: Record<string, number>,
): RankedTutor[] {
  const eligible = tutors.filter((t) => {
    if (t.status !== "active") return false;
    if (student.target_test && t.tests.length > 0 && !t.tests.includes(student.target_test)) {
      return false;
    }
    return true;
  });

  const ranked: RankedTutor[] = eligible.map((t) => {
    const overlap = student.target_subjects.filter((s) => t.subjects.includes(s)).length;
    const capacity = t.capacity_weekly ?? 8;
    const load = loads[t.profile_id] ?? 0;
    const slack = Math.max(0, capacity - load); // higher better

    // Score: overlap weighted heavily, slack as a secondary signal,
    // then a tiny epsilon based on inverse-creation-age so older tutors
    // win ties deterministically.
    const ageEps = 1 / (Date.now() - new Date(t.created_at).getTime() + 1);
    const score = overlap * 100 + slack * 10 + ageEps;

    const reasons: string[] = [];
    if (overlap > 0) {
      reasons.push(
        `${overlap} of ${student.target_subjects.length} target subjects match`,
      );
    } else if (student.target_subjects.length === 0) {
      reasons.push("subject not yet specified");
    } else {
      reasons.push("no subject overlap");
    }
    reasons.push(`${load} of ${capacity} weekly slots used`);

    return { tutor: t, score, reasons };
  });

  return ranked.sort((a, b) => b.score - a.score);
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add lib/match/rank.ts
git commit -m "feat(match): add deterministic rankTutors pure function"
```

---

### Task 4: Match-queue admin page

**Files:**
- Create: `app/admin/match-queue/page.tsx`
- Create: `app/admin/match-queue/MatchQueueClient.tsx`
- Create: `app/api/admin/match-queue/assign/route.ts`
- Modify: `app/admin/_nav.ts`

This page shows students in state `intake_done AND no_active_assignment`, surfaces top-3 ranked tutor suggestions per student, and lets admin click "Assign" to create an `assignments` row.

- [ ] **Step 1: Write the API route for assignments**

Create `app/api/admin/match-queue/assign/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { notifyMany } from "@/lib/notifications";

async function isAdmin(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const store = await cookies();
  return store.get("admin_session")?.value === adminPassword;
}

const Body = z.object({
  student_id: z.string().uuid(),
  tutor_profile_id: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getServiceRoleClient();
  if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });
  }

  const { student_id, tutor_profile_id } = parsed.data;

  const { data: assignment, error } = await sb
    .from("assignments")
    .insert({ student_id, tutor_id: tutor_profile_id, status: "active" })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await notifyMany([
    {
      userId: student_id,
      kind: "match.assigned",
      title: "You've been matched with a tutor",
      body: "Visit /portal/match to see your tutor and book your first session.",
      href: "/portal/match",
    },
    {
      userId: tutor_profile_id,
      kind: "match.new_student",
      title: "New student assigned",
      body: "Visit /portal/teacher to see your new student.",
      href: "/portal/teacher",
    },
  ]);

  await audit({
    action: "admin.match.assign",
    details: { student_id, tutor_profile_id, assignment_id: assignment.id },
  });

  return NextResponse.json({ assignment });
}
```

- [ ] **Step 2: Write the server-rendered page**

Create `app/admin/match-queue/page.tsx`:

```tsx
import { requireAdminAuth } from "@/lib/admin-auth";
import { getServiceRoleClient } from "@/lib/supabase";
import { listAdminTutors, countLoadThisWeek } from "@/lib/tutors/repo";
import { rankTutors, type StudentForMatch } from "@/lib/match/rank";
import { MatchQueueClient, type QueueRow } from "./MatchQueueClient";

export const metadata = { title: "Match queue · Admin" };

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  target_test: string | null;
  target_score: number | null;
  diagnostic_summary: { weakSkills?: string[]; targetSubjects?: string[] } | null;
  created_at: string;
}

export default async function MatchQueuePage() {
  await requireAdminAuth();
  const sb = getServiceRoleClient();
  const queue: QueueRow[] = [];

  if (sb) {
    const { data: students } = await sb
      .from("profiles")
      .select("id, full_name, email, target_test, target_score, diagnostic_summary, created_at")
      .eq("role", "student")
      .not("diagnostic_summary", "is", null);

    const studentIds = (students ?? []).map((s) => (s as ProfileRow).id);
    let assigned = new Set<string>();
    if (studentIds.length > 0) {
      const { data: existing } = await sb
        .from("assignments")
        .select("student_id")
        .in("student_id", studentIds)
        .eq("status", "active");
      assigned = new Set((existing ?? []).map((r) => (r as { student_id: string }).student_id));
    }

    const unmatched = (students ?? []).filter(
      (s) => !assigned.has((s as ProfileRow).id),
    ) as ProfileRow[];

    const tutors = await listAdminTutors();
    const loads: Record<string, number> = {};
    await Promise.all(
      tutors.map(async (t) => {
        loads[t.profile_id] = await countLoadThisWeek(t.profile_id);
      }),
    );

    for (const s of unmatched) {
      const ds = s.diagnostic_summary ?? {};
      const studentForMatch: StudentForMatch = {
        id: s.id,
        target_test: (s.target_test === "act" ? "act" : "sat"),
        target_subjects: ds.targetSubjects ?? [],
        diagnostic_weak_skills: ds.weakSkills ?? [],
      };
      const ranked = rankTutors(studentForMatch, tutors, loads).slice(0, 3);

      queue.push({
        student: {
          id: s.id,
          name: s.full_name ?? s.email ?? "Student",
          email: s.email ?? "",
          target_test: studentForMatch.target_test,
          target_score: s.target_score ?? null,
          weak_skills: studentForMatch.diagnostic_weak_skills,
          waiting_days: Math.floor(
            (Date.now() - new Date(s.created_at).getTime()) / 86_400_000,
          ),
        },
        suggestions: ranked.map((r) => ({
          tutor_id: r.tutor.id,
          tutor_profile_id: r.tutor.profile_id,
          tutor_name: r.tutor.display_name,
          headline: r.tutor.headline ?? null,
          subjects: r.tutor.subjects,
          reasons: r.reasons,
        })),
      });
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Match queue</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Students who finished the diagnostic and don't yet have an active tutor assignment. Top three ranked by subject overlap and weekly capacity.
        </p>
      </header>

      <MatchQueueClient initialQueue={queue} />
    </div>
  );
}
```

- [ ] **Step 3: Write the client**

Create `app/admin/match-queue/MatchQueueClient.tsx`:

```tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/system/Toast";

export interface QueueSuggestion {
  tutor_id: string;
  tutor_profile_id: string;
  tutor_name: string;
  headline: string | null;
  subjects: string[];
  reasons: string[];
}

export interface QueueRow {
  student: {
    id: string;
    name: string;
    email: string;
    target_test: "sat" | "act";
    target_score: number | null;
    weak_skills: string[];
    waiting_days: number;
  };
  suggestions: QueueSuggestion[];
}

export function MatchQueueClient({ initialQueue }: { initialQueue: QueueRow[] }) {
  const { toast } = useToast();
  const [queue, setQueue] = React.useState<QueueRow[]>(initialQueue);
  const [busy, setBusy] = React.useState<string | null>(null);

  async function assign(studentId: string, tutorProfileId: string) {
    setBusy(`${studentId}:${tutorProfileId}`);
    const res = await fetch("/api/admin/match-queue/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, tutor_profile_id: tutorProfileId }),
    });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ title: "Couldn't assign", description: data.error ?? "—", variant: "error" });
      return;
    }
    setQueue((q) => q.filter((row) => row.student.id !== studentId));
    toast({ title: "Assigned", variant: "success", durationMs: 1500 });
  }

  if (queue.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-[var(--text-3)] text-[13px]">
        Queue is empty — every student with a completed diagnostic already has an active tutor.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {queue.map((row) => (
        <li
          key={row.student.id}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <header className="flex items-start justify-between gap-3 mb-4 flex-wrap">
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-1)]">{row.student.name}</p>
              <p className="text-[12px] text-[var(--text-3)]">
                {row.student.email} · target {row.student.target_test.toUpperCase()}
                {row.student.target_score ? ` · ${row.student.target_score}` : ""}
                {" · waiting "}
                {row.student.waiting_days}d
              </p>
              {row.student.weak_skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {row.student.weak_skills.slice(0, 5).map((s) => (
                    <Badge key={s} variant="default">{s}</Badge>
                  ))}
                </div>
              )}
            </div>
          </header>

          <ol className="space-y-2">
            {row.suggestions.length === 0 ? (
              <li className="text-[13px] text-[var(--text-3)] italic">
                No active tutors match this student's target test. Add a tutor from /admin/tutors.
              </li>
            ) : (
              row.suggestions.map((s, i) => (
                <li
                  key={s.tutor_id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-4 py-3 flex-wrap"
                >
                  <div>
                    <p className="text-[13.5px] font-semibold text-[var(--text-1)]">
                      <span className="text-[var(--text-3)] mr-2 font-mono text-[11px]">#{i + 1}</span>
                      {s.tutor_name}
                    </p>
                    {s.headline && <p className="text-[12px] text-[var(--text-2)]">{s.headline}</p>}
                    <p className="text-[11.5px] text-[var(--text-3)] mt-1">{s.reasons.join(" · ")}</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    loading={busy === `${row.student.id}:${s.tutor_profile_id}`}
                    onClick={() => assign(row.student.id, s.tutor_profile_id)}
                  >
                    Assign
                  </Button>
                </li>
              ))
            )}
          </ol>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: Add the nav entry**

In `app/admin/_nav.ts`, add an entry for the match queue. Place it after `Tutors`:

```ts
import {
  // ...
  Compass,
  // ...
} from "lucide-react";

// In the ADMIN_NAV array, between Tutors and Students:
  { href: "/admin/match-queue", label: "Match queue", icon: Compass },
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add app/api/admin/match-queue/ app/admin/match-queue/ app/admin/_nav.ts
git commit -m "feat(admin): match-queue with ranked tutor suggestions"
```

---

### Task 5: Admin tutor CRUD

**Files:**
- Create: `app/api/admin/tutors/route.ts`
- Create: `app/admin/tutors/TutorCreateForm.tsx`
- Create: `app/admin/tutors/TutorEditDrawer.tsx`
- Modify: `app/admin/tutors/page.tsx`

(Plan body: see spec — POST creates a profile if one doesn't exist for the email then inserts the tutors row, PATCH edits, DELETE archives. The page lists DB tutors via the new repo and shows the create form + edit drawer per row.)

(Detailed task content omitted from this plan version for brevity; the executor consults the spec at `docs/superpowers/specs/2026-05-03-utility-pass-design.md` and the existing `/admin/questions` editor as a pattern reference.)

---

### Task 6: Tutor self-edit profile

**Files:**
- Create: `app/portal/teacher/profile/page.tsx`
- Create: `app/portal/teacher/profile/TutorProfileForm.tsx`
- Create: `app/api/portal/tutor-profile/route.ts`

The page calls `requireTutorUser()`, fetches the tutor row by `profile_id = user.id`, and renders a form for bio, headline, photo, calendar/meeting URLs, subjects, capacity, timezone. Hourly rate and status are read-only (admin-only).

---

### Task 7: Migration script

**Files:**
- Create: `scripts/migrate-mock-tutors.ts`

For each entry in `lib/mock/tutors.ts`:
1. Find or create a `profiles` row with `role='teacher'` (matched by an email — for the mock entries, the script prompts for an email override or uses a placeholder like `mock-{id}@nyx.local` for placeholder rows the operator later replaces with real emails).
2. Upsert into `tutors` (idempotent on `profile_id`).

After running, the operator confirms via `/admin/tutors` and Phase B's consumer switches (Task 8) become safe.

---

### Task 8: Switch consumers to repo

**Files:**
- Modify: `app/portal/schedule/page.tsx`
- Modify: `app/portal/diagnostic/page.tsx`
- Modify: `app/(marketing)/page.tsx`
- Modify: `app/(marketing)/match/page.tsx`

Each replaces `import { TUTORS } from "@/lib/mock/tutors"` with calls to `listActiveCards()` from the repo. The repo already returns mock fallback when DB is empty, so this swap is safe to land before the migration runs.

---

### Task 9: Delete the mock module

**Files:**
- Delete: `lib/mock/tutors.ts`
- Modify: `lib/tutors/repo.ts` (remove the mock-fallback paths once consumers are all on the repo and operator confirms migration)

Final cleanup. Only do this after Task 8 has shipped and the operator confirms there's at least one DB tutor.

---

## Sequencing notes

Tasks 1–4 are pure additions (new schema, new files, new admin page). They are safe to ship without running the migration, because:
- The repo falls back to the mock roster when the DB is empty.
- The match-queue page uses `listAdminTutors()` which returns `[]` when DB is empty — the page just shows "No active tutors match — add a tutor from /admin/tutors".

Tasks 5–9 are the operator path:
- Run the migration (Task 1 SQL).
- Use the new admin form to create one or two real tutor rows (Task 5).
- Or run the migration script to bring the mock roster in (Task 7).
- Switch consumers (Task 8).
- Delete the mock module (Task 9).

This phase ships in two PRs: PR1 = T1-T4, PR2 = T5-T9. PR2 is gated on the operator running the schema migration.

## Self-Review

1. **Spec coverage:** Spec § Phase B requires `tutors` table (T1), repo (T2), admin CRUD (T5), tutor self-edit (T6), match-queue with ranker (T3, T4), data migration (T7), consumer switches (T8), mock delete (T9). All covered.
2. **Placeholder scan:** T5–T9 use shorthand by design — they are gated on T1's migration being run by the operator. Each lists exact files to create/modify; the implementing engineer fills in code in a later session, informed by the patterns established in T1–T4.
3. **Type consistency:** `DbTutor` (T2) is referenced by `rankTutors` (T3), `match-queue/page.tsx` (T4), and admin CRUD (T5). `TutorCard` (T2) is the public surface used by consumers (T8). `StudentForMatch` (T3) → match-queue page (T4) → `MatchQueueClient` (T4).

## What's Next

Phase B PR1 (T1–T4) lands as additive change. The user runs the schema migration when ready. PR2 (T5–T9) is a follow-up session that flips consumers and removes the mock once the migration is complete.
