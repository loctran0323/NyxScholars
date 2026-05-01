"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle, Key } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

const GRADES = ["8", "9", "10", "11", "12", "College Freshman", "Other"];

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [phone, setPhone] = useState("");
  const [targetTest, setTargetTest] = useState<"SAT" | "ACT" | "">("");
  const [targetScore, setTargetScore] = useState("");
  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setGrade(profile.grade ?? "");
        setSchool(profile.school ?? "");
        setPhone(profile.phone ?? "");
        setTargetTest(profile.target_test ?? "");
        setTargetScore(profile.target_score ?? "");
      }
    };
    load();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError("");

    const res = await fetch("/api/portal/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName || null,
        grade: grade || null,
        school: school || null,
        phone: phone || null,
        target_test: targetTest || null,
        target_score: targetScore || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to save profile.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    setChangingPassword(true);
    setPasswordError("");

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSaved(true);
      setNewPassword("");
      setTimeout(() => setPasswordSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div className="mb-7">
        <p className="text-[13px] text-[#4e5d72] uppercase tracking-wider font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-bold text-[#f0ece3]">Profile Settings</h1>
        <p className="text-[14px] text-[#8d9ab0] mt-1">
          Update your information so we can personalize your experience.
        </p>
      </div>

      {/* Profile form */}
      <div className="bg-[#0f1521] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-[15px] font-semibold text-[#f0ece3] mb-5">Personal Information</h2>

        <form onSubmit={handleSave} className="space-y-4">
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
              disabled
              className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a]/60 border border-white/[0.05] text-[14px] text-[#4e5d72] cursor-not-allowed"
            />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#8d9ab0]">Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 transition-all cursor-pointer"
              >
                <option value="">Select grade</option>
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
                <option value="">Select test</option>
                <option value="SAT">SAT</option>
                <option value="ACT">ACT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#8d9ab0]">
                Target score <span className="text-[#4e5d72] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                placeholder={targetTest === "ACT" ? "e.g. 34" : "e.g. 1500"}
                className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#8d9ab0]">
                Phone <span className="text-[#4e5d72] font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all"
              />
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

          <button
            type="submit"
            disabled={saving}
            className={cn(
              "w-full h-11 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all",
              saved
                ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400"
                : "bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black hover:from-[#eac068] hover:to-[#d4a045] shadow-lg shadow-[#d4a853]/15",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            {saved ? (
              <><CheckCircle size={16} /> Saved!</>
            ) : (
              <><Save size={16} /> {saving ? "Saving…" : "Save Changes"}</>
            )}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-[#0f1521] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-[15px] font-semibold text-[#f0ece3] mb-1 flex items-center gap-2">
          <Key size={15} className="text-[#4e5d72]" />
          Change Password
        </h2>
        <p className="text-[12px] text-[#4e5d72] mb-5">Set a new password for your account.</p>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {passwordError && (
            <div className="px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
              {passwordError}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#8d9ab0]">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={changingPassword || !newPassword}
            className={cn(
              "w-full h-10 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all border",
              passwordSaved
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-white/[0.05] border-white/[0.1] text-[#c8d0de] hover:border-white/[0.18] hover:text-[#f0ece3]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {passwordSaved ? (
              <><CheckCircle size={14} /> Password updated!</>
            ) : (
              <>{changingPassword ? "Updating…" : "Update Password"}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
