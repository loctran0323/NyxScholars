"use client";

import * as React from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/system/Toast";

interface SlotInput {
  weekday: number;
  start_min: number;
  end_min: number;
  timezone: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function minsToHHMM(m: number): string {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function hhmmToMins(s: string): number {
  const [h, m] = s.split(":").map((n) => parseInt(n, 10));
  return (h ?? 0) * 60 + (m ?? 0);
}

export function AvailabilityEditor({
  initialSlots,
  defaultTimezone,
}: {
  initialSlots: SlotInput[];
  defaultTimezone: string;
}) {
  const { toast } = useToast();
  const [slots, setSlots] = React.useState<SlotInput[]>(initialSlots);
  const [saving, setSaving] = React.useState(false);

  function add() {
    setSlots((s) => [...s, { weekday: 1, start_min: 17 * 60, end_min: 19 * 60, timezone: defaultTimezone }]);
  }
  function patch(i: number, p: Partial<SlotInput>) {
    setSlots((s) => s.map((row, idx) => (idx === i ? { ...row, ...p } : row)));
  }
  function remove(i: number) {
    setSlots((s) => s.filter((_, idx) => idx !== i));
  }

  async function save() {
    // Validate: end > start.
    if (slots.some((s) => s.end_min <= s.start_min)) {
      toast({ title: "Each slot must end after it starts.", variant: "warning" });
      return;
    }
    setSaving(true);
    const res = await fetch("/api/portal/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    });
    setSaving(false);
    if (!res.ok) {
      toast({ title: "Couldn't save", variant: "error" });
      return;
    }
    toast({ title: `Saved ${slots.length} slot${slots.length === 1 ? "" : "s"}`, variant: "success" });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        {slots.length === 0 ? (
          <div className="px-5 py-10 text-center text-[13.5px] text-[var(--text-2)]">
            No availability set. Add a weekly window so students can book you.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {slots.map((slot, i) => (
              <li key={i} className="px-4 py-3 grid sm:grid-cols-[120px_1fr_1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="text-[10.5px] uppercase tracking-wider text-[var(--text-3)] font-semibold">Day</label>
                  <Select value={String(slot.weekday)} onValueChange={(v) => patch(i, { weekday: parseInt(v, 10) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {WEEKDAYS.map((d, idx) => (
                        <SelectItem key={d} value={String(idx)}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[10.5px] uppercase tracking-wider text-[var(--text-3)] font-semibold">Start</label>
                  <Input
                    type="time"
                    value={minsToHHMM(slot.start_min)}
                    onChange={(e) => patch(i, { start_min: hhmmToMins(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[10.5px] uppercase tracking-wider text-[var(--text-3)] font-semibold">End</label>
                  <Input
                    type="time"
                    value={minsToHHMM(slot.end_min)}
                    onChange={(e) => patch(i, { end_min: hhmmToMins(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[10.5px] uppercase tracking-wider text-[var(--text-3)] font-semibold">Timezone</label>
                  <Input value={slot.timezone} onChange={(e) => patch(i, { timezone: e.target.value })} />
                </div>
                <Button variant="ghost" size="sm" onClick={() => remove(i)}>
                  <Trash2 size={13} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={add}>
          <Plus size={13} /> Add window
        </Button>
        <Button variant="primary" loading={saving} onClick={save}>
          <Save size={13} /> Save schedule
        </Button>
      </div>
    </div>
  );
}
