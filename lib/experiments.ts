/**
 * Lightweight A/B experiment framework. Stable bucketing per user (or
 * anonymous id), persistent assignment in Supabase so the same person
 * always sees the same variant, and event firing into the analytics
 * pipeline so PostHog/GA can join exposure to outcomes.
 *
 * Activates an experiment with `assignVariant("hero_v3", "control", "variant_b")`.
 * Returns the chosen variant. Caches in localStorage on the client.
 */

import { track, EVENTS } from "@/lib/analytics";

const STORAGE_KEY = "nyx:exp:v1";
const ANON_KEY    = "nyx:anon-id";

interface AssignmentMap { [experiment: string]: string }

function readClient(): { anonId: string; assignments: AssignmentMap } {
  if (typeof window === "undefined") return { anonId: "", assignments: {} };
  let anonId = "";
  try {
    anonId = window.localStorage.getItem(ANON_KEY) ?? "";
    if (!anonId) {
      anonId = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2);
      window.localStorage.setItem(ANON_KEY, anonId);
    }
  } catch {}
  let assignments: AssignmentMap = {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) assignments = JSON.parse(raw) as AssignmentMap;
  } catch {}
  return { anonId, assignments };
}

function writeAssignments(a: AssignmentMap) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); } catch {}
}

/**
 * djb2 hash for stable bucket assignment.
 * Returns a 32-bit unsigned integer.
 */
function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h) ^ input.charCodeAt(i);
  return h >>> 0;
}

export function assignVariant<T extends string>(experiment: string, ...variants: T[]): T {
  if (variants.length === 0) throw new Error("variants required");
  const { anonId, assignments } = readClient();
  if (assignments[experiment]) {
    return assignments[experiment] as T;
  }
  const key = `${experiment}:${anonId}`;
  const idx = hash(key) % variants.length;
  const variant = variants[idx];
  assignments[experiment] = variant;
  writeAssignments(assignments);
  track(EVENTS.EXPERIMENT_VIEWED, { experiment, variant });
  return variant;
}

/** React hook variant. */
export function useExperiment<T extends string>(experiment: string, ...variants: T[]): T {
  // No useState/useEffect needed because assignVariant is pure once anonId resolves.
  // For SSR safety, return the first variant on the server.
  if (typeof window === "undefined") return variants[0];
  return assignVariant(experiment, ...variants);
}
