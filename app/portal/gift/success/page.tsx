import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function GiftSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const isMock = params.mock === "1";
  const amount = typeof params.amt === "string" ? Number(params.amt) / 100 : null;

  return (
    <div className="max-w-lg mx-auto pt-12 text-center">
      <div className="w-14 h-14 rounded-full bg-[var(--success-soft)] border border-[var(--success)]/25 grid place-items-center mx-auto mb-5">
        <CheckCircle2 size={26} className="text-[var(--success)]" />
      </div>
      <h1 className="text-[26px] font-semibold text-[var(--text-1)] mb-2">Gift card on the way.</h1>
      <p className="text-[14px] text-[var(--text-2)] leading-relaxed">
        We've kicked off the email and added a receipt to your inbox.
        {isMock && " (Dev mode — Stripe not configured.)"}
        {amount != null && ` Amount: $${amount.toFixed(0)}.`}
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link
          href="/portal"
          className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[13px] font-semibold text-[var(--text-1)] hover:border-[var(--border-2)]"
        >
          Back to dashboard
        </Link>
        <Link
          href="/portal/gift"
          className="px-4 py-2 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[13px] font-semibold text-[var(--accent)] hover:bg-[var(--accent-dim)]"
        >
          Send another
        </Link>
      </div>
    </div>
  );
}
