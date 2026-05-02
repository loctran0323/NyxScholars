"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { AuthShell, FormField, authInputClass, AuthError, AuthSubmit } from "@/components/portal/AuthShell";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error: signUpError } = await supabase!.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase!.from("profiles").upsert({
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
  }

  return (
    <AuthShell
      eyebrow={`Create account · step ${step} of 2`}
      heading="Light your first star."
      subheading="Your account is the entry point to the constellation map you'll build with your tutor."
      tagline={
        <>
          The night teaches.<br />
          <span style={{ color: "#9aa5c0" }}>One session at a time.</span>
        </>
      }
      bottom={
        <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
          Already have an account?{" "}
          <Link href="/portal/login" className="font-medium" style={{ color: "var(--accent)" }}>
            Sign in →
          </Link>
        </p>
      }
    >
      {success ? (
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
          <p className="font-[family-name:var(--font-fraunces)] text-[var(--text-1)] mb-2" style={{ fontSize: 20 }}>
            Check your inbox
          </p>
          <p className="text-[13.5px] leading-[1.7]" style={{ color: "var(--text-2)" }}>
            We sent a confirmation link to <span style={{ color: "var(--text-1)" }}>{email}</span>. Click it to activate your account.
          </p>
          <Link
            href="/portal/login"
            className="mt-6 inline-block font-mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            Go to sign in →
          </Link>
        </div>
      ) : (
        <>
          {/* Step indicator */}
          <div className="flex gap-2 mb-7">
            {[1, 2].map((s) => (
              <div
                key={s}
                className="flex-1 h-[2px] rounded overflow-hidden"
                style={{ background: "rgba(230, 233, 245, 0.07)" }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: step >= s ? "100%" : "0%",
                    background: "linear-gradient(90deg, #3b7a99, #7dd3fc, #bde9ff)",
                    boxShadow: step >= s ? "0 0 6px #7dd3fc" : "none",
                  }}
                />
              </div>
            ))}
          </div>

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-5">
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
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
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
              </FormField>
              <FormField label="Confirm password">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={authInputClass()}
                />
              </FormField>
              <AuthSubmit>Continue →</AuthSubmit>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthError message={error} />
              <FormField label="Full name">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className={authInputClass()}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Grade">
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className={authInputClass()}
                  >
                    <option value="">Select</option>
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </FormField>
                <FormField label="Target test">
                  <select
                    value={targetTest}
                    onChange={(e) => setTargetTest(e.target.value as "SAT" | "ACT" | "")}
                    className={authInputClass()}
                  >
                    <option value="">Select</option>
                    <option value="SAT">SAT</option>
                    <option value="ACT">ACT</option>
                  </select>
                </FormField>
              </div>
              <FormField label="School" optional>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Your high school"
                  className={authInputClass()}
                />
              </FormField>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 rounded-[10px] font-mono uppercase tracking-[0.18em] transition-all"
                  style={{
                    background: "transparent",
                    color: "var(--text-2)",
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                >
                  ← Back
                </button>
                <div className="flex-1">
                  <AuthSubmit loading={loading}>{loading ? "Creating…" : "Create account →"}</AuthSubmit>
                </div>
              </div>
            </form>
          )}
        </>
      )}
    </AuthShell>
  );
}
