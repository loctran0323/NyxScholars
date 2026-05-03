"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/system/Toast";

export function DeleteAccountButton() {
  const { toast } = useToast();
  const router = useRouter();
  const [confirmText, setConfirmText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const ready = confirmText.trim().toLowerCase() === "delete";

  async function go() {
    if (!ready) {
      toast({ title: "Type DELETE to confirm.", variant: "warning" });
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/portal/account", { method: "DELETE" });
    setSubmitting(false);
    if (!res.ok) {
      toast({ title: "Delete failed", description: "Try again or email hello@nyxscholars.com.", variant: "error" });
      return;
    }
    toast({ title: "Account deleted", description: "We've signed you out.", variant: "success" });
    router.push("/");
  }

  return (
    <div className="mt-4 space-y-3">
      <label className="text-[12.5px] font-medium text-[var(--text-2)] block">
        Type <span className="font-mono uppercase text-[var(--danger)]">DELETE</span> to confirm
      </label>
      <input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="DELETE"
        className="w-full max-w-xs h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 text-[13.5px] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)]/30"
      />
      <Button
        variant="destructive"
        loading={submitting}
        disabled={!ready}
        onClick={go}
      >
        <Trash2 size={14} /> Delete account permanently
      </Button>
    </div>
  );
}
