export interface Module {
  id: number;
  workflow_state: string;
  position: number;
  name: string;
  unlock_at?: string;
  require_sequential_progress: boolean;
  requirement_type?: "all" | "one";
  prerequisite_module_ids: number[];
  items_count: number;
  items_url: string;
  items?: ModuleItem[];
  state?: "locked" | "unlocked" | "started" | "completed";
  completed_at?: string;
  publish_final_grade?: boolean;
  published?: boolean;
}

export interface ModuleItem {
  id: number;
  module_id: number;
  position: number;
  title: string;
  indent: number;
  type:
    | "File"
    | "Page"
    | "Discussion"
    | "Assignment"
    | "Quiz"
    | "SubHeader"
    | "ExternalUrl"
    | "ExternalTool";
  content_id?: number;
  html_url: string;
  url?: string;
  page_url?: string;
  external_url?: string;
  new_tab?: boolean;
  completion_requirement?: CompletionRequirement;
  content_details?: ContentDetails;
  published?: boolean;
}

export interface CompletionRequirement {
  type:
    | "must_view"
    | "must_submit"
    | "must_contribute"
    | "min_score"
    | "min_percentage"
    | "must_mark_done";
  min_score?: number;
  min_percentage?: number;
  completed?: boolean;
}

export interface ContentDetails {
  points_possible?: number;
  due_at?: string;
  unlock_at?: string;
  lock_at?: string;
  locked_for_user?: boolean;
  lock_explanation?: string;
  lock_info?: any;
}

export interface ModuleItemSequenceNode {
  prev?: ModuleItem;
  current: ModuleItem;
  next?: ModuleItem;
  mastery_path?: MasteryPath;
}

export interface ModuleItemSequence {
  items: ModuleItemSequenceNode[];
  modules: Module[];
}

export interface MasteryPath {
  locked: boolean;
  assignment_sets: any[];
  selected_set_id?: number;
  awaiting_choice: boolean;
  still_processing: boolean;
  modules_url: string;
  choose_url: string;
  modules_tab_disabled: boolean;
}

export interface ModuleAssignmentOverride {
  id: number;
  context_module_id: number;
  title: string;
  students?: any[];
  course_section?: any;
}

export interface OverrideTarget {
  id: number;
  name: string;
}

// Request parameter interfaces
export interface ModuleListParams {
  include?: ("items" | "content_details")[];
  search_term?: string;
  student_id?: string;
}

export interface ModuleShowParams {
  include?: ("items" | "content_details")[];
  student_id?: string;
}

export interface ModuleCreateParams {
  name: string;
  unlock_at?: string;
  position?: number;
  require_sequential_progress?: boolean;
  prerequisite_module_ids?: number[];
  publish_final_grade?: boolean;
}

export interface ModuleUpdateParams {
  name?: string;
  unlock_at?: string;
  position?: number;
  require_sequential_progress?: boolean;
  prerequisite_module_ids?: number[];
  publish_final_grade?: boolean;
  published?: boolean;
}

export interface ModuleItemListParams {
  include?: "content_details"[];
  search_term?: string;
  student_id?: string;
}

export interface ModuleItemShowParams {
  include?: "content_details"[];
  student_id?: string;
}

export interface ModuleItemCreateParams {
  title?: string;
  type:
    | "File"
    | "Page"
    | "Discussion"
    | "Assignment"
    | "Quiz"
    | "SubHeader"
    | "ExternalUrl"
    | "ExternalTool";
  content_id?: string;
  position?: number;
  indent?: number;
  page_url?: string;
  external_url?: string;
  new_tab?: boolean;
  completion_requirement?: {
    type: "must_view" | "must_contribute" | "must_submit" | "must_mark_done";
    min_score?: number;
  };
  iframe?: {
    width?: number;
    height?: number;
  };
}

export interface ModuleItemUpdateParams {
  title?: string;
  position?: number;
  indent?: number;
  external_url?: string;
  new_tab?: boolean;
  completion_requirement?: {
    type: "must_view" | "must_contribute" | "must_submit" | "must_mark_done";
    min_score?: number;
  };
  published?: boolean;
  module_id?: string;
}

export interface ModuleItemSequenceParams {
  asset_type:
    | "ModuleItem"
    | "File"
    | "Page"
    | "Discussion"
    | "Assignment"
    | "Quiz"
    | "ExternalTool";
  asset_id: number;
}

export interface MasteryPathSelectParams {
  assignment_set_id?: string;
  student_id?: string;
}

export interface ModuleOverrideUpdateParams {
  overrides: Array<{
    id?: number;
    title?: string;
    student_ids?: number[];
    course_section_id?: number;
    group_id?: number;
  }>;
}
