"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

const NIGHT = "#050816";
const NIGHT_2 = "#0a0e1f";
const LINE = "#1e2542";
const TEXT = "#e6e9f5";
const TEXT_DIM = "#9aa5c0";
const TEXT_FAINT = "#6a7593";
const MOON = "#7dd3fc";
const MOON_DIM = "#3b7a99";

/**
 * Shared chrome for /portal/login and /portal/signup.
 *
 * Two-column layout on desktop (≥ md):
 *   • Left half — atmospheric scene (deep night, brand monogram,
 *     constellation glyph, italic tagline). Anchors the brand.
 *   • Right half — form, plenty of negative space.
 *
 * Mobile collapses to a thin atmospheric strip on top + form below.
 */
export function AuthShell({
  eyebrow,
  heading,
  subheading,
  tagline,
  children,
  bottom,
}: {
  /** Tiny mono label above the heading (e.g. "Sign in") */
  eyebrow: string;
  /** Display heading shown above the form (e.g. "Welcome back.") */
  heading: ReactNode;
  /** Body text under the heading (e.g. "Sign in to your portal.") */
  subheading: string;
  /** Italic line on the brand panel (mobile + desktop) */
  tagline?: ReactNode;
  /** Form contents */
  children: ReactNode;
  /** Bottom-of-form link row (e.g. "Don't have an account? Create one") */
  bottom?: ReactNode;
}) {
  return (
    <div
      className="min-h-screen grid md:grid-cols-2"
      style={{ background: NIGHT, color: TEXT }}
    >
      {/* Brand panel */}
      <div
        className="relative overflow-hidden hidden md:flex flex-col"
        style={{
          background:
            "radial-gradient(ellipse at 30% 25%, #11183a 0%, #060a1f 55%, #03050e 100%)",
        }}
      >
        {/* Decorative star field */}
        <DecorativeSky />

        {/* Faint rear monogram */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "8%", right: "-10%", width: 520, height: 520, opacity: 0.10,
          }}
        >
          <Image
            src="/design/crescent-monogram.png"
            alt=""
            fill
            sizes="520px"
            className="object-contain"
            priority
          />
        </div>

        <div className="relative flex flex-col h-full justify-between p-10 lg:p-14 z-10">
          {/* top — back link + small mark */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start text-[12px] font-mono uppercase tracking-[0.24em]"
            style={{ color: TEXT_DIM }}
          >
            <ArrowLeft size={12} />
            Back to site
          </Link>

          {/* center — primary lockup + tagline */}
          <div>
            <Image
              src="/design/primary-lockup.png"
              alt="Nyx Scholars"
              width={300}
              height={80}
              className="opacity-95 mb-9"
              priority
            />
            {tagline ? (
              <p
                className="italic leading-[1.35] read-narrow"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: 22,
                  color: TEXT,
                }}
              >
                {tagline}
              </p>
            ) : null}
            <p
              className="mt-7 font-mono text-[10px] tracking-[0.32em]"
              style={{ color: TEXT_FAINT }}
            >
              PER NOCTEM AD LUCEM
            </p>
          </div>

          {/* bottom — three small stats / promises */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { l: "VETTED", v: "1500+ SAT" },
              { l: "FORMAT", v: "Online 1:1" },
              { l: "TRIAL", v: "Free 30 min" },
            ].map((s) => (
              <div key={s.l}>
                <div
                  className="font-mono mb-1.5"
                  style={{ fontSize: 9, letterSpacing: 3, color: TEXT_FAINT }}
                >
                  {s.l}
                </div>
                <div
                  className="italic"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontSize: 15,
                    color: TEXT,
                  }}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hairline horizon between panels */}
        <div
          className="absolute top-0 bottom-0 right-0 w-px hidden md:block"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${LINE} 25%, ${LINE} 75%, transparent 100%)`,
          }}
        />
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        {/* Mobile top: back link */}
        <div className="md:hidden p-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.22em]"
            style={{ color: TEXT_DIM, fontSize: 11 }}
          >
            <ArrowLeft size={11} />
            Back
          </Link>
          <Image
            src="/design/primary-lockup.png"
            alt="Nyx Scholars"
            width={120}
            height={32}
            className="opacity-95"
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-5 sm:px-10 py-10 md:py-12">
          <div className="w-full max-w-[440px]">
            <div className="mb-9">
              <p
                className="font-mono mb-4"
                style={{
                  color: MOON,
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  className="inline-block mr-2.5 align-middle"
                  style={{
                    width: 18, height: 1,
                    background: MOON, borderRadius: 1,
                  }}
                />
                {eyebrow}
              </p>
              <h1
                className="font-light leading-[1.1] tracking-[-0.015em] mb-3"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: "clamp(2rem, 4vw, 2.6rem)",
                  color: TEXT,
                }}
              >
                {heading}
              </h1>
              <p
                className="leading-[1.6]"
                style={{ fontSize: 15, color: TEXT_DIM }}
              >
                {subheading}
              </p>
            </div>

            {children}

            {bottom ? (
              <div
                className="mt-7 pt-6 text-center"
                style={{ borderTop: `1px solid ${LINE}` }}
              >
                {bottom}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function DecorativeSky() {
  // Deterministic small star cluster + connecting constellation
  const stars: { x: number; y: number; r: number; o: number }[] = [
    { x: 14, y: 16, r: 1.4, o: 0.7 }, { x: 28, y: 9, r: 1.0, o: 0.55 },
    { x: 39, y: 18, r: 0.7, o: 0.5 }, { x: 52, y: 12, r: 1.2, o: 0.65 },
    { x: 66, y: 22, r: 0.9, o: 0.55 }, { x: 78, y: 14, r: 0.6, o: 0.45 },
    { x: 8, y: 38, r: 0.7, o: 0.5 }, { x: 22, y: 44, r: 1.1, o: 0.6 },
    { x: 38, y: 36, r: 0.8, o: 0.5 }, { x: 56, y: 42, r: 1.3, o: 0.7 },
    { x: 72, y: 48, r: 0.7, o: 0.45 }, { x: 86, y: 36, r: 1.0, o: 0.55 },
    { x: 18, y: 64, r: 0.9, o: 0.55 }, { x: 32, y: 72, r: 1.1, o: 0.65 },
    { x: 48, y: 66, r: 0.7, o: 0.45 }, { x: 64, y: 74, r: 1.2, o: 0.65 },
    { x: 82, y: 68, r: 0.8, o: 0.5 },
    { x: 14, y: 86, r: 0.6, o: 0.4 }, { x: 36, y: 90, r: 1.0, o: 0.55 },
    { x: 62, y: 88, r: 0.9, o: 0.5 }, { x: 86, y: 92, r: 1.1, o: 0.6 },
  ];
  // A "constellation" linking a few stars
  const lines: [number, number][] = [
    [1, 3], [3, 4], [4, 9], [9, 10], [10, 14], [14, 15],
    [0, 7], [7, 12],
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      aria-hidden
    >
      {lines.map(([a, b], i) => {
        const sa = stars[a]; const sb = stars[b];
        return (
          <line
            key={i}
            x1={sa.x} y1={sa.y}
            x2={sb.x} y2={sb.y}
            stroke={MOON_DIM}
            strokeWidth="0.18"
            opacity="0.55"
          />
        );
      })}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.16} fill={TEXT} opacity={s.o}>
          {i % 4 === 0 ? (
            <animate attributeName="opacity" values={`${s.o};${s.o * 0.4};${s.o}`} dur={`${4 + (i % 3)}s`} repeatCount="indefinite" />
          ) : null}
        </circle>
      ))}
    </svg>
  );
}

/* ─── Form-field helpers used by both auth pages ─── */

export function FormField({
  label, optional, children,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block font-mono mb-2" style={{ fontSize: 11, letterSpacing: 2, color: TEXT_DIM, textTransform: "uppercase" }}>
        {label}{optional ? <span className="ml-2 normal-case" style={{ color: TEXT_FAINT, letterSpacing: 0 }}>· optional</span> : null}
      </span>
      {children}
    </label>
  );
}

export function authInputClass(): string {
  return "w-full h-11 px-4 rounded-[10px] bg-[#0a0e1f] border border-[var(--border)] text-[14.5px] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all";
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      className="px-4 py-3 rounded-[10px] text-[13px] mb-4"
      style={{
        background: "rgba(251, 113, 133, 0.08)",
        border: "1px solid rgba(251, 113, 133, 0.28)",
        color: "#fca5a5",
      }}
    >
      {message}
    </div>
  );
}

export function AuthSubmit({
  loading, children, type = "submit",
}: {
  loading?: boolean;
  children: ReactNode;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className="w-full h-12 rounded-[10px] font-medium font-mono uppercase tracking-[0.18em] transition-all"
      style={{
        background: loading ? "rgba(125,211,252,0.20)" : MOON,
        color: loading ? TEXT_DIM : NIGHT_2,
        fontSize: 12,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
