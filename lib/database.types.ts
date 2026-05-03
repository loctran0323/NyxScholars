/**
 * Hand-written types for the Supabase Postgres schema.
 *
 * In a steady-state setup these would be generated from `supabase gen types`,
 * but until that pipeline runs in CI we maintain them here so that every
 * query returns a typed `Database['public']['Tables'][T]['Row']` instead of
 * `unknown` casts. Update this file alongside any SQL migration.
 */

import type { PlanType, PlanStatus, UserRole } from "@/types/portal";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          grade: string | null;
          school: string | null;
          target_score: string | null;
          target_test: "SAT" | "ACT" | null;
          phone: string | null;
          created_at: string;
          role: UserRole | null;
          plan: PlanType | null;
          plan_status: PlanStatus | null;
          plan_subject: string | null;
          plan_addons: string[] | null;
          timezone: string | null;
          locale: string | null;
          onboarding_state: Record<string, unknown> | null;
          parent_email: string | null;
          parent_name: string | null;
          parental_consent_at: string | null;
          nps_score: number | null;
          nps_at: string | null;
          notif_prefs: Record<string, unknown> | null;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      sessions: {
        Row: {
          id: string;
          student_id: string;
          tutor_name: string | null;
          subject: string;
          scheduled_at: string;
          duration_minutes: number;
          status: "pending" | "confirmed" | "completed" | "cancelled";
          meeting_link: string | null;
          student_notes: string | null;
          admin_notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sessions"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sessions"]["Row"]>;
      };
      messages: {
        Row: {
          id: string;
          student_id: string;
          sender: "student" | "nyx";
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at" | "read"> & {
          id?: string;
          created_at?: string;
          read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
      };
      assignments: {
        Row: {
          id: string;
          student_id: string;
          teacher_id: string;
          subject: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["assignments"]["Row"], "id" | "created_at" | "active"> & {
          id?: string;
          active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assignments"]["Row"]>;
      };
      diagnostic_questions: {
        Row: {
          id: string;
          skill_id: string;
          skill_name: string;
          section: "Math" | "Reading & Writing";
          difficulty: number;
          prompt: string;
          choices: string[];
          correct_index: number;
          rationale: string | null;
          source: string | null;
          status: "active" | "draft" | "retired";
          origin: "admin" | "generated" | "static" | "community";
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["diagnostic_questions"]["Row"]> & {
          skill_id: string;
          skill_name: string;
          section: "Math" | "Reading & Writing";
          difficulty: number;
          prompt: string;
          choices: string[];
          correct_index: number;
        };
        Update: Partial<Database["public"]["Tables"]["diagnostic_questions"]["Row"]>;
      };
      diagnostic_attempts: {
        Row: {
          id: string;
          user_id: string | null;
          question_id: string;
          skill_id: string;
          picked_index: number;
          correct: boolean;
          ms: number | null;
          theta_after: number | null;
          ci_after: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["diagnostic_attempts"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["diagnostic_attempts"]["Row"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          kind: string;
          title: string;
          body: string | null;
          href: string | null;
          meta: Record<string, unknown> | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at" | "read_at"> & {
          id?: string;
          created_at?: string;
          read_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string | null;
          subject_id: string | null;
          action: string;
          details: Record<string, unknown> | null;
          ip: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_log"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_log"]["Row"]>;
      };
      webhook_events: {
        Row: {
          id: string;
          provider: string;
          type: string;
          received_at: string;
          processed_at: string | null;
          payload: Record<string, unknown> | null;
          error: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["webhook_events"]["Row"], "received_at" | "processed_at"> & {
          received_at?: string;
          processed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["webhook_events"]["Row"]>;
      };
      leads: {
        Row: {
          id: string;
          student_name: string;
          parent_name: string | null;
          email: string;
          phone: string | null;
          grade: string | null;
          service: string;
          ap_subject: string | null;
          current_score: string | null;
          target_score: string | null;
          test_date: string | null;
          tutoring_format: string | null;
          availability_notes: string | null;
          help_needed: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leads"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Row"]>;
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TableInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
