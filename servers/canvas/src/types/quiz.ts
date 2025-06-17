import { CanvasEntity } from "./index.js";

// Quiz Types
export interface Quiz extends CanvasEntity {
  title: string;
  html_url: string;
  mobile_url: string;
  preview_url?: string;
  description: string;
  quiz_type: "practice_quiz" | "assignment" | "graded_survey" | "survey";
  assignment_group_id?: number;
  time_limit?: number;
  shuffle_answers: boolean;
  hide_results?: "always" | "until_after_last_attempt" | null;
  show_correct_answers: boolean;
  show_correct_answers_last_attempt: boolean;
  show_correct_answers_at?: string;
  hide_correct_answers_at?: string;
  one_time_results: boolean;
  scoring_policy: "keep_highest" | "keep_latest";
  allowed_attempts: number;
  one_question_at_a_time: boolean;
  question_count: number;
  points_possible: number;
  cant_go_back: boolean;
  access_code?: string;
  ip_filter?: string;
  due_at?: string;
  lock_at?: string;
  unlock_at?: string;
  published: boolean;
  unpublishable: boolean;
  locked_for_user: boolean;
  lock_info?: any;
  lock_explanation?: string;
  speedgrader_url?: string;
  quiz_extensions_url?: string;
  permissions?: QuizPermissions;
  all_dates?: any[];
  version_number: number;
  question_types: string[];
  anonymous_submissions: boolean;
  quiz_id?: number;
}

export interface QuizPermissions {
  read: boolean;
  submit: boolean;
  create: boolean;
  manage: boolean;
  read_statistics: boolean;
  review_grades: boolean;
  update: boolean;
}

// Quiz Question Types
export interface QuizQuestion extends CanvasEntity {
  quiz_id: number;
  position: number;
  question_name: string;
  question_type: QuestionType;
  question_text: string;
  points_possible: number;
  correct_comments?: string;
  incorrect_comments?: string;
  neutral_comments?: string;
  answers?: Answer[];
}

export type QuestionType =
  | "calculated_question"
  | "essay_question"
  | "file_upload_question"
  | "fill_in_multiple_blanks_question"
  | "matching_question"
  | "multiple_answers_question"
  | "multiple_choice_question"
  | "multiple_dropdowns_question"
  | "numerical_question"
  | "short_answer_question"
  | "text_only_question"
  | "true_false_question";

export interface Answer {
  id?: number;
  answer_text: string;
  answer_weight: number;
  answer_comments?: string;
  text_after_answers?: string;
  answer_match_left?: string;
  answer_match_right?: string;
  matching_answer_incorrect_matches?: string;
  numerical_answer_type?: "exact_answer" | "range_answer" | "precision_answer";
  exact?: number;
  margin?: number;
  approximate?: number;
  precision?: number;
  start?: number;
  end?: number;
  blank_id?: number;
}

// Request Parameter Types
export interface QuizListParams {
  search_term?: string;
}

export interface QuizCreateParams {
  title: string;
  description?: string;
  quiz_type?: "practice_quiz" | "assignment" | "graded_survey" | "survey";
  assignment_group_id?: number;
  time_limit?: number;
  shuffle_answers?: boolean;
  hide_results?: "always" | "until_after_last_attempt";
  show_correct_answers?: boolean;
  show_correct_answers_last_attempt?: boolean;
  show_correct_answers_at?: string;
  hide_correct_answers_at?: string;
  allowed_attempts?: number;
  scoring_policy?: "keep_highest" | "keep_latest";
  one_question_at_a_time?: boolean;
  cant_go_back?: boolean;
  access_code?: string;
  ip_filter?: string;
  due_at?: string;
  lock_at?: string;
  unlock_at?: string;
  published?: boolean;
  one_time_results?: boolean;
  only_visible_to_overrides?: boolean;
}

export interface QuizUpdateParams extends QuizCreateParams {
  notify_of_update?: boolean;
}

export interface QuizQuestionCreateParams {
  question_name?: string;
  question_text?: string;
  quiz_group_id?: number;
  question_type?: QuestionType;
  position?: number;
  points_possible?: number;
  correct_comments?: string;
  incorrect_comments?: string;
  neutral_comments?: string;
  text_after_answers?: string;
  answers?: Partial<Answer>[];
}

export interface QuizQuestionUpdateParams extends QuizQuestionCreateParams {}

export interface QuizQuestionListParams {
  quiz_submission_id?: number;
  quiz_submission_attempt?: number;
}
