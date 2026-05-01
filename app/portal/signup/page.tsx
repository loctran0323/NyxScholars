"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

const GRADES = ["8", "9", "10", "11", "12", "College Freshman", "Other"];

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [targetTest, setTargetTest] = useState<"SAT" | "ACT" | "">("");
  const [school, setSchool] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName || null,
        grade: grade || null,
        target_test: targetTest || null,
        school: school || null,
      });
    }

    setLoading(false);

    if (data.session) {
      router.push("/portal");
      router.refresh();
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pointer-events-none fixed inset-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,168,83,0.12) 0%, transparent 65%)",
      }} />

      <div className="relative z-10 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-[#8d9ab0] hover:text-[#f0ece3] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to site
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4a853] to-[#a07830] shadow-lg shadow-[#d4a853]/25 flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-black text-lg">N</span>
            </div>
            <h1 className="text-2xl font-bold text-[#f0ece3] mb-1">Create your account</h1>
            <p className="text-[14px] text-[#8d9ab0]">Join Nyx Scholars and start your prep journey</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6 px-1">
            {[1, 2].map((s) => (
              <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.06]">
                <div
                  className="h-full bg-gradient-to-r from-[#d4a853] to-[#c99438] transition-all duration-300"
                  style={{ width: step >= s ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>

          <div className="bg-[#0f1521] border border-white/[0.08] rounded-2xl p-7">
            {success ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-400 text-2xl">✓</span>
                </div>
                <p className="text-[#f0ece3] font-bold text-lg mb-2">Check your inbox</p>
                <p className="text-[13px] text-[#8d9ab0] leading-relaxed">
                  We sent a confirmation link to{" "}
                  <strong className="text-[#f0ece3]">{email}</strong>. Click it to activate your account.
                </p>
                <Link
                  href="/portal/login"
                  className="mt-5 inline-block text-[13px] text-[#d4a853] hover:underline"
                >
                  Go to sign in
                </Link>
              </div>
            ) : step === 1 ? (
              <form onSubmit={handleStep1} className="space-y-4">
                <p className="text-[12px] font-semibold text-[#4e5d72] uppercase tracking-wider mb-4">
                  Step 1 — Account credentials
                </p>
                {error && (
                  <div className="px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
                    {error}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#8d9ab0]">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#8d9ab0]">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Min. 8 characters"
                      className="w-full h-10 px-3.5 pr-10 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4e5d72] hover:text-[#8d9ab0] transition-colors">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#8d9ab0]">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all"
                  />
                </div>
                <button type="submit"
                  className="w-full h-11 rounded-xl font-bold text-[14px] bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black hover:from-[#eac068] hover:to-[#d4a045] shadow-lg shadow-[#d4a853]/20 transition-all">
                  Continue
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-[12px] font-semibold text-[#4e5d72] uppercase tracking-wider mb-4">
                  Step 2 — Your profile
                </p>
                {error && (
                  <div className="px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
                    {error}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#8d9ab0]">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-[#8d9ab0]">Grade</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 transition-all cursor-pointer"
                    >
                      <option value="">Select</option>
                      {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-[#8d9ab0]">Target test</label>
                    <select
                      value={targetTest}
                      onChange={(e) => setTargetTest(e.target.value as "SAT" | "ACT" | "")}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 transition-all cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="SAT">SAT</option>
                      <option value="ACT">ACT</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#8d9ab0]">
                    School <span className="text-[#4e5d72] font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Your high school"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 rounded-xl font-medium text-[14px] text-[#8d9ab0] bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "flex-1 h-11 rounded-xl font-bold text-[14px] bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black",
                      "hover:from-[#eac068] hover:to-[#d4a045] shadow-lg shadow-[#d4a853]/20 transition-all",
                      "disabled:opacity-60 disabled:cursor-not-allowed"
                    )}
                  >
                    {loading ? "Creating…" : "Create Account"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="text-center text-[13px] text-[#4e5d72] mt-5">
            Already have an account?{" "}
            <Link href="/portal/login" className="text-[#d4a853] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
