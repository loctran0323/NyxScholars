"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpenPortalButtonProps {
  variant?: "primary" | "outline";
  label?: string;
  className?: string;
}

/**
 * Tiny client island that calls the Stripe billing portal API and redirects
 * the browser to the hosted session. Used in multiple places on the billing
 * page so it lives on its own.
 */
export function OpenPortalButton({
  variant = "primary",
  label = "Manage in Stripe",
  className,
}: OpenPortalButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function open() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/portal/billing", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not open billing portal.");
        return;
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className={className}>
      <Button variant={variant} loading={loading} onClick={open}>
        {label} <ExternalLink size={14} />
      </Button>
      {error && (
        <span className="block text-[12px] text-[var(--danger)] mt-2">{error}</span>
      )}
    </span>
  );
}
