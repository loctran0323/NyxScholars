import Link from "next/link";
import { ShieldCheck, Download, Trash2, Lock, FileSearch, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteAccountButton } from "./DeleteAccountButton";

export const metadata = {
  title: "Privacy & data",
  description: "Privacy policy, data export, account deletion, and parental consent.",
};

export default function LegalPage() {
  return (
    <div className="max-w-3xl">
      <header className="mb-8">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)] leading-tight">Privacy &amp; data controls</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Full visibility and control over the data Nyx stores about you. Self-serve export and deletion below.
        </p>
      </header>

      <Section title="Your rights" icon={ShieldCheck}>
        <p>
          Under <Link href="https://gdpr-info.eu/" className="text-[var(--accent)]">GDPR</Link>,{" "}
          <Link href="https://oag.ca.gov/privacy/ccpa" className="text-[var(--accent)]">CCPA</Link>, and US{" "}
          <Link href="https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa" className="text-[var(--accent)]">COPPA</Link>{" "}
          / <Link href="https://studentprivacy.ed.gov/ferpa" className="text-[var(--accent)]">FERPA</Link>, you can:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1.5">
          <li>Download every row of data we store about you (JSON).</li>
          <li>Permanently delete your account and all data tied to it.</li>
          <li>Update your information from <Link href="/portal/profile" className="text-[var(--accent)]">profile</Link> at any time.</li>
          <li>If you&apos;re under 13, a parent or guardian must consent before we collect anything.</li>
        </ul>
      </Section>

      <Section title="Export your data" icon={Download} accent="success">
        <p>
          We package every record tied to your account — profile, sessions, messages, diagnostic attempts,
          homework, notifications, spaced-repetition cards — into a single JSON file. No middlemen.
        </p>
        <Button variant="primary" asChild className="mt-4">
          <a href="/api/portal/data-export">Download my data (JSON)</a>
        </Button>
      </Section>

      <Section title="Delete your account" icon={Trash2} accent="danger">
        <p>
          This is irreversible. We deactivate your auth session, then cascade-delete every record under
          your user id. Stripe records are retained per their financial-records obligations.
        </p>
        <DeleteAccountButton />
      </Section>

      <Section title="Parental consent (under 13)" icon={Lock}>
        <p>
          If the student is under 13, we send their parent / guardian a one-time consent form before
          collecting anything beyond the email used to create the account. Reach{" "}
          <Link href="/portal/profile" className="text-[var(--accent)]">profile</Link> to add a parent
          email; we&apos;ll handle the rest automatically.
        </p>
      </Section>

      <Section title="Audit log" icon={FileSearch}>
        <p>
          Every meaningful change to your account — billing, role, tutor assignment, data export, deletion —
          is recorded in our audit log. Email{" "}
          <a href="mailto:hello@nyxscholars.com" className="text-[var(--accent)]">hello@nyxscholars.com</a>{" "}
          to request your trail.
        </p>
      </Section>

      <Section title="Privacy policy" icon={BookOpen}>
        <p>
          We collect what we need to deliver tutoring, never sell your data, never use it to train
          third-party models without explicit opt-in, and retain it only as long as required by law or by
          legitimate business need (financial records up to 7 years; everything else deletable on
          request).
        </p>
        <p className="mt-3">
          Full text: <Link href="/legal/privacy" className="text-[var(--accent)]">Privacy policy</Link> ·{" "}
          <Link href="/legal/terms" className="text-[var(--accent)]">Terms of service</Link> ·{" "}
          <Link href="/legal/dpa"   className="text-[var(--accent)]">Data processing addendum</Link>
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: "success" | "danger";
  children: React.ReactNode;
}) {
  const tint =
    accent === "danger"  ? "border-[var(--danger)]/35 bg-[var(--danger-soft)]"  :
    accent === "success" ? "border-[var(--success)]/35 bg-[var(--success-soft)]" :
                           "border-[var(--border)] bg-[var(--surface)]";
  const iconColor =
    accent === "danger"  ? "text-[var(--danger)]"  :
    accent === "success" ? "text-[var(--success)]" :
                           "text-[var(--accent)]";
  return (
    <section className={`rounded-2xl border ${tint} p-6 mb-5 text-[var(--text-1)] text-[14px] leading-relaxed`}>
      <h2 className="text-[15px] font-semibold mb-3 flex items-center gap-2">
        <Icon size={15} className={iconColor} />
        {title}
      </h2>
      <div className="text-[13.5px] text-[var(--text-2)] space-y-2">{children}</div>
    </section>
  );
}

