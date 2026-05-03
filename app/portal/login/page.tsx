"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { AuthShell, FormField, authInputClass, AuthError, AuthSubmit } from "@/components/portal/AuthShell";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-[var(--text-2)] text-center">
          Authentication is not configured. Set Supabase env vars.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error: signInError } = await supabase!.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    let dest = from;
    if (!dest && data.user) {
      const { data: profile } = await supabase!
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      dest = profile?.role === "teacher" ? "/portal/teacher" : "/portal";
    }
    router.push(dest ?? "/portal");
    router.refresh();
  }

  async function handleForgot() {
    if (!email) {
      setError("Enter your email above first, then click Forgot password.");
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });
    setLoading(false);
    if (resetError) setError(resetError.message);
    else setResetSent(true);
  }

  return (
    <AuthShell
      eyebrow="Sign in"
      heading="Welcome back."
      subheading="Open your sky and pick up where you left off."
      tagline={
        <>
          Per noctem ad lucem.<br />
          <span style={{ color: "#9aa5c0" }}>Through night to light.</span>
        </>
      }
      bottom={
        <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
          Don&rsquo;t have an account?{" "}
          <Link href="/portal/signup" className="font-medium" style={{ color: "var(--accent)" }}>
            Create one →
          </Link>
        </p>
      }
    >
      {resetSent ? (
        <div className="text-center py-2">
          <div
            className="w-11 h-11 rounded-full mx-auto mb-4 grid place-items-center"
            style={{
              background: "rgba(125, 211, 252, 0.10)",
              border: "1px solid rgba(125, 211, 252, 0.30)",
            }}
          >
            <span style={{ color: "#bde9ff", fontSize: 16 }}>✓</span>
          </div>
          <p className="font-[family-name:var(--font-fraunces)] text-[var(--text-1)] mb-2" style={{ fontSize: 18 }}>
            Check your email
          </p>
          <p className="text-[13px] leading-[1.7]" style={{ color: "var(--text-2)" }}>
            We sent a reset link to <span style={{ color: "var(--text-1)" }}>{email}</span>.
          </p>
          <button
            onClick={() => { setResetSent(false); setError(null); }}
            className="mt-5 font-mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--accent)", background: "transparent", border: "none", cursor: "pointer" }}
          >
            ← Back to sign in
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthError message={error} />
          <FormField label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={authInputClass()}
            />
          </FormField>
          <FormField label="Password">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={authInputClass() + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-3)", background: "transparent", border: "none" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleForgot}
              className="mt-2 font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "var(--text-3)", background: "transparent", border: "none" }}
            >
              Forgot password?
            </button>
          </FormField>
          <AuthSubmit loading={loading}>{loading ? "Signing in…" : "Sign in →"}</AuthSubmit>
        </form>
      )}
    </AuthShell>
  );
}
