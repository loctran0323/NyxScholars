/**
 * Timezone helpers for the scheduling stack.
 *
 *   • detectTimezone()  — guesses the browser's IANA tz.
 *   • formatInTz()      — renders a Date in the supplied tz, with a
 *                         friendly fallback for tz strings the runtime
 *                         doesn't know about.
 *   • compareTzs()      — returns hour offset between two zones.
 */

export function detectTimezone(): string {
  if (typeof Intl === "undefined") return "America/New_York";
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  } catch {
    return "America/New_York";
  }
}

export function formatInTz(d: Date, tz: string, opts: Intl.DateTimeFormatOptions = {}): string {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: tz, ...opts }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

/** Returns "Eastern Daylight Time" or similar for a given IANA tz. */
export function tzLongName(tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "long" })
      .formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
  } catch {
    return tz;
  }
}

/** Quick UTC offset string like "-05:00" for a given tz. */
export function tzOffset(tz: string, ref: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(ref);
    const off = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    return off.replace("GMT", "");
  } catch {
    return "";
  }
}

/** Common tz options for a profile selector. */
export const COMMON_TIMEZONES: { value: string; label: string }[] = [
  { value: "America/Los_Angeles", label: "Pacific (Los Angeles)" },
  { value: "America/Denver",      label: "Mountain (Denver)" },
  { value: "America/Chicago",     label: "Central (Chicago)" },
  { value: "America/New_York",    label: "Eastern (New York)" },
  { value: "America/Toronto",     label: "Eastern (Toronto)" },
  { value: "Europe/London",       label: "London" },
  { value: "Europe/Paris",        label: "Paris" },
  { value: "Asia/Singapore",      label: "Singapore" },
  { value: "Asia/Hong_Kong",      label: "Hong Kong" },
  { value: "Asia/Tokyo",          label: "Tokyo" },
  { value: "Asia/Seoul",          label: "Seoul" },
  { value: "Asia/Shanghai",       label: "Shanghai" },
  { value: "Australia/Sydney",    label: "Sydney" },
];
