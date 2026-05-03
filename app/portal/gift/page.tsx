"use client";

import * as React from "react";
import { Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PortalHero } from "@/components/portal/PortalHero";
import {
  GIFT_CARD_PRESETS_CENTS,
  GIFT_CARD_MIN_CENTS,
  GIFT_CARD_MAX_CENTS,
  fmtUsd,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/system/Toast";
import { track, EVENTS } from "@/lib/analytics";

export default function GiftCardPage() {
  const { toast } = useToast();
  const [amountCents, setAmountCents] = React.useState<number>(GIFT_CARD_PRESETS_CENTS[1]);
  const [customDollars, setCustomDollars] = React.useState<string>("");
  const [recipientName, setRecipientName] = React.useState("");
  const [recipientEmail, setRecipientEmail] = React.useState("");
  const [senderName, setSenderName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [deliverAt, setDeliverAt] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);

  function setCustom(value: string) {
    setCustomDollars(value);
    const cents = Math.round(Number(value || "0") * 100);
    if (Number.isFinite(cents) && cents >= GIFT_CARD_MIN_CENTS && cents <= GIFT_CARD_MAX_CENTS) {
      setAmountCents(cents);
    }
  }

  async function purchase(e: React.FormEvent) {
    e.preventDefault();
    if (!recipientName || !recipientEmail || !senderName) {
      toast({ title: "Missing fields", description: "Recipient and sender are required.", variant: "warning" });
      return;
    }
    setSubmitting(true);
    track(EVENTS.GIFT_CARD_PURCHASED, { amountCents });
    try {
      const res = await fetch("/api/gift-cards/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents,
          recipientName,
          recipientEmail,
          senderName,
          message,
          deliverAt: deliverAt || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Could not start checkout", description: data.error ?? "Try again.", variant: "error" });
        return;
      }
      window.location.assign(data.url);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PortalHero
        eyebrow="Portal"
        title="Gift card"
        italic="for someone you love"
        subtitle="The recipient gets a code by email and can apply it to any plan at checkout."
      />

      <form onSubmit={purchase} className="space-y-6">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-[14.5px] font-semibold text-[var(--text-1)] mb-4">Choose an amount</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
            {GIFT_CARD_PRESETS_CENTS.map((cents) => (
              <button
                key={cents}
                type="button"
                onClick={() => {
                  setAmountCents(cents);
                  setCustomDollars("");
                }}
                className={cn(
                  "h-12 rounded-xl border text-[13px] font-semibold transition-colors",
                  amountCents === cents && !customDollars
                    ? "bg-[var(--accent-dim)] border-[var(--border-accent)] text-[var(--accent)]"
                    : "bg-[var(--bg-2)] border-[var(--border)] text-[var(--text-1)] hover:border-[var(--border-2)]",
                )}
              >
                {fmtUsd(cents)}
              </button>
            ))}
          </div>
          <Label htmlFor="custom-amt" className="mb-1.5 block">Or enter a custom amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] text-[14px]">$</span>
            <Input
              id="custom-amt"
              type="number"
              min={GIFT_CARD_MIN_CENTS / 100}
              max={GIFT_CARD_MAX_CENTS / 100}
              step={5}
              value={customDollars}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="250"
              className="pl-6"
            />
          </div>
          <p className="text-[11.5px] text-[var(--text-3)] mt-1.5">
            Between {fmtUsd(GIFT_CARD_MIN_CENTS)} and {fmtUsd(GIFT_CARD_MAX_CENTS)}.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <h2 className="text-[14.5px] font-semibold text-[var(--text-1)]">Who's it for?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="r-name" className="mb-1.5 block">Recipient name</Label>
              <Input id="r-name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Maya Chen" />
            </div>
            <div>
              <Label htmlFor="r-email" className="mb-1.5 block">Recipient email</Label>
              <Input id="r-email" type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="maya@example.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="s-name" className="mb-1.5 block">Your name (so they know who sent it)</Label>
            <Input id="s-name" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Mom" />
          </div>
          <div>
            <Label htmlFor="msg" className="mb-1.5 block">Personal note (optional)</Label>
            <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Proud of you. Knock the SAT out of the park." />
          </div>
          <div>
            <Label htmlFor="deliver" className="mb-1.5 block">Schedule delivery (optional)</Label>
            <Input id="deliver" type="datetime-local" value={deliverAt} onChange={(e) => setDeliverAt(e.target.value)} />
            <p className="text-[11.5px] text-[var(--text-3)] mt-1.5">Leave empty to send immediately on purchase.</p>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[var(--text-2)]">
            Total today: <span className="font-semibold text-[var(--text-1)]">{fmtUsd(amountCents)}</span>
          </p>
          <Button type="submit" variant="primary" loading={submitting}>
            Continue to checkout <ArrowRight size={14} />
          </Button>
        </div>
      </form>
    </div>
  );
}
