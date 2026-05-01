import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  description: "Nyx Scholars admin dashboard.",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string }>;
}) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const params = await searchParams;

  if (!adminPassword) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl border border-[#2a3a52] bg-[#161e2e]">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-xl">!</span>
          </div>
          <h1 className="text-xl font-bold text-[#f0ede6] mb-2">Admin Disabled</h1>
          <p className="text-[#8896a7] text-sm">
            The <code className="text-amber-400 bg-[#0f1623] px-1 py-0.5 rounded">ADMIN_PASSWORD</code> environment variable is not set.
            Set it to enable admin access.
          </p>
        </div>
      </div>
    );
  }

  // Check cookie or URL param
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  const isAuthenticated = sessionCookie === adminPassword || params.auth === adminPassword;

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return <AdminDashboard />;
}

function AdminLoginForm() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#f0ede6] mb-2">Admin Access</h1>
          <p className="text-[#8896a7] text-sm">Enter the admin password to continue.</p>
        </div>
        <form action="/api/admin/auth" method="POST" className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="Admin password"
            required
            className="w-full h-11 px-4 rounded-lg border border-[#2a3a52] bg-[#0f1623] text-[#f0ede6] placeholder:text-[#4a5a6a] focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
          />
          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
