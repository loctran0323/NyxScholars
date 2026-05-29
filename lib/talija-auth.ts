import { cookies } from "next/headers";

/**
 * Passphrase that gates /talija. Prefers the TALIJA_PASSCODE env var (then
 * ADMIN_PASSWORD), and finally falls back to a hardcoded default so the tutor
 * view works in production with no env configuration at all. This is a
 * low-stakes gate (it guards a study dashboard, not sensitive data); the
 * hardcoded default was explicitly requested.
 */
const DEFAULT_PASSCODE = "charlesistheprettiestboyandimjustasmellypoopyhead";

export function talijaPasscode(): string {
  return process.env.TALIJA_PASSCODE || process.env.ADMIN_PASSWORD || DEFAULT_PASSCODE;
}

export const TALIJA_COOKIE = "talija_session";

export async function isTalijaAuthed(): Promise<boolean> {
  const code = talijaPasscode();
  if (!code) return false;
  const store = await cookies();
  return store.get(TALIJA_COOKIE)?.value === code;
}
