"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/system/Toast";

export default function NewThreadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [category, setCategory] = React.useState<"approach" | "lesson_plan" | "win_story" | "tools" | "other">("approach");
  const [submitting, setSubmitting] = React.useState(false);

  async function submit() {
    if (title.length < 3 || body.length < 10) {
      toast({ title: "Title and body required.", variant: "warning" });
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/portal/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, category }),
    });
    setSubmitting(false);
    if (!res.ok) {
      toast({ title: "Couldn't post", variant: "error" });
      return;
    }
    toast({ title: "Posted", variant: "success" });
    router.push("/portal/teacher/forum");
  }

  return (
    <div className="max-w-2xl">
      <Link href="/portal/teacher/forum" className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono mb-4">
        <ArrowLeft size={12} /> back to forum
      </Link>
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Tutors</p>
        <h1 className="text-[24px] font-semibold text-[var(--text-1)]">New thread</h1>
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <div>
          <Label className="mb-1.5 block">Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="approach">Approach</SelectItem>
              <SelectItem value="lesson_plan">Lesson plan</SelectItem>
              <SelectItem value="win_story">Win story</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block">Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Pacing fix that worked for my 1380 student" />
        </div>
        <div>
          <Label className="mb-1.5 block">Body</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} placeholder="Markdown-ish: paragraphs, dashes, links — formatted post-MVP." />
        </div>
        <Button variant="primary" loading={submitting} onClick={submit}>
          <Send size={13} /> Post thread
        </Button>
      </div>
    </div>
  );
}
