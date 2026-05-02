export type PlanType = "session" | "monthly" | "counseling";
export type PlanStatus = "active" | "paused" | "cancelled";

export interface Profile {
  id: string;
  full_name: string | null;
  grade: string | null;
  school: string | null;
  target_score: string | null;
  target_test: "SAT" | "ACT" | null;
  phone: string | null;
  created_at: string;
  // subscription plan
  plan: PlanType | null;
  plan_status: PlanStatus | null;
  plan_subject: string | null; // for session plan: 'SAT' | 'ACT' | 'AP' | 'College Admissions'
  plan_addons: string[] | null; // e.g. ['counseling']
}

export type SessionStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Session {
  id: string;
  student_id: string;
  tutor_name: string | null;
  subject: string;
  scheduled_at: string;
  duration_minutes: number;
  status: SessionStatus;
  meeting_link: string | null;
  student_notes: string | null;
  admin_notes: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  student_id: string;
  sender: "student" | "nyx";
  content: string;
  read: boolean;
  created_at: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "quiz" | "article" | "practice";
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  url: string;
  is_premium: boolean;
  estimated_time: string;
}
