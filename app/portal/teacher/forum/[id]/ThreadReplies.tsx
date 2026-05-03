"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/system/Toast";

export function ThreadReplies({ threadId }: { threadId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [body, setBody] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function send() {
    if (body.trim().length < 1) return;
    setSubmitting(true);
    const res = await fetch(`/api/portal/forum/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    setSubmitting(false);
    if (!res.ok) {
      toast({ title: "Couldn't post reply", variant: "error" });
      return;
    }
    setBody("");
    router.refresh();
    toast({ title: "Reply posted", variant: "success", durationMs: 1500 });
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-[13px] font-semibold text-[var(--text-1)] mb-2">Add a reply</p>
      <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share what worked, ask a follow-up, or push back." />
      <div className="mt-3 flex justify-end">
        <Button variant="primary" loading={submitting} onClick={send}>
          <Send size={13} /> Post
        </Button>
      </div>
    </div>
  );
}
