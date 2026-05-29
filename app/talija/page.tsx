import type { Metadata } from "next";
import { cookies } from "next/headers";
import { talijaPasscode, TALIJA_COOKIE, isTalijaAuthed } from "@/lib/talija-auth";
import { loadTalijaBank } from "@/lib/practice/talija-data";
import { cleanSlug } from "@/lib/practice/student-data";
import { TalijaDashboard } from "./TalijaDashboard";

export const metadata: Metadata = {
  title: "Tutor view · Nyx",
  robots: { index: false, follow: false },
};

export default async function TalijaPage({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string; student?: string }>;
}) {
  const params = await searchParams;
  const code = talijaPasscode();

  if (!code) {
    return (
      <Centered>
        <h1 className="mb-2 text-[20px] font-semibold text-[var(--text-1)]">Tutor view disabled</h1>
        <p className="text-[13px] text-[var(--text-2)]">
          Set <code className="rounded bg-[var(--bg-2)] px-1 text-[var(--gold)]">TALIJA_PASSCODE</code> (or{" "}
          <code className="rounded bg-[var(--bg-2)] px-1 text-[var(--gold)]">ADMIN_PASSWORD</code>) to enable access.
        </p>
      </Centered>
    );
  }

  // Allow either the cookie or a one-shot ?auth= link.
  const cookieStore = await cookies();
  const authed =
    (await isTalijaAuthed()) ||
    (cookieStore.get(TALIJA_COOKIE)?.value === code) ||
    params.auth === code;

  if (!authed) return <LoginForm invalid={params.auth !== undefined} />;

  const slug = cleanSlug(params.student || "arush") || "arush";
  const bank = loadTalijaBank();
  return <TalijaDashboard slug={slug} bank={bank} />;
}

function LoginForm({ invalid }: { invalid: boolean }) {
  return (
    <Centered>
      <div className="mb-6 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--gold)]/40 text-[15px] text-[var(--gold)]">☾</span>
        <div className="text-left">
          <h1 className="text-[18px] font-semibold text-[var(--text-1)]">Tutor view</h1>
          <p className="text-[12px] text-[var(--text-3)]">Enter your passphrase.</p>
        </div>
      </div>
      <form action="/api/talija/auth" method="POST" className="w-full space-y-3">
        <input
          type="password"
          name="password"
          placeholder="Passphrase"
          required
          autoFocus
          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-4 text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:border-[var(--border-accent)] focus:outline-none"
        />
        {invalid && <p className="text-[12px] text-[var(--danger)]">That passphrase didn&apos;t match. Try again.</p>}
        <button type="submit" className="h-11 w-full rounded-xl bg-[var(--gold-soft)] font-semibold text-[var(--on-gold)] hover:bg-[var(--gold-bright)]">
          Enter
        </button>
      </form>
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm text-center">{children}</div>
    </main>
  );
}
