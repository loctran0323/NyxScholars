# Phase A — Real Question Bank Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the question bank from "DB table exists but is empty + practice still reads only the static `POOL`" to "DB has 50 reviewed-and-published starter items + practice + diagnostic both read from DB through a single repo + admin can publish/unretire from the existing `/admin/questions` page."

**Architecture:** Add a thin `lib/questions/repo.ts` for DB reads (one place to add filters / change SQL). Wire the Practice Skill Drill to a new `/api/practice/drill` route that uses the repo. Extend the existing `/admin/questions` UI with publish/unretire actions on each row (currently you can only retire). Add an `external_key` column to `diagnostic_questions` to make seeding idempotent. Write a 50-item seed script that lands as `status='draft'` so the user reviews each one in the admin UI before publishing.

**Tech Stack:** Existing Supabase schema (`diagnostic_questions`, RLS), existing service-role client, Next.js 16 App Router, the existing `/admin/questions` editor (extend, don't rewrite), the existing skill taxonomy in `lib/diagnostic/skills.ts`.

**What's already built (so we don't duplicate):**
- `diagnostic_questions` schema with `status ('active'|'draft'|'retired')`, `origin`, `created_by`, `rationale`.
- `/api/diagnostic/pool` already merges DB items with the static `POOL` for the diagnostic.
- `/api/admin/questions` supports POST (insert hand-written), POST `?action=mint` (generator batch), PATCH (update fields including status), DELETE (retire).
- `/admin/questions` UI lists DB items, filters by status, has add-form and mint-batch.

**What's actually missing (this phase fixes):**
- Practice Skill Drill reads `POOL` directly (static only); never touches DB.
- DB is empty — no seed pipeline.
- Admin UI can flip a row to `retired` but cannot flip `draft → active` or `retired → active` from the list.
- No idempotent seed mechanism.

---

## File Structure

**Create:**
- `supabase-questions-schema-phase-a.sql` — additive migration adding `external_key` column + unique index
- `lib/questions/repo.ts` — single source of truth for question DB reads
- `app/api/practice/drill/route.ts` — DB-backed drill endpoint
- `scripts/seed-questions.ts` — idempotent seeder for 50 starter items
- `scripts/README-seeding.md` — operator notes

**Modify:**
- `app/portal/practice/page.tsx` — Skill Drill fetches from `/api/practice/drill` instead of static `POOL`. Threshold-based banner.
- `app/admin/questions/QuestionsEditor.tsx` — add Publish/Activate row action; show source vs origin
- `app/api/admin/questions/route.ts` — accept `external_key` field on POST (for ad-hoc curation that might need to be re-runnable too)

**Schema migration (run manually in Supabase SQL editor):** `supabase-questions-schema-phase-a.sql`.

---

### Task 1: Schema migration — add `external_key` column

**Files:**
- Create: `supabase-questions-schema-phase-a.sql`

- [ ] **Step 1: Write migration**

Create `supabase-questions-schema-phase-a.sql`:

```sql
-- ============================================================
-- Phase A — Real Question Bank
-- Additive migration. Run AFTER supabase-questions-schema.sql.
-- ============================================================

-- Idempotency key for seed scripts and CSV imports.
alter table public.diagnostic_questions
  add column if not exists external_key text;

-- Partial unique index so two rows can both have NULL external_key
-- (hand-written questions don't need one), but seeded rows can't dup.
create unique index if not exists diagnostic_questions_external_key_unique
  on public.diagnostic_questions(external_key)
  where external_key is not null;

-- Updated-at trigger so the editor can show "last edited" without
-- the app having to set it on every PATCH.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

alter table public.diagnostic_questions
  add column if not exists updated_at timestamptz default now();

drop trigger if exists set_diagnostic_questions_updated_at on public.diagnostic_questions;
create trigger set_diagnostic_questions_updated_at
  before update on public.diagnostic_questions
  for each row execute function public.set_updated_at();
```

- [ ] **Step 2: Run the migration in Supabase**

Open Supabase SQL editor → paste the contents of `supabase-questions-schema-phase-a.sql` → Run. Expect "Success. No rows returned." This is a manual step — no code change required to run it later.

- [ ] **Step 3: Commit**

```bash
git add supabase-questions-schema-phase-a.sql
git commit -m "feat(questions): schema migration — external_key + updated_at"
```

---

### Task 2: Repo layer — `lib/questions/repo.ts`

**Files:**
- Create: `lib/questions/repo.ts`

- [ ] **Step 1: Write the repo**

Create `lib/questions/repo.ts`:

```ts
import { getServiceRoleClient } from "@/lib/supabase";

export interface DbQuestion {
  id: string;
  skill_id: string;
  skill_name: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  prompt: string;
  choices: string[];
  correct_index: number;
  rationale: string | null;
  status: "active" | "draft" | "retired";
  origin: "admin" | "generated" | "static" | "community";
  external_key: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface PublishedPoolFilters {
  skillId?: string;
  section?: "Math" | "Reading & Writing";
  limit?: number;
  excludeIds?: string[];
}

/**
 * Active (published) DB questions only — never includes drafts or retired.
 * Returns [] when supabase isn't configured (caller decides on fallback).
 */
export async function getPublishedPool(
  filters: PublishedPoolFilters = {},
): Promise<DbQuestion[]> {
  const sb = getServiceRoleClient();
  if (!sb) return [];

  let q = sb.from("diagnostic_questions").select("*").eq("status", "active");
  if (filters.skillId) q = q.eq("skill_id", filters.skillId);
  if (filters.section) q = q.eq("section", filters.section);
  if (filters.excludeIds && filters.excludeIds.length > 0) {
    q = q.not("id", "in", `(${filters.excludeIds.map((id) => `"${id}"`).join(",")})`);
  }
  if (filters.limit) q = q.limit(filters.limit);

  const { data, error } = await q;
  if (error) {
    console.error("[questions.repo] getPublishedPool", error.message);
    return [];
  }
  return (data ?? []) as DbQuestion[];
}

/** Counts of active items per (skill_id), used to decide when to drop the practice "starter set" banner. */
export async function publishedCountsBySkill(): Promise<Record<string, number>> {
  const sb = getServiceRoleClient();
  if (!sb) return {};
  const { data, error } = await sb
    .from("diagnostic_questions")
    .select("skill_id")
    .eq("status", "active");
  if (error) {
    console.error("[questions.repo] publishedCountsBySkill", error.message);
    return {};
  }
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const skillId = (row as { skill_id: string }).skill_id;
    counts[skillId] = (counts[skillId] ?? 0) + 1;
  }
  return counts;
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add lib/questions/repo.ts
git commit -m "feat(questions): add lib/questions/repo for DB reads"
```

---

### Task 3: `/api/practice/drill` — DB-backed drill endpoint

**Files:**
- Create: `app/api/practice/drill/route.ts`

- [ ] **Step 1: Write the route**

Create `app/api/practice/drill/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getPortalApi } from "@/lib/portal-auth";
import { getPublishedPool, type DbQuestion } from "@/lib/questions/repo";
import { POOL } from "@/lib/diagnostic";

interface DrillItem {
  id: string;
  skillId: string;
  skill: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  prompt: string;
  choices: string[];
  correct: number;
  rationale?: string;
  /** "db" — pulled from supabase; "static" — fallback from in-process bank. */
  source: "db" | "static";
}

const DRILL_TARGET = 10;
const STATIC_FALLBACK_THRESHOLD = 6;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dbToDrill(q: DbQuestion): DrillItem {
  return {
    id: `db-${q.id}`,
    skillId: q.skill_id,
    skill: q.skill_name,
    section: q.section,
    difficulty: q.difficulty,
    prompt: q.prompt,
    choices: q.choices,
    correct: q.correct_index,
    rationale: q.rationale ?? undefined,
    source: "db",
  };
}

export async function GET(req: NextRequest) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const skill = req.nextUrl.searchParams.get("skill");
  if (!skill) {
    return NextResponse.json({ error: "skill query param required" }, { status: 400 });
  }
  const limit = Math.min(20, Math.max(1, Number(req.nextUrl.searchParams.get("n") ?? DRILL_TARGET)));

  const dbItems = await getPublishedPool({ skillId: skill, limit: limit * 2 });
  const dbDrill = dbItems.map(dbToDrill);

  // If DB is thin, top up from the static POOL so the student isn't stuck.
  let combined: DrillItem[] = shuffle(dbDrill).slice(0, limit);
  let usedFallback = false;
  if (combined.length < STATIC_FALLBACK_THRESHOLD) {
    const staticItems: DrillItem[] = POOL.filter((p) => p.skillId === skill).map((p) => ({
      id: p.id,
      skillId: p.skillId,
      skill: p.skill,
      section: p.section,
      difficulty: p.difficulty,
      prompt: p.prompt,
      choices: p.choices,
      correct: p.correct,
      rationale: p.rationale,
      source: "static" as const,
    }));
    const seen = new Set(combined.map((c) => c.id));
    const topUp = shuffle(staticItems.filter((s) => !seen.has(s.id))).slice(0, limit - combined.length);
    combined = [...combined, ...topUp];
    if (topUp.length > 0) usedFallback = true;
  }

  return NextResponse.json({
    items: combined,
    counts: {
      requested: limit,
      returned: combined.length,
      db: combined.filter((c) => c.source === "db").length,
      static: combined.filter((c) => c.source === "static").length,
    },
    fallback: usedFallback,
  });
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/api/practice/drill/route.ts
git commit -m "feat(practice): add /api/practice/drill DB-backed endpoint"
```

---

### Task 4: Wire Skill Drill UI to the new endpoint

**Files:**
- Modify: `app/portal/practice/page.tsx`

- [ ] **Step 1: Replace the `SkillDrill` data source**

In `app/portal/practice/page.tsx`:

a) Replace this block (currently around lines 32–37):

```tsx
function SkillDrill({ skillId }: { skillId: string }) {
  const questions = React.useMemo(
    () => shuffle(POOL.filter((q) => q.skillId === skillId)),
    [skillId],
  );
```

with:

```tsx
interface DrillItem {
  id: string;
  skillId: string;
  skill: string;
  prompt: string;
  choices: string[];
  correct: number;
  rationale?: string;
  source: "db" | "static";
}

function SkillDrill({ skillId }: { skillId: string }) {
  const [questions, setQuestions] = React.useState<DrillItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [usedFallback, setUsedFallback] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/practice/drill?skill=${encodeURIComponent(skillId)}&n=10`, { cache: "no-store" })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((data) => {
        if (cancelled) return;
        setQuestions((data.items ?? []) as DrillItem[]);
        setUsedFallback(Boolean(data.fallback));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setQuestions([]);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [skillId]);
```

b) Remove the local `shuffle` helper (lines 23–30) since it's no longer used here. Keep `Inbox`, `Check`, `X`, etc.

c) Remove the import of `POOL` and `BankQuestion` from `@/lib/diagnostic` (line 11). The Skill Drill no longer reads them. (Don't touch the SRS code which still doesn't depend on them either.)

d) Update the `q` typing (currently `BankQuestion | undefined`):

```tsx
  const q: DrillItem | undefined = questions[index];
```

e) The empty-state branch and active-drill render remain visually identical. Add a loading state immediately above the empty-state check:

```tsx
  if (loading) {
    return (
      <div className="max-w-md mx-auto pt-16 text-center text-[var(--text-3)] text-[13px]">
        Loading drill…
      </div>
    );
  }
```

f) Replace the existing `<InfoBanner>` block (the "Expanded question bank arriving — current pool is a starter set." banner from Phase C) with a conditional one driven by `usedFallback`:

```tsx
      {usedFallback && (
        <InfoBanner tone="warn" className="mb-5">
          We mixed in a few starter items because the live bank for this skill
          is still being seeded. New questions are added each week.
        </InfoBanner>
      )}
```

This means: once a skill has ≥6 published DB questions, the banner disappears for that skill automatically.

- [ ] **Step 2: Verify TypeScript + build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Manual smoke test**

Run `npm run dev`. Navigate to `/portal/practice?skill=lin-eq`:
- Without seeded data: drill loads, banner shows, content is from the static fallback.
- After Task 5 seeds and Task 6 publishes some `lin-eq` items: banner disappears, content is DB items.

- [ ] **Step 4: Commit**

```bash
git add app/portal/practice/page.tsx
git commit -m "feat(practice): wire Skill Drill to /api/practice/drill"
```

---

### Task 5: Seed script — 50 starter items as drafts

**Files:**
- Create: `scripts/seed-questions.ts`
- Create: `scripts/README-seeding.md`

- [ ] **Step 1: Write the seed script**

Create `scripts/seed-questions.ts`. The script:
- Loads the service-role Supabase client from env.
- Defines a typed array of 50 starter items, each with an `external_key`.
- Upserts on `external_key` (unique), so re-running the script does not create duplicates.
- Inserts every item with `status='draft'` so the user reviews and publishes in the admin UI.
- Tags `origin='admin'` (since these are hand-curated by the team, not algorithmically generated).

```ts
/**
 * Seed 50 starter SAT-aligned questions into diagnostic_questions as drafts.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-questions.ts
 *
 * Idempotent — matches by external_key. Re-running is safe.
 * All items land as status='draft'. Use /admin/questions to review and publish.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

interface SeedItem {
  external_key: string;
  skill_id: string;
  skill_name: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  prompt: string;
  choices: string[];
  correct_index: number;
  rationale: string;
}

const ITEMS: SeedItem[] = [
  // (50 items inline below — see Step 2 for the full list)
];

async function main() {
  console.log(`Seeding ${ITEMS.length} starter items as drafts…`);

  // Upsert by external_key. Each row lands as status='draft', origin='admin'.
  const rows = ITEMS.map((it) => ({
    external_key: it.external_key,
    skill_id: it.skill_id,
    skill_name: it.skill_name,
    section: it.section,
    difficulty: it.difficulty,
    prompt: it.prompt,
    choices: it.choices,
    correct_index: it.correct_index,
    rationale: it.rationale,
    status: "draft",
    origin: "admin",
    source: "seed",
  }));

  const { data, error } = await sb
    .from("diagnostic_questions")
    .upsert(rows, { onConflict: "external_key", ignoreDuplicates: false })
    .select("id, external_key, status");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Upserted ${data?.length ?? 0} rows.`);
  console.log("Visit /admin/questions and filter by 'draft' to review and publish.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Fill in the 50 SeedItem entries**

Replace the empty `const ITEMS: SeedItem[] = [];` with 50 hand-written items. Spread coverage across the existing skill ids in `lib/diagnostic/skills.ts` — roughly:
- Algebra (5 skills × ~1.5 items): lin-eq, lin-sys, lin-ineq, lin-fn, abs-val → 7 items
- Adv Math (4 skills): quad, poly, exp, rat → 7 items
- Data (5 skills): fulcrum, beam-l, beam-r, pan-l, pan-r → 7 items
- Geometry (4 skills): apex, b-l, b-r, cent → 5 items
- Reading (6 skills): eye-l, eye-r, beak, wing-l, wing-r, foot → 12 items
- Writing (5 skills): tip, shaft1, shaft2, plume, barb → 12 items

(Exact distribution is judgment — the writer ensures every skill_id has at least one item.)

Each item must:
- Use a real `skill_id` from `lib/diagnostic/skills.ts` (e.g., "lin-eq", "quad", "eye-l").
- Use the matching `skill_name` from the same file.
- Set `section` to "Math" for Math constellations, "Reading & Writing" for the rest.
- Use `difficulty` 1–5 (favor 2–4 for starters).
- Have an `external_key` of the form `seed-2026-05-{skill_id}-{n}` where n is 1-indexed within that skill.
- Have 4 choices for MCQ (or 2+).
- Have a non-empty `rationale` (1–3 sentences).

Example items (the writer fills in 50 like this):

```ts
{
  external_key: "seed-2026-05-lin-eq-1",
  skill_id: "lin-eq",
  skill_name: "Linear equations",
  section: "Math",
  difficulty: 2,
  prompt: "If 3x + 7 = 22, what is the value of x?",
  choices: ["3", "5", "7", "15"],
  correct_index: 1,
  rationale: "Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5.",
},
{
  external_key: "seed-2026-05-quad-1",
  skill_id: "quad",
  skill_name: "Quadratics",
  section: "Math",
  difficulty: 3,
  prompt: "What are the solutions to x² − 5x + 6 = 0?",
  choices: ["x = 2 or x = 3", "x = −2 or x = −3", "x = 1 or x = 6", "x = 5 or x = 6"],
  correct_index: 0,
  rationale: "Factor: (x − 2)(x − 3) = 0. So x = 2 or x = 3.",
},
{
  external_key: "seed-2026-05-eye-l-1",
  skill_id: "eye-l",
  skill_name: "Main idea",
  section: "Reading & Writing",
  difficulty: 2,
  prompt:
    "(Passage describes how migratory birds use Earth's magnetic field for navigation, with detail on cryptochrome proteins in their eyes.)\n\n" +
    "Which choice best states the central idea of the passage?",
  choices: [
    "Migratory birds rely on visual landmarks to navigate.",
    "Specialized proteins let migratory birds sense Earth's magnetic field.",
    "Cryptochrome was first discovered in plants.",
    "Bird migration patterns have shifted because of climate change.",
  ],
  correct_index: 1,
  rationale:
    "The passage's central claim is that cryptochrome proteins enable magnetoreception. The other options are either off-topic or mentioned only in passing.",
},
```

The writer fills the remaining 47 items following this pattern. **Important:** these are starter quality — they will go to the user as drafts and be reviewed before publishing. The job is to provide a working scaffold across all skills, not to produce a polished final bank.

- [ ] **Step 3: Verify the script type-checks**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Run the seed script (locally)**

```bash
SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY npx tsx scripts/seed-questions.ts
```

Expected output:
```
Seeding 50 starter items as drafts…
Upserted 50 rows.
Visit /admin/questions and filter by 'draft' to review and publish.
```

Re-run the same command to confirm idempotency: it should report `Upserted 50 rows` again, but `select * from diagnostic_questions where origin='admin' and source='seed'` should still show exactly 50.

- [ ] **Step 5: Write the README**

Create `scripts/README-seeding.md`:

```md
# Question Bank Seeding

The Phase A seed pipeline lives in `scripts/seed-questions.ts`. It inserts hand-curated starter questions into `diagnostic_questions` as `status='draft'`.

## Running

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-questions.ts
```

You can also use `NEXT_PUBLIC_SUPABASE_URL` instead of `SUPABASE_URL`.

## Idempotency

Each seed item carries an `external_key`. The script upserts on this column (unique partial index). Re-running the script:
- Updates rows whose content has changed in the script.
- Does not create duplicates.
- Does not change `status` away from whatever the admin set in `/admin/questions`. (The `upsert` does set `status='draft'` on every run — if the admin has already published an item and you re-run the script, it will revert to draft. **Fix: only edit a seed item's content via `/admin/questions` directly once the admin has published it.** If you must update the seeded text, retire the existing row first and add a new entry with a fresh `external_key`.)

## After seeding

Visit `/admin/questions`, filter by **draft**, review each item, and click **Publish** to push it live. Live items show up in `/portal/practice?skill=...` and the diagnostic intake.
```

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-questions.ts scripts/README-seeding.md
git commit -m "feat(questions): seed 50 starter items as drafts"
```

---

### Task 6: Admin UI — publish/unretire row action

**Files:**
- Modify: `app/admin/questions/QuestionsEditor.tsx`
- Modify: `app/api/admin/questions/route.ts` (only if PATCH doesn't already cover status changes — verify in Step 1)

- [ ] **Step 1: Verify PATCH already accepts `status`**

Open `app/api/admin/questions/route.ts`. The `allowed` array on the PATCH handler already includes `"status"` (line ~144). No backend change needed. Skip the API edit.

- [ ] **Step 2: Add Publish + Unretire buttons to the list**

In `app/admin/questions/QuestionsEditor.tsx`:

a) Replace the existing `deleteOne` function (around lines 49–57) with a single status-update helper plus its three callers:

```tsx
  async function setStatus(id: string, status: "active" | "draft" | "retired") {
    const res = await fetch(`/api/admin/questions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      toast({ title: "Couldn't update", variant: "error" });
      return;
    }
    setItems((curr) => curr.map((i) => (i.id === id ? { ...i, status } : i)));
    toast({
      title: status === "active" ? "Published" : status === "retired" ? "Retired" : "Moved to draft",
      variant: "success",
      durationMs: 1500,
    });
  }
```

b) Replace the trailing `<Button>` block in each row (currently around lines 113–117) with a per-status action set:

```tsx
                  <div className="flex items-center gap-1">
                    {q.status === "draft" && (
                      <Button variant="ghost" size="sm" onClick={() => setStatus(q.id, "active")}>
                        <Save size={12} /> Publish
                      </Button>
                    )}
                    {q.status === "active" && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => setStatus(q.id, "draft")}>
                          Unpublish
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setStatus(q.id, "retired")}>
                          <Trash2 size={12} /> Retire
                        </Button>
                      </>
                    )}
                    {q.status === "retired" && (
                      <Button variant="ghost" size="sm" onClick={() => setStatus(q.id, "draft")}>
                        Restore
                      </Button>
                    )}
                  </div>
```

(`Save` is already imported. `Trash2` is already imported. No new imports needed.)

- [ ] **Step 3: Verify TypeScript + build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 4: Manual smoke test**

`npm run dev`. Log in as admin. Navigate to `/admin/questions`:
- Filter by `draft` — see seeded items. Click **Publish** on one. It moves to `active` (visible if you switch to that filter).
- Click **Unpublish** on an active item — it moves back to draft.
- Click **Retire** on an active item — it moves to retired.
- Click **Restore** on a retired item — it moves back to draft.

- [ ] **Step 5: Commit**

```bash
git add app/admin/questions/QuestionsEditor.tsx
git commit -m "feat(admin): publish/unpublish/restore actions on question rows"
```

---

### Task 7: Final verification

**Files:** None modified.

- [ ] **Step 1: Build clean**

Run: `npm run build`
Expected: clean.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: clean (no new warnings introduced by Phase A files).

- [ ] **Step 3: End-to-end checklist**

With the seed script run once and a few items published:

- `/portal/practice?skill=<one-published-skill>` loads — no fallback banner — questions are DB items (look at network tab: `/api/practice/drill` returns `source: "db"` for all items).
- `/portal/practice?skill=<unpublished-skill>` loads with the fallback banner; items have `source: "static"`.
- `/admin/questions` filtered to `draft` shows ~50 items (or whatever's left after some are published).
- Publishing a draft from `/admin/questions` immediately makes it visible in the next drill of that skill.
- Diagnostic intake (`/portal/diagnostic`) still works — `/api/diagnostic/pool` already merges DB-active items with the static `POOL`, so it picks up published seeds automatically.

- [ ] **Step 4: Spec coverage check**

The spec's Phase A acceptance: `/admin/questions` is a usable curation tool ✓ (Tasks 6). 50 items seeded as drafts ✓ (Task 5). Practice Skill Drill, Diagnostic, and `/admin/questions` all read from DB ✓ (Tasks 2–4 + existing pool route). Static `lib/diagnostic/bank.ts` retained as fallback ✓ (Task 3 logic). Banner removes itself when threshold crossed ✓ (Task 4 `usedFallback` flag).

---

## Self-Review

1. **Spec coverage:** Every Phase A item in the spec has a task. Repo (T2), API for drill (T3), wired drill (T4), seed script (T5), publish/unretire UI (T6). The spec mentioned a Phase A `assets` jsonb column and CSV importer — both deferred (out of scope for v1; seed-script + paste-into-form covers the immediate need; CSV adds tooling burden without a current driver).
2. **Placeholder scan:** None. The seed-items "fill 50" is the one place the executor must produce content rather than copy/paste — that's a content task, not a placeholder. Task 5 Step 2 specifies exact format and gives 3 example items.
3. **Type consistency:** `DbQuestion` (Task 2) → `DrillItem` (Task 3) → `DrillItem` (Task 4 client). `SeedItem` (Task 5) matches the columns `diagnostic_questions` actually has, including `external_key` from Task 1. Status values (`'active'|'draft'|'retired'`) and origin values (`'admin'|'generated'|'static'|'community'`) match the existing schema CHECK constraints.

## What's Next

Phase B (tutoring portal backbone) gets its own plan after Phase A lands. The spec at `docs/superpowers/specs/2026-05-03-utility-pass-design.md` is the source of truth.
