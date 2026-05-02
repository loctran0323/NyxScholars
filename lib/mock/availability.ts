/**
 * Deterministic mock availability generator.
 * Given a tutor id, returns the next 7 days × up to 6 slots/day,
 * with a stable random subset marked as available so the grid feels real.
 *
 * Real implementation would query Supabase / Calendly / etc.
 */

export type Slot = {
  iso: string;          // ISO start time
  label: string;        // human label "9:00 AM"
  available: boolean;
  isTrial?: boolean;    // true for the soonest available slot — free 30 min
};

export type DayAvailability = {
  date: Date;
  weekday: string;      // "Mon"
  monthDay: string;     // "May 4"
  slots: Slot[];
};

const SLOT_HOURS = [9, 11, 14, 16, 18, 20]; // 9am, 11am, 2pm, 4pm, 6pm, 8pm

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getAvailability(tutorId: string, days = 7): DayAvailability[] {
  const rng = mulberry32(hashSeed(tutorId));
  const out: DayAvailability[] = [];
  const now = new Date();
  let firstAvailableMarked = false;

  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(0, 0, 0, 0);
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const slots: Slot[] = SLOT_HOURS.map((h) => {
      const slot = new Date(d);
      slot.setHours(h, 0, 0, 0);
      // ~55% availability, but never in the past
      const available = slot.getTime() > now.getTime() && rng() > 0.45;
      const label = slot.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const s: Slot = { iso: slot.toISOString(), label, available };
      if (available && !firstAvailableMarked) {
        s.isTrial = true;
        firstAvailableMarked = true;
      }
      return s;
    });

    out.push({ date: d, weekday, monthDay, slots });
  }

  return out;
}
