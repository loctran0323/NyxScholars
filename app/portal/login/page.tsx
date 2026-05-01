"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

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
        <p className="text-[#8d9ab0] text-center">
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
          className="inline-flex items-center gap-2 text-[13px] text-[#8d9ab0] hover:text-[#f0ece3] transition-colors"
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4a853] to-[#a07830] shadow-lg shadow-[#d4a853]/25 flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-black text-lg">N</span>
            </div>
            <h1 className="text-2xl font-bold text-[#f0ece3] mb-1">Welcome back</h1>
            <p className="text-[14px] text-[#8d9ab0]">Sign in to your Nyx Scholars portal</p>
          </div>

          {/* Card */}
          <div className="bg-[#0f1521] border border-white/[0.08] rounded-2xl p-7">
            {resetSent ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-400 text-lg">✓</span>
                </div>
                <p className="text-[#f0ece3] font-semibold mb-1">Check your email</p>
                <p className="text-[13px] text-[#8d9ab0]">
                  We sent a password reset link to <strong className="text-[#f0ece3]">{email}</strong>
                </p>
                <button
                  onClick={() => setResetSent(false)}
                  className="mt-4 text-[13px] text-[#d4a853] hover:underline"
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
                  <label className="block text-[13px] font-medium text-[#8d9ab0]">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#8d9ab0]">
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
                      className="w-full h-10 px-3.5 pr-10 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4e5d72] hover:text-[#8d9ab0] transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[12px] text-[#4e5d72] hover:text-[#d4a853] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full h-11 rounded-xl font-bold text-[14px] transition-all",
                    "bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black",
                    "hover:from-[#eac068] hover:to-[#d4a045] shadow-lg shadow-[#d4a853]/20 hover:shadow-[#d4a853]/35",
                    "disabled:opacity-60 disabled:cursor-not-allowed"
                  )}
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-[13px] text-[#4e5d72] mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/portal/signup" className="text-[#d4a853] hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
