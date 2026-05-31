/**
 * Provision a Supabase Auth login for a client, idempotently.
 *
 * Auto-loads .env / .env.local, then provisions the account two possible ways:
 *
 *   • SERVICE ROLE key present  → admin path: create/repair the auth user with the
 *     email PRE-CONFIRMED, and write the full profile + baseline "sky" (bypasses RLS).
 *     This is the reliable path — works regardless of your email-confirmation setting.
 *
 *   • Only the PUBLISHABLE / anon key present → signup path: signs the client up
 *     through the public flow (same as /portal/signup). If your project has email
 *     confirmation OFF, signup returns a session and we also write the full profile +
 *     baseline. If confirmation is ON, the account is created but the client must click
 *     the confirmation email before signing in (and the baseline needs the service key).
 *
 * Usage (from the repo root, after putting values in .env / .env.local):
 *   npx tsx scripts/create-client-user.ts
 * or inline:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/create-client-user.ts
 *
 * Override the account with CLIENT_EMAIL / CLIENT_PASSWORD / CLIENT_NAME / CLIENT_GRADE.
 */
import { createClient, type Session } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

/* Load .env.local then .env from the repo root (without overwriting real env vars). */
function loadEnvFiles() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  for (const f of [".env.local", ".env"]) {
    const p = join(root, f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (process.env[m[1]] === undefined && v !== "") process.env[m[1]] = v;
    }
  }
}
loadEnvFiles();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const EMAIL = (process.env.CLIENT_EMAIL ?? "royarush08@gmail.com").toLowerCase().trim();
// The password is a secret — never hardcode it in committed source. Supply it via
// CLIENT_PASSWORD in your (gitignored) .env, or inline when you run the script.
const PASSWORD = process.env.CLIENT_PASSWORD ?? "";
const FULL_NAME = process.env.CLIENT_NAME ?? "Arush Roy";
const GRADE = process.env.CLIENT_GRADE ?? "11";
const TARGET_SCORE = process.env.CLIENT_TARGET_SCORE ?? "1550"; // stretch goal above his 1490 — editable in-app
const ROLE = process.env.CLIENT_ROLE ?? "student";

/**
 * Baseline "sky"/diagnostic snapshot for Arush, derived from his official College
 * Board SAT report (Mar 14 2026: total 1490 — Math 800, R&W 690). per_skill maps his
 * eight domain performance bands onto the constellation stars: strong math +
 * Craft/Conventions; the two focus areas are Information and Ideas (610–670) and
 * Expression of Ideas (550–600). Only applied to the default Arush account.
 */
const ARUSH_EMAIL = "royarush08@gmail.com";
const ARUSH_DIAGNOSTIC = {
  source: "College Board SAT report, 2026-03-14 (imported baseline)",
  theta: 2.2, // predicted ≈ 1050 + 200·θ ≈ 1490
  ci: 0.3,
  questions: 98,
  predicted_score: 1490,
  per_skill: {
    "lin-eq": 0.96, "lin-sys": 0.94, "lin-ineq": 0.93, "lin-fn": 0.95, "abs-val": 0.9,
    quad: 0.92, poly: 0.9, exp: 0.91, rat: 0.88,
    fulcrum: 0.93, "beam-l": 0.95, "beam-r": 0.92, "pan-l": 0.9, "pan-r": 0.92,
    apex: 0.92, "b-l": 0.9, "b-r": 0.89, cent: 0.88,
    "eye-l": 0.66, "eye-r": 0.62, beak: 0.6, "beak-q": 0.58,        // Information & Ideas — focus
    "wing-l": 0.86, "wing-r": 0.84, foot: 0.82,                     // Craft & Structure — strong
    shaft2: 0.55, plume: 0.5,                                        // Expression of Ideas — weakest
    tip: 0.87, shaft1: 0.85, barb: 0.84,                            // Standard English Conventions — strong
  } as Record<string, number>,
};

function fail(msg: string): never {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

type ProfileLike = { notif_prefs?: Record<string, unknown> | null } | null;

function buildProfileRow(userId: string, existing: ProfileLike) {
  const isArush = EMAIL === ARUSH_EMAIL;
  const existingPrefs = (existing?.notif_prefs ?? {}) as Record<string, unknown>;
  const notif_prefs = isArush
    ? { ...existingPrefs, diagnostic_summary: { ...ARUSH_DIAGNOSTIC, completed_at: new Date().toISOString() } }
    : existingPrefs;
  // Basic tutoring access: the "session" (pay-as-you-go) plan is what unlocks the
  // Sessions + Schedule tabs. Active so it isn't gated behind the upgrade wall.
  const plan = isArush
    ? { plan: "session", plan_status: "active", plan_subject: "SAT", plan_addons: [] }
    : {};
  return { id: userId, full_name: FULL_NAME, grade: GRADE, role: ROLE, target_test: "SAT", target_score: TARGET_SCORE, notif_prefs, ...plan };
}

/* ── Admin path: service_role key (reliable, pre-confirmed, full baseline) ── */
async function adminPath(serviceKey: string) {
  const admin = createClient(URL!, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  async function findUserByEmail(email: string) {
    for (let page = 1; page <= 50; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      const hit = data.users.find((u) => (u.email ?? "").toLowerCase() === email);
      if (hit) return hit;
      if (data.users.length < 200) break;
    }
    return null;
  }

  let userId: string;
  const existing = await findUserByEmail(EMAIL);
  if (existing) {
    // Password is only reset when CLIENT_PASSWORD is supplied — so you can safely
    // re-run to update the profile/plan without re-stating the password.
    console.log(`  • Auth user exists — confirming email${PASSWORD ? " & resetting password" : ""}.`);
    const updateArgs: Record<string, unknown> = {
      email_confirm: true,
      user_metadata: { ...(existing.user_metadata ?? {}), full_name: FULL_NAME, role: ROLE },
    };
    if (PASSWORD) updateArgs.password = PASSWORD;
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, updateArgs);
    if (error) fail(`Failed to update existing user: ${error.message}`);
    userId = data.user.id;
  } else {
    if (!PASSWORD) fail("Set CLIENT_PASSWORD to create a new account (it is intentionally not stored in source).");
    console.log("  • Creating new auth user (email pre-confirmed).");
    const { data, error } = await admin.auth.admin.createUser({
      email: EMAIL, password: PASSWORD, email_confirm: true,
      user_metadata: { full_name: FULL_NAME, role: ROLE },
    });
    if (error) fail(`Failed to create user: ${error.message}`);
    userId = data.user.id;
  }

  console.log("  • Writing profile (name, grade, target, baseline sky).");
  const { data: existingProfile } = await admin.from("profiles").select("notif_prefs").eq("id", userId).maybeSingle();
  const { error: upErr } = await admin.from("profiles").upsert(buildProfileRow(userId, existingProfile as ProfileLike), { onConflict: "id" });
  if (upErr) console.warn(`  ⚠ Profile upsert warning: ${upErr.message}`);
  done(userId, true);
}

/* ── Signup path: publishable/anon key only ── */
async function signupPath(anonKey: string) {
  if (!PASSWORD) fail("Set CLIENT_PASSWORD in .env (or inline) — the signup flow needs the client's password.");
  const pub = createClient(URL!, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  console.log("  • No service_role key — using the public signup flow (publishable key).");

  let session: Session | null = null;
  let userId: string | null = null;

  const { data, error } = await pub.auth.signUp({
    email: EMAIL, password: PASSWORD, options: { data: { full_name: FULL_NAME, role: ROLE } },
  });
  if (error && /registered|already|exists/i.test(error.message)) {
    const { data: si, error: se } = await pub.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
    if (se) fail(`User already exists and sign-in failed (${se.message}). Add SUPABASE_SERVICE_ROLE_KEY to reset the password.`);
    session = si.session; userId = si.user?.id ?? null;
    console.log("  • User already existed; signed in to refresh the profile.");
  } else if (error) {
    fail(`Signup failed: ${error.message}`);
  } else {
    session = data.session; userId = data.user?.id ?? null;
  }
  if (!userId) fail("Signup returned no user id.");

  if (!session) {
    console.log(`\n⚠ Created ${EMAIL}, but this project has EMAIL CONFIRMATION enabled.`);
    console.log("  → Arush must click the confirmation email before he can sign in.");
    console.log("  → His profile/sky baseline was NOT written (it needs an active session).");
    console.log("  To make the login instant AND seed his baseline automatically, either:");
    console.log("    (a) add SUPABASE_SERVICE_ROLE_KEY to .env and re-run, or");
    console.log("    (b) turn off Supabase → Authentication → Providers → Email → 'Confirm email', then re-run.\n");
    return;
  }

  // We have a session → update Arush's OWN profile (RLS allows self-update).
  const authed = createClient(URL!, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${session.access_token}` } },
  });
  console.log("  • Writing profile (name, grade, target, baseline sky).");
  const { data: existingProfile } = await authed.from("profiles").select("notif_prefs").eq("id", userId).maybeSingle();
  const { error: upErr } = await authed.from("profiles").upsert(buildProfileRow(userId, existingProfile as ProfileLike), { onConflict: "id" });
  if (upErr) console.warn(`  ⚠ Profile update warning: ${upErr.message} (login works; full baseline may need the service_role key).`);
  done(userId, true);
}

function done(userId: string, baseline: boolean) {
  console.log(`\n✓ Done. ${EMAIL} can sign in at /portal/login with the given password.`);
  if (baseline) console.log("  Profile + baseline sky set (strong Math; focus on Expression of Ideas & Information and Ideas).");
  console.log(`  user id: ${userId}\n`);
}

async function main() {
  if (!URL) {
    fail(
      [
        "Missing NEXT_PUBLIC_SUPABASE_URL.",
        "Put your Supabase values in .env (repo root), e.g.:",
        "  NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co",
        "  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...        (or NEXT_PUBLIC_SUPABASE_ANON_KEY)",
        "  SUPABASE_SERVICE_ROLE_KEY=eyJ...                    (optional, but recommended)",
        "then re-run: npx tsx scripts/create-client-user.ts",
      ].join("\n"),
    );
  }
  // Password is required only to create a new account or via the signup path; the
  // admin path can update an existing account's profile/plan without it.
  console.log(`\nProvisioning client login: ${EMAIL}`);
  if (SERVICE_KEY) await adminPath(SERVICE_KEY);
  else if (ANON_KEY) await signupPath(ANON_KEY);
  else fail("Have the URL but no key. Set SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.");
}

main().catch((e) => fail(e?.message ?? String(e)));
