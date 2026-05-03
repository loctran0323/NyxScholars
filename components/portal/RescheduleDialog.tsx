"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/system/Toast";
import { detectTimezone, formatInTz } from "@/lib/timezone";
import { track, EVENTS } from "@/lib/analytics";

const TIMES = [
  "09:00", "10:00", "11:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00",
];

export function RescheduleDialog({
  sessionId,
  currentScheduledAt,
  triggerLabel = "Reschedule",
}: {
  sessionId: string;
  currentScheduledAt: string;
  triggerLabel?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const tz = React.useMemo(detectTimezone, []);
  const current = new Date(currentScheduledAt);

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>(current);
  const [time, setTime] = React.useState<string>(
    formatInTz(current, tz, { hour: "2-digit", minute: "2-digit", hour12: false }),
  );
  const [submitting, setSubmitting] = React.useState(false);

  const hoursUntil = (current.getTime() - Date.now()) / 3_600_000;
  const tooLate = hoursUntil < 12;

  async function submit() {
    if (tooLate) {
      toast({
        title: "Too close to start time",
        description: "Sessions can only be rescheduled at least 12 hours ahead. Message us instead.",
        variant: "warning",
      });
      return;
    }
    const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
    const next = new Date(date);
    next.setHours(hh ?? 9, mm ?? 0, 0, 0);

    setSubmitting(true);
    track(EVENTS.SESSION_RESCHEDULED, { sessionId, hoursUntilOriginal: Math.round(hoursUntil) });
    const res = await fetch("/api/portal/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sessionId, scheduled_at: next.toISOString() }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ title: "Couldn't reschedule", description: data.error ?? "Try again.", variant: "error" });
      return;
    }
    toast({
      title: "Rescheduled",
      description: `Now ${formatInTz(next, tz, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`,
      variant: "success",
    });
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarIcon size={13} /> {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick a new time</DialogTitle>
          <DialogDescription>
            Times are shown in your local zone ({tz}). Self-serve up to 12 hours before.
          </DialogDescription>
        </DialogHeader>

        {tooLate ? (
          <p className="text-[13px] text-[var(--danger)] py-3">
            This session starts in less than 12 hours — please{" "}
            <a href="/portal/messages" className="underline">message your tutor</a> instead.
          </p>
        ) : (
          <>
            <Calendar
              value={date}
              onChange={setDate}
              minDate={new Date()}
              className="mx-auto"
            />
            <div className="mt-4">
              <p className="text-[12px] uppercase tracking-wider text-[var(--text-3)] font-semibold mb-2 flex items-center gap-1.5">
                <Clock size={12} /> Time
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {TIMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={
                      "h-9 rounded-lg text-[12px] font-mono transition-colors " +
                      (t === time
                        ? "bg-[var(--accent)] text-[var(--on-accent)]"
                        : "bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)]")
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" loading={submitting} onClick={submit} disabled={tooLate}>
            Confirm new time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
