export interface Lead {
  id: string;
  student_name: string;
  parent_name?: string;
  email: string;
  phone?: string;
  grade?: string;
  service: string;
  ap_subject?: string;
  current_score?: string;
  target_score?: string;
  test_date?: string;
  tutoring_format?: string;
  availability_notes?: string;
  help_needed?: string;
  created_at: string;
}
