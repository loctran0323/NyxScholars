import Link from "next/link";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  CreditCard, FileText, ShieldCheck, ExternalLink, AlertTriangle,
  CheckCircle2, Clock, Receipt,
} from "lucide-react";
import type Stripe from "stripe";
import { PortalHero } from "@/components/portal/PortalHero";
import { PortalSection } from "@/components/portal/PortalSection";
import { Badge } from "@/components/ui/badge";
import { OpenPortalButton } from "./OpenPortalButton";
import { requirePortalUser } from "@/lib/portal-auth";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { planLabel } from "@/lib/sessions";
import type { Profile } from "@/types/portal";

export const metadata = { title: "Billing · Nyx" };

interface BillingData {
  customerId:    string | null;
  subscription:  Stripe.Subscription | null;
  paymentMethod: Stripe.PaymentMethod | null;
  invoices:      Stripe.Invoice[];
}

async function loadBillingData(userId: string, email: string | undefined, profile: Profile | null): Promise<BillingData> {
  if (!isStripeConfigured()) {
    return { customerId: null, subscription: null, paymentMethod: null, invoices: [] };
  }
  const stripe = getStripe();

  // Resolve the customer id. Stored on profile.notif_prefs.stripe_customer_id
  // by /api/portal/billing on first portal-open or by webhook on first checkout.
  const meta = (profile?.notif_prefs ?? {}) as Record<string, unknown> | undefined;
  let customerId = meta && typeof meta.stripe_customer_id === "string" ? meta.stripe_customer_id : null;

  if (!customerId && email) {
    // Fall back to looking up by email so returning customers see their data
    // even before they re-trigger the portal session.
    const found = await stripe.customers.list({ email, limit: 1 });
    customerId = found.data[0]?.id ?? null;
  }

  if (!customerId) {
    return { customerId: null, subscription: null, paymentMethod: null, invoices: [] };
  }

  const [subsResponse, invoicesResponse, customerResponse] = await Promise.all([
    stripe.subscriptions.list({
      customer: customerId,
      status:   "all",
      limit:    1,
      expand:   ["data.default_payment_method", "data.items.data.price.product"],
    }),
    stripe.invoices.list({ customer: customerId, limit: 12 }),
    stripe.customers.retrieve(customerId, { expand: ["invoice_settings.default_payment_method"] }),
  ]);

  const subscription = subsResponse.data[0] ?? null;
  let paymentMethod: Stripe.PaymentMethod | null = null;
  const customer = customerResponse as Stripe.Customer;
  const defaultPm = customer.invoice_settings?.default_payment_method;
  if (defaultPm && typeof defaultPm === "object") paymentMethod = defaultPm as Stripe.PaymentMethod;
  else if (subscription?.default_payment_method && typeof subscription.default_payment_method === "object") {
    paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod;
  }

  void userId;
  return { customerId, subscription, paymentMethod, invoices: invoicesResponse.data };
}

export default async function BillingPage() {
  const { supabase, user } = await requirePortalUser();
  const { data: profileRow } = await supabase
    .from("profiles").select("plan, plan_status, notif_prefs")
    .eq("id", user.id).maybeSingle();
  const profile = profileRow as Profile | null;

  const billing = await loadBillingData(user.id, user.email ?? undefined, profile);
  const sub = billing.subscription;
  const pm  = billing.paymentMethod;

  return (
    <div className="space-y-10">
      <PortalHero
        eyebrow="Portal"
        title="Billing"
        italic="& invoices"
        subtitle="Your plan, payment method, and full receipt history. Anything that touches your card runs through Stripe — we never see the number."
        actions={<OpenPortalButton variant="outline" label="Manage in Stripe" />}
      />

      <PortalSection label="Current plan">
        <PlanCard
          plan={profile?.plan ?? null}
          planStatus={profile?.plan_status ?? null}
          subscription={sub}
        />
      </PortalSection>

      <PortalSection label="Payment method">
        {pm ? <PaymentMethodCard method={pm} /> : <NoPaymentMethodCard />}
      </PortalSection>

      <PortalSection
        label="Invoices"
        action={billing.invoices.length > 0 ? <span>{billing.invoices.length} most recent</span> : null}
      >
        {billing.invoices.length === 0 ? (
          <EmptyInvoicesCard configured={isStripeConfigured() && !!billing.customerId} />
        ) : (
          <InvoicesTable invoices={billing.invoices} />
        )}
      </PortalSection>

      <PortalSection label="Reassurances">
        <div className="grid sm:grid-cols-3 gap-3">
          <BillingFeature
            icon={ShieldCheck}
            title="PCI-safe by Stripe"
            description="Your card never touches our servers. Stripe stores it under PCI DSS Level 1."
          />
          <BillingFeature
            icon={Receipt}
            title="Tax receipts on every charge"
            description="Each invoice doubles as a receipt — download the PDF anytime."
          />
          <BillingFeature
            icon={Clock}
            title="Cancel anytime"
            description="Cancel from the Stripe portal — access continues until the end of the period."
          />
        </div>
      </PortalSection>

      <p className="text-[12.5px] text-[var(--text-3)]">
        Questions? <a href="mailto:hello@nyxscholars.com?subject=Billing%20question" className="text-[var(--accent)] hover:text-[var(--accent-bright)]">Email billing</a>
        {" "}— responses within one business day.
      </p>
    </div>
  );
}

/* ─────────── Plan card ─────────── */

function PlanCard({
  plan, planStatus, subscription,
}: {
  plan: string | null;
  planStatus: string | null;
  subscription: Stripe.Subscription | null;
}) {
  const status = subscription?.status ?? planStatus ?? null;
  const cancelling = subscription?.cancel_at_period_end ?? false;
  const item = subscription?.items.data[0];
  const price = item?.price;
  const periodEnd = item?.current_period_end ?? null;
  const product = price?.product && typeof price.product === "object" ? (price.product as Stripe.Product) : null;
  const planName = product?.name ?? planLabel(plan);
  const amount = price?.unit_amount != null
    ? formatMoney(price.unit_amount, price.currency, price.recurring?.interval)
    : null;

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-[18px] font-semibold text-[var(--text-1)]">{planName}</h2>
            <PlanBadge status={status} cancelling={cancelling} />
          </div>
          {amount && (
            <p className="text-[14px] text-[var(--text-2)] mt-1">{amount}</p>
          )}
          {!subscription && plan && (
            <p className="text-[13px] text-[var(--text-3)] mt-1">
              Plan recorded locally. Stripe subscription record will appear here once your first invoice posts.
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <OpenPortalButton variant="primary" label={cancelling ? "Resume" : "Change plan"} />
          {periodEnd && (
            <p className="text-[11.5px] text-[var(--text-3)]">
              {cancelling ? "Ends " : "Renews "}
              {format(new Date(periodEnd * 1000), "MMM d, yyyy")}
              {" · "}
              {formatDistanceToNowStrict(new Date(periodEnd * 1000), { addSuffix: true })}
            </p>
          )}
        </div>
      </div>
      {!plan && !subscription && (
        <Link
          href="/portal/upgrade"
          className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-[var(--accent)] hover:text-[var(--accent-bright)]"
        >
          Choose a plan to start →
        </Link>
      )}
    </article>
  );
}

function PlanBadge({ status, cancelling }: { status: string | null; cancelling: boolean }) {
  if (cancelling) return <Badge variant="gold">Ends at period end</Badge>;
  if (!status)    return <Badge variant="default">No subscription</Badge>;
  if (status === "active" || status === "trialing")  return <Badge variant="green">Active</Badge>;
  if (status === "past_due" || status === "unpaid")  return <Badge variant="red">Action needed</Badge>;
  if (status === "canceled" || status === "cancelled") return <Badge variant="default">Cancelled</Badge>;
  if (status === "paused")  return <Badge variant="gold">Paused</Badge>;
  return <Badge variant="default">{status}</Badge>;
}

/* ─────────── Payment method ─────────── */

function PaymentMethodCard({ method }: { method: Stripe.PaymentMethod }) {
  const card = method.card;
  if (!card) {
    return (
      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex items-center gap-4">
        <CreditCard size={20} className="text-[var(--text-3)]" />
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[var(--text-1)]">{method.type.replace("_", " ")} on file</p>
          <p className="text-[12px] text-[var(--text-3)] mt-0.5">Manage in Stripe to view details.</p>
        </div>
        <OpenPortalButton variant="outline" label="Update" />
      </article>
    );
  }
  const exp = `${String(card.exp_month).padStart(2, "0")}/${String(card.exp_year).slice(-2)}`;
  const expSoon = isExpiringSoon(card.exp_year, card.exp_month);
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex items-center gap-4 flex-wrap">
      <div className="w-12 h-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] grid place-items-center shrink-0">
        <CreditCard size={20} className="text-[var(--text-2)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[var(--text-1)]">
          {capitalize(card.brand)} ending in {card.last4}
        </p>
        <p className="text-[12px] text-[var(--text-3)] mt-0.5 flex items-center gap-2 flex-wrap">
          Expires {exp}
          {expSoon && (
            <Badge variant="gold" size="sm">
              <AlertTriangle size={10} /> Expires soon
            </Badge>
          )}
        </p>
      </div>
      <OpenPortalButton variant="outline" label="Update card" />
    </article>
  );
}

function NoPaymentMethodCard() {
  return (
    <article className="rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface)]/50 p-6 flex items-center gap-4 flex-wrap">
      <div className="w-12 h-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] grid place-items-center shrink-0">
        <CreditCard size={20} className="text-[var(--text-3)]" />
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-[var(--text-1)]">No card on file yet</p>
        <p className="text-[12.5px] text-[var(--text-2)] mt-0.5 leading-relaxed">
          Add one when you start a plan — checkout takes the card and stores it for future renewals.
        </p>
      </div>
      <Link
        href="/portal/upgrade"
        className="text-[12.5px] font-semibold text-[var(--accent)] hover:text-[var(--accent-bright)] px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-accent)] transition-colors"
      >
        Choose a plan →
      </Link>
    </article>
  );
}

/* ─────────── Invoices ─────────── */

function InvoicesTable({ invoices }: { invoices: Stripe.Invoice[] }) {
  return (
    <ul className="rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
      {invoices.map((inv) => (
        <li key={inv.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--surface)] transition-colors">
          <div className="w-9 h-9 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] grid place-items-center shrink-0">
            <InvoiceIcon status={inv.status} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-[13.5px] font-semibold text-[var(--text-1)]">
                {formatMoney(inv.amount_paid || inv.amount_due, inv.currency)}
              </p>
              <InvoiceBadge status={inv.status} />
            </div>
            <p className="text-[11.5px] text-[var(--text-3)] mt-0.5">
              {inv.created ? format(new Date(inv.created * 1000), "MMM d, yyyy") : "—"}
              {inv.number ? ` · #${inv.number}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {inv.hosted_invoice_url && (
              <a
                href={inv.hosted_invoice_url}
                target="_blank" rel="noreferrer noopener"
                className="text-[11.5px] font-semibold text-[var(--text-2)] hover:text-[var(--text-1)] flex items-center gap-1"
              >
                View <ExternalLink size={11} />
              </a>
            )}
            {inv.invoice_pdf && (
              <a
                href={inv.invoice_pdf}
                target="_blank" rel="noreferrer noopener"
                className="text-[11.5px] font-semibold text-[var(--accent)] hover:text-[var(--accent-bright)] flex items-center gap-1"
              >
                PDF <FileText size={11} />
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function InvoiceIcon({ status }: { status: Stripe.Invoice["status"] }) {
  if (status === "paid")  return <CheckCircle2 size={16} className="text-[var(--success)]" />;
  if (status === "open")  return <Clock         size={16} className="text-[var(--warning)]" />;
  if (status === "void" || status === "uncollectible")
    return <AlertTriangle size={16} className="text-[var(--danger)]" />;
  return <Receipt size={16} className="text-[var(--text-3)]" />;
}

function InvoiceBadge({ status }: { status: Stripe.Invoice["status"] }) {
  if (status === "paid")  return <Badge variant="green" size="sm">Paid</Badge>;
  if (status === "open")  return <Badge variant="gold"  size="sm">Open</Badge>;
  if (status === "void")  return <Badge variant="default" size="sm">Void</Badge>;
  if (status === "uncollectible") return <Badge variant="red" size="sm">Failed</Badge>;
  if (status === "draft") return <Badge variant="default" size="sm">Draft</Badge>;
  return <Badge variant="default" size="sm">{status ?? "—"}</Badge>;
}

function EmptyInvoicesCard({ configured }: { configured: boolean }) {
  return (
    <article className="rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface)]/50 p-7 text-center">
      <Receipt size={22} className="text-[var(--text-3)] mx-auto mb-3" />
      <p className="text-[13.5px] font-semibold text-[var(--text-1)]">
        {configured ? "No invoices yet." : "Billing isn't connected yet."}
      </p>
      <p className="text-[12.5px] text-[var(--text-2)] mt-1.5 max-w-sm mx-auto leading-relaxed">
        {configured
          ? "Receipts will appear here after your first charge."
          : "Stripe is not configured for this environment, so we can't show your billing history yet."}
      </p>
    </article>
  );
}

/* ─────────── Reassurance row ─────────── */

function BillingFeature({
  icon: Icon, title, description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[var(--text-3)]" />
        <p className="text-[13px] font-semibold text-[var(--text-1)]">{title}</p>
      </div>
      <p className="text-[12.5px] text-[var(--text-2)] leading-relaxed">{description}</p>
    </article>
  );
}

/* ─────────── helpers ─────────── */

function formatMoney(amountMinor: number, currency: string, interval?: string | null): string {
  try {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amountMinor / 100);
    return interval ? `${formatted} / ${interval}` : formatted;
  } catch {
    return `$${(amountMinor / 100).toFixed(2)}`;
  }
}

function isExpiringSoon(year: number, month: number): boolean {
  const now = new Date();
  const expiry = new Date(year, month - 1, 1);
  const diffMonths = (expiry.getFullYear() - now.getFullYear()) * 12 + (expiry.getMonth() - now.getMonth());
  return diffMonths <= 2;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
