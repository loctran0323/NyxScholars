# Question Bank Seeding

The Phase A seed pipeline lives in `scripts/seed-questions.ts`. It inserts hand-curated starter questions into `diagnostic_questions` as `status='draft'`.

## Running

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-questions.ts
```

You can also use `NEXT_PUBLIC_SUPABASE_URL` instead of `SUPABASE_URL`.

## Idempotency

Each seed item carries an `external_key`. The script upserts on this column (unique partial index from `supabase-questions-schema-phase-a.sql`). Re-running the script:

- Updates rows whose content has changed in the script.
- Does not create duplicates.
- **Does** reset `status` to `draft` on every upsert. This means: if an admin has already published a seeded item via `/admin/questions` and you re-run the script, that item will revert to `draft`.

If you need to update the seeded text after publishing, the cleanest path is to retire the existing row in `/admin/questions` first, then add a new row with a fresh `external_key` (e.g. bump from `seed-2026-05-lin-eq-1` to `seed-2026-05-lin-eq-1-v2`).

## After seeding

Visit `/admin/questions`, filter by **draft**, review each item, and click **Publish** to push it live. Live items show up in `/portal/practice?skill=...` and the diagnostic intake.

The Skill Drill banner ("we mixed in a few starter items…") will disappear automatically once `/api/practice/drill` returns ≥6 published items for the requested skill.

## Where to look in the codebase

- Schema migration: `supabase-questions-schema-phase-a.sql`
- Seed items: `scripts/seed-questions.ts` (this directory)
- Repo layer (server-side reads): `lib/questions/repo.ts`
- Drill API: `app/api/practice/drill/route.ts`
- Admin authoring UI: `app/admin/questions/QuestionsEditor.tsx`
- Skill taxonomy (which `skill_id` values are valid): `lib/diagnostic/skills.ts` and `lib/mock/constellations.ts`
