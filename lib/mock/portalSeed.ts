/**
 * Seed data for the local **preview fallback** (demo mode).
 *
 * This is ONLY used when Supabase env vars are absent (i.e. local dev / a
 * zero-setup demo). In production, the real Supabase client is used and this
 * file is never touched. See `lib/supabase/mock.ts`.
 *
 * Rows are shaped to match the real Postgres tables so the portal pages and
 * API routes render exactly as they would against the live database.
 */
import { ALL_SKILLS } from "@/lib/mock/constellations";

export const DEMO_USER = {
  id: "00000000-0000-4000-8000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "royarush08@gmail.com",
  email_confirmed_at: new Date("2026-01-12T10:00:00Z").toISOString(),
  phone: "",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: { full_name: "Arush Roy" },
  created_at: new Date("2026-01-12T10:00:00Z").toISOString(),
  updated_at: new Date("2026-01-12T10:00:00Z").toISOString(),
} as const;

const TEACHER_ID = "00000000-0000-4000-8000-0000000000a1";

const now = Date.now();
const iso = (msFromNow: number) => new Date(now + msFromNow).toISOString();
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

/**
 * Per-skill mastery for the Sky — Arush Roy's baseline, mapped from his official
 * College Board SAT report (Mar 14 2026: 1490 total; Math 800; R&W 690 with the
 * weakest domains being Expression of Ideas 550–600 and Information and Ideas
 * 610–670). Strong math + Craft/Conventions; the two R&W focus areas read low.
 * Any star not listed falls back to the constellation default.
 */
const ARUSH_PER_SKILL: Record<string, number> = {
  // Math — 800 (all four domains 680–800)
  "lin-eq": 0.96, "lin-sys": 0.94, "lin-ineq": 0.93, "lin-fn": 0.95, "abs-val": 0.9,
  quad: 0.92, poly: 0.9, exp: 0.91, rat: 0.88,
  fulcrum: 0.93, "beam-l": 0.95, "beam-r": 0.92, "pan-l": 0.9, "pan-r": 0.92,
  apex: 0.92, "b-l": 0.9, "b-r": 0.89, cent: 0.88,
  // R&W · Information and Ideas — 610–670 (focus)
  "eye-l": 0.66, "eye-r": 0.62, beak: 0.6, "beak-q": 0.58,
  // R&W · Craft and Structure — 680–800 (strong)
  "wing-l": 0.86, "wing-r": 0.84, foot: 0.82,
  // R&W · Expression of Ideas — 550–600 (weakest, primary focus)
  shaft2: 0.55, plume: 0.5,
  // R&W · Standard English Conventions — 680–800 (strong)
  tip: 0.87, shaft1: 0.85, barb: 0.84,
};
const perSkill: Record<string, number> = Object.fromEntries(
  ALL_SKILLS.map((s) => [s.id, ARUSH_PER_SKILL[s.id] ?? s.mastery]),
);

type Row = Record<string, unknown>;

export const MOCK_DB: Record<string, Row[]> = {
  profiles: [
    {
      id: DEMO_USER.id,
      full_name: "Arush Roy",
      grade: "11",
      school: null,
      target_score: "1550",
      target_test: "SAT",
      phone: null,
      created_at: DEMO_USER.created_at,
      role: "student",
      plan: "monthly",
      plan_status: "active",
      plan_subject: "SAT",
      plan_addons: [],
      notif_prefs: {
        diagnostic_summary: {
          source: "College Board SAT report, 2026-03-14 (imported baseline)",
          completed_at: iso(-9 * DAY),
          theta: 2.2,
          ci: 0.3,
          questions: 98,
          predicted_score: 1490,
          per_skill: perSkill,
        },
        welcome_sent_at: iso(-30 * DAY),
      },
    },
    {
      id: TEACHER_ID,
      full_name: "Talija Marković",
      grade: null,
      school: "Princeton ’26",
      target_score: null,
      target_test: null,
      phone: null,
      created_at: iso(-120 * DAY),
      role: "teacher",
      plan: null,
      plan_status: null,
      plan_subject: null,
      plan_addons: null,
      notif_prefs: {},
    },
  ],

  assignments: [
    {
      id: "00000000-0000-4000-8000-0000000000b1",
      student_id: DEMO_USER.id,
      teacher_id: TEACHER_ID,
      subject: "SAT",
      active: true,
      created_at: iso(-28 * DAY),
      // embedded relation used by the consultation page's projection
      tutor: { full_name: "Talija Marković" },
    },
  ],

  sessions: [
    {
      id: "00000000-0000-4000-8000-0000000000c1",
      student_id: DEMO_USER.id,
      tutor_name: "Talija Marković",
      subject: "SAT · Reading & Writing",
      scheduled_at: iso(2 * DAY + 3 * HOUR),
      duration_minutes: 60,
      status: "confirmed",
      meeting_link: "https://meet.nyxscholars.com/avery-talija",
      student_notes: "Want to push pacing on the harder inference sets.",
      admin_notes: null,
      created_at: iso(-3 * DAY),
    },
    {
      id: "00000000-0000-4000-8000-0000000000c2",
      student_id: DEMO_USER.id,
      tutor_name: "Talija Marković",
      subject: "SAT · Math",
      scheduled_at: iso(5 * DAY),
      duration_minutes: 60,
      status: "pending",
      meeting_link: null,
      student_notes: null,
      admin_notes: null,
      created_at: iso(-1 * DAY),
    },
    {
      id: "00000000-0000-4000-8000-0000000000c3",
      student_id: DEMO_USER.id,
      tutor_name: "Talija Marković",
      subject: "SAT · Advanced Math",
      scheduled_at: iso(-3 * DAY),
      duration_minutes: 60,
      status: "completed",
      meeting_link: null,
      student_notes: null,
      admin_notes:
        "Quadratics are landing now — vertex form clicked. Next: rational expressions, especially restrictions on the domain. Pushed 4 cards to your deck.",
      created_at: iso(-10 * DAY),
    },
    {
      id: "00000000-0000-4000-8000-0000000000c4",
      student_id: DEMO_USER.id,
      tutor_name: "Talija Marković",
      subject: "SAT · Reading & Writing",
      scheduled_at: iso(-9 * DAY),
      duration_minutes: 60,
      status: "completed",
      meeting_link: null,
      student_notes: null,
      admin_notes:
        "Command-of-evidence questions: slow down and find the line reference before reading choices. Big improvement on transitions.",
      created_at: iso(-16 * DAY),
    },
  ],

  messages: [
    {
      id: "00000000-0000-4000-8000-0000000000d1",
      student_id: DEMO_USER.id,
      sender: "nyx",
      content: "Nice work on the transitions drill — you went 9/10. I queued a short rational-expressions set before Thursday.",
      read: false,
      created_at: iso(-6 * HOUR),
    },
    {
      id: "00000000-0000-4000-8000-0000000000d2",
      student_id: DEMO_USER.id,
      sender: "student",
      content: "Thanks! I’ll get through it tonight. Should I time myself?",
      read: true,
      created_at: iso(-2 * DAY),
    },
    {
      id: "00000000-0000-4000-8000-0000000000d3",
      student_id: DEMO_USER.id,
      sender: "nyx",
      content: "Welcome to Nyx, Arush. Your sky is built from your March SAT — strong across Math, with Expression of Ideas and Information & Ideas as your two focus areas. Tap any star to drill that skill.",
      read: true,
      created_at: iso(-9 * DAY),
    },
  ],

  notifications: [
    {
      id: "00000000-0000-4000-8000-0000000000e1",
      user_id: DEMO_USER.id,
      kind: "session.reminder",
      title: "Session in 2 days",
      body: "SAT · Reading & Writing with Talija.",
      href: "/portal/sessions/00000000-0000-4000-8000-0000000000c1",
      read_at: null,
      created_at: iso(-5 * HOUR),
    },
    {
      id: "00000000-0000-4000-8000-0000000000e2",
      user_id: DEMO_USER.id,
      kind: "practice.due",
      title: "5 cards are due",
      body: "Your daily eight minutes is ready.",
      href: "/portal/practice",
      read_at: null,
      created_at: iso(-7 * HOUR),
    },
    {
      id: "00000000-0000-4000-8000-0000000000e3",
      user_id: DEMO_USER.id,
      kind: "message.received",
      title: "New message from Talija",
      body: "Nice work on the transitions drill…",
      href: "/portal/messages",
      read_at: iso(-1 * DAY),
      created_at: iso(-6 * HOUR),
    },
  ],

  srs_cards: srsCards(),

  diagnostic_attempts: [
    {
      id: "00000000-0000-4000-8000-0000000000f1",
      user_id: DEMO_USER.id,
      created_at: iso(-9 * DAY),
      theta_after: 0.8,
    },
  ],

  homework: [
    {
      id: "00000000-0000-4000-8000-0000000000a2",
      student_id: DEMO_USER.id,
      tutor_id: TEACHER_ID,
      session_id: null,
      title: "Rational expressions — restrictions & simplifying",
      body: "Focus on domain restrictions. Show the excluded values.",
      due_at: iso(2 * DAY),
      questions: [
        {
          prompt: "For which value of x is the expression (x + 3) / (x² − 9) undefined but removable when simplified?",
          choices: ["x = 3", "x = −3", "x = 0", "x = 9"],
          correct_index: 1,
          rationale: "x² − 9 = (x−3)(x+3). The (x+3) cancels, so x = −3 is a removable discontinuity; x = 3 remains a true restriction.",
        },
        {
          prompt: "Simplify: (2x² − 8) / (x² − 4x + 4).",
          choices: ["2(x + 2)/(x − 2)", "2(x − 2)/(x + 2)", "2/(x − 2)", "(x + 2)/(x − 2)"],
          correct_index: 0,
          rationale: "Numerator = 2(x−2)(x+2); denominator = (x−2)². Cancel one (x−2): 2(x+2)/(x−2).",
        },
      ],
      results: null,
      completed_at: null,
      created_at: iso(-2 * DAY),
    },
  ],

  // Intentionally empty — pages handle these gracefully (empty states).
  diagnostic_questions: [],
  tutor_availability: [],
  forum_threads: [],
  forum_replies: [],
  pricing_config: [],
  leads: [],
  audit_log: [],
  webhook_events: [],
  tutors: [],
};

function srsCards(): Row[] {
  const seeds: Array<{ skill: string; prompt: string; answer: string; reps: number; dueOffset: number }> = [
    { skill: "rat", prompt: "What value must be excluded from the domain of 1/(x−5)?", answer: "x = 5 — it makes the denominator zero, so the function is undefined there.", reps: 1, dueOffset: -2 * HOUR },
    { skill: "quad", prompt: "What are the roots of x² − 5x + 6 = 0?", answer: "x = 2 and x = 3 (factors to (x−2)(x−3)).", reps: 3, dueOffset: -1 * HOUR },
    { skill: "shaft2", prompt: "Choose the transition: 'The data was inconclusive; ____, the team repeated the trial.'", answer: "“therefore” / “as a result” — the repeat is a consequence of the inconclusive data.", reps: 2, dueOffset: -3 * HOUR },
    { skill: "beak", prompt: "On command-of-evidence items, what should you locate before reading the answer choices?", answer: "The specific line/quote the question points to, so you evaluate each choice against the text rather than memory.", reps: 0, dueOffset: -30 * 60 * 1000 },
    { skill: "cent", prompt: "In a right triangle, sin(θ) = ?", answer: "opposite / hypotenuse.", reps: 1, dueOffset: -4 * HOUR },
  ];
  return seeds.map((s, i) => ({
    id: `00000000-0000-4000-8000-0000000001${String(i).padStart(2, "0")}`,
    user_id: DEMO_USER.id,
    skill_id: s.skill,
    prompt: s.prompt,
    answer: s.answer,
    reps: s.reps,
    lapses: 0,
    ease: 2.5,
    interval_days: Math.max(1, s.reps),
    due_at: iso(s.dueOffset),
    created_at: iso(-9 * DAY),
  }));
}
