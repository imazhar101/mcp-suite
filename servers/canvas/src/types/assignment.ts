export interface Assignment {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  due_at?: string;
  lock_at?: string;
  unlock_at?: string;
  has_overrides: boolean;
  all_dates?: AssignmentDate[];
  course_id: number;
  html_url: string;
  submissions_download_url?: string;
  assignment_group_id: number;
  due_date_required: boolean;
  allowed_extensions?: string[];
  max_name_length: number;
  turnitin_enabled?: boolean;
  vericite_enabled?: boolean;
  turnitin_settings?: TurnitinSettings;
  grade_group_students_individually: boolean;
  external_tool_tag_attributes?: ExternalToolTagAttributes;
  peer_reviews: boolean;
  automatic_peer_reviews: boolean;
  peer_review_count?: number;
  peer_reviews_assign_at?: string;
  intra_group_peer_reviews: boolean;
  group_category_id?: number;
  needs_grading_count?: number;
  needs_grading_count_by_section?: NeedsGradingCount[];
  position: number;
  post_to_sis?: boolean;
  integration_id?: string;
  integration_data?: any;
  points_possible: number;
  submission_types: string[];
  has_submitted_submissions: boolean;
  grading_type: string;
  grading_standard_id?: number;
  published: boolean;
  unpublishable: boolean;
  only_visible_to_overrides: boolean;
  locked_for_user: boolean;
  lock_info?: LockInfo;
  lock_explanation?: string;
  quiz_id?: number;
  anonymous_submissions?: boolean;
  discussion_topic?: any;
  freeze_on_copy?: boolean;
  frozen?: boolean;
  frozen_attributes?: string[];
  submission?: any;
  use_rubric_for_grading?: boolean;
  rubric_settings?: any;
  rubric?: any;
  assignment_visibility?: number[];
  overrides?: AssignmentOverride[];
  omit_from_final_grade?: boolean;
  hide_in_gradebook?: boolean;
  moderated_grading: boolean;
  grader_count?: number;
  final_grader_id?: number;
  grader_comments_visible_to_graders?: boolean;
  graders_anonymous_to_graders?: boolean;
  grader_names_visible_to_final_grader?: boolean;
  anonymous_grading?: boolean;
  allowed_attempts?: number;
  post_manually?: boolean;
  score_statistics?: ScoreStatistic;
  can_submit?: boolean;
  ab_guid?: string[];
  annotatable_attachment_id?: number;
  anonymize_students?: boolean;
  require_lockdown_browser?: boolean;
  important_dates?: boolean;
  muted?: boolean;
  anonymous_peer_reviews?: boolean;
  anonymous_instructor_annotations?: boolean;
  graded_submissions_exist?: boolean;
  is_quiz_assignment?: boolean;
  in_closed_grading_period?: boolean;
  can_duplicate?: boolean;
  original_course_id?: number;
  original_assignment_id?: number;
  original_lti_resource_link_id?: number;
  original_assignment_name?: string;
  original_quiz_id?: number;
  workflow_state: string;
}

export interface AssignmentDate {
  id?: number;
  base?: boolean;
  title?: string;
  due_at?: string;
  unlock_at?: string;
  lock_at?: string;
}

export interface TurnitinSettings {
  originality_report_visibility: string;
  s_paper_check: boolean;
  internet_check: boolean;
  journal_check: boolean;
  exclude_biblio: boolean;
  exclude_quoted: boolean;
  exclude_small_matches_type: string;
  exclude_small_matches_value: number;
}

export interface ExternalToolTagAttributes {
  url: string;
  new_tab: boolean;
  resource_link_id: string;
}

export interface LockInfo {
  asset_string: string;
  unlock_at?: string;
  lock_at?: string;
  context_module?: any;
  manually_locked: boolean;
}

export interface NeedsGradingCount {
  section_id: string;
  needs_grading_count: number;
}

export interface ScoreStatistic {
  min: number;
  max: number;
  mean: number;
  upper_q: number;
  median: number;
  lower_q: number;
}

export interface AssignmentOverride {
  id: number;
  assignment_id?: number;
  quiz_id?: number;
  context_module_id?: number;
  discussion_topic_id?: number;
  wiki_page_id?: number;
  attachment_id?: number;
  student_ids?: number[];
  group_id?: number;
  course_section_id?: number;
  title: string;
  due_at?: string;
  all_day?: boolean;
  all_day_date?: string;
  unlock_at?: string;
  lock_at?: string;
}

export interface AssignmentListParams {
  include?: string[];
  search_term?: string;
  override_assignment_dates?: boolean;
  needs_grading_count_by_section?: boolean;
  bucket?: string;
  assignment_ids?: string[];
  order_by?: string;
  post_to_sis?: boolean;
  new_quizzes?: boolean;
}

export interface AssignmentCreateParams {
  name: string;
  position?: number;
  submission_types?: string[];
  allowed_extensions?: string[];
  turnitin_enabled?: boolean;
  vericite_enabled?: boolean;
  turnitin_settings?: string;
  integration_data?: string;
  integration_id?: string;
  peer_reviews?: boolean;
  automatic_peer_reviews?: boolean;
  notify_of_update?: boolean;
  group_category_id?: number;
  grade_group_students_individually?: boolean;
  external_tool_tag_attributes?: string;
  points_possible?: number;
  grading_type?: string;
  due_at?: string;
  lock_at?: string;
  unlock_at?: string;
  description?: string;
  assignment_group_id?: number;
  assignment_overrides?: AssignmentOverride[];
  only_visible_to_overrides?: boolean;
  published?: boolean;
  grading_standard_id?: number;
  omit_from_final_grade?: boolean;
  hide_in_gradebook?: boolean;
  quiz_lti?: boolean;
  moderated_grading?: boolean;
  grader_count?: number;
  final_grader_id?: number;
  grader_comments_visible_to_graders?: boolean;
  graders_anonymous_to_graders?: boolean;
  graders_names_visible_to_final_grader?: boolean;
  anonymous_grading?: boolean;
  allowed_attempts?: number;
  annotatable_attachment_id?: number;
}

export interface AssignmentUpdateParams
  extends Partial<AssignmentCreateParams> {
  sis_assignment_id?: string;
  force_updated_at?: boolean;
}

export interface AssignmentShowParams {
  include?: string[];
  override_assignment_dates?: boolean;
  needs_grading_count_by_section?: boolean;
  all_dates?: boolean;
}

export interface BulkUpdateAssignmentParams {
  id: number;
  all_dates: AssignmentDate[];
}
