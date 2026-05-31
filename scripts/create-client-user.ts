/**
 * Provision a Supabase Auth login for a client, idempotently.
 *
 * Creates (or repairs) the auth.users row AND the public.profiles row so the
 * account can sign in at /portal/login immediately. Safe to re-run: if the user
 * already exists it resets the password, confirms the email, and upserts the
 * profile rather than erroring.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=...  SUPABASE_SERVICE_ROLE_KEY=...  \
 *     npx tsx scripts/create-client-user.ts
 *
 * Defaults to the client account requested for this deployment; override with
 * CLIENT_EMAIL / CLIENT_PASSWORD / CLIENT_NAME env vars.
 *
 * The SERVICE ROLE key is required (it bypasses RLS and can create auth users).
 * Never expose it to the browser — run this from a trusted shell only.
 */
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const EMAIL = (process.env.CLIENT_EMAIL ?? "royarush08@gmail.com").toLowerCase().trim();
const PASSWORD = process.env.CLIENT_PASSWORD ?? "Rushi2008$";
const FULL_NAME = process.env.CLIENT_NAME ?? "Roy Arush";
const ROLE = process.env.CLIENT_ROLE ?? "student";

function fail(msg: string): never {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

if (!URL || !SERVICE_KEY) {
  fail(
    [
      "Missing Supabase credentials.",
      "",
      "This script needs a real Supabase project. Set:",
      "  NEXT_PUBLIC_SUPABASE_URL      (your project URL, e.g. https://xxxx.supabase.co)",
      "  SUPABASE_SERVICE_ROLE_KEY     (Project Settings → API → service_role secret)",
      "",
      "Then re-run:",
      "  NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/create-client-user.ts",
    ].join("\n"),
  );
}

const admin = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email: string) {
  // Paginate through users (admin.listUsers has no email filter in all versions).
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => (u.email ?? "").toLowerCase() === email);
    if (hit) return hit;
    if (data.users.length < 200) break;
  }
  return null;
}

async function main() {
  console.log(`\nProvisioning client login: ${EMAIL}`);

  let userId: string;
  const existing = await findUserByEmail(EMAIL);

  if (existing) {
    console.log("  • Auth user already exists — resetting password & confirming email.");
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { ...(existing.user_metadata ?? {}), full_name: FULL_NAME, role: ROLE },
    });
    if (error) fail(`Failed to update existing user: ${error.message}`);
    userId = data.user.id;
  } else {
    console.log("  • Creating new auth user (email pre-confirmed).");
    const { data, error } = await admin.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: FULL_NAME, role: ROLE },
    });
    if (error) fail(`Failed to create user: ${error.message}`);
    userId = data.user.id;
  }

  // Upsert the profile row defensively (the auth trigger usually creates it,
  // but we guarantee it exists with the right role/name here too).
  console.log("  • Upserting profiles row.");
  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: userId,
      full_name: FULL_NAME,
      role: ROLE,
      target_test: "SAT",
    },
    { onConflict: "id" },
  );
  if (profileError) {
    console.warn(`  ⚠ Profile upsert warning: ${profileError.message}`);
    console.warn("    (The login still works; the auth trigger may have already created the row.)");
  }

  console.log(`\n✓ Done. ${EMAIL} can now sign in at /portal/login with the provided password.`);
  console.log(`  user id: ${userId}\n`);
}

main().catch((e) => fail(e?.message ?? String(e)));
