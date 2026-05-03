"use client";

import * as React from "react";
import { Sparkles, Send, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/system/Toast";

interface Props {
  sessionId: string;
  initialTopics?: string[];
  initialMistakes?: string[];
  initialHomework?: string[];
}

/**
 * Tutor-only composer that drafts a recap from a transcript using Claude/
 * OpenAI, lets the tutor edit each list, and stamps `summary_status='sent'`
 * which triggers a notification + email to the student.
 */
export function SessionSummaryComposer({ sessionId, initialTopics, initialMistakes, initialHomework }: Props) {
  const { toast } = useToast();
  const [transcript, setTranscript] = React.useState("");
  const [topics, setTopics] = React.useState<string>((initialTopics ?? []).join("\n"));
  const [mistakes, setMistakes] = React.useState<string>((initialMistakes ?? []).join("\n"));
  const [homework, setHomework] = React.useState<string>((initialHomework ?? []).join("\n"));
  const [drafting, setDrafting] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  async function draftFromTranscript() {
    if (transcript.trim().length < 20) {
      toast({ title: "Paste more transcript first.", variant: "warning" });
      return;
    }
    setDrafting(true);
    const res = await fetch(`/api/portal/sessions/${sessionId}/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });
    const data = await res.json();
    setDrafting(false);
    if (!res.ok) {
      toast({ title: "AI draft failed", description: data.error ?? "—", variant: "error" });
      return;
    }
    const s = data.summary as { topicsCovered: string[]; mistakes: string[]; homework: string[] };
    setTopics(s.topicsCovered.join("\n"));
    setMistakes(s.mistakes.join("\n"));
    setHomework(s.homework.join("\n"));
    toast({ title: "Draft ready", description: "Edit then send.", variant: "success" });
  }

  function toLines(s: string): string[] {
    return s.split("\n").map((line) => line.trim()).filter(Boolean);
  }

  async function send() {
    setSending(true);
    const res = await fetch(`/api/portal/sessions/${sessionId}/summary`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicsCovered: toLines(topics),
        mistakes:      toLines(mistakes),
        homework:      toLines(homework),
        status:        "sent",
      }),
    });
    setSending(false);
    if (!res.ok) {
      toast({ title: "Couldn't send", variant: "error" });
      return;
    }
    toast({ title: "Recap sent", description: "Student notified.", variant: "success" });
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h3 className="text-[14px] font-semibold text-[var(--text-1)] mb-3 flex items-center gap-2">
        <Sparkles size={14} className="text-[var(--accent)]" /> Session recap (tutors only)
      </h3>

      <Label className="mb-1.5 block">Transcript paste</Label>
      <Textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste the Whisper transcript here, then click Draft to fill the lists below."
        rows={6}
      />
      <Button variant="outline" size="sm" loading={drafting} onClick={draftFromTranscript} className="mt-2">
        <RotateCw size={12} /> Draft from transcript
      </Button>

      <div className="grid sm:grid-cols-3 gap-4 mt-5">
        <div>
          <Label className="mb-1.5 block">Topics covered</Label>
          <Textarea rows={4} value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="One per line" />
        </div>
        <div>
          <Label className="mb-1.5 block">Mistakes</Label>
          <Textarea rows={4} value={mistakes} onChange={(e) => setMistakes(e.target.value)} placeholder="One per line" />
        </div>
        <div>
          <Label className="mb-1.5 block">Homework / next steps</Label>
          <Textarea rows={4} value={homework} onChange={(e) => setHomework(e.target.value)} placeholder="One per line" />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="primary" loading={sending} onClick={send}>
          <Send size={13} /> Send to student
        </Button>
      </div>
    </div>
  );
}
