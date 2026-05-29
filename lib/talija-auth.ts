import { cookies } from "next/headers";

/**
 * Passphrase that gates /talija. Prefers TALIJA_PASSCODE; falls back to
 * ADMIN_PASSWORD so the tutor view can never be locked out in an environment
 * where only the admin password is configured.
 */
export function talijaPasscode(): string | undefined {
  return process.env.TALIJA_PASSCODE || process.env.ADMIN_PASSWORD || undefined;
}

export const TALIJA_COOKIE = "talija_session";

export async function isTalijaAuthed(): Promise<boolean> {
  const code = talijaPasscode();
  if (!code) return false;
  const store = await cookies();
  return store.get(TALIJA_COOKIE)?.value === code;
}
