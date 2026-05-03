"use client";

import * as React from "react";
import { Plus, Sparkles, Trash2, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/system/Toast";

interface QuestionRow {
  id: string;
  skill_id: string;
  skill_name: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  prompt: string;
  choices: string[];
  correct_index: number;
  rationale: string | null;
  status: "active" | "draft" | "retired";
  origin: "admin" | "generated" | "static" | "community";
  created_at: string;
}

interface Stats {
  total: number;
  skillsCovered: number;
  skillsTotal: number;
  bySkill: Record<string, { skill: string; static: number; generated: number; total: number }>;
}

export function QuestionsEditor({ stats, initial }: { stats: Stats; initial: QuestionRow[] }) {
  const { toast } = useToast();
  const [items, setItems] = React.useState<QuestionRow[]>(initial);
  const [filter, setFilter] = React.useState<"all" | "active" | "draft" | "retired">("all");

  const visible = filter === "all" ? items : items.filter((i) => i.status === filter);

  async function refresh() {
    const res = await fetch("/api/admin/questions");
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.dbQuestions as QuestionRow[]);
  }

  async function setStatus(id: string, status: "active" | "draft" | "retired") {
    const res = await fetch(`/api/admin/questions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      toast({ title: "Couldn't update", variant: "error" });
      return;
    }
    setItems((curr) => curr.map((i) => (i.id === id ? { ...i, status } : i)));
    toast({
      title:
        status === "active"
          ? "Published"
          : status === "retired"
            ? "Retired"
            : "Moved to draft",
      variant: "success",
      durationMs: 1500,
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-3">
        <Stat label="Total in bank"   value={stats.total} />
        <Stat label="Skills covered"  value={`${stats.skillsCovered} / ${stats.skillsTotal}`} />
        <Stat label="DB-stored"       value={items.length} />
      </div>

      <NewQuestionForm onCreated={(q) => setItems((curr) => [q, ...curr])} />
      <MintBatch onMinted={refresh} />

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--border)] flex-wrap">
          <h2 className="text-[14px] font-semibold text-[var(--text-1)]">Stored questions</h2>
          <div className="flex items-center gap-1">
            {(["all", "active", "draft", "retired"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "px-2.5 py-1 rounded-md text-[12px] font-semibold transition-colors " +
                  (filter === f
                    ? "bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--border-accent)]"
                    : "text-[var(--text-2)] border border-transparent hover:text-[var(--text-1)]")
                }
              >
                {f}
              </button>
            ))}
            <Button variant="ghost" size="sm" onClick={refresh}>
              <RefreshCw size={12} />
            </Button>
          </div>
        </header>
        {visible.length === 0 ? (
          <div className="px-5 py-8 text-center text-[var(--text-3)] text-[13px]">No questions match.</div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {visible.map((q) => (
              <li key={q.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="default">{q.section}</Badge>
                    <Badge variant="default">{q.skill_name}</Badge>
                    <Badge variant={q.difficulty >= 4 ? "purple" : q.difficulty >= 3 ? "blue" : "default"}>
                      D{q.difficulty}
                    </Badge>
                    <Badge variant={q.origin === "admin" ? "gold" : q.origin === "generated" ? "blue" : "default"}>
                      {q.origin}
                    </Badge>
                    <Badge variant={q.status === "active" ? "green" : q.status === "draft" ? "gold" : "red"}>
                      {q.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {q.status === "draft" && (
                      <Button variant="ghost" size="sm" onClick={() => setStatus(q.id, "active")}>
                        <Save size={12} /> Publish
                      </Button>
                    )}
                    {q.status === "active" && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => setStatus(q.id, "draft")}>
                          Unpublish
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setStatus(q.id, "retired")}>
                          <Trash2 size={12} /> Retire
                        </Button>
                      </>
                    )}
                    {q.status === "retired" && (
                      <Button variant="ghost" size="sm" onClick={() => setStatus(q.id, "draft")}>
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-[13.5px] text-[var(--text-1)] mb-2 leading-snug">{q.prompt}</p>
                <ul className="space-y-1">
                  {q.choices.map((c, i) => (
                    <li
                      key={i}
                      className={
                        "text-[12.5px] " +
                        (i === q.correct_index ? "text-[var(--success)] font-semibold" : "text-[var(--text-2)]")
                      }
                    >
                      <span className="font-mono mr-2">{String.fromCharCode(65 + i)}</span>
                      {c}
                      {i === q.correct_index && <span className="ml-1.5 text-[var(--success)]">✓</span>}
                    </li>
                  ))}
                </ul>
                {q.rationale && (
                  <p className="text-[12px] text-[var(--text-3)] mt-2 italic">{q.rationale}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-[10.5px] uppercase tracking-wider text-[var(--text-3)] font-semibold">{label}</p>
      <p className="text-[22px] font-semibold text-[var(--text-1)] mt-1">{value}</p>
    </div>
  );
}

function NewQuestionForm({ onCreated }: { onCreated: (q: QuestionRow) => void }) {
  const { toast } = useToast();
  const [skillId, setSkillId] = React.useState("");
  const [difficulty, setDifficulty] = React.useState(3);
  const [prompt, setPrompt] = React.useState("");
  const [choices, setChoices] = React.useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = React.useState(0);
  const [rationale, setRationale] = React.useState("");
  const [status, setStatus] = React.useState<"active" | "draft">("active");
  const [submitting, setSubmitting] = React.useState(false);

  function patchChoice(i: number, v: string) {
    setChoices((c) => c.map((x, idx) => (idx === i ? v : x)));
  }

  async function submit() {
    if (!skillId.trim() || !prompt.trim() || choices.some((c) => !c.trim())) {
      toast({ title: "Skill, prompt, and all four choices are required.", variant: "warning" });
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skill_id: skillId,
        difficulty,
        prompt,
        choices,
        correct_index: correctIndex,
        rationale: rationale || undefined,
        status,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      toast({ title: "Couldn't save", description: data.error ?? "—", variant: "error" });
      return;
    }
    onCreated(data.question as QuestionRow);
    toast({ title: "Question added", variant: "success", durationMs: 1800 });
    setPrompt(""); setChoices(["", "", "", ""]); setCorrectIndex(0); setRationale("");
  }

  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <summary className="px-5 py-4 cursor-pointer text-[14px] font-semibold text-[var(--text-1)] flex items-center gap-2">
        <Plus size={14} className="text-[var(--accent)]" /> Add a hand-written question
      </summary>
      <div className="px-5 pb-5 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className="mb-1.5 block">Skill ID</Label>
            <Input value={skillId} onChange={(e) => setSkillId(e.target.value)} placeholder="lin-eq" />
            <p className="text-[11px] text-[var(--text-3)] mt-1">From <code className="text-[var(--accent)]">lib/mock/constellations.ts</code>.</p>
          </div>
          <div>
            <Label className="mb-1.5 block">Difficulty (1–5)</Label>
            <Select value={String(difficulty)} onValueChange={(v) => setDifficulty(parseInt(v, 10))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((d) => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as "active" | "draft")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block">Prompt</Label>
          <Textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="If 3x + 7 = 22, what is x?" />
        </div>
        <div>
          <Label className="mb-1.5 block">Choices (radio = correct)</Label>
          <div className="space-y-2">
            {choices.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                  aria-label={`Choice ${String.fromCharCode(65 + i)} correct`}
                  className="accent-[var(--success)]"
                />
                <span className="font-mono text-[12px] text-[var(--text-3)] w-4">{String.fromCharCode(65 + i)}</span>
                <Input value={c} onChange={(e) => patchChoice(i, e.target.value)} placeholder={`Choice ${String.fromCharCode(65 + i)}`} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block">Rationale (optional)</Label>
          <Textarea rows={2} value={rationale} onChange={(e) => setRationale(e.target.value)} placeholder="3x = 15, so x = 5." />
        </div>
        <Button variant="primary" loading={submitting} onClick={submit}>
          <Save size={13} /> Save question
        </Button>
      </div>
    </details>
  );
}

function MintBatch({ onMinted }: { onMinted: () => void }) {
  const { toast } = useToast();
  const [skillId, setSkillId] = React.useState("");
  const [count, setCount] = React.useState(5);
  const [submitting, setSubmitting] = React.useState(false);

  async function mint() {
    if (!skillId.trim()) {
      toast({ title: "Skill ID required.", variant: "warning" });
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/admin/questions?action=mint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill_id: skillId, count }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      toast({ title: "Mint failed", description: data.error ?? "—", variant: "error" });
      return;
    }
    onMinted();
    toast({ title: `Minted ${data.inserted}`, variant: "success" });
  }

  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <summary className="px-5 py-4 cursor-pointer text-[14px] font-semibold text-[var(--text-1)] flex items-center gap-2">
        <Sparkles size={14} className="text-[var(--gold-soft)]" /> Mint a generated batch
      </summary>
      <div className="px-5 pb-5 grid sm:grid-cols-3 gap-3 items-end">
        <div>
          <Label className="mb-1.5 block">Skill ID</Label>
          <Input value={skillId} onChange={(e) => setSkillId(e.target.value)} placeholder="lin-eq" />
        </div>
        <div>
          <Label className="mb-1.5 block">Count (1–20)</Label>
          <Input type="number" min={1} max={20} value={count} onChange={(e) => setCount(parseInt(e.target.value || "1", 10))} />
        </div>
        <Button variant="primary" loading={submitting} onClick={mint}>
          <Sparkles size={13} /> Mint batch
        </Button>
      </div>
    </details>
  );
}
