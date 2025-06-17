export interface Submission {
  assignment_id: number;
  assignment?: any;
  course?: any;
  attempt: number;
  body?: string;
  grade?: string;
  grade_matches_current_submission: boolean;
  html_url: string;
  preview_url: string;
  score?: number;
  submission_comments?: SubmissionComment[];
  submission_type?: string;
  submitted_at?: string;
  url?: string;
  user_id: number;
  grader_id?: number;
  graded_at?: string;
  user?: any;
  late: boolean;
  assignment_visible: boolean;
  excused?: boolean;
  missing?: boolean;
  late_policy_status?: string;
  points_deducted?: number;
  seconds_late?: number;
  workflow_state: string;
  extra_attempts?: number;
  anonymous_id?: string;
  posted_at?: string;
  read_status?: string;
  redo_request?: boolean;
}

export interface SubmissionComment {
  id: number;
  author_id: number;
  author_name: string;
  author?: any;
  comment: string;
  created_at: string;
  edited_at?: string;
  media_comment?: MediaComment;
}

export interface MediaComment {
  "content-type": string;
  display_name: string;
  media_id: string;
  media_type: string;
  url: string;
}

export interface SubmissionListParams {
  include?: string[];
  grouped?: boolean;
}

export interface SubmissionMultipleParams {
  student_ids?: string[];
  assignment_ids?: string[];
  grouped?: boolean;
  post_to_sis?: boolean;
  submitted_since?: string;
  graded_since?: string;
  grading_period_id?: number;
  workflow_state?: string;
  enrollment_state?: string;
  state_based_on_date?: boolean;
  order?: string;
  order_direction?: string;
  include?: string[];
}

export interface SubmissionShowParams {
  include?: string[];
}

export interface SubmissionCreateParams {
  submission_type: string;
  body?: string;
  url?: string;
  file_ids?: number[];
  media_comment_id?: string;
  media_comment_type?: string;
  user_id?: number;
  annotatable_attachment_id?: number;
  submitted_at?: string;
}

export interface SubmissionUpdateParams {
  posted_grade?: string;
  excuse?: boolean;
  late_policy_status?: string;
  sticker?: string;
  seconds_late_override?: number;
}

export interface SubmissionCommentParams {
  text_comment?: string;
  attempt?: number;
  group_comment?: boolean;
  media_comment_id?: string;
  media_comment_type?: string;
  file_ids?: number[];
}

export interface BulkUpdateGradeData {
  [studentId: string]: {
    posted_grade?: string;
    excuse?: boolean;
    rubric_assessment?: any;
    text_comment?: string;
    group_comment?: boolean;
    media_comment_id?: string;
    media_comment_type?: string;
    file_ids?: number[];
  };
}

export interface SubmissionSummary {
  graded: number;
  ungraded: number;
  not_submitted: number;
}

export interface GradeableStudent {
  id: string;
  display_name: string;
  avatar_image_url?: string;
  html_url: string;
  assignment_ids?: number[];
}

// Gradebook History Types
export interface Day {
  date: string;
  graders: Grader[];
}

export interface Grader {
  id: number;
  name: string;
  assignments: number[];
}

export interface SubmissionVersion {
  assignment_id: number;
  assignment_name: string;
  body?: string;
  current_grade?: string;
  current_graded_at?: string;
  current_grader?: string;
  grade_matches_current_submission: boolean;
  graded_at?: string;
  grader?: string;
  grader_id?: number;
  id: number;
  new_grade?: string;
  new_graded_at?: string;
  new_grader?: string;
  previous_grade?: string;
  previous_graded_at?: string;
  previous_grader?: string;
  score?: number;
  user_name: string;
  submission_type?: string;
  url?: string;
  user_id: number;
  workflow_state: string;
}

export interface SubmissionHistory {
  submission_id: number;
  versions: SubmissionVersion[];
}

export interface GradebookHistoryFeedParams {
  assignment_id?: number;
  user_id?: number;
  ascending?: boolean;
}
