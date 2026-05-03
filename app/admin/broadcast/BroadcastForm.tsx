"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/system/Toast";

export function BroadcastForm() {
  const { toast } = useToast();
  const [audience, setAudience] = React.useState<"all" | "students" | "tutors" | "active" | "lapsed">("all");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [href, setHref] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function send() {
    if (title.length < 1) {
      toast({ title: "Title required.", variant: "warning" });
      return;
    }
    if (!confirm(`Send this notification to the "${audience}" audience? This cannot be undone.`)) return;
    setSubmitting(true);
    const res = await fetch("/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audience, title, body: body || undefined, href: href || undefined }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      toast({ title: "Couldn't broadcast", description: data.error ?? "—", variant: "error" });
      return;
    }
    toast({ title: `Sent to ${data.recipients}`, variant: "success" });
    setTitle(""); setBody(""); setHref("");
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
      <div>
        <Label className="mb-1.5 block">Audience</Label>
        <Select value={audience} onValueChange={(v) => setAudience(v as typeof audience)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All users</SelectItem>
            <SelectItem value="students">All students</SelectItem>
            <SelectItem value="tutors">All tutors</SelectItem>
            <SelectItem value="active">Active payers</SelectItem>
            <SelectItem value="lapsed">Lapsed (cancelled)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-1.5 block">Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="May SAT registration deadline reminder" />
      </div>
      <div>
        <Label className="mb-1.5 block">Body</Label>
        <Textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Optional — one or two sentences." />
      </div>
      <div>
        <Label className="mb-1.5 block">Click-through URL (optional)</Label>
        <Input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/portal/schedule" />
      </div>
      <Button variant="primary" loading={submitting} onClick={send}>
        <Send size={13} /> Broadcast
      </Button>
    </div>
  );
}
