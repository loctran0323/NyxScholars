import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase";

const schema = z.object({
  student_name: z.string().min(2),
  parent_name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  grade: z.string().min(1),
  service: z.string().min(1),
  ap_subject: z.string().optional(),
  current_score: z.string().optional(),
  target_score: z.string().optional(),
  test_date: z.string().optional(),
  tutoring_format: z.string().min(1),
  availability_notes: z.string().optional(),
  help_needed: z.string().optional(),
  consent: z.boolean().refine((v) => v === true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const leadData = {
      student_name: parsed.student_name,
      parent_name: parsed.parent_name || null,
      email: parsed.email,
      phone: parsed.phone || null,
      grade: parsed.grade,
      service: parsed.service,
      ap_subject: parsed.ap_subject || null,
      current_score: parsed.current_score || null,
      target_score: parsed.target_score || null,
      test_date: parsed.test_date || null,
      tutoring_format: parsed.tutoring_format,
      availability_notes: parsed.availability_notes || null,
      help_needed: parsed.help_needed || null,
    };

    // Try Supabase first
    const client = getServiceRoleClient();
    if (client) {
      const { error } = await client.from("leads").insert([leadData]);
      if (error) {
        console.error("[leads] Supabase insert error:", error);
        // Fall through to log-only fallback
      } else {
        return NextResponse.json({ success: true, stored: "supabase" });
      }
    }

    // Fallback: log to server console
    console.log("[leads] New inquiry (Supabase not configured):", JSON.stringify(leadData, null, 2));
    return NextResponse.json({ success: true, stored: "log" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: err.issues }, { status: 400 });
    }
    console.error("[leads] Unexpected error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
