---
title: Nyx Visual Redesign — Cohesion Pass
date: 2026-05-02
status: approved
scope: design-only (no functionality changes except scaffolding the new consultation dashboard route)
---

# Nyx Visual Redesign — Cohesion Pass

## Context

Nyx Scholars is pivoting toward an adaptive SAT prep product. Before the functional rebuild, the visual layer needs to be unfragmented and razzed up to read as a high-end, dark, editorial-grade tutoring brand. The user is supplying photos and plots in a `claude_design/` folder (to be added) that need a consistent home in the new system.

This spec covers **only the visual / structural redesign**. No backend, schema, plan-tier, or product feature changes ship in this pass. The single new *route* is `/portal/consultation` — a dashboard *layout*, populated with typed mock data; no live data wiring.

## Goals

1. Replace the fragmented per-page styles with a **single design system** powered by shared primitives.
2. Refresh the visual language from "premium hotel gold-on-navy" to **"observatory / editorial dark luxury"** — deeper backgrounds, sparingly used brass accent, a cool moonlight secondary, warmer paper-white text.
3. Provide deliberate slots for the incoming `claude_design/` photos and plots so they elevate the brand instead of feeling pasted in.
4. Standardize page archetypes so every existing page inherits a layout pattern from a small fixed set.
5. Scaffold the new **consultation dashboard** layout under `/portal/consultation`.

## Non-Goals

- No copywriting overhaul (only trimming where layout demands).
- No changes to plan tiers, pricing logic, payments, Supabase schemas, or admin auth.
- No new product surfaces (adaptive engine, question bank, IRT, score reports). Those land in subsequent specs.
- No swap of the underlying framework — Next.js 16 + Tailwind 4 + Radix/shadcn UI primitives stay.
- No replacement of `components/ui/*` (shadcn primitives). They stay; the new layer composes on top.

## Cohesion Audit — Current Fragmentation

Issues identified in the existing codebase that justify the refactor:

- **Card treatments diverge** — `border-white/[0.07]` plain cards (services), gold-tinted cards with `card-hover` (home), bespoke admissions cards. No single primitive.
- **Section padding scale drifts** — `py-28` / `py-24` / `py-20` / per-page custom. No rhythm.
- **Headline scale is inconsistent** — `clamp(2.6rem, 6vw, 5.5rem)` on home; flat `2.1rem` / `2.2rem` on subpages. Pages read as different products.
- **Eyebrow labels exist in three styles** — gold dot pill, `gold-line` caps, plain caps.
- **Marketing and portal share no vocabulary** — portal feels like a flat admin tool; marketing is dramatic. They should diverge in *register*, not in *language*.
- **Pages are long inline JSX** — `app/page.tsx` is 429 lines. Each section is a snowflake.

## Visual System

### Palette (replaces tokens in `app/globals.css`)

| Token | Old | New | Use |
|---|---|---|---|
| `--bg` | `#060912` | `#05070d` | Page background, deeper near-black indigo |
| `--bg-2` | `#0b0f1a` | `#080b14` | Section alternation, subtle |
| `--surface` | `#0f1521` | `#0c1018` | Default card surface |
| `--surface-elevated` | (n/a) | `#141925` | Cards floating above surface |
| `--surface-3` | `#1a2338` | `#1b2236` | Hover/active surface |
| `--border` | `rgba(255,255,255,.07)` | `rgba(255,255,255,.06)` | Default borders |
| `--border-2` | `rgba(255,255,255,.12)` | `rgba(255,255,255,.10)` | Hover borders |
| `--accent` | `#d4a853` | `#c9a961` | Brass — used **sparingly**, primary CTA + key data only |
| `--accent-bright` | `#e8c46a` | `#d8bb78` | Hover state of accent |
| `--accent-dim` | `rgba(212,168,83,.15)` | `rgba(201,169,97,.12)` | Tinted bg for accent panels |
| `--accent-2` | (n/a) | `#7d9bc1` | Moonlight blue — links, plot lines, soft highlights |
| `--text-1` | `#f0ece3` | `#f5f1e8` | Headings, primary text — warmer paper-white |
| `--text-2` | `#8d9ab0` | `#9aa5b8` | Body |
| `--text-3` | `#4e5d72` | `#52607a` | Muted / labels |

The accent budget is **strict**: brass appears on the primary CTA, the eyebrow, the active nav state, and at most one accent line per section. Everything else uses neutral text or moonlight blue.

### Typography

- **Display** — Fraunces (variable, optical sizing). Used **only** for `<Heading level={1|2}>`.
- **UI/body** — Geist Sans (already loaded).
- **Mono** — Geist Mono (already loaded). Stats, dates, numerical IDs only.

Type scale (locked — nothing in between):

```
12 / 14 / 16 / 18 / 24 / 32 / 48 / 64 / 80
```

Heading sizes:
- `h1`: 64 desktop / 48 tablet / 40 mobile (Fraunces, weight 500, optical-size 96, tracking -0.02em, line-height 1.05)
- `h2`: 48 desktop / 32 tablet (Fraunces, weight 500, optical-size 48, tracking -0.015em, line-height 1.1)
- `h3`: 24 (Geist Sans, weight 600, tracking -0.005em, line-height 1.25)
- `h4`: 18 (Geist Sans, weight 600)
- Body: 16 / line-height 1.7
- Body-small: 14 / line-height 1.65
- Eyebrow: 12 / weight 700 / uppercase / tracking 0.16em

### Texture & Atmosphere

- **Star field**: fixed-position SVG layer, 4% opacity, behind everything, parallax-free. Sparser and larger than the existing dot grid.
- **Film grain**: global 3% noise overlay (already partial via `surface-noise`; promote to `body::after`).
- **Section transitions**: replace hard `border-y` lines with vertical horizon gradients (deep indigo → near-black → deep indigo).
- **Glow accents**: keep the radial brass glow at hero top, but reduce intensity from `.22` to `.16` and tighten the ellipse.
- **Removed**: the existing dot-grid pattern (replaced by star field).

### Motion

- Single ease curve: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Default duration: 0.6s.
- Stagger delay: 0.08s per item.
- All scroll-in animations use `viewport={{ once: true }}` — no re-fires.
- Hover transitions: 0.2s on color, 0.3s on transform.

## Shared Primitives — `components/system/`

The cohesion work hinges on every page composing from a small fixed set of primitives. New folder: `components/system/`. Existing `components/ui/` (shadcn) is left untouched.

### `<Section>`

```tsx
<Section
  variant="default" | "elevated" | "accent"
  spacing="default" | "tight" | "loose"
  glow?: "top" | "bottom" | "side" | "none"
  bordered?: boolean
>
```

- Wraps a `<section>` element.
- Owns vertical rhythm: `default` = `py-32 md:py-36`, `tight` = `py-20 md:py-24`, `loose` = `py-40 md:py-48`.
- Owns max-width container: `max-w-7xl mx-auto px-5 sm:px-8`.
- `glow` adds a positioned radial gradient layer.
- `bordered` adds a top horizon-gradient divider.

### `<Eyebrow>`

```tsx
<Eyebrow color="brass" | "moon">{children}</Eyebrow>
```

- 12px uppercase tracked label with the gold-line decoration.
- Replaces all three current eyebrow styles.

### `<Heading level={1|2|3|4}>`

- Locks display font + size + tracking + line-height.
- Optional `as` prop to override semantic tag (e.g. `<Heading level={2} as="h1">` for SEO).

### `<Text variant="body" | "lead" | "caption" | "small">`

- Standard paragraph styles. `lead` is 18px line-height 1.7, used directly under h1/h2.

### `<Card variant="default" | "elevated" | "accent" | "feature" | "ghost">`

- Single card surface system with locked padding (`p-6` / `p-8` for `feature`).
- `variant="default"`: `--surface` background, `--border` border.
- `variant="elevated"`: `--surface-elevated`, slightly stronger shadow.
- `variant="accent"`: brass-tinted background `--accent-dim`, brass border at 15% opacity.
- `variant="feature"`: larger padding, optional photo slot.
- `variant="ghost"`: transparent, hairline border only — used in dashboards.
- All variants share the same hover treatment via `card-hover` class — refined to use a softer translateY and a subtle border-color shift; gold-glow hover is removed except on `variant="accent"`.

### `<StatBlock>`

```tsx
<StatBlock items={[{ stat, label, mono?: true }]} columns={2 | 3 | 4} />
```

- Replaces the inline grid on home and elsewhere. Uses Geist Mono for the stat when `mono: true`.

### `<HeroFrame>`

- Two variants: `text-only` (current home hero), `text-with-image` (50/50 split, image on right with gradient mask).
- Owns the eyebrow → heading → lead → CTA stack.
- Standardizes mobile collapse: image stacks below text under `md`.

### `<PhotoFrame>`

- Wraps `<Image>` from `next/image`.
- Adds: rounded-xl border, optional caption with mono number prefix (e.g. `01 / Manifesto`), optional gradient mask overlay (top, bottom, both), optional hover zoom (1.02).
- Aspects: `auto`, `square`, `portrait` (4:5), `landscape` (16:9), `wide` (21:9).
- All photos in the site flow through this component.

### `<PlotEmbed>`

- Wraps a chart (image or future inline SVG/recharts).
- Adds: outer frame with mono caption ("Source: …"), grid background option, optional zoom-on-click placeholder (no implementation in this pass).
- All charts/plots flow through this component.

### `<CTA>`

- Two variants: `primary` (brass gradient — the only place full brass is used), `ghost` (border + text).
- Locks padding, radius, font-weight. Replaces the inline gradient buttons.

### `<HorizonDivider>`

- A 1px vertical-gradient hairline (transparent → border → transparent) to separate sections without hard lines.

### `<Eyelet>` (small mono label)

- Tiny mono "01 — Section" labels used in editorial layouts. Optional.

## Page Archetypes

Every page is one of these. Page files become thin compositions of system primitives.

### A. Editorial Scroll (home)

Stack of distinct sections, each a story beat. ~5 sections max.

1. Hero (`<HeroFrame variant="text-only">`) — eyebrow, h1, lead, CTAs, trust micro-strip.
2. Manifesto (`<Section variant="elevated">` + `<PhotoFrame>` aside) — short philosophy with one full-bleed photo.
3. Plot showcase (`<Section>` + `<PlotEmbed>`) — score-trajectory or skill-distribution chart, copy beside.
4. Founders strip (`<Section>` + 2 `<Card variant="feature">` with `<PhotoFrame>`) — Loc + Charles, brief.
5. CTA banner (`<Section variant="accent" glow="bottom">`) — final push.

### B. Long-form Essay (`/sat-act`, `/college-admissions`)

Single column, max-width prose, large imagery and inline plots interleaved.

- Title block (eyebrow + h1 + lead).
- Body in narrative subsections separated by `<HorizonDivider>`.
- Inline `<PhotoFrame>` and `<PlotEmbed>` every 2–3 subsections.
- Footer CTA.

### C. Catalog Grid (`/services`)

- Header section (eyebrow, h2, lead).
- 2-up `<Card variant="feature">` cards, each with a `<PhotoFrame>` photo, label, copy, "Learn more" link.
- Optional dense secondary 4-up grid below for adjacent offerings.

### D. Profile Spread (`/tutors` → "Founders")

- Magazine layout per founder: full-bleed `<PhotoFrame variant="portrait">` on one side, headline + bio + credentials on the other. Alternates left/right between founders.
- Page intro on top, joint statement on bottom.

### E. Comparison (`/pricing`)

- Header section.
- 3-column `<Card variant="default|accent|default">` (middle = highlighted plan, accent variant).
- Below: feature matrix table — single source of truth for what each tier includes.
- FAQ accordion at bottom (reuses existing `FAQAccordion`).

### F. Knowledge (`/faq`)

- Single-column, generous spacing.
- Restyle existing accordion to match new tokens (border, padding, motion).

### G. Form (`/apply`)

- Centered narrow `<Card variant="elevated">` form on mobile.
- On desktop ≥ md: 2-col with form on left and a calm side panel (`<PhotoFrame>` + a quote / trust strip) on the right.

### H. App Shell (all `/portal/*` except login/signup)

- Persistent `PortalSidebar` (existing, restyled to new tokens).
- Content area uses a different section rhythm: `py-10 md:py-12`, no big glows, denser cards.
- Visual register: same palette and type, **lower drama** — small headings, more data, less storytelling.

### I. Auth (`/portal/login`, `/portal/signup`)

- Centered narrow `<Card variant="elevated">` on a star-field background.
- Single column, no sidebar.

### J. Dashboard (`/portal/consultation` — NEW, see §"Consultation Dashboard")

## Per-Page Plan

| Page | Archetype | Notes |
|---|---|---|
| `/` | A. Editorial Scroll | Reduce from ~7 sections to 5; bring photos in early; lighter hero copy |
| `/sat-act` | B. Long-form Essay | Drop current grid; rebuild as narrative |
| `/college-admissions` | B. Long-form Essay | Same archetype as `/sat-act` for cohesion |
| `/services` | C. Catalog Grid | Add photo-per-service; widen cards |
| `/tutors` | D. Profile Spread | Rename heading to "Founders"; magazine layout |
| `/pricing` | E. Comparison | Tighten tier cards; add feature matrix |
| `/faq` | F. Knowledge | Restyle accordion only |
| `/apply` | G. Form | Add side imagery on desktop |
| `/portal` (overview) | H. App Shell | Consolidate; remove decorative cruft |
| `/portal/sessions` | H. App Shell | Restyle to new tokens |
| `/portal/sessions/[id]` | H. App Shell | Restyle |
| `/portal/messages` | H. App Shell | Restyle |
| `/portal/profile` | H. App Shell | Restyle |
| `/portal/schedule` | H. App Shell | Restyle |
| `/portal/materials` | H. App Shell | Restyle |
| `/portal/upgrade` | H. App Shell | Restyle |
| `/portal/login` | I. Auth | Restyle |
| `/portal/signup` | I. Auth | Restyle |
| `/portal/consultation` | J. Dashboard | **NEW** |
| `/admin` | (special — minimal styling pass) | Tokens only; no archetype change |

## Consultation Dashboard

**Route:** `app/portal/consultation/page.tsx`

**Wired into:** `components/portal/PortalSidebar.tsx` as a top-level link with a compass-rose icon (Lucide `Compass`), positioned above "Sessions."

**Data:** A typed mock object in `lib/mock/consultationDashboard.ts` exporting `mockDashboard: ConsultationDashboardData`. The shape is designed to map onto Supabase later but contains only literal values for this pass.

```ts
export type ConsultationDashboardData = {
  student: { name: string; plan: "Free" | "Scholar" | "Constellation"; nextSessionAt: string | null };
  kpis: {
    diagnosticScore: { value: number; outOf: 1600; deltaFromLast: number | null };
    practiceHours: { value: number; window: "7d" | "30d" };
    streakDays: number;
    targetScore: number;
  };
  trajectory: { date: string; score: number }[];          // for the line plot
  mastery: { skill: string; section: "Math" | "RW"; mastery: 0..1 }[]; // for the heatmap
  upcomingSession: { tutor: string; topic: string; startsAt: string } | null;
  notes: { id: string; author: string; createdAt: string; body: string }[];
  recommendations: { id: string; title: string; cta: string; href: string }[];
};
```

**Layout (12-col grid on desktop, single column on mobile):**

```
┌─────────────────────────────────────────────────────────────────┐
│ TOP BAR (full width)                                            │
│  Student name · Plan badge · "Next session in 3d" · settings link│
├─────────────────────────────────────────────────────────────────┤
│ KPI STRIP (4 columns)                                            │
│  [Diagnostic 1310 +40] [Practice 6.5h /7d] [Streak 12d] [Target 1480] │
├──────────────────────────────────┬──────────────────────────────┤
│ MAIN (col-span-8)                │ RAIL (col-span-4)            │
│  ┌─ Score trajectory ────────┐   │  ┌─ Upcoming session ─────┐  │
│  │ <PlotEmbed line chart>    │   │  │ Tutor · topic · time   │  │
│  │ caption: last 12 weeks    │   │  └────────────────────────┘  │
│  └───────────────────────────┘   │  ┌─ Tutor notes feed ─────┐  │
│  ┌─ Skill mastery ───────────┐   │  │ note · note · note     │  │
│  │ <PlotEmbed heatmap>       │   │  └────────────────────────┘  │
│  │ Math + RW skills          │   │  ┌─ Recommended actions ──┐  │
│  └───────────────────────────┘   │  │ 3 next steps           │  │
│                                  │  └────────────────────────┘  │
├──────────────────────────────────┴──────────────────────────────┤
│ FOOTER ZONE: subtle constellation backdrop, no content          │
└─────────────────────────────────────────────────────────────────┘
```

- **Top bar:** thin row, `--surface` background, `--border` bottom edge, mono "Next session in 3d" using Geist Mono.
- **KPI strip:** 4 `<Card variant="ghost">` with mono numerals; each KPI has an optional delta badge (`+40`, `-2`) using moonlight blue for positive and a desaturated red for negative.
- **Score trajectory:** `<PlotEmbed>` wrapping a placeholder PNG/SVG slot for now (the user will drop the real plot in `claude_design/`); caption is mono.
- **Skill mastery:** `<PlotEmbed>` wrapping a heatmap placeholder; rows = skills, columns = mastery bands.
- **Upcoming session:** `<Card variant="elevated">` with mono date, brass CTA `View session`.
- **Tutor notes feed:** vertically stacked `<Card variant="ghost">` items, max 5 visible, "View all" link below.
- **Recommended actions:** `<Card variant="accent">` (the only accent card on the page) with 3 stacked CTAs.

**Mobile (< md):** stacks in order — top bar → KPIs (2x2 grid) → trajectory → mastery → upcoming session → notes → recommendations.

**No live data wiring.** The page reads from `mockDashboard` only.

## Asset Pipeline — `claude_design/` Folder

When the folder is delivered, the inventory step runs:

1. List every file with type and dimensions.
2. Slot each asset into a page based on its semantic role:
   - Hero shots → home `Manifesto` and `/apply` side panel
   - Plot exports (score curves, distributions) → `/`'s plot showcase, consultation dashboard, `/sat-act` inline
   - Founder photos → `/tutors` profile spread
   - Texture / atmospheric → optional `<Section>` glow / divider backdrops (low opacity)
3. All assets land under `public/design/` with a flat naming scheme: `hero-1.jpg`, `plot-trajectory.svg`, `founder-loc.jpg`, etc.
4. Every image is rendered through `<PhotoFrame>` or `<PlotEmbed>` — no raw `<img>` or `<Image>` calls in page files.
5. Hero / above-the-fold images get `priority` on `next/image`; everything else lazy-loads.

## File Changes Summary

**New files:**

- `components/system/Section.tsx`
- `components/system/Eyebrow.tsx`
- `components/system/Heading.tsx`
- `components/system/Text.tsx`
- `components/system/Card.tsx`
- `components/system/StatBlock.tsx`
- `components/system/HeroFrame.tsx`
- `components/system/PhotoFrame.tsx`
- `components/system/PlotEmbed.tsx`
- `components/system/CTA.tsx`
- `components/system/HorizonDivider.tsx`
- `components/system/Eyelet.tsx`
- `components/system/index.ts` (barrel export)
- `app/portal/consultation/page.tsx`
- `lib/mock/consultationDashboard.ts`
- `public/design/.gitkeep` (placeholder until assets land)

**Modified files (token + composition refactor):**

- `app/globals.css` — palette, type scale, motion vars, star field, film grain, removed dot grid
- `app/layout.tsx` — load Fraunces font alongside Geist
- `app/page.tsx` — recompose into Editorial Scroll archetype (~150 lines target)
- `app/sat-act/page.tsx` — Long-form Essay archetype
- `app/college-admissions/page.tsx` — Long-form Essay archetype
- `app/services/page.tsx` — Catalog Grid archetype
- `app/tutors/page.tsx` — Profile Spread archetype
- `app/pricing/page.tsx` — Comparison archetype
- `app/faq/page.tsx` — restyled accordion only
- `app/apply/page.tsx` — Form archetype with side panel
- `app/portal/layout.tsx` — App Shell tokens
- `app/portal/page.tsx` — restyled to system primitives
- `app/portal/sessions/page.tsx`, `app/portal/sessions/[id]/page.tsx` — restyled
- `app/portal/messages/page.tsx`, `app/portal/profile/page.tsx`, `app/portal/schedule/page.tsx`, `app/portal/materials/page.tsx`, `app/portal/upgrade/page.tsx` — restyled
- `app/portal/login/page.tsx`, `app/portal/signup/page.tsx` — Auth archetype
- `app/admin/AdminDashboard.tsx` — token swap only
- `components/portal/PortalSidebar.tsx` — add Consultation link, restyle
- `components/shared/Navbar.tsx`, `components/shared/Footer.tsx` — token swap, slight type adjustment
- `components/shared/PricingCard.tsx`, `components/shared/ServiceCard.tsx`, `components/shared/TutorCard.tsx`, `components/shared/SectionHeader.tsx`, `components/shared/TrustBadge.tsx`, `components/shared/FAQAccordion.tsx`, `components/shared/LeadForm.tsx`, `components/shared/AdminLeadTable.tsx`, `components/shared/AdminPortalSection.tsx` — restyle to new tokens; some get thin wrappers around `components/system/` primitives.

**Untouched:**

- `components/ui/*` (shadcn primitives — left alone)
- API routes (`app/api/*`)
- `lib/supabase/*`, `lib/utils.ts`
- `types/lead.ts`, `types/portal.ts`
- All `.sql` schema files
- `proxy.ts`, build config, ESLint config

## Verification Strategy

This is a visual pass — automated tests have limited value. Verification checklist for the implementation phase:

1. `npm run build` succeeds with zero TypeScript errors.
2. `npm run lint` clean.
3. Every page renders in dev (`npm run dev`) without runtime errors. Visit each route in a browser; confirm no console errors and no layout collapse.
4. Visual cohesion check: open `/`, `/sat-act`, `/services`, `/tutors`, `/pricing`, `/portal`, `/portal/consultation` side by side. Confirm shared rhythm, type scale, palette.
5. Mobile breakpoint check at 375px and 768px on every page.
6. Lighthouse pass: no perf regression vs. current build (image priorities + lazy-loading enforced).
7. Confirm `claude_design/` placeholder slots render correctly with stand-in assets until real photos/plots arrive.

## Risks & Open Questions

- **Fraunces** adds one variable font load. Mitigation: load only the variable axes used (`opsz,wght`) and self-host through `next/font`.
- The `claude_design/` assets aren't here yet. Until they are, all photo/plot slots use neutral placeholders (CSS-drawn or low-poly SVGs) so layouts don't collapse.
- Some current shared components (e.g., `PricingCard`, `ServiceCard`, `TutorCard`) overlap with new system primitives. Decision in this pass: **keep the shared components but reimplement them as thin wrappers over the system primitives** — preserves call-sites, centralizes style.
- The admin dashboard (`/admin`) gets only a token swap; full redesign deferred (low priority for product launch).
- Portal pages currently bind to Supabase data. The visual restyle must not change query shape — only presentation.

## Approval

User confirmed direction in conversation on 2026-05-02:
- Pivot palette (cooler brass + moonlight blue): **yes**
- Add Fraunces display font: **yes**
- Introduce `components/system/` primitives and refactor pages: **yes**
- Page archetypes per §"Per-Page Plan": **yes**
- Consultation dashboard layout per §"Consultation Dashboard": **yes**

Implementation plan follows in `docs/superpowers/plans/2026-05-02-nyx-visual-redesign-plan.md`.
