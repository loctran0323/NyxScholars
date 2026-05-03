"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/system/Toast";

export function ParentalConsentForm({
  defaultParentName,
  defaultParentEmail,
  studentName,
}: {
  defaultParentName: string;
  defaultParentEmail: string;
  studentName: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [parentName, setParentName] = React.useState(defaultParentName);
  const [parentEmail, setParentEmail] = React.useState(defaultParentEmail);
  const [submitting, setSubmitting] = React.useState(false);

  async function send() {
    if (!parentName.trim() || !parentEmail.trim()) {
      toast({ title: "Parent name and email are required.", variant: "warning" });
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/portal/parental-consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parent_name: parentName, parent_email: parentEmail, student_name: studentName }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ title: "Couldn't send", description: data.error ?? "Try again.", variant: "error" });
      return;
    }
    toast({ title: "Email sent", description: "Parent will receive a one-click consent link.", variant: "success" });
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block">Parent / guardian name</Label>
          <Input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Sara Chen" />
        </div>
        <div>
          <Label className="mb-1.5 block">Parent email</Label>
          <Input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="parent@example.com" />
        </div>
      </div>
      <Button variant="primary" loading={submitting} onClick={send}>
        <Send size={13} /> Send consent email
      </Button>
    </div>
  );
}
