import { CanvasEntity, CourseIncludeOptions } from "./index.js";

export interface Course extends CanvasEntity {
  name: string;
  course_code: string;
  workflow_state: string;
  account_id: number;
  root_account_id: number;
  enrollment_term_id: number;
  start_at?: string;
  end_at?: string;
  locale?: string;
  enrollments?: any[];
  total_students?: number;
  default_view: string;
  syllabus_body?: string;
  public_description?: string;
  storage_quota_mb?: number;
  is_public?: boolean;
  is_public_to_auth_users?: boolean;
  public_syllabus?: boolean;
  public_syllabus_to_auth?: boolean;
  apply_assignment_group_weights?: boolean;
  permissions?: Record<string, boolean>;
  time_zone?: string;
  blueprint?: boolean;
  template?: boolean;
}

export interface CourseCreateParams {
  account_id: string;
  name?: string;
  course_code?: string;
  start_at?: string;
  end_at?: string;
  license?:
    | "private"
    | "cc_by_nc_nd"
    | "cc_by_nc_sa"
    | "cc_by_nc"
    | "cc_by_nd"
    | "cc_by_sa"
    | "cc_by"
    | "public_domain";
  is_public?: boolean;
  is_public_to_auth_users?: boolean;
  public_syllabus?: boolean;
  public_description?: string;
  allow_student_wiki_edits?: boolean;
  allow_wiki_comments?: boolean;
  allow_student_forum_attachments?: boolean;
  open_enrollment?: boolean;
  self_enrollment?: boolean;
  restrict_enrollments_to_course_dates?: boolean;
  term_id?: string;
  sis_course_id?: string;
  integration_id?: string;
  hide_final_grades?: boolean;
  apply_assignment_group_weights?: boolean;
  time_zone?: string;
  offer?: boolean;
  enroll_me?: boolean;
  default_view?: "feed" | "wiki" | "modules" | "syllabus" | "assignments";
  syllabus_body?: string;
  grading_standard_id?: number;
  course_format?: "on_campus" | "online" | "blended";
}

export interface CourseUpdateParams {
  course_id: string;
  name?: string;
  course_code?: string;
  start_at?: string;
  end_at?: string;
  license?: string;
  is_public?: boolean;
  is_public_to_auth_users?: boolean;
  public_syllabus?: boolean;
  public_description?: string;
  allow_student_wiki_edits?: boolean;
  allow_wiki_comments?: boolean;
  allow_student_forum_attachments?: boolean;
  open_enrollment?: boolean;
  self_enrollment?: boolean;
  restrict_enrollments_to_course_dates?: boolean;
  hide_final_grades?: boolean;
  apply_assignment_group_weights?: boolean;
  time_zone?: string;
  offer?: boolean;
  event?: "claim" | "offer" | "conclude" | "delete" | "undelete";
  default_view?: "feed" | "wiki" | "modules" | "syllabus" | "assignments";
  syllabus_body?: string;
  grading_standard_id?: number;
  course_format?: "on_campus" | "online" | "blended";
}

export interface CourseListParams {
  enrollment_type?: "teacher" | "student" | "ta" | "observer" | "designer";
  enrollment_state?: "active" | "invited_or_pending" | "completed";
  state?: Array<"unpublished" | "available" | "completed" | "deleted">;
  include?: CourseIncludeOptions[];
}

export interface CourseSettings {
  allow_student_discussion_topics?: boolean;
  allow_student_forum_attachments?: boolean;
  allow_student_discussion_editing?: boolean;
  allow_student_organized_groups?: boolean;
  hide_final_grades?: boolean;
  hide_distribution_graphs?: boolean;
  lock_all_announcements?: boolean;
  usage_rights_required?: boolean;
  restrict_student_past_view?: boolean;
  restrict_student_future_view?: boolean;
  show_announcements_on_home_page?: boolean;
  home_page_announcement_limit?: number;
  syllabus_course_summary?: boolean;
  default_due_time?: string;
}

export interface CourseProgress {
  requirement_count: number;
  requirement_completed_count: number;
  next_requirement_url?: string;
  completed_at?: string;
}
