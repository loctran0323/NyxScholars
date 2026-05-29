# Site-wide Polish, Bug Fixes & Local Preview Fallback

**Date:** 2026-05-29
**Author:** site-polish pass (separate from the Arush/Talija session work)
**Branch:** `polish/site-wide-fixes`

## Context

The deployed site has real Supabase + Stripe configured (in Vercel). Locally there are
no keys, so the entire `/portal` is dead: the login page shows "Authentication is not
configured," the portal layout shows "Portal unavailable," and every portal API returns
503/401 — which surfaces in the UI as "constellations have no practice questions."

The goal: the *rest of the site* (everything except the live tutoring-session flow) should
be **fleshed out, correct, and impressive**. Fix the bugs, make it stunning, keep the
existing night-sky design language.

## Deconfliction — DO NOT TOUCH (owned by the Arush/Talija agent)

A separate agent owns the live-session work per
`docs/superpowers/specs/2026-05-29-arush-rw-portal-design.md`. To avoid collisions, this
pass will **not** edit:

- Routes: `/talija`, `/temp/[slug]`, `/students/[slug]`
- Files: `lib/practice/rw-bank.ts`, `supabase-temp-practice-schema.sql`,
  `scripts/validate-rw-bank.ts`
- Answer-key corrections in `lib/diagnostic/bank.ts` (adv-poly-2, adv-poly-3, alg-eq-8,
  alg-ineq-5, data-stat-4, adv-rat-2) and R&W rationale additions — theirs.

This pass owns: the marketing site, the Supabase-based `/portal` (login, consultation/Sky,
practice SRS+drill, diagnostic, dashboard, sessions, messages, etc.), shared/system
components, and the local preview fallback.

## Goals

1. **Local preview fallback** so the whole portal renders and is interactive with zero
   setup — and doubles as a no-backend demo. Production behavior is unchanged.
2. **Unbreak everything**: login/signup flow, dead handlers, crashes, broken links.
3. **Constellation + practice loop** works end-to-end with no dead-ends.
4. **Visual polish** across marketing + portal; verify light mode; elevate weak pages.

## Architecture: Local Preview Fallback (the keystone)

A mock Supabase layer that activates **only when Supabase env is absent** (i.e. locally).
When real keys are present, nothing changes.

- `lib/supabase/config.ts` — `isSupabaseConfigured()`, `isDemoMode()`, `DEMO_USER`.
- `lib/supabase/mock.ts` — `createMockServerClient(cookieStore)` and
  `createMockBrowserClient()`. Each exposes:
  - **Query builder**: chainable + thenable over a seeded in-memory store keyed by table
    name. Implements every method the app uses (`select/insert/update/upsert/delete`,
    `eq/neq/in/is/gt/gte/lt/lte/match/or/ilike/like/contains`, `order/limit/range`,
    `single/maybeSingle`, and `select(_, { count, head })`). Unknown methods fall through
    to a chainable no-op (Proxy) so an unseen query never throws.
  - **Auth**: cookie-driven (`nyx_demo` non-httpOnly cookie). Server reads the cookie to
    decide `getUser()`; browser `signInWithPassword`/`signUp` set the cookie and resolve
    success for any credentials; `signOut` clears it. Mirrors the real redirect flow.
  - Tables not seeded return `[]` / `null` — pages already handle empty states, so this
    degrades gracefully.
- `lib/mock/portalSeed.ts` — realistic seed (a demo student profile, a couple of sessions,
  SRS cards, a few messages, a homework item, notifications). Questions reuse the existing
  diagnostic `POOL`.
- `lib/supabase/server.ts` / `browser.ts` — return the mock client instead of `null` when
  unconfigured. Callers (`requirePortalUser`, `getPortalApi`, portal layout, pages) work
  unchanged.

Net effect: `/portal/login` → working form → sign in → `/portal` renders a populated,
clickable portal. No page needs its own "not configured" branch anymore.

## Phases

1. **Unbreak** — mock layer; fix login/signup/layout dead-ends; fix `onDrill` no-op
   (`ConsultationView.tsx:70`); crash/broken-link sweep.
2. **Constellation + practice** — every skill resolves to real drill items; Sky → sheet →
   drill → score loop verified.
3. **Polish** — marketing weak pages (handbook, field-notes, match mobile), light-mode
   audit, most-seen portal screens, motion/empty-state/micro-interaction taste.

## Verification

- `npm run build` + `npm run lint` clean.
- Click through every route in the running dev app; no crashes, no placeholders, no dead
  buttons. Confirm both dark and light themes.
