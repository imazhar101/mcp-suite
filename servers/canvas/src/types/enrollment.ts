import { CanvasEntity, EnrollmentIncludeOptions } from "./index.js";
import { User } from "./user.js";

export interface Grade {
  html_url?: string;
  current_grade?: string;
  final_grade?: string;
  current_score?: number;
  final_score?: number;
  current_points?: number;
  unposted_current_grade?: string;
  unposted_final_grade?: string;
  unposted_current_score?: number;
  unposted_final_score?: number;
  unposted_current_points?: number;
}

export interface Enrollment extends CanvasEntity {
  course_id: number;
  sis_course_id?: string;
  course_integration_id?: string;
  course_section_id: number;
  section_integration_id?: string;
  sis_account_id?: string;
  sis_section_id?: string;
  sis_user_id?: string;
  enrollment_state:
    | "active"
    | "invited"
    | "creation_pending"
    | "deleted"
    | "rejected"
    | "completed"
    | "inactive";
  limit_privileges_to_course_section?: boolean;
  sis_import_id?: number;
  root_account_id: number;
  type:
    | "StudentEnrollment"
    | "TeacherEnrollment"
    | "TaEnrollment"
    | "DesignerEnrollment"
    | "ObserverEnrollment";
  user_id: number;
  associated_user_id?: number;
  role: string;
  role_id: number;
  start_at?: string;
  end_at?: string;
  last_activity_at?: string;
  last_attended_at?: string;
  total_activity_time?: number;
  html_url?: string;
  grades?: Grade;
  user?: User;
  override_grade?: string;
  override_score?: number;
  unposted_current_grade?: string;
  unposted_final_grade?: string;
  unposted_current_score?: number;
  unposted_final_score?: number;
  has_grading_periods?: boolean;
  totals_for_all_grading_periods_option?: boolean;
  current_grading_period_title?: string;
  current_grading_period_id?: number;
  current_period_override_grade?: string;
  current_period_override_score?: number;
  current_period_unposted_current_score?: number;
  current_period_unposted_final_score?: number;
  current_period_unposted_current_grade?: string;
  current_period_unposted_final_grade?: string;
}

export interface EnrollmentListParams {
  type?: Array<
    | "StudentEnrollment"
    | "TeacherEnrollment"
    | "TaEnrollment"
    | "DesignerEnrollment"
    | "ObserverEnrollment"
  >;
  role?: string[];
  state?: Array<
    | "active"
    | "invited"
    | "creation_pending"
    | "deleted"
    | "rejected"
    | "completed"
    | "inactive"
    | "current_and_invited"
    | "current_and_future"
    | "current_future_and_restricted"
    | "current_and_concluded"
  >;
  include?: EnrollmentIncludeOptions[];
  user_id?: string;
  grading_period_id?: number;
  enrollment_term_id?: number;
  sis_account_id?: string[];
  sis_course_id?: string[];
  sis_section_id?: string[];
  sis_user_id?: string[];
  created_for_sis_id?: boolean;
}

export interface EnrollmentCreateParams {
  user_id: string;
  type:
    | "StudentEnrollment"
    | "TeacherEnrollment"
    | "TaEnrollment"
    | "ObserverEnrollment"
    | "DesignerEnrollment";
  role_id?: number;
  enrollment_state?: "active" | "invited" | "inactive";
  course_section_id?: number;
  limit_privileges_to_course_section?: boolean;
  notify?: boolean;
  self_enrollment_code?: string;
  self_enrolled?: boolean;
  associated_user_id?: number;
  start_at?: string;
  end_at?: string;
  sis_user_id?: string;
  integration_id?: string;
  root_account?: string;
}

export interface EnrollmentUpdateParams {
  enrollment_id: string;
  task?: "conclude" | "delete" | "inactivate" | "deactivate";
}

export interface EnrollmentAcceptRejectParams {
  course_id: string;
  enrollment_id: string;
}

export interface EnrollmentReactivateParams {
  course_id: string;
  enrollment_id: string;
}

export interface LastAttendedParams {
  course_id: string;
  user_id: string;
  date?: string;
}

export interface TemporaryEnrollmentStatusParams {
  user_id: string;
  account_id?: string;
}

export interface TemporaryEnrollmentStatus {
  is_provider: boolean;
  is_recipient: boolean;
  can_provide: boolean;
}

// Enrollment context types for different endpoints
export type EnrollmentContext = "course" | "section" | "user";

export interface EnrollmentContextParams {
  context: EnrollmentContext;
  context_id: string;
}
