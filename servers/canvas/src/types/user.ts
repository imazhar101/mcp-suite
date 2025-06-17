import { CanvasEntity, UserIncludeOptions } from "./index.js";

export interface User extends CanvasEntity {
  name: string;
  sortable_name: string;
  short_name: string;
  last_name?: string;
  first_name?: string;
  sis_user_id?: string;
  sis_import_id?: number;
  integration_id?: string;
  login_id: string;
  avatar_url?: string;
  avatar_state?:
    | "approved"
    | "submitted"
    | "locked"
    | "reported"
    | "re_reported";
  enrollments?: any[];
  email?: string;
  locale?: string;
  effective_locale?: string;
  last_login?: string;
  time_zone?: string;
  bio?: string;
  pronouns?: string;
  title?: string;
  pronunciation?: string;
  permissions?: {
    can_update_name?: boolean;
    can_update_avatar?: boolean;
    limit_parent_app_web_access?: boolean;
  };
}

export interface UserDisplay {
  id: number;
  short_name: string;
  avatar_image_url?: string;
  html_url: string;
}

export interface AnonymousUserDisplay {
  anonymous_id: string;
  avatar_image_url: string;
  display_name: string;
}

export interface Profile {
  id: number;
  name: string;
  short_name: string;
  sortable_name: string;
  title?: string;
  bio?: string;
  pronunciation?: string;
  primary_email: string;
  login_id: string;
  sis_user_id?: string;
  lti_user_id?: string;
  avatar_url: string;
  calendar?: any;
  time_zone?: string;
  locale?: string;
  k5_user?: boolean;
  use_classic_font_in_k5?: boolean;
}

export interface Avatar {
  type: "gravatar" | "attachment" | "no_pic";
  url: string;
  token: string;
  display_name: string;
  id?: number;
  "content-type"?: string;
  filename?: string;
  size?: number;
}

export interface PageView {
  id: string;
  app_name?: string;
  url: string;
  context_type?: string;
  asset_type?: string;
  controller?: string;
  action?: string;
  contributed: boolean;
  interaction_seconds?: number;
  created_at: string;
  user_request: boolean;
  render_time?: number;
  user_agent?: string;
  participated: boolean;
  http_method: string;
  remote_ip?: string;
  links?: {
    user?: number;
    context?: number;
    asset?: number;
    real_user?: number;
    account?: number;
  };
}

export interface CourseNickname {
  course_id: number;
  name: string;
  nickname: string;
}

export interface UserSettings {
  manual_mark_as_read?: boolean;
  release_notes_badge_disabled?: boolean;
  collapse_global_nav?: boolean;
  collapse_course_nav?: boolean;
  hide_dashcard_color_overlays?: boolean;
  comment_library_suggestions_enabled?: boolean;
  elementary_dashboard_disabled?: boolean;
}

export interface CustomColors {
  custom_colors: Record<string, string>;
}

export interface DashboardPositions {
  dashboard_positions: Record<string, number>;
}

// User list parameters for account-level user listing
export interface AccountUserListParams {
  account_id: string;
  search_term?: string;
  enrollment_type?: "student" | "teacher" | "ta" | "observer" | "designer";
  sort?: "username" | "email" | "sis_id" | "integration_id" | "last_login";
  order?: "asc" | "desc";
  include_deleted_users?: boolean;
}

// User list parameters for course-level user listing
export interface CourseUserListParams {
  course_id: string;
  search_term?: string;
  sort?: "username" | "last_login" | "email" | "sis_id";
  enrollment_type?: Array<
    "teacher" | "student" | "student_view" | "ta" | "observer" | "designer"
  >;
  enrollment_state?: Array<
    "active" | "invited" | "rejected" | "completed" | "inactive"
  >;
  include?: UserIncludeOptions[];
}

export interface UserProgressParams {
  course_id: string;
  user_id: string;
}

export interface UserCreateParams {
  account_id: string;
  user: {
    name?: string;
    short_name?: string;
    sortable_name?: string;
    time_zone?: string;
    locale?: string;
    terms_of_use?: boolean;
    skip_registration?: boolean;
  };
  pseudonym: {
    unique_id: string;
    password?: string;
    sis_user_id?: string;
    integration_id?: string;
    send_confirmation?: boolean;
    force_self_registration?: boolean;
    authentication_provider_id?: string;
  };
  communication_channel?: {
    type?: string;
    address?: string;
    confirmation_url?: boolean;
    skip_confirmation?: boolean;
  };
  force_validations?: boolean;
  enable_sis_reactivation?: boolean;
  destination?: string;
  initial_enrollment_type?: string;
  pairing_code?: {
    code?: string;
  };
}

export interface UserUpdateParams {
  user_id: string;
  user?: {
    name?: string;
    short_name?: string;
    sortable_name?: string;
    time_zone?: string;
    email?: string;
    locale?: string;
    avatar?: {
      token?: string;
      url?: string;
      state?:
        | "none"
        | "submitted"
        | "approved"
        | "locked"
        | "reported"
        | "re_reported";
    };
    title?: string;
    bio?: string;
    pronunciation?: string;
    pronouns?: string;
    event?: "suspend" | "unsuspend";
  };
  override_sis_stickiness?: boolean;
}

export interface MissingSubmissionsParams {
  user_id: string;
  observed_user_id?: string;
  include?: Array<"planner_overrides" | "course">;
  filter?: Array<"submittable" | "current_grading_period">;
  course_ids?: string[];
}

export interface PageViewParams {
  user_id: string;
  start_time?: string;
  end_time?: string;
}

export interface ActivityStreamParams {
  only_active_courses?: boolean;
}

export interface TodoItemsParams {
  include?: Array<"ungraded_quizzes">;
}

export interface CustomDataParams {
  user_id: string;
  scope?: string;
  ns: string;
  data?: any;
}
