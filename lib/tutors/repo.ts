import { getServiceRoleClient } from "@/lib/supabase";
import { TUTORS as MOCK_TUTORS, HOURLY_RATE_USD } from "@/lib/mock/tutors";

export interface DbTutor {
  id: string;
  profile_id: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  photo_url: string | null;
  subjects: string[];
  tests: string[];
  hourly_rate_cents: number | null;
  calendar_url: string | null;
  meeting_url: string | null;
  timezone: string | null;
  status: "active" | "paused" | "archived";
  capacity_weekly: number | null;
  created_at: string;
  updated_at: string;
}

export interface TutorCard {
  id: string;
  profile_id: string | null;
  name: string;
  headline: string | null;
  bio: string;
  photo_url: string | null;
  subjects: string[];
  tests: string[];
  hourly_rate_cents: number;
  calendar_url: string | null;
  meeting_url: string | null;
  source: "db" | "mock";
}

const MOCK_RATE_CENTS = HOURLY_RATE_USD * 100;

function mockToCard(m: (typeof MOCK_TUTORS)[number]): TutorCard {
  return {
    id: m.id,
    profile_id: null,
    name: m.name,
    headline: m.pitch ?? null,
    bio: m.bio,
    photo_url: null,
    subjects: m.specialties,
    tests: m.tags.includes("ACT") ? ["sat", "act"] : ["sat"],
    hourly_rate_cents: MOCK_RATE_CENTS,
    calendar_url: null,
    meeting_url: null,
    source: "mock",
  };
}

function dbToCard(t: DbTutor, fallback?: { name: string }): TutorCard {
  return {
    id: t.id,
    profile_id: t.profile_id,
    name: t.display_name || fallback?.name || "Nyx tutor",
    headline: t.headline,
    bio: t.bio ?? "",
    photo_url: t.photo_url,
    subjects: t.subjects,
    tests: t.tests,
    hourly_rate_cents: t.hourly_rate_cents ?? MOCK_RATE_CENTS,
    calendar_url: t.calendar_url,
    meeting_url: t.meeting_url,
    source: "db",
  };
}

export async function listActiveCards(opts?: {
  test?: "sat" | "act";
  subject?: string;
}): Promise<TutorCard[]> {
  const sb = getServiceRoleClient();
  if (!sb) return MOCK_TUTORS.map(mockToCard);

  const { data, error } = await sb
    .from("tutors")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[tutors.repo] listActiveCards", error.message);
    return MOCK_TUTORS.map(mockToCard);
  }

  const dbRows = (data ?? []) as DbTutor[];
  if (dbRows.length === 0) return MOCK_TUTORS.map(mockToCard);

  let cards = dbRows.map((t) => dbToCard(t));
  if (opts?.test) cards = cards.filter((c) => c.tests.includes(opts.test!));
  if (opts?.subject) cards = cards.filter((c) => c.subjects.includes(opts.subject!));
  return cards;
}

export async function listAdminTutors(): Promise<DbTutor[]> {
  const sb = getServiceRoleClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("tutors")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[tutors.repo] listAdminTutors", error.message);
    return [];
  }
  return (data ?? []) as DbTutor[];
}

export async function getByProfileId(profileId: string): Promise<DbTutor | null> {
  const sb = getServiceRoleClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("tutors")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (error) {
    console.error("[tutors.repo] getByProfileId", error.message);
    return null;
  }
  return (data as DbTutor) ?? null;
}

export async function countLoadThisWeek(tutorProfileId: string): Promise<number> {
  const sb = getServiceRoleClient();
  if (!sb) return 0;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const { count } = await sb
    .from("assignments")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", tutorProfileId)
    .eq("active", true)
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString());
  return count ?? 0;
}
