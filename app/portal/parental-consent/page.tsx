import Link from "next/link";
import { ShieldCheck, AlertCircle, Mail } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ParentalConsentForm } from "./ParentalConsentForm";

export const metadata = {
  title: "Parental consent",
  description: "Confirm parental consent so your student can use the Nyx portal.",
};

export default async function ParentalConsentPage() {
  const sb = await getSupabaseServerClient();
  if (!sb) redirect("/portal/login");
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await sb
    .from("profiles")
    .select("parent_name, parent_email, parental_consent_at, full_name")
    .eq("id", user.id)
    .single();

  const consented = !!profile?.parental_consent_at;

  return (
    <div className="max-w-2xl">
      <header className="mb-7">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)] leading-tight flex items-center gap-2">
          <ShieldCheck size={20} className="text-[var(--accent)]" />
          Parental consent
        </h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Required by COPPA / FERPA when the student is under 13. We won&apos;t collect anything beyond
          the email used to sign in until consent is on file.
        </p>
      </header>

      {consented ? (
        <div className="rounded-2xl border border-[var(--success)]/35 bg-[var(--success-soft)] p-5 mb-6">
          <p className="text-[14px] font-semibold text-[var(--text-1)] flex items-center gap-2">
            <ShieldCheck size={15} className="text-[var(--success)]" /> Consent on file
          </p>
          <p className="text-[12.5px] text-[var(--text-2)] mt-1">
            Recorded {new Date(profile!.parental_consent_at!).toLocaleDateString()}. To withdraw, email{" "}
            <a href="mailto:hello@nyxscholars.com" className="text-[var(--accent)]">hello@nyxscholars.com</a>.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--warning)]/35 bg-[var(--warning-soft)] p-5 mb-6 flex items-start gap-3">
          <AlertCircle size={16} className="text-[var(--warning)] mt-0.5 shrink-0" />
          <div className="text-[13px] text-[var(--text-1)] leading-relaxed">
            We&apos;ll email the parent / guardian for explicit consent. Until that&apos;s recorded, scheduling and
            messaging are read-only.
          </div>
        </div>
      )}

      <ParentalConsentForm
        defaultParentName={profile?.parent_name ?? ""}
        defaultParentEmail={profile?.parent_email ?? ""}
        studentName={profile?.full_name ?? ""}
      />

      <div className="mt-6 text-[12.5px] text-[var(--text-3)]">
        Questions? <Link href="/portal/legal" className="text-[var(--accent)]">Read our privacy policy</Link>{" "}
        or email{" "}
        <a href="mailto:privacy@nyxscholars.com" className="text-[var(--accent)] inline-flex items-center gap-1">
          <Mail size={11} /> privacy@nyxscholars.com
        </a>
        .
      </div>
    </div>
  );
}
