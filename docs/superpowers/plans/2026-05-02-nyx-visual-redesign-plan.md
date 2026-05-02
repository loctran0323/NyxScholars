# Nyx Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor every page in the Nyx codebase onto a single design system (palette, type, primitives) that reads as high-end, dark, editorial tutoring; introduce slots for incoming `claude_design/` photos and plots; scaffold the new `/portal/consultation` dashboard layout.

**Architecture:** Token-first refactor. Step 1 swaps `app/globals.css` tokens, step 2 introduces `components/system/` primitives composed from those tokens, step 3 rewrites every page as thin compositions of the primitives. Existing `components/ui/` (shadcn) and all backend code remain untouched.

**Tech Stack:** Next.js 16 (app router), React 19, Tailwind CSS 4, Radix/shadcn primitives, Framer Motion, `next/font` (Geist Sans/Mono + new Fraunces variable), Supabase (untouched in this pass), Lucide icons.

**Spec:** `docs/superpowers/specs/2026-05-02-nyx-visual-redesign-design.md`

**Verification posture:** This is a visual refactor; traditional unit tests have low value. Each task's "test" is one of:
- (a) `npx tsc --noEmit` succeeds (type-check),
- (b) `npm run lint` clean for changed files,
- (c) `npm run build` succeeds,
- (d) `npm run dev` renders the affected route(s) without console errors,
- (e) a manual visual checklist (last task).
Commits happen at the end of each task.

---

## Working agreements

- **Imports**: always import system primitives from `@/components/system` (the barrel). Never import individual files from `components/system/*` directly.
- **No raw `<img>`** in page or component files. Every image goes through `<PhotoFrame>`. Every chart through `<PlotEmbed>`. (Icons from `lucide-react` are exempt.)
- **No inline gradient buttons** in pages. Every CTA goes through `<CTA>`.
- **No bespoke `<section>` wrappers** in pages. Every section uses `<Section>`.
- **No raw `<h1>`/`<h2>` with custom Tailwind sizing** in pages. Every display heading uses `<Heading>`.
- **Color tokens** come from CSS variables defined in `app/globals.css`. Inline hex literals are forbidden in new code (existing untouched components may keep theirs until their dedicated task).
- **`framer-motion` ease**: always `[0.22, 1, 0.36, 1]`, duration `0.6` unless a comment justifies otherwise.
- **Mobile**: every layout must collapse cleanly at 375px. Test in dev tools.
- **Commits**: commit after every task. Use the message format shown in each task.

---

## Phase 1 — Foundation (tokens, fonts, atmosphere)

### Task 1: Update palette + token layer in `globals.css`

**Files:**
- Modify: `app/globals.css` (full file rewrite of the `:root` and `@theme` blocks plus utilities)

- [ ] **Step 1: Replace `app/globals.css` with the new token layer**

Overwrite the file with:

```css
@import "tailwindcss";

:root {
  /* Surfaces */
  --bg: #05070d;
  --bg-2: #080b14;
  --surface: #0c1018;
  --surface-elevated: #141925;
  --surface-3: #1b2236;

  /* Borders */
  --border: rgba(255, 255, 255, 0.06);
  --border-2: rgba(255, 255, 255, 0.10);
  --border-accent: rgba(201, 169, 97, 0.30);

  /* Accents */
  --accent: #c9a961;
  --accent-bright: #d8bb78;
  --accent-dim: rgba(201, 169, 97, 0.12);
  --accent-2: #7d9bc1;          /* moonlight blue */
  --accent-2-dim: rgba(125, 155, 193, 0.14);

  /* Text */
  --text-1: #f5f1e8;
  --text-2: #9aa5b8;
  --text-3: #52607a;

  /* Atmosphere */
  --glow-hero: radial-gradient(ellipse 65% 45% at 50% -8%, rgba(201, 169, 97, 0.16) 0%, transparent 60%);
  --glow-accent: radial-gradient(ellipse 60% 50% at 50% 100%, rgba(201, 169, 97, 0.10) 0%, transparent 60%);
  --glow-side: radial-gradient(circle at 100% 50%, rgba(125, 155, 193, 0.06) 0%, transparent 50%);

  /* Type scale (locked) */
  --fs-12: 0.75rem;
  --fs-14: 0.875rem;
  --fs-16: 1rem;
  --fs-18: 1.125rem;
  --fs-24: 1.5rem;
  --fs-32: 2rem;
  --fs-48: 3rem;
  --fs-64: 4rem;
  --fs-80: 5rem;

  /* Motion */
  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-base: 0.6s;
  --dur-hover: 0.2s;
  --dur-transform: 0.3s;
}

@theme inline {
  --color-background: var(--bg);
  --color-foreground: var(--text-1);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-display: var(--font-fraunces);
}

@keyframes accordion-down {
  from { height: 0; opacity: 0; }
  to { height: var(--radix-accordion-content-height); opacity: 1; }
}
@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); opacity: 1; }
  to { height: 0; opacity: 0; }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes pulse-soft {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.85; }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.6; }
}

@theme inline {
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
  --animate-twinkle: twinkle 4s var(--ease-out-soft) infinite;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  background-color: var(--bg);
  background-image: var(--glow-hero);
  background-attachment: fixed;
  color: var(--text-1);
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  min-height: 100vh;
}

/* Global star field — fixed, parallax-free */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(1px 1px at 18% 22%, rgba(245, 241, 232, 0.6), transparent 60%),
    radial-gradient(1px 1px at 71% 14%, rgba(245, 241, 232, 0.45), transparent 60%),
    radial-gradient(1px 1px at 33% 78%, rgba(245, 241, 232, 0.5), transparent 60%),
    radial-gradient(1.2px 1.2px at 58% 64%, rgba(245, 241, 232, 0.55), transparent 60%),
    radial-gradient(1px 1px at 88% 39%, rgba(245, 241, 232, 0.45), transparent 60%),
    radial-gradient(1px 1px at 12% 55%, rgba(245, 241, 232, 0.4), transparent 60%),
    radial-gradient(1px 1px at 46% 8%, rgba(245, 241, 232, 0.5), transparent 60%),
    radial-gradient(1px 1px at 81% 82%, rgba(245, 241, 232, 0.45), transparent 60%);
  background-size: 1100px 900px;
  background-repeat: repeat;
  opacity: 0.5;
}

/* Global film grain */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.03;
  mix-blend-mode: overlay;
}

/* Page content sits above atmosphere */
body > * { position: relative; z-index: 1; }

::selection { background: rgba(201, 169, 97, 0.25); color: var(--text-1); }

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--surface-3); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(201, 169, 97, 0.30); }

/* Display gradient — used inside <Heading> for emphasis spans */
.text-gradient {
  background: linear-gradient(135deg, var(--accent-bright) 0%, var(--accent) 55%, #a98842 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Card hover (default) */
.card-hover {
  transition:
    border-color var(--dur-hover) var(--ease-out-soft),
    box-shadow var(--dur-hover) var(--ease-out-soft),
    transform var(--dur-transform) var(--ease-out-soft);
}
.card-hover:hover {
  border-color: var(--border-2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transform: translateY(-2px);
}

/* Eyebrow accent line */
.gold-line::before {
  content: "";
  display: inline-block;
  width: 22px;
  height: 1px;
  background: var(--accent);
  vertical-align: middle;
  margin-right: 10px;
  border-radius: 1px;
}
.moon-line::before {
  content: "";
  display: inline-block;
  width: 22px;
  height: 1px;
  background: var(--accent-2);
  vertical-align: middle;
  margin-right: 10px;
  border-radius: 1px;
}

/* Horizon divider */
.horizon-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--border-2) 50%, transparent 100%);
  width: 100%;
}

/* Plot frame (used by <PlotEmbed>) */
.plot-frame {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%),
    var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
}

/* Photo mask (used by <PhotoFrame>) */
.photo-mask-bottom {
  -webkit-mask-image: linear-gradient(180deg, black 65%, transparent 100%);
  mask-image: linear-gradient(180deg, black 65%, transparent 100%);
}
.photo-mask-top {
  -webkit-mask-image: linear-gradient(0deg, black 65%, transparent 100%);
  mask-image: linear-gradient(0deg, black 65%, transparent 100%);
}
.photo-mask-both {
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%);
}

/* Star twinkle dot (used inside <Section glow="..."> ornaments) */
.twinkle { animation: var(--animate-twinkle); }
```

- [ ] **Step 2: Type-check passes**

Run: `npx tsc --noEmit`
Expected: no errors. (CSS isn't type-checked, but ensure nothing in TS was broken.)

- [ ] **Step 3: Dev server renders**

Run: `npm run dev` then open `http://localhost:3000`.
Expected: site loads (will look broken — that's fine — but no runtime errors in the terminal).

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "Refresh palette and atmosphere tokens for redesign

Switches surfaces to deeper near-black indigo, cools brass accent, adds
moonlight-blue secondary, introduces locked type scale and motion tokens,
and replaces the dot grid with a global star field plus film grain.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Add Fraunces display font

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update `app/layout.tsx` to load Fraunces**

Replace the file contents with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nyx | Adaptive SAT prep, calibrated by Ivy-tier students",
    template: "%s | Nyx",
  },
  description:
    "Adaptive SAT preparation built around your gaps, your pace, and your target score — written and vetted by Ivy-tier students.",
  keywords: ["SAT prep", "adaptive SAT", "Nyx", "Ivy League tutors", "test prep", "college admissions"],
  openGraph: {
    title: "Nyx | Adaptive SAT prep",
    description:
      "Adaptive SAT preparation built around your gaps, your pace, and your target score.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full`}
    >
      <body className="text-[var(--text-1)] min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Type-check + build font resolution**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run dev` and load any page.
Expected: home loads; in DevTools → Computed, body shows `font-family: "Geist", ...` and any element with `font-family: var(--font-display)` resolves to a Fraunces variant.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "Load Fraunces variable display font alongside Geist

Adds a CSS variable --font-fraunces wired through @theme inline so the
new <Heading> primitive can use it without per-page font imports.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Add Lucide-based AGENTS.md compliance check

**Files:**
- Read: `node_modules/next/dist/docs/` (just inventory — no edits)

- [ ] **Step 1: Confirm Next.js 16 docs exist locally**

Run: `ls node_modules/next/dist/docs/ 2>/dev/null | head -20`
Expected: directory exists or doesn't. If it doesn't, the AGENTS.md instruction is informational and we proceed using Next 16 patterns we already know (app router, server components by default, `use client` for interactivity, `next/image`, `next/font`).

- [ ] **Step 2: No commit (read-only check)**

This task only verifies environmental assumptions — nothing to commit.

---

## Phase 2 — System primitives

All primitives live in `components/system/`. They are server-component-safe by default; only those that need state (`HeroFrame` motion) opt into `"use client"`.

### Task 4: Create `<Eyebrow>`

**Files:**
- Create: `components/system/Eyebrow.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { cn } from "@/lib/utils";

type EyebrowProps = {
  color?: "brass" | "moon";
  className?: string;
  children: React.ReactNode;
};

export function Eyebrow({ color = "brass", className, children }: EyebrowProps) {
  const colorClass = color === "brass" ? "text-[var(--accent)] gold-line" : "text-[var(--accent-2)] moon-line";
  return (
    <p
      className={cn(
        "inline-flex items-center font-semibold uppercase tracking-[0.16em]",
        "text-[var(--fs-12)]",
        colorClass,
        className,
      )}
    >
      {children}
    </p>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/system/Eyebrow.tsx
git commit -m "Add Eyebrow primitive with brass/moon variants

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Create `<Heading>`

**Files:**
- Create: `components/system/Heading.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

type HeadingLevel = 1 | 2 | 3 | 4;

type HeadingProps = {
  level: HeadingLevel;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  children: ReactNode;
};

const LEVEL_CLASSES: Record<HeadingLevel, string> = {
  // Display sizes use Fraunces
  1: "font-[family-name:var(--font-fraunces)] font-medium text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] tracking-[-0.02em]",
  2: "font-[family-name:var(--font-fraunces)] font-medium text-[2rem] md:text-[3rem] leading-[1.1] tracking-[-0.015em]",
  // UI sizes use Geist
  3: "font-sans font-semibold text-[1.5rem] leading-[1.25] tracking-[-0.005em]",
  4: "font-sans font-semibold text-[1.125rem] leading-[1.35]",
};

export function Heading({ level, as, className, children }: HeadingProps) {
  const Tag: ElementType = as ?? (`h${level}` as ElementType);
  return (
    <Tag className={cn("text-[var(--text-1)]", LEVEL_CLASSES[level], className)}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/system/Heading.tsx
git commit -m "Add Heading primitive with locked display/UI scale

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Create `<Text>`

**Files:**
- Create: `components/system/Text.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TextVariant = "body" | "lead" | "caption" | "small";

const VARIANT_CLASSES: Record<TextVariant, string> = {
  body: "text-[var(--fs-16)] leading-[1.7] text-[var(--text-2)]",
  lead: "text-[var(--fs-18)] leading-[1.7] text-[var(--text-2)]",
  caption: "text-[var(--fs-12)] uppercase tracking-[0.12em] text-[var(--text-3)] font-mono",
  small: "text-[var(--fs-14)] leading-[1.65] text-[var(--text-2)]",
};

type TextProps = {
  variant?: TextVariant;
  className?: string;
  children: ReactNode;
};

export function Text({ variant = "body", className, children }: TextProps) {
  return <p className={cn(VARIANT_CLASSES[variant], className)}>{children}</p>;
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/system/Text.tsx
git commit -m "Add Text primitive with body/lead/caption/small variants

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Create `<HorizonDivider>`

**Files:**
- Create: `components/system/HorizonDivider.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { cn } from "@/lib/utils";

type HorizonDividerProps = {
  className?: string;
};

export function HorizonDivider({ className }: HorizonDividerProps) {
  return <div className={cn("horizon-divider", className)} role="separator" aria-hidden />;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/system/HorizonDivider.tsx
git commit -m "Add HorizonDivider primitive

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Create `<Eyelet>` (mono section labels)

**Files:**
- Create: `components/system/Eyelet.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { cn } from "@/lib/utils";

type EyeletProps = {
  index?: string;
  label: string;
  className?: string;
};

export function Eyelet({ index, label, className }: EyeletProps) {
  return (
    <span
      className={cn(
        "font-mono text-[var(--fs-12)] uppercase tracking-[0.18em] text-[var(--text-3)]",
        className,
      )}
    >
      {index ? <span className="text-[var(--accent)] mr-2">{index}</span> : null}
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/system/Eyelet.tsx
git commit -m "Add Eyelet mono label primitive

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Create `<Section>`

**Files:**
- Create: `components/system/Section.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionVariant = "default" | "elevated" | "accent";
type SectionSpacing = "default" | "tight" | "loose";
type SectionGlow = "top" | "bottom" | "side" | "none";

type SectionProps = {
  variant?: SectionVariant;
  spacing?: SectionSpacing;
  glow?: SectionGlow;
  bordered?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
  children: ReactNode;
};

const VARIANT_BG: Record<SectionVariant, string> = {
  default: "bg-transparent",
  elevated: "bg-[var(--bg-2)]",
  accent: "bg-[var(--accent-dim)]",
};

const SPACING: Record<SectionSpacing, string> = {
  default: "py-32 md:py-36",
  tight: "py-20 md:py-24",
  loose: "py-40 md:py-48",
};

const GLOW_STYLE: Record<SectionGlow, string | null> = {
  top: "var(--glow-hero)",
  bottom: "var(--glow-accent)",
  side: "var(--glow-side)",
  none: null,
};

export function Section({
  variant = "default",
  spacing = "default",
  glow = "none",
  bordered = false,
  className,
  containerClassName,
  id,
  children,
}: SectionProps) {
  const glowImage = GLOW_STYLE[glow];
  return (
    <section
      id={id}
      className={cn(
        "relative",
        VARIANT_BG[variant],
        SPACING[spacing],
        className,
      )}
    >
      {bordered ? (
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--border-2) 50%, transparent 100%)",
          }}
        />
      ) : null}
      {glowImage ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: glowImage }}
        />
      ) : null}
      <div
        className={cn(
          "relative max-w-7xl mx-auto px-5 sm:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/system/Section.tsx
git commit -m "Add Section primitive (rhythm + variant + glow)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Create `<Card>`

**Files:**
- Create: `components/system/Card.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type CardVariant = "default" | "elevated" | "accent" | "feature" | "ghost";

type CardProps = {
  variant?: CardVariant;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "section" | "li";
  children: ReactNode;
};

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default:
    "bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6",
  elevated:
    "bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
  accent:
    "bg-[var(--accent-dim)] border border-[var(--border-accent)] rounded-2xl p-6",
  feature:
    "bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 md:p-10",
  ghost:
    "bg-transparent border border-[var(--border)] rounded-2xl p-5",
};

export function Card({
  variant = "default",
  className,
  hover = false,
  as: Tag = "div",
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        VARIANT_CLASSES[variant],
        hover && "card-hover",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/system/Card.tsx
git commit -m "Add Card primitive with five variants

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Create `<StatBlock>`

**Files:**
- Create: `components/system/StatBlock.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { cn } from "@/lib/utils";

export type StatItem = {
  stat: string;
  label: string;
  mono?: boolean;
};

type StatBlockProps = {
  items: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
};

const COLS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export function StatBlock({ items, columns = 4, className }: StatBlockProps) {
  return (
    <div
      className={cn(
        "grid gap-px bg-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden",
        COLS[columns],
        className,
      )}
    >
      {items.map(({ stat, label, mono }) => (
        <div
          key={`${label}-${stat}`}
          className="bg-[var(--bg-2)] px-6 py-5 flex flex-col justify-center"
        >
          <p
            className={cn(
              "text-[var(--text-1)] font-semibold mb-1",
              mono ? "font-mono text-[var(--fs-18)]" : "text-[var(--fs-18)]",
            )}
          >
            {stat}
          </p>
          <p className="text-[var(--text-3)] text-[var(--fs-12)] uppercase tracking-[0.12em]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/system/StatBlock.tsx
git commit -m "Add StatBlock primitive

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Create `<CTA>`

**Files:**
- Create: `components/system/CTA.tsx`

- [ ] **Step 1: Write the component**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CTAVariant = "primary" | "ghost";
type CTASize = "default" | "lg";

type CTAProps = {
  href: string;
  variant?: CTAVariant;
  size?: CTASize;
  trailingIcon?: boolean;
  className?: string;
  children: ReactNode;
};

const VARIANT_CLASSES: Record<CTAVariant, string> = {
  primary:
    "bg-gradient-to-b from-[var(--accent-bright)] to-[var(--accent)] text-black font-bold hover:from-[#e2c685] hover:to-[#cba961] shadow-[0_8px_28px_rgba(201,169,97,0.28)] hover:shadow-[0_14px_44px_rgba(201,169,97,0.42)] hover:-translate-y-0.5",
  ghost:
    "border border-[var(--border-2)] text-[var(--text-1)] font-semibold hover:bg-[var(--surface)]",
};

const SIZE_CLASSES: Record<CTASize, string> = {
  default: "px-7 py-3.5 text-[var(--fs-14)]",
  lg: "px-8 py-4 text-[var(--fs-16)]",
};

export function CTA({
  href,
  variant = "primary",
  size = "default",
  trailingIcon = true,
  className,
  children,
}: CTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-[var(--dur-hover)]",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
      {trailingIcon ? (
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      ) : null}
    </Link>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/system/CTA.tsx
git commit -m "Add CTA primitive (primary/ghost)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Create `<PhotoFrame>`

**Files:**
- Create: `components/system/PhotoFrame.tsx`

- [ ] **Step 1: Write the component**

```tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

type Aspect = "auto" | "square" | "portrait" | "landscape" | "wide";
type Mask = "none" | "top" | "bottom" | "both";

type PhotoFrameProps = {
  src: string;
  alt: string;
  index?: string;
  caption?: string;
  aspect?: Aspect;
  mask?: Mask;
  priority?: boolean;
  hoverZoom?: boolean;
  className?: string;
  rounded?: "default" | "lg" | "none";
  fill?: boolean;
};

const ASPECT_CLASSES: Record<Aspect, string> = {
  auto: "",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/9]",
  wide: "aspect-[21/9]",
};

const MASK_CLASSES: Record<Mask, string> = {
  none: "",
  top: "photo-mask-top",
  bottom: "photo-mask-bottom",
  both: "photo-mask-both",
};

const ROUNDED: Record<"default" | "lg" | "none", string> = {
  default: "rounded-2xl",
  lg: "rounded-3xl",
  none: "rounded-none",
};

export function PhotoFrame({
  src,
  alt,
  index,
  caption,
  aspect = "landscape",
  mask = "none",
  priority = false,
  hoverZoom = false,
  className,
  rounded = "default",
  fill = true,
}: PhotoFrameProps) {
  return (
    <figure className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden border border-[var(--border)] bg-[var(--surface)]",
          ASPECT_CLASSES[aspect],
          ROUNDED[rounded],
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-[var(--dur-transform)] ease-[var(--ease-out-soft)]",
            MASK_CLASSES[mask],
            hoverZoom && "hover:scale-[1.02]",
          )}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 flex items-center gap-3 font-mono text-[var(--fs-12)] uppercase tracking-[0.18em] text-[var(--text-3)]">
          {index ? <span className="text-[var(--accent)]">{index}</span> : null}
          <span>{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/system/PhotoFrame.tsx
git commit -m "Add PhotoFrame primitive (next/image wrapper)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Create `<PlotEmbed>`

**Files:**
- Create: `components/system/PlotEmbed.tsx`

- [ ] **Step 1: Write the component**

```tsx
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PlotEmbedProps = {
  src?: string;
  alt?: string;
  caption?: string;
  source?: string;
  index?: string;
  aspect?: "landscape" | "wide" | "square" | "tall";
  className?: string;
  children?: ReactNode;
};

const ASPECT: Record<NonNullable<PlotEmbedProps["aspect"]>, string> = {
  landscape: "aspect-[16/9]",
  wide: "aspect-[21/9]",
  square: "aspect-square",
  tall: "aspect-[4/5]",
};

export function PlotEmbed({
  src,
  alt = "",
  caption,
  source,
  index,
  aspect = "landscape",
  className,
  children,
}: PlotEmbedProps) {
  return (
    <figure className={cn("plot-frame p-4 md:p-6", className)}>
      <div className={cn("relative w-full overflow-hidden rounded-xl bg-[var(--bg-2)]", ASPECT[aspect])}>
        {children
          ? children
          : src
            ? <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain p-4" />
            : <PlotPlaceholder />}
      </div>
      {(caption || source) ? (
        <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[var(--fs-12)] uppercase tracking-[0.16em] text-[var(--text-3)]">
          <span className="flex items-center gap-3">
            {index ? <span className="text-[var(--accent)]">{index}</span> : null}
            {caption ? <span>{caption}</span> : null}
          </span>
          {source ? <span className="text-[var(--text-3)]/80">Source · {source}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

function PlotPlaceholder() {
  return (
    <svg viewBox="0 0 600 320" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="plotLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={i}
          x1="0" x2="600"
          y1={(i + 1) * 50}
          y2={(i + 1) * 50}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
      ))}
      <path
        d="M 20 240 C 80 200, 140 220, 200 180 S 320 90, 380 110 S 500 60, 580 70"
        fill="none"
        stroke="url(#plotLine)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 20 240 C 80 200, 140 220, 200 180 S 320 90, 380 110 S 500 60, 580 70 L 580 320 L 20 320 Z"
        fill="url(#plotLine)"
        opacity="0.08"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/system/PlotEmbed.tsx
git commit -m "Add PlotEmbed primitive with placeholder until assets land

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 15: Create `<HeroFrame>`

**Files:**
- Create: `components/system/HeroFrame.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroFrameProps = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  lead?: ReactNode;
  ctas?: ReactNode;
  trust?: ReactNode;
  aside?: ReactNode;          // photo or plot — when present, becomes 2-column on md+
  className?: string;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HeroFrame({
  eyebrow,
  heading,
  lead,
  ctas,
  trust,
  aside,
  className,
}: HeroFrameProps) {
  return (
    <div
      className={cn(
        "relative grid gap-12 md:gap-16 items-center",
        aside ? "md:grid-cols-2" : "md:grid-cols-1",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-7"
          >
            {eyebrow}
          </motion.div>
        ) : null}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="mb-6"
        >
          {heading}
        </motion.div>
        {lead ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            className="mb-10 max-w-xl"
          >
            {lead}
          </motion.div>
        ) : null}
        {ctas ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {ctas}
          </motion.div>
        ) : null}
        {trust ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
            className="mt-12"
          >
            {trust}
          </motion.div>
        ) : null}
      </div>
      {aside ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="relative"
        >
          {aside}
        </motion.div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/system/HeroFrame.tsx
git commit -m "Add HeroFrame primitive (text-only / text-with-aside)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 16: Create barrel export

**Files:**
- Create: `components/system/index.ts`

- [ ] **Step 1: Write the barrel**

```ts
export { Eyebrow } from "./Eyebrow";
export { Heading } from "./Heading";
export { Text } from "./Text";
export { HorizonDivider } from "./HorizonDivider";
export { Eyelet } from "./Eyelet";
export { Section } from "./Section";
export { Card, type CardVariant } from "./Card";
export { StatBlock, type StatItem } from "./StatBlock";
export { CTA } from "./CTA";
export { PhotoFrame } from "./PhotoFrame";
export { PlotEmbed } from "./PlotEmbed";
export { HeroFrame } from "./HeroFrame";
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/system/index.ts
git commit -m "Add components/system barrel export

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 3 — Shell components

### Task 17: Restyle `Navbar`

**Files:**
- Modify: `components/shared/Navbar.tsx`

- [ ] **Step 1: Replace the file with the restyled version**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { CTA } from "@/components/system";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/sat-act", label: "SAT / ACT" },
  { href: "/college-admissions", label: "Admissions" },
  { href: "/tutors", label: "Founders" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const auth = client.auth;
    void auth.getSession().then((res: { data: { session: unknown } }) => setIsLoggedIn(!!res.data.session));
    const { data: { subscription } } = auth.onAuthStateChange(
      (_event: unknown, session: unknown) => setIsLoggedIn(!!session)
    );
    return () => subscription.unsubscribe();
  }, []);

  const toggleMobile = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[var(--bg)]/85 backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--accent-bright)] to-[#a98842] shadow-lg shadow-[var(--accent-dim)] group-hover:shadow-[rgba(201,169,97,0.45)] transition-shadow" />
            <span className="relative text-black font-black text-sm tracking-tight">N</span>
          </div>
          <span className="font-[family-name:var(--font-fraunces)] font-medium tracking-tight text-[18px] text-[var(--text-1)]">
            Nyx
          </span>
        </Link>

        <div className="hidden md:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-1.5 text-[13.5px] font-medium transition-colors duration-200",
                pathname === link.href
                  ? "text-[var(--text-1)]"
                  : "text-[var(--text-2)] hover:text-[var(--text-1)]"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-md bg-white/[0.06]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/portal"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-[var(--border-2)] text-[var(--text-1)] text-[13px] font-medium hover:bg-white/[0.10] transition-all"
            >
              <LayoutDashboard size={14} />
              Portal
            </Link>
          ) : (
            <Link
              href="/portal/login"
              className="px-4 py-2 rounded-lg text-[var(--text-2)] text-[13px] font-medium hover:text-[var(--text-1)] transition-colors"
            >
              Sign In
            </Link>
          )}
          <CTA href="/apply" size="default" trailingIcon={false} className="px-4 py-2 text-[13px]">
            Book Consultation
          </CTA>
        </div>

        <button
          onClick={toggleMobile}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden bg-[var(--bg)]/96 backdrop-blur-xl border-b border-[var(--border)]"
          >
            <div className="px-5 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-xl text-[14px] font-medium transition-colors",
                    pathname === link.href
                      ? "text-[var(--text-1)] bg-white/[0.06]"
                      : "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.04]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 space-y-2">
                {isLoggedIn ? (
                  <Link
                    href="/portal"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.06] border border-[var(--border-2)] text-[var(--text-1)] text-[14px] font-medium"
                  >
                    <LayoutDashboard size={15} />
                    Portal
                  </Link>
                ) : (
                  <Link
                    href="/portal/login"
                    className="flex items-center justify-center w-full py-3 rounded-xl bg-white/[0.04] border border-[var(--border)] text-[var(--text-2)] text-[14px] font-medium"
                  >
                    Sign In
                  </Link>
                )}
                <CTA href="/apply" size="default" trailingIcon={false} className="w-full py-3">
                  Book Free Consultation
                </CTA>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
```

- [ ] **Step 2: Verify in dev**

Run: `npm run dev`. Visit `/`. Scroll to confirm navbar opacity transition. Click any link, hamburger on mobile width.
Expected: no console errors, tokens applied.

- [ ] **Step 3: Commit**

```bash
git add components/shared/Navbar.tsx
git commit -m "Restyle Navbar to new tokens and CTA primitive

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 18: Restyle `Footer`

**Files:**
- Modify: `components/shared/Footer.tsx`

- [ ] **Step 1: Replace file**

```tsx
import Link from "next/link";

const footerLinks = {
  Services: [
    { href: "/services", label: "All Services" },
    { href: "/sat-act", label: "SAT / ACT Prep" },
    { href: "/services#ap", label: "AP Tutoring" },
    { href: "/services#admissions", label: "Admissions" },
  ],
  Company: [
    { href: "/tutors", label: "Founders" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
    { href: "/apply", label: "Book Consultation" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--accent-bright)] to-[#a98842]" />
                <span className="relative text-black font-black text-sm">N</span>
              </div>
              <span className="font-[family-name:var(--font-fraunces)] font-medium tracking-tight text-[18px] text-[var(--text-1)]">
                Nyx
              </span>
            </Link>
            <p className="text-[var(--text-2)] text-[13.5px] leading-[1.8] max-w-sm mb-5">
              Adaptive SAT preparation built around your gaps, your pace, and your target score —
              calibrated by Ivy-tier students.
            </p>
            <p className="text-[var(--text-3)] text-[12px] leading-relaxed max-w-sm">
              Nyx does not guarantee test score increases or admissions outcomes.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[var(--text-1)] font-semibold text-[12px] uppercase tracking-[0.14em] mb-5">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[var(--text-2)] text-[13.5px] hover:text-[var(--accent)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-3)] text-[12px]">
            &copy; {new Date().getFullYear()} Nyx. All rights reserved.
          </p>
          <p className="text-[var(--text-3)] text-[12px] font-mono uppercase tracking-[0.14em]">
            Calibrated by students who recently scored at the top.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/shared/Footer.tsx
git commit -m "Restyle Footer to new tokens

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 19: Restyle `PortalSidebar` and add Consultation link

**Files:**
- Modify: `components/portal/PortalSidebar.tsx`

- [ ] **Step 1: Replace file**

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Compass,
  CalendarPlus,
  Calendar,
  BookOpen,
  MessageSquare,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Profile, PlanType } from "@/types/portal";

const allNavItems = [
  { href: "/portal",              label: "Dashboard",        icon: LayoutDashboard, exact: true,  plans: ["session", "monthly", "counseling"] },
  { href: "/portal/consultation", label: "Consultation",     icon: Compass,         exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/schedule",     label: "Schedule Session", icon: CalendarPlus,    exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/sessions",     label: "My Sessions",      icon: Calendar,        exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/materials",    label: "Materials",        icon: BookOpen,        exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/messages",     label: "Messages",         icon: MessageSquare,   exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/profile",      label: "Profile",          icon: User,            exact: false, plans: ["session", "monthly", "counseling"] },
];

function planLabel(plan: PlanType | null): string {
  switch (plan) {
    case "session":    return "Session Plan";
    case "monthly":    return "Scholar Plan";
    case "counseling": return "Constellation Plan";
    default:           return "Student";
  }
}

interface PortalSidebarProps {
  profile: Profile | null;
  userEmail: string;
  unreadCount?: number;
}

function NavItem({
  href, label, icon: Icon, exact, unreadCount, onClick,
}: {
  href: string; label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact: boolean; unreadCount?: number; onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all border",
        isActive
          ? "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--border-accent)]"
          : "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.04] border-transparent"
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="flex-1">{label}</span>
      {label === "Messages" && unreadCount && unreadCount > 0 ? (
        <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-black text-[10px] font-bold flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      ) : null}
      {isActive && <ChevronRight size={12} className="opacity-40" />}
    </Link>
  );
}

function SidebarContent({
  profile, userEmail, unreadCount, onNavClick,
}: PortalSidebarProps & { onNavClick?: () => void }) {
  const router = useRouter();
  const plan = profile?.plan ?? null;

  const visibleNav = allNavItems.filter((item) => !plan || item.plans.includes(plan));

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  };

  const displayName = profile?.full_name || userEmail.split("@")[0];
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <div className="px-5 h-[68px] flex items-center border-b border-[var(--border)] shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--accent-bright)] to-[#a98842]" />
            <span className="relative text-black font-black text-xs">N</span>
          </div>
          <span className="font-[family-name:var(--font-fraunces)] font-medium text-[16px] text-[var(--text-1)]">
            Nyx
          </span>
        </Link>
      </div>

      <div className="px-4 py-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white/[0.03] border border-[var(--border)]">
          <div className="w-9 h-9 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center shrink-0">
            <span className="text-[12px] font-bold text-[var(--accent)]">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[var(--text-1)] truncate">{displayName}</p>
            <p className="text-[11px] text-[var(--text-3)] truncate">{planLabel(plan)}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleNav.map((item) => (
          <NavItem key={item.href} {...item} unreadCount={unreadCount} onClick={onNavClick} />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--border)] space-y-1 shrink-0">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-[13.5px] font-medium text-[var(--text-2)] hover:text-red-400 hover:bg-red-500/[0.05] transition-all"
        >
          <LogOut size={16} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </>
  );
}

export function PortalSidebar(props: PortalSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[var(--bg-2)] border-r border-[var(--border)] shrink-0">
        <SidebarContent {...props} />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[var(--bg-2)]/95 backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between px-4">
        <Link href="/portal" className="flex items-center gap-2">
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[var(--accent-bright)] to-[#a98842]" />
            <span className="relative text-black font-black text-[10px]">N</span>
          </div>
          <span className="font-[family-name:var(--font-fraunces)] font-medium text-[14px] text-[var(--text-1)]">
            Nyx
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {props.unreadCount ? (
            <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-black text-[10px] font-bold flex items-center justify-center">
              {props.unreadCount > 9 ? "9+" : props.unreadCount}
            </span>
          ) : null}
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={cn(
        "md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[var(--bg-2)] border-r border-[var(--border)] flex flex-col transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
        >
          <X size={16} />
        </button>
        <SidebarContent {...props} onNavClick={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/portal/PortalSidebar.tsx
git commit -m "Restyle PortalSidebar and add Consultation nav item

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 4 — Marketing pages

> **Pattern for every page in this phase:** delete the previous file body and replace with a thin composition of `components/system/` primitives. Page content (copy, links) is largely preserved; only structure and styling change. Keep the existing route, exports, and any `"use client"` directive needed for motion.

### Task 20: Refactor `/` (home) — Editorial Scroll

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace file**

```tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Section, Eyebrow, Heading, Text, CTA, Card, StatBlock, HeroFrame,
  PhotoFrame, PlotEmbed, Eyelet, HorizonDivider,
} from "@/components/system";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stats = [
  { stat: "Adaptive", label: "Calibrated by IRT", mono: false },
  { stat: "1,600", label: "SAT score ceiling", mono: true },
  { stat: "Ivy-tier", label: "Authors and tutors", mono: false },
  { stat: "Free", label: "Diagnostic test", mono: false },
];

const principles = [
  { eyelet: "01", title: "Diagnose first.", body: "30-question adaptive diagnostic converges on a section score in under 40 minutes — no guessing what to study." },
  { eyelet: "02", title: "Practice the gaps.", body: "Every session targets the skills at the edge of your ability, not the ones you've already mastered." },
  { eyelet: "03", title: "See the trajectory.", body: "Score curves, mastery heatmaps, and time-to-target estimates — calibrated, not vibes." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]" id="hero">
        <HeroFrame
          eyebrow={<Eyebrow color="brass">Adaptive SAT prep · Calibrated by Ivy-tier students</Eyebrow>}
          heading={
            <Heading level={1}>
              The SAT, mapped to <span className="text-gradient">your</span> gaps.
            </Heading>
          }
          lead={
            <Text variant="lead">
              Nyx is an adaptive preparation system that learns where you struggle, hands you the
              exact questions that grow your score, and shows you the trajectory in real time.
            </Text>
          }
          ctas={
            <>
              <CTA href="/apply" size="lg">Take the free diagnostic</CTA>
              <CTA href="/services" variant="ghost" size="lg" trailingIcon={false}>How it works</CTA>
            </>
          }
          trust={<StatBlock items={stats} columns={4} />}
        />
      </Section>

      {/* MANIFESTO */}
      <Section variant="elevated" spacing="default" bordered>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            custom={0} variants={fadeUp}
            className="lg:col-span-6"
          >
            <Eyebrow color="brass" className="mb-5">Manifesto</Eyebrow>
            <Heading level={2} className="mb-6">
              Generic prep is recycled noise.
            </Heading>
            <Text variant="body" className="mb-5">
              Most test prep is the same questions in a new wrapper, sold by tutors who took the
              SAT a decade ago. The exam has changed. The bar has changed. The prep hasn&apos;t.
            </Text>
            <Text variant="body" className="mb-8">
              Nyx is built around one idea: the fastest way to a higher score is the question
              you can&apos;t quite answer yet — delivered at the moment you&apos;re ready for it.
            </Text>
            <CTA href="/sat-act" variant="ghost">Read the approach</CTA>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            custom={1} variants={fadeUp}
            className="lg:col-span-6"
          >
            <PhotoFrame
              src="/design/manifesto.jpg"
              alt="Late-night study scene"
              aspect="portrait"
              caption="Manifesto"
              index="01"
              mask="bottom"
            />
          </motion.div>
        </div>
      </Section>

      {/* PLOT SHOWCASE */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <Eyelet index="02" label="Trajectory" />
            <Heading level={2} className="mt-5 mb-6">
              You&apos;ll see your score move.
            </Heading>
            <Text variant="body" className="mb-6">
              Every session updates a calibrated estimate of your ability. The trajectory plot
              shows you the path — and the time-to-target — without speculation.
            </Text>
            <ul className="space-y-3">
              {principles.map((p) => (
                <li key={p.eyelet} className="flex gap-4">
                  <span className="font-mono text-[var(--accent)] text-[12px] tracking-[0.18em] pt-1">{p.eyelet}</span>
                  <span>
                    <span className="block text-[var(--text-1)] font-semibold mb-1">{p.title}</span>
                    <span className="block text-[var(--text-2)] text-[14px] leading-relaxed">{p.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <PlotEmbed
              caption="Score trajectory · sample student"
              index="02"
              source="Nyx adaptive engine"
              aspect="landscape"
            />
          </div>
        </div>
      </Section>

      {/* FOUNDERS STRIP */}
      <Section variant="elevated" spacing="default" bordered>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <Eyebrow color="moon" className="mb-4">The Founders</Eyebrow>
            <Heading level={2}>Built by students who just did it.</Heading>
          </div>
          <CTA href="/tutors" variant="ghost" trailingIcon>Meet the founders</CTA>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "Loc", school: "Princeton, Class of 2028", img: "/design/founder-loc.jpg" },
            { name: "Charles", school: "Princeton, Class of 2028", img: "/design/founder-charles.jpg" },
          ].map((f) => (
            <Card key={f.name} variant="feature" hover>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <PhotoFrame src={f.img} alt={f.name} aspect="square" className="sm:col-span-1" />
                <div className="sm:col-span-2">
                  <Heading level={3} className="mb-2">{f.name}</Heading>
                  <Text variant="small" className="mb-4">{f.school}</Text>
                  <Text variant="small">
                    Authored and calibrated questions for the Nyx bank. Mentors students one-on-one
                    in addition to platform sessions.
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <HorizonDivider />

      {/* CTA BANNER */}
      <Section variant="accent" spacing="default" glow="bottom">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow color="brass" className="mb-5">Get started</Eyebrow>
          <Heading level={2} className="mb-6">Take the diagnostic. Then decide.</Heading>
          <Text variant="lead" className="mb-10 mx-auto">
            Thirty adaptive questions. Forty minutes. A calibrated score and a real plan — at no cost.
          </Text>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CTA href="/apply" size="lg">Start the diagnostic</CTA>
            <CTA href="/pricing" variant="ghost" size="lg" trailingIcon={false}>See plans</CTA>
          </div>
          <Text variant="small" className="mt-8 text-[var(--text-3)]">
            Nyx does not guarantee score increases or admissions outcomes.
          </Text>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Verify the home page renders**

Run: `npm run dev` (if not running) and visit `http://localhost:3000/`.
Expected: hero, manifesto, plot, founders, CTA — no console errors. Photo placeholders are 404 — acceptable; `/design/...` files don't exist yet.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Refactor home page to Editorial Scroll archetype

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 21: Refactor `/sat-act` — Long-form Essay

**Files:**
- Modify: `app/sat-act/page.tsx`

- [ ] **Step 1: Replace file**

```tsx
import {
  Section, Eyebrow, Heading, Text, CTA, PhotoFrame, PlotEmbed, HorizonDivider, Eyelet,
} from "@/components/system";

export const metadata = { title: "SAT / ACT Approach" };

export default function SatActPage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl mx-auto">
          <Eyebrow color="brass" className="mb-5">SAT &amp; ACT</Eyebrow>
          <Heading level={1} className="mb-6">
            Adaptive prep, not a workbook.
          </Heading>
          <Text variant="lead">
            Nyx prepares you for the SAT and ACT by modeling your ability and feeding you the exact
            questions that close your gaps — section by section, week by week.
          </Text>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="max-w-3xl mx-auto space-y-12">
          <section>
            <Eyelet index="01" label="Diagnostic" />
            <Heading level={2} as="h2" className="mt-4 mb-5">Forty minutes. A real number.</Heading>
            <Text variant="body" className="mb-5">
              The diagnostic uses a calibrated item-response model. Thirty questions converge on a
              section score with a published confidence interval — no &quot;your level is intermediate.&quot;
            </Text>
            <PhotoFrame
              src="/design/diagnostic.jpg"
              alt="Diagnostic interface"
              aspect="wide"
              caption="The diagnostic interface"
              index="A"
            />
          </section>

          <HorizonDivider />

          <section>
            <Eyelet index="02" label="Practice" />
            <Heading level={2} as="h2" className="mt-4 mb-5">Targeted, not random.</Heading>
            <Text variant="body" className="mb-5">
              After the diagnostic, every practice question is selected for difficulty just above
              your current ability and for the skill you most need. The boring middle is gone.
            </Text>
            <PlotEmbed
              caption="Skill mastery over four weeks · sample student"
              index="B"
              aspect="landscape"
            />
          </section>

          <HorizonDivider />

          <section>
            <Eyelet index="03" label="Review" />
            <Heading level={2} as="h2" className="mt-4 mb-5">Read the report. Don&apos;t guess.</Heading>
            <Text variant="body" className="mb-5">
              The weekly study report names the three skills holding your score back, the time
              you spent on each, and what to work on next. It&apos;s short, specific, and updated automatically.
            </Text>
          </section>
        </div>
      </Section>

      <Section variant="accent" spacing="default" glow="bottom">
        <div className="max-w-2xl mx-auto text-center">
          <Heading level={2} className="mb-5">Start with the diagnostic.</Heading>
          <Text variant="lead" className="mb-8">Forty minutes. Free. No commitment.</Text>
          <CTA href="/apply" size="lg">Take the diagnostic</CTA>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sat-act/page.tsx
git commit -m "Refactor /sat-act to Long-form Essay archetype

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 22: Refactor `/college-admissions` — Long-form Essay

**Files:**
- Modify: `app/college-admissions/page.tsx`

- [ ] **Step 1: Replace file**

```tsx
import {
  Section, Eyebrow, Heading, Text, CTA, PhotoFrame, HorizonDivider, Eyelet,
} from "@/components/system";

export const metadata = { title: "College Admissions" };

export default function CollegeAdmissionsPage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl mx-auto">
          <Eyebrow color="moon" className="mb-5">Admissions</Eyebrow>
          <Heading level={1} className="mb-6">Strategy, written by people who just got in.</Heading>
          <Text variant="lead">
            Essay review, school list strategy, and interview prep — from students currently at
            Princeton, Harvard, Yale, Stanford, MIT, and Columbia.
          </Text>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="max-w-3xl mx-auto space-y-12">
          <section>
            <Eyelet index="01" label="Essay" />
            <Heading level={2} as="h2" className="mt-4 mb-5">The essay is a voice problem.</Heading>
            <Text variant="body" className="mb-5">
              Most essay help is grammar and structure. Ours is voice. We work line by line until
              the page sounds like you on your best day — and we know what reads as &quot;trying too hard.&quot;
            </Text>
            <PhotoFrame
              src="/design/essay.jpg"
              alt="Essay annotation"
              aspect="wide"
              caption="A real annotated draft"
              index="A"
            />
          </section>

          <HorizonDivider />

          <section>
            <Eyelet index="02" label="School list" />
            <Heading level={2} as="h2" className="mt-4 mb-5">Build the list around fit, not name.</Heading>
            <Text variant="body" className="mb-5">
              Reach, target, likely — sorted by what you actually want from college, not by US News
              rankings. We share the data we used when we built our own lists.
            </Text>
          </section>

          <HorizonDivider />

          <section>
            <Eyelet index="03" label="Interview" />
            <Heading level={2} as="h2" className="mt-4 mb-5">Practice with someone who&apos;s been on the other side.</Heading>
            <Text variant="body">
              Mock interviews with current students who serve as alumni interviewers. We send a
              written debrief after every session — what landed, what didn&apos;t, what to drill.
            </Text>
          </section>
        </div>
      </Section>

      <Section variant="accent" spacing="default" glow="bottom">
        <div className="max-w-2xl mx-auto text-center">
          <Heading level={2} className="mb-5">Talk to a Nyx mentor.</Heading>
          <Text variant="lead" className="mb-8">A free 20-minute call to map your application.</Text>
          <CTA href="/apply" size="lg">Book the call</CTA>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/college-admissions/page.tsx
git commit -m "Refactor /college-admissions to Long-form Essay

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 23: Refactor `/services` — Catalog Grid

**Files:**
- Modify: `app/services/page.tsx`

- [ ] **Step 1: Replace file**

```tsx
import { Target, BookOpen, GraduationCap, Award } from "lucide-react";
import {
  Section, Eyebrow, Heading, Text, CTA, Card, PhotoFrame, HorizonDivider,
} from "@/components/system";

export const metadata = { title: "Services" };

const featured = [
  {
    icon: Target,
    label: "SAT Adaptive",
    body: "Adaptive diagnostic, calibrated practice, weekly score reports. The core Nyx product.",
    photo: "/design/svc-sat.jpg",
    href: "/sat-act",
  },
  {
    icon: BookOpen,
    label: "ACT Prep",
    body: "ACT-specific pacing, section drills, and reading speed training adapted to your baseline.",
    photo: "/design/svc-act.jpg",
    href: "/sat-act",
  },
];

const adjacent = [
  { icon: GraduationCap, label: "AP Tutoring", body: "10+ subjects with current top scorers." },
  { icon: Award, label: "Admissions", body: "Essays, school lists, interview prep." },
  { icon: Target, label: "1:1 Add-on", body: "Book Ivy-tier mentors à la carte." },
  { icon: BookOpen, label: "Mocks", body: "Full-length proctored practice tests with debrief." },
];

export default function ServicesPage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl">
          <Eyebrow color="brass" className="mb-5">Services</Eyebrow>
          <Heading level={1} className="mb-6">Adaptive prep, plus humans when it counts.</Heading>
          <Text variant="lead">
            The Nyx platform is the core. Tutoring, mocks, and admissions services exist to amplify it —
            never as a substitute for adaptive practice.
          </Text>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="grid md:grid-cols-2 gap-6">
          {featured.map(({ icon: Icon, label, body, photo, href }) => (
            <Card key={label} variant="feature" hover>
              <PhotoFrame src={photo} alt={label} aspect="landscape" className="mb-6" />
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center">
                  <Icon size={16} className="text-[var(--accent)]" />
                </span>
                <Heading level={3}>{label}</Heading>
              </div>
              <Text variant="body" className="mb-6">{body}</Text>
              <CTA href={href} variant="ghost">Learn more</CTA>
            </Card>
          ))}
        </div>
      </Section>

      <HorizonDivider />

      <Section spacing="tight">
        <div className="mb-10">
          <Eyebrow color="moon" className="mb-4">Adjacent</Eyebrow>
          <Heading level={2}>Other ways we work with students.</Heading>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adjacent.map(({ icon: Icon, label, body }) => (
            <Card key={label} variant="default" hover>
              <span className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center mb-4">
                <Icon size={16} className="text-[var(--accent)]" />
              </span>
              <h3 className="text-[var(--text-1)] font-semibold text-[15px] mb-2">{label}</h3>
              <p className="text-[var(--text-2)] text-[13.5px] leading-relaxed">{body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/services/page.tsx
git commit -m "Refactor /services to Catalog Grid

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 24: Refactor `/tutors` — Profile Spread

**Files:**
- Modify: `app/tutors/page.tsx`

- [ ] **Step 1: Replace file**

```tsx
import {
  Section, Eyebrow, Heading, Text, CTA, PhotoFrame, HorizonDivider, Eyelet,
} from "@/components/system";

export const metadata = { title: "Founders" };

const founders = [
  {
    name: "Loc",
    role: "Co-founder · Product & Curriculum",
    school: "Princeton, Class of 2028",
    img: "/design/founder-loc.jpg",
    bio: "Loc designs the adaptive engine and authors much of the SAT bank. He recently scored in the 99th percentile on the digital SAT and has tutored over 50 students one-on-one through the redesigned exam.",
    quote: "The fastest path to a higher score is the question you can almost answer.",
  },
  {
    name: "Charles",
    role: "Co-founder · Engineering & Operations",
    school: "Princeton, Class of 2028",
    img: "/design/founder-charles.jpg",
    bio: "Charles built the Nyx platform end to end and runs ops. Princeton class of 2028, he handles the engineering side of every adaptive feature — from IRT calibration to the dashboard you read each week.",
    quote: "We owe students a number, not a vibe.",
  },
];

export default function FoundersPage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl">
          <Eyebrow color="brass" className="mb-5">The Founders</Eyebrow>
          <Heading level={1} className="mb-6">
            Two students. One product they wish they&apos;d had.
          </Heading>
          <Text variant="lead">
            Nyx was built by Loc and Charles — Princeton classmates who started where you are
            and built the prep platform they wanted.
          </Text>
        </div>
      </Section>

      {founders.map((f, i) => (
        <Section key={f.name} variant={i % 2 === 0 ? "default" : "elevated"} spacing="default" bordered>
          <div className={`grid lg:grid-cols-12 gap-12 lg:gap-16 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
            <div className="lg:col-span-5 lg:[direction:ltr]">
              <PhotoFrame
                src={f.img}
                alt={f.name}
                aspect="portrait"
                index={`0${i + 1}`}
                caption={f.role}
                hoverZoom
              />
            </div>
            <div className="lg:col-span-7 lg:[direction:ltr]">
              <Eyelet index={`0${i + 1}`} label={f.school} />
              <Heading level={2} as="h2" className="mt-5 mb-5">{f.name}</Heading>
              <Text variant="body" className="mb-8">{f.bio}</Text>
              <blockquote className="border-l-2 border-[var(--accent)] pl-5 text-[var(--text-1)] text-[18px] leading-relaxed font-[family-name:var(--font-fraunces)] italic">
                &ldquo;{f.quote}&rdquo;
              </blockquote>
            </div>
          </div>
        </Section>
      ))}

      <HorizonDivider />

      <Section variant="accent" spacing="default" glow="bottom">
        <div className="max-w-2xl mx-auto text-center">
          <Heading level={2} className="mb-5">Work with us directly.</Heading>
          <Text variant="lead" className="mb-8">
            Loc and Charles still tutor a small number of students each semester.
            Spots are limited.
          </Text>
          <CTA href="/apply" size="lg">Apply for 1:1 tutoring</CTA>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/tutors/page.tsx
git commit -m "Refactor /tutors to Profile Spread (Founders)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 25: Refactor `/pricing` — Comparison

**Files:**
- Modify: `app/pricing/page.tsx`

- [ ] **Step 1: Replace file**

```tsx
import { Check, Minus } from "lucide-react";
import {
  Section, Eyebrow, Heading, Text, CTA, Card,
} from "@/components/system";

export const metadata = { title: "Pricing" };

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    summary: "Take the diagnostic. Sample the platform.",
    cta: { label: "Start free", href: "/apply" },
    accent: false,
    bullets: [
      "Adaptive diagnostic (1 attempt)",
      "Score and study report",
      "50 practice questions / week",
      "Email support",
    ],
  },
  {
    name: "Scholar",
    price: "$29",
    period: "/ month",
    summary: "Unlimited adaptive practice + analytics.",
    cta: { label: "Start Scholar", href: "/apply" },
    accent: true,
    bullets: [
      "Unlimited adaptive practice",
      "Full question bank",
      "Weekly score updates",
      "Skill mastery heatmap",
      "Daily study plan",
    ],
  },
  {
    name: "Constellation",
    price: "$79",
    period: "/ month",
    summary: "Scholar + mocks, written feedback.",
    cta: { label: "Start Constellation", href: "/apply" },
    accent: false,
    bullets: [
      "Everything in Scholar",
      "2 full-length mocks / month",
      "Written tutor feedback",
      "Priority new content",
      "Priority support",
    ],
  },
];

const matrix: { feature: string; free: boolean; scholar: boolean; constellation: boolean }[] = [
  { feature: "Adaptive diagnostic",           free: true,  scholar: true,  constellation: true },
  { feature: "Score and study report",        free: true,  scholar: true,  constellation: true },
  { feature: "Unlimited practice",            free: false, scholar: true,  constellation: true },
  { feature: "Skill mastery heatmap",         free: false, scholar: true,  constellation: true },
  { feature: "Daily study plan",              free: false, scholar: true,  constellation: true },
  { feature: "Full-length proctored mocks",   free: false, scholar: false, constellation: true },
  { feature: "Written tutor feedback",        free: false, scholar: false, constellation: true },
  { feature: "Priority new content",          free: false, scholar: false, constellation: true },
];

export default function PricingPage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl">
          <Eyebrow color="brass" className="mb-5">Pricing</Eyebrow>
          <Heading level={1} className="mb-6">Simple plans. Real outcomes.</Heading>
          <Text variant="lead">
            Three tiers and one optional add-on. Cancel anytime. Tutoring is sold separately,
            never bundled into thousand-dollar packages.
          </Text>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <Card key={t.name} variant={t.accent ? "accent" : "default"} hover>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-[var(--text-1)] font-semibold text-[18px]">{t.name}</h3>
                {t.accent ? (
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] font-mono">Recommended</span>
                ) : null}
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-[family-name:var(--font-fraunces)] text-[44px] leading-none text-[var(--text-1)]">{t.price}</span>
                <span className="text-[var(--text-3)] text-[13px]">{t.period}</span>
              </div>
              <Text variant="small" className="mb-6">{t.summary}</Text>
              <ul className="space-y-2.5 mb-8">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[var(--text-2)] text-[14px]">
                    <Check size={14} className="text-[var(--accent)] mt-1 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <CTA href={t.cta.href} variant={t.accent ? "primary" : "ghost"} size="default" className="w-full">
                {t.cta.label}
              </CTA>
            </Card>
          ))}
        </div>
      </Section>

      <Section variant="elevated" spacing="default" bordered>
        <div className="mb-10">
          <Eyebrow color="moon" className="mb-4">Compare</Eyebrow>
          <Heading level={2}>Feature matrix</Heading>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[var(--bg-2)] text-[var(--text-3)] uppercase text-[11px] tracking-[0.14em]">
              <tr>
                <th className="px-5 py-4">Feature</th>
                <th className="px-5 py-4 text-center">Free</th>
                <th className="px-5 py-4 text-center">Scholar</th>
                <th className="px-5 py-4 text-center">Constellation</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.feature} className="border-t border-[var(--border)]">
                  <td className="px-5 py-3.5 text-[var(--text-1)]">{row.feature}</td>
                  <td className="px-5 py-3.5 text-center">{row.free ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                  <td className="px-5 py-3.5 text-center">{row.scholar ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                  <td className="px-5 py-3.5 text-center">{row.constellation ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                </tr>
              ))}
              <tr className="border-t border-[var(--border)] bg-[var(--bg-2)]">
                <td className="px-5 py-3.5 text-[var(--text-2)] italic">1:1 tutoring add-on · $120 / session</td>
                <td className="px-5 py-3.5 text-center text-[var(--text-3)]" colSpan={3}>Available on any plan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/pricing/page.tsx
git commit -m "Refactor /pricing to Comparison archetype with feature matrix

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 26: Restyle `/faq` — Knowledge

**Files:**
- Read first: `app/faq/page.tsx`, `components/shared/FAQAccordion.tsx`
- Modify: `app/faq/page.tsx`

- [ ] **Step 1: Read existing files to learn the shape of FAQAccordion**

Run: open both files, note FAQAccordion's expected props (it likely takes `items: { q, a }[]`).

- [ ] **Step 2: Rewrite the page (preserve the FAQ data; only restyle the wrapper)**

```tsx
import {
  Section, Eyebrow, Heading, Text,
} from "@/components/system";
import FAQAccordion from "@/components/shared/FAQAccordion";

export const metadata = { title: "FAQ" };

const items = [
  { q: "What does the diagnostic measure?", a: "Your current SAT or ACT section ability, expressed as a calibrated score with a confidence interval. Thirty adaptive questions converge in roughly forty minutes." },
  { q: "Is Nyx adaptive?", a: "Yes. Every practice question is selected based on a running estimate of your ability and the skill you most need. The engine uses item-response theory (IRT)." },
  { q: "How is this different from Khan Academy?", a: "Adaptivity is the core, not an extra. Calibration is published — you see the confidence interval, the time-to-target, and the specific skills holding your score back." },
  { q: "Do you guarantee a score increase?", a: "No. We publish trajectory and confidence intervals because we owe students a real number — not a marketing promise." },
  { q: "Who writes the questions?", a: "Current students at Ivy-tier schools who recently scored at the top. Every question is calibrated against the bank before it ships to a student." },
  { q: "Can I work with a tutor?", a: "Yes — 1:1 tutoring is sold separately at $120 per session. It is never bundled into thousand-dollar packages." },
  { q: "Can I cancel?", a: "Anytime. Plans are monthly. Pro-rated refunds aren't issued, but you keep platform access through the end of the billing month." },
];

export default function FaqPage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl mx-auto">
          <Eyebrow color="brass" className="mb-5">FAQ</Eyebrow>
          <Heading level={1} className="mb-6">Questions, plainly answered.</Heading>
          <Text variant="lead">If something here doesn&apos;t cover your case, the consultation is free.</Text>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="max-w-3xl mx-auto">
          <FAQAccordion items={items} />
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 3: Token-swap `FAQAccordion`**

Open `components/shared/FAQAccordion.tsx` and replace any inline color literals (e.g., `#d4a853`, `#0f1521`, `#f0ece3`, `#8d9ab0`, `rgba(255,255,255,0.07)`) with the corresponding `var(--accent)`, `var(--surface)`, `var(--text-1)`, `var(--text-2)`, `var(--border)`. Wrap the trigger label in a `font-medium text-[var(--text-1)]` class. The component already extends Radix Accordion — keep that wiring as-is.

If the component accepts a different prop name (e.g., `data` instead of `items`), update the call site in `app/faq/page.tsx` to match.

- [ ] **Step 4: Commit**

```bash
git add app/faq/page.tsx components/shared/FAQAccordion.tsx
git commit -m "Restyle /faq and FAQAccordion to new tokens

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 27: Refactor `/apply` — Form archetype

**Files:**
- Read first: `app/apply/page.tsx`, `components/shared/LeadForm.tsx`
- Modify: `app/apply/page.tsx`

- [ ] **Step 1: Read existing files to learn the existing LeadForm props**

The page currently renders LeadForm directly. Preserve that wiring.

- [ ] **Step 2: Rewrite the page**

```tsx
import {
  Section, Eyebrow, Heading, Text, Card, PhotoFrame,
} from "@/components/system";
import LeadForm from "@/components/shared/LeadForm";

export const metadata = { title: "Apply" };

export default function ApplyPage() {
  return (
    <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <Eyebrow color="brass" className="mb-5">Free consultation</Eyebrow>
          <Heading level={1} className="mb-6">Tell us where you are.</Heading>
          <Text variant="lead" className="mb-10">
            Two minutes to fill out, twenty minutes on a call. We&apos;ll map your prep and tell you
            exactly which Nyx plan fits — or that none do.
          </Text>
          <PhotoFrame
            src="/design/apply.jpg"
            alt="Late-night study"
            aspect="landscape"
            caption="Where the work happens"
            index="A"
            mask="bottom"
            className="hidden lg:block"
          />
        </div>
        <div className="lg:col-span-7">
          <Card variant="elevated">
            <LeadForm />
          </Card>
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Token-swap `LeadForm`**

Open `components/shared/LeadForm.tsx`. Replace inline color hex / rgba literals with the new tokens (same mapping as Task 26). Replace any `bg-gradient-to-b from-[#e0b55c] to-[#c99438]` submit buttons with the system `<CTA>` if static, or keep the button element but change colors to `var(--accent)`/`var(--accent-bright)`. Keep all form logic, validation, and Supabase wiring intact.

- [ ] **Step 4: Commit**

```bash
git add app/apply/page.tsx components/shared/LeadForm.tsx
git commit -m "Refactor /apply to Form archetype with side photo

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 5 — Portal pages (token swap, lighter touch)

> Each portal page below: keep all data fetching, Supabase calls, and props. Only restyle. Wrap section bodies in `<Section spacing="tight">` where it improves rhythm.

### Task 28: Restyle `/portal` (overview) and `/portal/layout.tsx`

**Files:**
- Read first: `app/portal/layout.tsx`, `app/portal/page.tsx`
- Modify: `app/portal/layout.tsx`, `app/portal/page.tsx`

- [ ] **Step 1: Token-swap `app/portal/layout.tsx`**

Replace `bg-[#0a0d14]` → `bg-[var(--bg)]`, all text colors and borders to tokens. Keep the `PortalSidebar` placement unchanged.

- [ ] **Step 2: Token-swap `app/portal/page.tsx`**

Process: walk the file top to bottom. Wherever a color literal appears (`#d4a853`, `#f0ece3`, `#8d9ab0`, `#0f1521`, etc.), replace with the matching CSS var. Replace bespoke section wrappers with `<Section spacing="tight">`. Replace ad-hoc card divs with `<Card variant="default">`. Replace primary buttons with `<CTA>`.

Mapping table (apply consistently):
- `#060912`, `#0a0d14` → `var(--bg)`
- `#0b0f1a` → `var(--bg-2)`
- `#0f1521` → `var(--surface)`
- `#141b2d`, `#1a2338` → `var(--surface-elevated)`
- `#d4a853`, `#e8c46a` → `var(--accent)` / `var(--accent-bright)`
- `#f0ece3`, `#f0ede6` → `var(--text-1)`
- `#c8d0de` → `var(--text-1)` (close enough; keep cohesive)
- `#8d9ab0` → `var(--text-2)`
- `#4e5d72` → `var(--text-3)`
- `rgba(255,255,255,0.07)` → `var(--border)`
- `rgba(255,255,255,0.12)` → `var(--border-2)`
- `rgba(212,168,83, *)` → match `--accent-dim` (~0.12) or `--border-accent` (~0.30)
- Any `font-bold` heading lines should become `<Heading level={2|3>}` where they are page-level headings.

- [ ] **Step 3: Commit**

```bash
git add app/portal/layout.tsx app/portal/page.tsx
git commit -m "Restyle /portal overview and shell to new tokens

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 29: Restyle the portal subpages

**Files:**
- Modify: `app/portal/sessions/page.tsx`
- Modify: `app/portal/sessions/[id]/page.tsx`
- Modify: `app/portal/messages/page.tsx`
- Modify: `app/portal/profile/page.tsx`
- Modify: `app/portal/schedule/page.tsx`
- Modify: `app/portal/materials/page.tsx`
- Modify: `app/portal/upgrade/page.tsx`

- [ ] **Step 1: Apply the Task 28 token-mapping table to each portal subpage**

For each file in the list:
1. Replace literal hex colors with CSS vars per the table.
2. Replace bespoke `<section>` wrappers with `<Section spacing="tight">`.
3. Replace bespoke card `<div className="rounded-... border-... bg-...">` with `<Card variant="default|elevated|ghost">`.
4. Replace primary buttons with `<CTA>`.
5. Replace section/page title `<h1>`/`<h2>` with `<Heading level={2|3}>`.
6. Replace eyebrow lines with `<Eyebrow color="brass|moon">`.

Do not change any data fetching, Supabase queries, or props. Only the JSX styling and structure.

- [ ] **Step 2: Verify each route**

Run: `npm run dev`. Sign in (if auth wired locally) or visit each route and confirm it renders without console errors.

- [ ] **Step 3: Commit**

```bash
git add app/portal/sessions app/portal/messages app/portal/profile app/portal/schedule app/portal/materials app/portal/upgrade
git commit -m "Restyle portal subpages to new tokens and primitives

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 30: Restyle `/portal/login` and `/portal/signup` — Auth archetype

**Files:**
- Modify: `app/portal/login/page.tsx`
- Modify: `app/portal/signup/page.tsx`

- [ ] **Step 1: Wrap each in a centered narrow Card**

For each file, the outer layout becomes:

```tsx
<div className="min-h-screen flex items-center justify-center px-5 py-20">
  <div className="w-full max-w-md">
    <Card variant="elevated">
      {/* keep existing form, but restyle inputs/labels with var(--*) */}
    </Card>
  </div>
</div>
```

Apply the same token mapping from Task 28 to the form contents. Keep all Supabase auth calls intact.

- [ ] **Step 2: Commit**

```bash
git add app/portal/login/page.tsx app/portal/signup/page.tsx
git commit -m "Restyle login/signup to Auth archetype

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 31: Token-swap `/admin`

**Files:**
- Modify: `app/admin/page.tsx`
- Modify: `app/admin/AdminDashboard.tsx`

- [ ] **Step 1: Apply token-mapping table**

Same mechanical pass as Task 28. No archetype change. Goal: it stops looking like a different product.

- [ ] **Step 2: Commit**

```bash
git add app/admin/page.tsx app/admin/AdminDashboard.tsx
git commit -m "Token-swap /admin to align with new palette

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 6 — Consultation dashboard

### Task 32: Create the typed mock data module

**Files:**
- Create: `lib/mock/consultationDashboard.ts`

- [ ] **Step 1: Write the module**

```ts
export type Section = "Math" | "RW";

export type ConsultationDashboardData = {
  student: {
    name: string;
    plan: "Free" | "Scholar" | "Constellation";
    nextSessionAt: string | null;
  };
  kpis: {
    diagnosticScore: { value: number; outOf: 1600; deltaFromLast: number | null };
    practiceHours: { value: number; window: "7d" | "30d" };
    streakDays: number;
    targetScore: number;
  };
  trajectory: { date: string; score: number }[];
  mastery: { skill: string; section: Section; mastery: number }[];
  upcomingSession: { tutor: string; topic: string; startsAt: string } | null;
  notes: { id: string; author: string; createdAt: string; body: string }[];
  recommendations: { id: string; title: string; cta: string; href: string }[];
};

export const mockDashboard: ConsultationDashboardData = {
  student: {
    name: "Avery Chen",
    plan: "Scholar",
    nextSessionAt: "2026-05-05T17:00:00-04:00",
  },
  kpis: {
    diagnosticScore: { value: 1310, outOf: 1600, deltaFromLast: 40 },
    practiceHours: { value: 6.5, window: "7d" },
    streakDays: 12,
    targetScore: 1480,
  },
  trajectory: [
    { date: "2026-02-09", score: 1230 },
    { date: "2026-02-23", score: 1255 },
    { date: "2026-03-09", score: 1270 },
    { date: "2026-03-23", score: 1285 },
    { date: "2026-04-06", score: 1290 },
    { date: "2026-04-20", score: 1310 },
  ],
  mastery: [
    { skill: "Linear equations",        section: "Math", mastery: 0.86 },
    { skill: "Systems",                  section: "Math", mastery: 0.72 },
    { skill: "Quadratics",               section: "Math", mastery: 0.55 },
    { skill: "Word problems",            section: "Math", mastery: 0.41 },
    { skill: "Geometry",                 section: "Math", mastery: 0.63 },
    { skill: "Statistics",               section: "Math", mastery: 0.58 },
    { skill: "Information & Ideas",      section: "RW",   mastery: 0.78 },
    { skill: "Craft & Structure",        section: "RW",   mastery: 0.62 },
    { skill: "Expression of Ideas",      section: "RW",   mastery: 0.49 },
    { skill: "Standard English",         section: "RW",   mastery: 0.71 },
  ],
  upcomingSession: {
    tutor: "Loc",
    topic: "Word problems · setup strategies",
    startsAt: "2026-05-05T17:00:00-04:00",
  },
  notes: [
    { id: "n1", author: "Loc",     createdAt: "2026-04-29", body: "Strong on linear systems this week. Focus next on translating word problems before computation." },
    { id: "n2", author: "Charles", createdAt: "2026-04-25", body: "Reading passages: pace is good; second-pass close-reading still costs 4–5 min on long passages. Drill skim-then-locate." },
    { id: "n3", author: "Loc",     createdAt: "2026-04-22", body: "Great mock score. Math was up 30; RW flat. Investigate whether grammar drills are pulling time from passage practice." },
  ],
  recommendations: [
    { id: "r1", title: "Drill word problems",    cta: "Start drill",   href: "/portal/sessions" },
    { id: "r2", title: "Review last mock",       cta: "Open report",   href: "/portal/sessions" },
    { id: "r3", title: "Schedule next session",  cta: "Pick a time",   href: "/portal/schedule" },
  ],
};
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add lib/mock/consultationDashboard.ts
git commit -m "Add typed mock data for consultation dashboard

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 33: Build the Consultation Dashboard page

**Files:**
- Create: `app/portal/consultation/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import { Compass, ArrowRight, TrendingUp, Clock, Flame, Target } from "lucide-react";
import {
  Section, Heading, Text, Card, CTA, PlotEmbed, Eyelet,
} from "@/components/system";
import { mockDashboard, type ConsultationDashboardData } from "@/lib/mock/consultationDashboard";

export const metadata = { title: "Consultation" };

function daysUntil(iso: string | null): string {
  if (!iso) return "—";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Today";
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return `in ${days}d`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function masteryToPercent(m: number): string {
  return `${Math.round(m * 100)}%`;
}

function deltaBadge(delta: number | null) {
  if (delta == null) return null;
  const isPositive = delta >= 0;
  const color = isPositive ? "text-[var(--accent-2)]" : "text-red-400";
  const sign = isPositive ? "+" : "";
  return <span className={`font-mono text-[12px] ${color}`}>{sign}{delta}</span>;
}

export default function ConsultationDashboardPage() {
  const d: ConsultationDashboardData = mockDashboard;
  return (
    <div className="px-5 sm:px-8 py-10 md:py-12 max-w-7xl mx-auto">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center">
            <Compass size={16} className="text-[var(--accent)]" />
          </span>
          <div>
            <Heading level={3} className="!text-[18px]">Consultation</Heading>
            <p className="text-[var(--text-3)] text-[12px] font-mono uppercase tracking-[0.14em]">
              {d.student.name} · {d.student.plan} plan
            </p>
          </div>
        </div>
        <p className="text-[var(--text-2)] text-[13px] font-mono">
          Next session <span className="text-[var(--text-1)]">{daysUntil(d.student.nextSessionAt)}</span>
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <KpiCard
          icon={TrendingUp}
          label="Diagnostic"
          value={`${d.kpis.diagnosticScore.value}`}
          unit={`/ ${d.kpis.diagnosticScore.outOf}`}
          delta={deltaBadge(d.kpis.diagnosticScore.deltaFromLast)}
        />
        <KpiCard
          icon={Clock}
          label={`Practice · ${d.kpis.practiceHours.window}`}
          value={`${d.kpis.practiceHours.value}`}
          unit="hrs"
        />
        <KpiCard
          icon={Flame}
          label="Streak"
          value={`${d.kpis.streakDays}`}
          unit="days"
        />
        <KpiCard
          icon={Target}
          label="Target"
          value={`${d.kpis.targetScore}`}
          unit="goal"
        />
      </div>

      {/* Main + rail */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Trajectory */}
          <Card variant="default">
            <div className="flex items-center justify-between mb-5">
              <div>
                <Eyelet index="01" label="Trajectory" />
                <Heading level={4} className="mt-2">Score over the last 12 weeks</Heading>
              </div>
            </div>
            <PlotEmbed
              caption="Adaptive ability estimate · weekly"
              source="Nyx engine"
              aspect="landscape"
            />
          </Card>

          {/* Mastery heatmap */}
          <Card variant="default">
            <div className="mb-5">
              <Eyelet index="02" label="Mastery" />
              <Heading level={4} className="mt-2">Skill heatmap</Heading>
            </div>
            <MasteryHeatmap items={d.mastery} />
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming session */}
          {d.upcomingSession ? (
            <Card variant="elevated">
              <Eyelet index="03" label="Upcoming session" />
              <Heading level={4} className="mt-3 mb-1">{d.upcomingSession.topic}</Heading>
              <p className="text-[var(--text-2)] text-[13.5px] mb-4">
                with {d.upcomingSession.tutor}
              </p>
              <p className="text-[var(--text-1)] text-[14px] font-mono mb-5">
                {formatDate(d.upcomingSession.startsAt)}
              </p>
              <CTA href="/portal/sessions" variant="primary" size="default" className="w-full">
                View session
              </CTA>
            </Card>
          ) : null}

          {/* Tutor notes */}
          <Card variant="ghost">
            <Eyelet index="04" label="Tutor notes" />
            <ul className="mt-4 space-y-4">
              {d.notes.map((n) => (
                <li key={n.id} className="border-l-2 border-[var(--border-accent)] pl-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[var(--text-1)] text-[13.5px] font-semibold">{n.author}</span>
                    <span className="text-[var(--text-3)] text-[11px] font-mono">{formatDate(n.createdAt)}</span>
                  </div>
                  <Text variant="small">{n.body}</Text>
                </li>
              ))}
            </ul>
          </Card>

          {/* Recommendations */}
          <Card variant="accent">
            <Eyelet index="05" label="Recommended" />
            <ul className="mt-4 space-y-3">
              {d.recommendations.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 py-2">
                  <span className="text-[var(--text-1)] text-[14px]">{r.title}</span>
                  <a
                    href={r.href}
                    className="inline-flex items-center gap-1 text-[var(--accent)] text-[12px] font-semibold hover:text-[var(--accent-bright)] transition-colors"
                  >
                    {r.cta}
                    <ArrowRight size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon, label, value, unit, delta,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  unit?: string;
  delta?: React.ReactNode;
}) {
  return (
    <Card variant="ghost">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[var(--text-3)] text-[11px] font-mono uppercase tracking-[0.14em]">{label}</span>
        <Icon size={14} className="text-[var(--text-3)]" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-[family-name:var(--font-fraunces)] text-[var(--text-1)] text-[36px] leading-none">{value}</span>
        {unit ? <span className="text-[var(--text-3)] text-[12px]">{unit}</span> : null}
      </div>
      {delta ? <div className="mt-2">{delta}</div> : null}
    </Card>
  );
}

function MasteryHeatmap({ items }: { items: ConsultationDashboardData["mastery"] }) {
  const sections: ("Math" | "RW")[] = ["Math", "RW"];
  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const rows = items.filter((i) => i.section === section);
        return (
          <div key={section}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[var(--text-2)] text-[12px] uppercase tracking-[0.16em] font-mono">{section}</span>
            </div>
            <div className="space-y-2.5">
              {rows.map((r) => (
                <div key={r.skill} className="grid grid-cols-12 items-center gap-3">
                  <span className="col-span-5 text-[var(--text-1)] text-[13.5px] truncate">{r.skill}</span>
                  <div className="col-span-6 h-2 rounded-full bg-[var(--surface-3)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent-2)] to-[var(--accent)]"
                      style={{ width: `${Math.round(r.mastery * 100)}%` }}
                    />
                  </div>
                  <span className="col-span-1 text-right text-[var(--text-3)] text-[12px] font-mono">
                    {masteryToPercent(r.mastery)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify the route renders**

Run: `npm run dev` and visit `http://localhost:3000/portal/consultation` (sign in if your local Supabase requires it; otherwise the existing portal layout's auth redirect is acceptable — the page itself renders without DB).
Expected: KPI strip, trajectory plot placeholder, heatmap, upcoming session card, notes feed, recommendations all visible. No console errors.

- [ ] **Step 3: Commit**

```bash
git add app/portal/consultation/page.tsx
git commit -m "Add consultation dashboard layout with mock data

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 7 — Asset slot, restyle remaining shared components, final verification

### Task 34: Add `public/design/` placeholder folder

**Files:**
- Create: `public/design/.gitkeep`

- [ ] **Step 1: Create the placeholder file**

```bash
mkdir -p public/design
touch public/design/.gitkeep
```

- [ ] **Step 2: Commit**

```bash
git add public/design/.gitkeep
git commit -m "Reserve public/design/ for incoming claude_design assets

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 35: Token-swap remaining shared components

**Files:**
- Modify: `components/shared/PricingCard.tsx`
- Modify: `components/shared/ServiceCard.tsx`
- Modify: `components/shared/TutorCard.tsx`
- Modify: `components/shared/SectionHeader.tsx`
- Modify: `components/shared/TrustBadge.tsx`
- Modify: `components/shared/AdminLeadTable.tsx`
- Modify: `components/shared/AdminPortalSection.tsx`

- [ ] **Step 1: Apply the Task 28 token-mapping table to each file**

Some of these may no longer be referenced after Phase 4 (e.g., `PricingCard`, `ServiceCard`, `TutorCard` were embedded in their pages and we rewrote those pages without them). For each file:

1. Run `grep -rn "from \"@/components/shared/<filename>\"" app components` (without extension) to confirm whether it's still imported anywhere.
2. **If still imported:** apply the token-mapping; consider rewriting its body to compose `<Card>` from `components/system`.
3. **If no imports remain:** delete the file (`git rm components/shared/<filename>.tsx`).

Be conservative — when in doubt, restyle and keep.

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add components/shared/
git commit -m "Token-swap (or delete dead) shared marketing components

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 36: Final cohesion verification

**Files:** none modified — checklist run.

- [ ] **Step 1: TypeScript clean**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: Lint clean**

Run: `npm run lint`
Expected: zero errors. Warnings are acceptable but should be reviewed.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds. Note any image-not-found warnings — those are expected because `claude_design/` assets aren't in place yet. They are warnings, not errors; build still succeeds.

- [ ] **Step 4: Manual visual checklist (run dev and walk every route)**

Run: `npm run dev`. Open these routes in order at desktop (1440px) then at mobile (375px) using browser dev tools:

- `/`
- `/services`
- `/sat-act`
- `/college-admissions`
- `/tutors`
- `/pricing`
- `/faq`
- `/apply`
- `/portal`
- `/portal/consultation` (the new dashboard)
- `/portal/sessions`
- `/portal/profile`
- `/portal/login`
- `/admin`

For each route, verify:
- (a) Background is the new deep indigo with star field visible.
- (b) Brass accent is rare (CTA + eyebrow + at most one accent line per section). Pages are not "dripping in gold" anymore.
- (c) Display headings render in Fraunces (a serif). UI text in Geist Sans.
- (d) Section vertical rhythm feels consistent across pages — no abrupt density changes.
- (e) No console errors. No raw `<img>` tags (DevTools → Elements). All images either render or 404 (expected for `/design/...`).
- (f) Mobile layout collapses cleanly at 375px. Sidebar replaces with hamburger; multi-column grids stack.

- [ ] **Step 5: Commit a checklist note** (optional)

```bash
git commit --allow-empty -m "Verified: build, lint, dev checklist for visual redesign

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage check (each spec section → task ref):**

- Cohesion audit problems → addressed in palette token swap (Task 1), primitives (Tasks 4–16), page archetype refactors (Tasks 20–27, 28–31).
- Palette table → Task 1.
- Typography (Fraunces + scale) → Task 2 (font load), Task 5 (Heading), Task 6 (Text).
- Texture & atmosphere (star field, grain, glow, motion vars) → Task 1.
- Motion (single ease, 0.6s default, once-only) → Task 1 (CSS vars), Task 15 (HeroFrame), Task 20 (home animations).
- Shared primitives — every primitive in §"Shared Primitives" of the spec:
  - `<Section>` → Task 9
  - `<Eyebrow>` → Task 4
  - `<Heading>` → Task 5
  - `<Text>` → Task 6
  - `<Card>` → Task 10
  - `<StatBlock>` → Task 11
  - `<HeroFrame>` → Task 15
  - `<PhotoFrame>` → Task 13
  - `<PlotEmbed>` → Task 14
  - `<CTA>` → Task 12
  - `<HorizonDivider>` → Task 7
  - `<Eyelet>` → Task 8
  - barrel → Task 16
- Page archetypes (per-page table in spec §"Per-Page Plan") → Tasks 20 (home), 21 (sat-act), 22 (admissions), 23 (services), 24 (tutors/founders), 25 (pricing), 26 (faq), 27 (apply), 28 (portal layout + overview), 29 (portal subpages), 30 (auth), 31 (admin).
- Consultation dashboard → Tasks 32 (data) + 33 (page) + sidebar link added in Task 19.
- Asset pipeline → `<PhotoFrame>` (Task 13), `<PlotEmbed>` (Task 14), `public/design/` placeholder (Task 34).
- File changes summary → covered across all tasks.
- Verification strategy → Task 36.

**Placeholder scan:** No "TBD" / "TODO" remains in the plan. Every step has explicit code or commands. The only "open" surface is `claude_design/` assets, which is documented as expected and accommodated by `<PhotoFrame>` placeholders — not a plan gap.

**Type consistency:**
- `Card` variants (`"default" | "elevated" | "accent" | "feature" | "ghost"`) used identically across Tasks 10, 20, 23, 24, 25, 27, 33.
- `Section` variants (`"default" | "elevated" | "accent"`) and spacing/glow values consistent across Tasks 9, 20–25, 27, 28, 33.
- `CTA` variants (`"primary" | "ghost"`) and sizes consistent across Tasks 12, 17, 20–27, 33.
- `Heading` levels 1–4 used consistently; `level={2}` in display contexts, `level={3|4}` in card contexts.
- `mockDashboard` shape (`ConsultationDashboardData`) defined in Task 32, consumed in Task 33 with the same field paths.
- `PhotoFrame` aspect values (`"square" | "portrait" | "landscape" | "wide" | "auto"`) used consistently in Tasks 20, 21, 22, 23, 24, 27.
- `Eyelet` props (`index?`, `label`) consistent across Tasks 8, 20, 21, 22, 24, 33.

No type drift detected.

**Scope check:** the plan is scoped to one design pass + one new dashboard page with mocked data. It produces a buildable, browsable site at the end of every task. Functional product features (adaptive engine, question bank, IRT) are deliberately out of scope and slated for follow-up specs.
