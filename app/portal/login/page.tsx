"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import { NyxLockup } from "@/components/system";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/portal";

  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-[var(--text-2)] text-center">
          Authentication is not configured. Please set up Supabase environment variables.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(from);
      router.refresh();
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email address above, then click Forgot Password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,168,83,0.12) 0%, transparent 65%)",
      }} />

      {/* Back to site */}
      <div className="relative z-10 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to site
        </Link>
      </div>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[400px]">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <NyxLockup size="lg" variant="stacked" />
            </div>
            <h1 className="text-2xl font-medium text-[var(--text-1)] mb-1 font-[family-name:var(--font-fraunces)]">Welcome back</h1>
            <p className="text-[14px] text-[var(--text-2)]">Sign in to your Nyx portal</p>
          </div>

          {/* Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-7">
            {resetSent ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-400 text-lg">✓</span>
                </div>
                <p className="text-[var(--text-1)] font-semibold mb-1">Check your email</p>
                <p className="text-[13px] text-[var(--text-2)]">
                  We sent a password reset link to <strong className="text-[var(--text-1)]">{email}</strong>
                </p>
                <button
                  onClick={() => setResetSent(false)}
                  className="mt-4 text-[13px] text-[var(--accent)] hover:underline"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[var(--text-2)]">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] text-[14px] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[var(--text-2)]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full h-10 px-3.5 pr-10 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] text-[14px] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[12px] text-[var(--text-3)] hover:text-[var(--accent)] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full h-11 rounded-xl font-bold text-[14px] transition-all",
                    "bg-gradient-to-b from-[var(--accent-bright)] to-[var(--accent)] text-black",
                    "hover:from-[#e2c685] hover:to-[#cba961] shadow-lg shadow-[var(--accent-dim)] hover:shadow-[var(--accent-dim)]",
                    "disabled:opacity-60 disabled:cursor-not-allowed"
                  )}
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-[13px] text-[var(--text-3)] mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/portal/signup" className="text-[var(--accent)] hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
