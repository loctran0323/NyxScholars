import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side guard for /admin sub-pages. Reads the `admin_session` cookie
 * (set by /api/admin/auth) and compares it to ADMIN_PASSWORD.
 * Redirects to /admin (which renders the login form) when missing.
 */
export async function requireAdminAuth(): Promise<void> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) redirect("/admin");
  const store = await cookies();
  const session = store.get("admin_session")?.value;
  if (session !== adminPassword) redirect("/admin");
}
