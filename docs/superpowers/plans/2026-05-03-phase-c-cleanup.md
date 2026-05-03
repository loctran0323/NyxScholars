# Phase C — Cleanup-First Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace stale/hardcoded student-facing surfaces (Lessons, Mock Tests) with a polished "Coming Soon" placeholder, add a transition banner to Practice → Skill Drill, delete three thin admin stubs (broadcast, payouts, revenue), and consolidate admin nav into a single source.

**Architecture:** Single shared `<ComingSoonPanel>` and `<NavBadge>` components in `components/portal/` are reused by every gated route. Sidebar gets per-item "Soon" badges. Admin nav is extracted to `app/admin/_nav.ts` so adding/removing entries is one edit. Existing content files (`lessons/content.ts`, `mock-tests/content.ts`) and the mock-test runner are preserved on disk for future phases — they are simply no longer imported by routes.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, Lucide icons, existing `@/components/ui/badge` and design tokens (`var(--accent)`, `var(--surface)`, etc.).

**Note on testing:** This repo has no Jest/Vitest/Playwright setup — verification is `npm run build` (TypeScript + ESLint pass) plus a manual checklist. New components are pure UI; their correctness is visual.

---

## File Structure

**Create:**
- `components/portal/ComingSoonPanel.tsx` — shared placeholder UI for gated routes
- `components/portal/NavBadge.tsx` — "Soon" pill used in sidebar
- `components/portal/InfoBanner.tsx` — neutral banner used on Skill Drill
- `app/admin/_nav.ts` — single source of truth for admin nav entries

**Modify:**
- `app/portal/lessons/page.tsx` — render `<ComingSoonPanel>` only
- `app/portal/lessons/[id]/page.tsx` — render `<ComingSoonPanel>` only
- `app/portal/mock-tests/page.tsx` — render `<ComingSoonPanel>` only
- `app/portal/mock-tests/[id]/page.tsx` — render `<ComingSoonPanel>` only (parent page; runner subroute also gated)
- `app/portal/mock-tests/[id]/run/page.tsx` — render `<ComingSoonPanel>` only (preserves runner code in git history)
- `app/portal/practice/page.tsx` — add `<InfoBanner>` above Skill Drill question card
- `components/portal/PortalSidebar.tsx` — add `soon?: boolean` to `NavItemDef`, mark Lessons + Mock Tests entries, render `<NavBadge>` when set
- `app/admin/layout.tsx` — import nav from `_nav.ts` instead of inline `NAV` array

**Delete:**
- `app/admin/broadcast/` (entire directory)
- `app/admin/payouts/` (entire directory)
- `app/admin/revenue/` (entire directory)

**Preserved (parked, not deleted):**
- `app/portal/lessons/content.ts`, `app/portal/mock-tests/content.ts` — for re-use when real lessons/mocks ship
- `app/portal/mock-tests/[id]/run/` — runner UI/logic for future use

---

### Task 1: Add `<ComingSoonPanel>` component

**Files:**
- Create: `components/portal/ComingSoonPanel.tsx`

- [ ] **Step 1: Write the component**

Create `components/portal/ComingSoonPanel.tsx`:

```tsx
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface ComingSoonPanelProps {
  /** Short, capitalized feature name shown in the eyebrow. */
  feature: string;
  /** Hero title — what's coming. */
  title: string;
  /** Italic flourish under the title (matches PortalHero rhythm). */
  italic?: string;
  /** One short paragraph describing what students will get. */
  blurb: string;
  /** Optional bullets — 2 to 4 items max. */
  highlights?: string[];
  /** Optional ETA string, e.g. "Summer 2026". */
  eta?: string;
  /** Optional back link target; defaults to /portal. */
  backHref?: string;
  /** Optional back link label. */
  backLabel?: string;
}

export function ComingSoonPanel({
  feature,
  title,
  italic,
  blurb,
  highlights,
  eta,
  backHref = "/portal",
  backLabel = "Back to dashboard",
}: ComingSoonPanelProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono mb-6"
      >
        <ArrowLeft size={12} /> {backLabel}
      </Link>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, white, transparent 60%), radial-gradient(1px 1px at 70% 60%, white, transparent 60%), radial-gradient(1px 1px at 50% 80%, white, transparent 60%)",
            backgroundSize: "200px 200px",
          }}
        />
        <div className="relative">
          <p className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold mb-3 inline-flex items-center gap-1.5">
            <Sparkles size={11} /> {feature} · Coming soon
          </p>
          <h1 className="text-[28px] sm:text-[32px] font-light font-[family-name:var(--font-fraunces)] text-[var(--text-1)] leading-tight">
            {title}
            {italic && (
              <>
                {" "}
                <em className="text-[var(--accent)]">{italic}</em>
              </>
            )}
          </h1>
          <p className="mt-4 text-[14px] text-[var(--text-2)] leading-relaxed max-w-xl">{blurb}</p>

          {highlights && highlights.length > 0 && (
            <ul className="mt-6 space-y-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-[13.5px] text-[var(--text-1)] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          {eta && (
            <p className="mt-6 text-[11.5px] font-mono uppercase tracking-[0.18em] text-[var(--text-3)]">
              Expected: {eta}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors related to this file.

- [ ] **Step 3: Commit**

```bash
git add components/portal/ComingSoonPanel.tsx
git commit -m "feat(portal): add ComingSoonPanel shared component"
```

---

### Task 2: Add `<NavBadge>` component

**Files:**
- Create: `components/portal/NavBadge.tsx`

- [ ] **Step 1: Write the component**

Create `components/portal/NavBadge.tsx`:

```tsx
import { cn } from "@/lib/utils";

export interface NavBadgeProps {
  variant?: "soon" | "new";
  className?: string;
  children?: React.ReactNode;
}

const STYLES: Record<NonNullable<NavBadgeProps["variant"]>, string> = {
  soon: "bg-[var(--surface-elevated)] border-[var(--border-2)] text-[var(--text-3)]",
  new: "bg-[var(--accent-dim)] border-[var(--border-accent)] text-[var(--accent)]",
};

const DEFAULT_LABELS: Record<NonNullable<NavBadgeProps["variant"]>, string> = {
  soon: "Soon",
  new: "New",
};

export function NavBadge({ variant = "soon", className, children }: NavBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 h-4 rounded border text-[9px] font-semibold uppercase tracking-wider",
        STYLES[variant],
        className,
      )}
    >
      {children ?? DEFAULT_LABELS[variant]}
    </span>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors related to this file.

- [ ] **Step 3: Commit**

```bash
git add components/portal/NavBadge.tsx
git commit -m "feat(portal): add NavBadge for sidebar pills"
```

---

### Task 3: Add `<InfoBanner>` component

**Files:**
- Create: `components/portal/InfoBanner.tsx`

- [ ] **Step 1: Write the component**

Create `components/portal/InfoBanner.tsx`:

```tsx
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InfoBannerProps {
  tone?: "info" | "warn";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoBanner({ tone = "info", title, children, className }: InfoBannerProps) {
  const toneClasses =
    tone === "warn"
      ? "border-[var(--border-2)] bg-[var(--surface-elevated)]"
      : "border-[var(--border-accent)] bg-[var(--accent-dim)]";

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 flex items-start gap-3",
        toneClasses,
        className,
      )}
      role="status"
    >
      <Info
        size={15}
        className={cn("mt-0.5 shrink-0", tone === "warn" ? "text-[var(--text-2)]" : "text-[var(--accent)]")}
      />
      <div className="text-[13px] text-[var(--text-1)] leading-relaxed">
        {title && <p className="font-semibold mb-1">{title}</p>}
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors related to this file.

- [ ] **Step 3: Commit**

```bash
git add components/portal/InfoBanner.tsx
git commit -m "feat(portal): add InfoBanner shared component"
```

---

### Task 4: Gate `/portal/lessons` index

**Files:**
- Modify: `app/portal/lessons/page.tsx`

- [ ] **Step 1: Replace the page**

Overwrite `app/portal/lessons/page.tsx` with:

```tsx
import { ComingSoonPanel } from "@/components/portal/ComingSoonPanel";

export const metadata = {
  title: "Video lessons · Coming soon",
  description: "Three-minute micro-lessons by Nyx tutors — coming soon.",
};

export default function LessonsPage() {
  return (
    <ComingSoonPanel
      feature="Video lessons"
      title="Three-minute walkthroughs,"
      italic="one skill at a time"
      blurb="We're recording a library of micro-lessons taught by the same tutors working with students each week. Each lesson cracks one skill: a pacing trick, a problem type, a writing move."
      highlights={[
        "3–5 minute videos, captioned and chunked by skill",
        "Tied directly to your sky map — what slipped, you can replay",
        "New lessons every other week, recorded in the current test format",
      ]}
      eta="Summer 2026"
    />
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build` (or `npx tsc --noEmit` for a faster TS-only check)
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/portal/lessons/page.tsx
git commit -m "feat(portal): gate /portal/lessons behind ComingSoonPanel"
```

---

### Task 5: Gate `/portal/lessons/[id]` detail

**Files:**
- Modify: `app/portal/lessons/[id]/page.tsx`

- [ ] **Step 1: Replace the page**

Overwrite `app/portal/lessons/[id]/page.tsx` with:

```tsx
import { ComingSoonPanel } from "@/components/portal/ComingSoonPanel";

export const metadata = {
  title: "Video lessons · Coming soon",
};

export default function LessonDetailPage() {
  return (
    <ComingSoonPanel
      feature="Video lessons"
      title="Library is being recorded"
      italic="check back soon"
      blurb="Individual lesson pages will live here once the first batch ships. In the meantime, your sky map and Daily Review are the fastest way to convert a weak spot into a confident answer."
      eta="Summer 2026"
      backHref="/portal/lessons"
      backLabel="Back to video lessons"
    />
  );
}
```

Note: this removes the `generateStaticParams` / `generateMetadata` exports. Acceptable — there are no real lesson IDs to pre-render. The route now matches any `[id]` and shows the same panel.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/portal/lessons/\[id\]/page.tsx
git commit -m "feat(portal): gate /portal/lessons/[id] behind ComingSoonPanel"
```

---

### Task 6: Gate `/portal/mock-tests` index

**Files:**
- Modify: `app/portal/mock-tests/page.tsx`

- [ ] **Step 1: Replace the page**

Overwrite `app/portal/mock-tests/page.tsx` with:

```tsx
import { ComingSoonPanel } from "@/components/portal/ComingSoonPanel";

export const metadata = {
  title: "Mock tests · Coming soon",
  description: "Full-length digital SAT/ACT mocks — coming soon.",
};

export default function MockTestsPage() {
  return (
    <ComingSoonPanel
      feature="Mock tests"
      title="Full-length, scored,"
      italic="hand-calibrated"
      blurb="We're building a rotation of full-length digital SAT and ACT mocks, each calibrated against three real test forms. Score reports flow directly into your sky map and your weekly digest."
      highlights={[
        "Adaptive section structure for digital SAT",
        "Scaled scoring with ±15-point precision (SAT) and ±1-point (ACT)",
        "New mock every two weeks once the rotation is live",
      ]}
      eta="Summer 2026"
    />
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/portal/mock-tests/page.tsx
git commit -m "feat(portal): gate /portal/mock-tests behind ComingSoonPanel"
```

---

### Task 7: Gate `/portal/mock-tests/[id]` detail

**Files:**
- Modify: `app/portal/mock-tests/[id]/page.tsx`

- [ ] **Step 1: Replace the page**

Overwrite `app/portal/mock-tests/[id]/page.tsx` with:

```tsx
import { ComingSoonPanel } from "@/components/portal/ComingSoonPanel";

export const metadata = {
  title: "Mock tests · Coming soon",
};

export default function MockTestDetailPage() {
  return (
    <ComingSoonPanel
      feature="Mock tests"
      title="This mock is being calibrated"
      italic="we want it real"
      blurb="The mock-test rotation isn't live yet. Once it is, this page becomes the start screen for the timed run plus your previous attempts."
      eta="Summer 2026"
      backHref="/portal/mock-tests"
      backLabel="Back to mock tests"
    />
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/portal/mock-tests/\[id\]/page.tsx
git commit -m "feat(portal): gate /portal/mock-tests/[id] behind ComingSoonPanel"
```

---

### Task 8: Gate `/portal/mock-tests/[id]/run` runner subroute

**Files:**
- Modify: `app/portal/mock-tests/[id]/run/page.tsx`

The existing runner code stays in git history for re-use. The route returns the panel.

- [ ] **Step 1: Replace the page**

Overwrite `app/portal/mock-tests/[id]/run/page.tsx` with:

```tsx
import { ComingSoonPanel } from "@/components/portal/ComingSoonPanel";

export const metadata = {
  title: "Mock test runner · Coming soon",
};

export default function MockRunPage() {
  return (
    <ComingSoonPanel
      feature="Mock tests"
      title="Timed runner is offline"
      italic="for now"
      blurb="The full-length runner is paused while we calibrate the question rotation. The Adaptive Intake (under Learn → Adaptive intake) is the closest thing currently live — it's a 14-question diagnostic, not a full-length mock, but it produces a real sky map."
      eta="Summer 2026"
      backHref="/portal/mock-tests"
      backLabel="Back to mock tests"
    />
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/portal/mock-tests/\[id\]/run/page.tsx
git commit -m "feat(portal): gate /portal/mock-tests/[id]/run behind ComingSoonPanel"
```

---

### Task 9: Add transition banner to Practice → Skill Drill

**Files:**
- Modify: `app/portal/practice/page.tsx`

- [ ] **Step 1: Import `<InfoBanner>` and render it inside `SkillDrill`**

In `app/portal/practice/page.tsx`, add this import near the other component imports (after the `PortalHero` import on line 10):

```tsx
import { InfoBanner } from "@/components/portal/InfoBanner";
```

Then, inside the `SkillDrill` component's main return (the `<div className="max-w-xl mx-auto">…</div>` block that starts at line 110), insert the banner immediately before the existing `<div className="flex items-center gap-3 mb-6">` header. The result should look like:

```tsx
  return (
    <div className="max-w-xl mx-auto">
      <InfoBanner tone="warn" className="mb-5">
        Expanded question bank is being prepped — the current pool is a hand-built
        starter set. New items roll in over the next few weeks.
      </InfoBanner>

      <div className="flex items-center gap-3 mb-6">
        {/* ...existing header... */}
```

Do not add the banner inside the empty-state branch (`if (questions.length === 0)`) or the done branch — only the active drill.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/portal/practice/page.tsx
git commit -m "feat(portal): add Skill Drill bank-transition banner"
```

---

### Task 10: Show "Soon" badge on gated sidebar items

**Files:**
- Modify: `components/portal/PortalSidebar.tsx`

- [ ] **Step 1: Extend `NavItemDef` and student nav config**

In `components/portal/PortalSidebar.tsx`:

a) Add an import near the other portal-component imports (around line 27):

```tsx
import { NavBadge } from "@/components/portal/NavBadge";
```

b) Update the `NavItemDef` interface (currently lines 30–37) to include a `soon` flag:

```tsx
interface NavItemDef {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
  plans?: PlanType[];
  badgeKey?: "messages";
  soon?: boolean;
}
```

c) In the `studentNavGroups` "Learn" group (lines 54–64), mark the gated entries:

Change:

```tsx
{ href: "/portal/lessons",      label: "Video lessons", icon: PlayCircle },
{ href: "/portal/mock-tests",   label: "Mock tests",   icon: Timer },
```

to:

```tsx
{ href: "/portal/lessons",      label: "Video lessons", icon: PlayCircle, soon: true },
{ href: "/portal/mock-tests",   label: "Mock tests",   icon: Timer, soon: true },
```

- [ ] **Step 2: Render the badge inside `NavItem`**

Locate the `NavItem` render block (around lines 138–144) where the message-unread badge is rendered. Add the "Soon" badge next to it. Replace the existing trailing badge block with:

```tsx
      <span className="flex-1 truncate">{item.label}</span>
      {showBadge ? (
        <span className="px-1.5 h-4 min-w-4 rounded-full bg-[var(--accent)] text-[var(--on-accent)] text-[9.5px] font-bold flex items-center justify-center">
          {unreadCount! > 9 ? "9+" : unreadCount}
        </span>
      ) : item.soon ? (
        <NavBadge variant="soon" />
      ) : null}
```

(Existing `showBadge` logic stays the same; the `soon` badge only shows when `showBadge` is false.)

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add components/portal/PortalSidebar.tsx
git commit -m "feat(portal): show Soon badge on gated sidebar entries"
```

---

### Task 11: Extract admin nav to `_nav.ts` and remove stub entries

**Files:**
- Create: `app/admin/_nav.ts`
- Modify: `app/admin/layout.tsx`

- [ ] **Step 1: Create `app/admin/_nav.ts`**

Create `app/admin/_nav.ts` containing only the entries we want to keep — note the deletions of `broadcast`, `revenue`, `payouts`:

```ts
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileSearch,
  Sparkles,
  Tag,
  Activity,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin",             label: "Overview",    icon: LayoutDashboard },
  { href: "/admin/tutors",      label: "Tutors",      icon: GraduationCap },
  { href: "/admin/students",    label: "Students",    icon: Users },
  { href: "/admin/questions",   label: "Questions",   icon: Sparkles },
  { href: "/admin/pricing",     label: "Pricing",     icon: Tag },
  { href: "/admin/audit",       label: "Audit",       icon: FileSearch },
  { href: "/admin/diagnostics", label: "Diagnostics", icon: Activity },
];
```

- [ ] **Step 2: Update `app/admin/layout.tsx` to import from `_nav.ts`**

Overwrite `app/admin/layout.tsx` with:

```tsx
import Link from "next/link";
import { ADMIN_NAV } from "./_nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-[68px]">
      <AdminNav />
      <main>{children}</main>
    </div>
  );
}

function AdminNav() {
  return (
    <nav className="border-b border-[var(--border)] bg-[var(--bg-2)]">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center gap-1 py-2">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--accent-dim)] transition-colors"
            >
              <Icon size={12.5} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add app/admin/_nav.ts app/admin/layout.tsx
git commit -m "refactor(admin): extract nav to _nav.ts and drop stub entries"
```

---

### Task 12: Delete stub admin directories

**Files:**
- Delete: `app/admin/broadcast/`, `app/admin/payouts/`, `app/admin/revenue/`

- [ ] **Step 1: Verify no other code imports these**

Run: `grep -rn "admin/broadcast\|admin/payouts\|admin/revenue" app/ components/ lib/ types/`
Expected: no results other than (possibly) the now-removed admin layout reference (which Task 11 already removed). Stop and reconcile if anything else references them.

- [ ] **Step 2: Delete the directories**

Run:

```bash
rm -rf app/admin/broadcast app/admin/payouts app/admin/revenue
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add -A app/admin
git commit -m "chore(admin): delete broadcast/payouts/revenue stub pages"
```

---

### Task 13: Final verification

**Files:** None modified. This task confirms acceptance.

- [ ] **Step 1: Type + lint pass**

Run: `npm run build`
Expected: build succeeds, no TS errors, no ESLint failures introduced by Phase C.

- [ ] **Step 2: Hardcoded-link audit**

Run: `grep -rn "/admin/broadcast\|/admin/payouts\|/admin/revenue" app/ components/ lib/ types/`
Expected: no results.

Run: `grep -rn "from \"./content\"\|from '../content'" app/portal/lessons app/portal/mock-tests`
Expected: no results in `page.tsx` files (only `content.ts` itself, which is parked but no longer imported).

- [ ] **Step 3: Manual checklist (visual / behavioral)**

Start the dev server with `npm run dev` and verify in a browser:

- `/portal/lessons` renders `<ComingSoonPanel>` with the lessons copy and "Soon" pill in the sidebar.
- `/portal/lessons/anything` renders the detail variant of the panel.
- `/portal/mock-tests` renders the mock-tests panel.
- `/portal/mock-tests/sat-april-2026` and `/portal/mock-tests/sat-april-2026/run` render the panel variants.
- `/portal/practice?skill=<some-real-skill-id>` shows the new transition banner above the question card; `/portal/practice` (SRS mode) is unchanged.
- `/portal/materials` is unchanged.
- Admin nav (when logged in as admin) shows: Overview, Tutors, Students, Questions, Pricing, Audit, Diagnostics. No Broadcast / Revenue / Payouts. Visiting `/admin/broadcast` 404s.

- [ ] **Step 4: Final commit if any cleanup needed**

If the manual pass reveals anything, fix and commit. Otherwise, Phase C is done.

---

## Self-Review (run before handing off)

1. **Spec coverage:** All Phase C items in the spec have a task — `<ComingSoonPanel>` (T1), `<NavBadge>` (T2), `<InfoBanner>` (T3), Lessons gate (T4–T5), Mock-tests gate (T6–T8), Practice banner (T9), sidebar Soon pills (T10), `_nav.ts` extraction + stub deletes (T11–T12), final verification (T13).
2. **Placeholder scan:** No "TBD"/"TODO"/"similar to". All file paths are exact. All required code is inlined.
3. **Type consistency:** `ComingSoonPanelProps` fields used in T4–T8 match the definition in T1. `NavBadgeProps` fields used in T10 match T2. `InfoBannerProps` fields used in T9 match T3. `AdminNavItem` shape in T11 matches the inline use in `app/admin/layout.tsx`.
4. **Acceptance for the phase:** Walk-the-portal pass produces no thin/embarrassing surfaces. Admin nav has no dead-end stubs. `npm run build` clean.

---

## What's Next

Phase A (real question bank) and Phase B (tutoring portal backbone) each get their own plan, written after Phase C lands so each is informed by what we learned. The spec at `docs/superpowers/specs/2026-05-03-utility-pass-design.md` is the source of truth for both.
