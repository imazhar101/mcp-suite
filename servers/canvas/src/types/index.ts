// Common Canvas API types
export interface CanvasApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface CanvasError {
  message: string;
  error_code?: string;
  errors?: Array<{
    message: string;
    attribute?: string;
  }>;
}

// Base Canvas entity
export interface CanvasEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

// Include options for various endpoints
export type CourseIncludeOptions =
  | "needs_grading_count"
  | "syllabus_body"
  | "public_description"
  | "total_scores"
  | "term"
  | "course_progress"
  | "sections"
  | "total_students"
  | "teachers"
  | "permissions"
  | "concluded";

export type UserIncludeOptions =
  | "enrollments"
  | "locked"
  | "avatar_url"
  | "test_student"
  | "bio"
  | "custom_links"
  | "current_grading_period_scores"
  | "uuid";

export type EnrollmentIncludeOptions =
  | "avatar_url"
  | "group_ids"
  | "locked"
  | "observed_users"
  | "can_be_removed"
  | "uuid"
  | "current_points"
  | "user";

// Export all types
export * from "./course.js";
export * from "./enrollment.js";
export * from "./user.js";
export * from "./quiz.js";
export * from "./assignment.js";
export * from "./submission.js";
export * from "./module.js";
export * from "./external-tool.js";
export * from "./admin.js";
export * from "./grade-change-log.js";
export * from "./login.js";
export * from "./authentication-provider.js";
export * from "./lti-launch-definition.js";
export * from "./page.js";
export * from "./grading-standard.js";
