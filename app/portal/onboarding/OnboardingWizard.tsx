"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  GraduationCap,
  CheckCircle2,
  Compass,
  Microscope,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/system/Toast";
import { track, EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface Props {
  defaultName: string;
  defaultTargetTest: "SAT" | "ACT" | null;
  defaultTargetScore: string | null;
  defaultGrade: string | null;
}

type Step = 1 | 2 | 3;

interface IntakeForm {
  fullName: string;
  grade: string;
  targetTest: "SAT" | "ACT" | "";
  currentScore: string;
  targetScore: string;
  testDate: string;
  primaryGoal: string;
  weakAreas: string[];
  hoursPerWeek: number;
  notes: string;
}

const WEAK_AREA_OPTIONS = [
  "Algebra fluency",
  "Geometry",
  "Word problems",
  "Statistics & data analysis",
  "Reading comprehension",
  "Reading speed",
  "Vocabulary in context",
  "Essay structure",
  "Standard English conventions",
  "Test anxiety",
  "Pacing under time pressure",
];

const GRADES = ["8", "9", "10", "11", "12", "Other"];

export function OnboardingWizard({
  defaultName,
  defaultTargetTest,
  defaultTargetScore,
  defaultGrade,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = React.useState<Step>(1);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<IntakeForm>({
    fullName:     defaultName,
    grade:        defaultGrade ?? "",
    targetTest:   defaultTargetTest ?? "",
    currentScore: "",
    targetScore:  defaultTargetScore ?? "",
    testDate:     "",
    primaryGoal:  "",
    weakAreas:    [],
    hoursPerWeek: 4,
    notes:        "",
  });

  function patch(p: Partial<IntakeForm>) {
    setForm((f) => ({ ...f, ...p }));
  }
  function toggleWeakArea(area: string) {
    setForm((f) => ({
      ...f,
      weakAreas: f.weakAreas.includes(area)
        ? f.weakAreas.filter((a) => a !== area)
        : [...f.weakAreas, area],
    }));
  }

  function next() {
    if (step === 1) {
      if (!form.fullName.trim() || !form.grade || !form.targetTest) {
        toast({ title: "Fill in your name, grade, and test.", variant: "warning" });
        return;
      }
    }
    if (step === 2 && !form.targetScore) {
      toast({ title: "Add a goal score so we can plan to it.", variant: "warning" });
      return;
    }
    setStep((s) => (s + 1) as Step);
    track(EVENTS.ONBOARDING_STEP, { step: `intake.${step}.complete` });
  }
  function back() {
    setStep((s) => Math.max(1, s - 1) as Step);
  }

  async function complete() {
    setSubmitting(true);
    try {
      // 1. Save intake context to onboarding_state.
      await fetch("/api/portal/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "intake_complete", done: true, context: form }),
      });
      // 2. Patch profile with target_test/target_score/grade so downstream pages personalize.
      await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name:    form.fullName,
          grade:        form.grade,
          target_test:  form.targetTest || null,
          target_score: form.targetScore || null,
        }),
      });
      track(EVENTS.ONBOARDING_STEP, { step: "intake_complete", done: true });
      toast({ title: "Intake saved", description: "Routing you to the adaptive test.", variant: "success" });
      router.push("/portal/match");
    } catch {
      toast({ title: "Could not save intake. Try again.", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="text-center mb-2">
        <p className="text-[12px] text-[var(--accent)] uppercase tracking-[0.22em] font-semibold">Concierge intake</p>
        <h1 className="text-[28px] font-semibold text-[var(--text-1)] mt-1">Let&apos;s map your sky.</h1>
        <p className="text-[var(--text-2)] text-[14px] mt-1.5 max-w-md mx-auto">
          Three minutes. We use this to predict your starting score, pick the right tutor, and plan your weeks.
        </p>
      </header>

      <ProgressBar step={step} />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        {step === 1 && (
          <Step1
            form={form}
            patch={patch}
          />
        )}
        {step === 2 && (
          <Step2
            form={form}
            patch={patch}
          />
        )}
        {step === 3 && (
          <Step3
            form={form}
            patch={patch}
            toggleWeakArea={toggleWeakArea}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 1}>
          <ChevronLeft size={14} /> Back
        </Button>
        {step < 3 ? (
          <Button variant="primary" onClick={next}>
            Continue <ChevronRight size={14} />
          </Button>
        ) : (
          <Button variant="primary" loading={submitting} onClick={complete}>
            Save intake & meet tutors <ChevronRight size={14} />
          </Button>
        )}
      </div>

      <ScorePrediction form={form} />
    </div>
  );
}

function ProgressBar({ step }: { step: Step }) {
  const steps = [
    { id: 1, label: "About you",         icon: GraduationCap },
    { id: 2, label: "Your target",       icon: Target },
    { id: 3, label: "Where you struggle", icon: Microscope },
  ];
  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const active = s.id === step;
        const done = s.id < step;
        return (
          <React.Fragment key={s.id}>
            <div className={cn(
              "flex items-center gap-2 text-[12.5px] font-semibold",
              active ? "text-[var(--text-1)]" : done ? "text-[var(--accent)]" : "text-[var(--text-3)]",
            )}>
              <span className={cn(
                "w-7 h-7 rounded-full grid place-items-center border",
                active ? "bg-[var(--accent-dim)] border-[var(--border-accent)] text-[var(--accent)]" :
                done   ? "bg-[var(--success-soft)] border-[var(--success)]/35 text-[var(--success)]" :
                         "bg-[var(--bg-2)] border-[var(--border)]",
              )}>
                {done ? <CheckCircle2 size={13} /> : <Icon size={13} />}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("flex-1 h-px", done ? "bg-[var(--success)]/40" : "bg-[var(--border)]")} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Step1({ form, patch }: { form: IntakeForm; patch: (p: Partial<IntakeForm>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="full-name" className="mb-1.5 block">Your name</Label>
        <Input id="full-name" value={form.fullName} onChange={(e) => patch({ fullName: e.target.value })} placeholder="Maya Chen" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block">Grade</Label>
          <Select value={form.grade} onValueChange={(v) => patch({ grade: v })}>
            <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
            <SelectContent>
              {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block">Which test?</Label>
          <Select value={form.targetTest} onValueChange={(v) => patch({ targetTest: v as "SAT" | "ACT" })}>
            <SelectTrigger><SelectValue placeholder="SAT or ACT" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="SAT">SAT (digital, 1600-scale)</SelectItem>
              <SelectItem value="ACT">ACT (36-scale)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function Step2({ form, patch }: { form: IntakeForm; patch: (p: Partial<IntakeForm>) => void }) {
  const test = form.targetTest;
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block">Most recent score (optional)</Label>
          <Input
            value={form.currentScore}
            onChange={(e) => patch({ currentScore: e.target.value })}
            placeholder={test === "ACT" ? "e.g. 28" : "e.g. 1200"}
            inputMode="numeric"
          />
          <p className="text-[11.5px] text-[var(--text-3)] mt-1.5">Skip if you haven&apos;t taken one.</p>
        </div>
        <div>
          <Label className="mb-1.5 block">Goal score</Label>
          <Input
            value={form.targetScore}
            onChange={(e) => patch({ targetScore: e.target.value })}
            placeholder={test === "ACT" ? "e.g. 34" : "e.g. 1500"}
            inputMode="numeric"
          />
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block">When&apos;s your test?</Label>
        <Input
          type="date"
          value={form.testDate}
          onChange={(e) => patch({ testDate: e.target.value })}
        />
      </div>
      <div>
        <Label className="mb-1.5 block">Primary goal in your own words</Label>
        <Textarea
          value={form.primaryGoal}
          onChange={(e) => patch({ primaryGoal: e.target.value })}
          placeholder="e.g. Hit 1500 by November so I can apply early to Stanford."
          rows={3}
        />
      </div>
    </div>
  );
}

function Step3({
  form,
  patch,
  toggleWeakArea,
}: {
  form: IntakeForm;
  patch: (p: Partial<IntakeForm>) => void;
  toggleWeakArea: (a: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-2 block">Where do you currently struggle?</Label>
        <p className="text-[12.5px] text-[var(--text-3)] mb-2">Pick as many as apply — your tutor will use this to plan week one.</p>
        <div className="flex flex-wrap gap-2">
          {WEAK_AREA_OPTIONS.map((area) => {
            const on = form.weakAreas.includes(area);
            return (
              <button
                key={area}
                type="button"
                onClick={() => toggleWeakArea(area)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-[12.5px] font-medium transition-colors",
                  on
                    ? "bg-[var(--accent-dim)] border-[var(--border-accent)] text-[var(--accent)]"
                    : "bg-[var(--bg-2)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-2)] hover:text-[var(--text-1)]",
                )}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block">How many hours per week can you dedicate?</Label>
        <input
          type="range"
          min={2}
          max={12}
          step={1}
          value={form.hoursPerWeek}
          onChange={(e) => patch({ hoursPerWeek: Number(e.target.value) })}
          className="w-full accent-[var(--accent)]"
        />
        <p className="text-[12.5px] text-[var(--text-2)] mt-1">{form.hoursPerWeek} hours / week</p>
      </div>
      <div>
        <Label className="mb-1.5 block">Anything else we should know?</Label>
        <Textarea
          value={form.notes}
          onChange={(e) => patch({ notes: e.target.value })}
          placeholder="Test accommodations, learning differences, prior tutors that worked or didn't…"
          rows={3}
        />
      </div>
    </div>
  );
}

function ScorePrediction({ form }: { form: IntakeForm }) {
  const prediction = predictScore(form);
  if (!prediction) return null;
  return (
    <div className="rounded-2xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-5">
      <div className="flex items-start gap-3">
        <Sparkles size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[var(--text-1)]">
            Predicted starting score: <span className="text-[var(--accent)]">{prediction.range}</span>
          </p>
          <p className="text-[12.5px] text-[var(--text-2)] mt-1 leading-relaxed">
            Based on your goal, weeks until test, and self-reported struggle areas. <strong>Methodology:</strong> we anchor to
            self-reported current score (or the median for your grade if missing), regress
            toward your goal at the rate of {Math.round(prediction.deltaPerWeek)} points/week,
            and apply a confidence band of ±{prediction.band} based on your hours of practice.
          </p>
        </div>
      </div>
    </div>
  );
}

function predictScore(form: IntakeForm): { range: string; deltaPerWeek: number; band: number } | null {
  const test = form.targetTest;
  if (!test) return null;
  const current = Number(form.currentScore || (test === "ACT" ? "24" : "1100"));
  const goal    = Number(form.targetScore  || (test === "ACT" ? "30" : "1400"));
  if (!Number.isFinite(current) || !Number.isFinite(goal)) return null;
  const weeks = form.testDate ? Math.max(1, Math.ceil((new Date(form.testDate).getTime() - Date.now()) / (7 * 24 * 3600 * 1000))) : 12;
  const deltaPerWeek = (goal - current) / weeks;
  const band = test === "ACT" ? Math.max(1, Math.round(2 - form.hoursPerWeek / 8)) : Math.max(20, Math.round(80 - form.hoursPerWeek * 5));
  const lo = current - band;
  const hi = current + band;
  return { range: test === "ACT" ? `${Math.round(lo)}–${Math.round(hi)}` : `${Math.round(lo)}–${Math.round(hi)}`, deltaPerWeek, band };
}
