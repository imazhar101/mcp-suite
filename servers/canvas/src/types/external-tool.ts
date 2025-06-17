export interface ExternalTool {
  id: number;
  domain?: string;
  url?: string;
  consumer_key: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  privacy_level: "anonymous" | "name_only" | "email_only" | "public";
  custom_fields: Record<string, string>;
  is_rce_favorite?: boolean;
  is_top_nav_favorite?: boolean;
  account_navigation?: NavigationPlacement;
  assignment_selection?: NavigationPlacement;
  course_home_sub_navigation?: NavigationPlacement;
  course_navigation?: CourseNavigationPlacement;
  editor_button?: EditorButtonPlacement;
  homework_submission?: NavigationPlacement;
  link_selection?: NavigationPlacement;
  migration_selection?: NavigationPlacement;
  resource_selection?: ResourceSelectionPlacement;
  tool_configuration?: NavigationPlacement;
  user_navigation?: UserNavigationPlacement;
  selection_width?: number;
  selection_height?: number;
  icon_url?: string;
  not_selectable?: boolean;
  deployment_id?: string;
  unified_tool_id?: string;
}

export interface NavigationPlacement {
  canvas_icon_class?: string;
  icon_url?: string;
  text?: string;
  url?: string;
  label?: string;
  selection_width?: number;
  selection_height?: number;
  enabled?: boolean;
  message_type?: string;
}

export interface CourseNavigationPlacement extends NavigationPlacement {
  default?: "disabled" | "enabled";
  visibility?: "admins" | "members" | "public";
  windowTarget?: "_blank" | "_self";
  display_type?:
    | "full_width"
    | "full_width_in_context"
    | "full_width_with_nav"
    | "in_nav_context"
    | "borderless"
    | "default";
}

export interface UserNavigationPlacement extends NavigationPlacement {
  visibility?: "admins" | "members" | "public";
}

export interface EditorButtonPlacement extends NavigationPlacement {
  message_type?: "ContentItemSelectionRequest";
}

export interface ResourceSelectionPlacement extends NavigationPlacement {
  enabled?: boolean;
}

export interface SessionlessLaunchResponse {
  id: number;
  name: string;
  url: string;
}

// Request parameter interfaces
export interface ExternalToolListParams {
  search_term?: string;
  selectable?: boolean;
  include_parents?: boolean;
  placement?: string;
}

export interface ExternalToolCreateParams {
  client_id?: string;
  name: string;
  privacy_level: "anonymous" | "name_only" | "email_only" | "public";
  consumer_key: string;
  shared_secret: string;
  description?: string;
  url?: string;
  domain?: string;
  icon_url?: string;
  text?: string;
  custom_fields?: Record<string, string>;
  is_rce_favorite?: boolean;

  // Navigation placements
  account_navigation?: Partial<NavigationPlacement> & { display_type?: string };
  user_navigation?: Partial<UserNavigationPlacement>;
  course_home_sub_navigation?: Partial<NavigationPlacement>;
  course_navigation?: Partial<CourseNavigationPlacement>;
  editor_button?: Partial<EditorButtonPlacement>;
  homework_submission?: Partial<NavigationPlacement>;
  link_selection?: Partial<NavigationPlacement>;
  migration_selection?: Partial<NavigationPlacement>;
  tool_configuration?: Partial<NavigationPlacement> & {
    prefer_sis_email?: boolean;
  };
  resource_selection?: Partial<ResourceSelectionPlacement>;

  // Configuration options
  config_type?: "by_url" | "by_xml";
  config_xml?: string;
  config_url?: string;
  not_selectable?: boolean;
  oauth_compliant?: boolean;
  unified_tool_id?: string;
}

export interface ExternalToolUpdateParams
  extends Partial<ExternalToolCreateParams> {}

export interface SessionlessLaunchParams {
  id?: string;
  url?: string;
  assignment_id?: string;
  module_item_id?: string;
  launch_type?: "assessment" | "module_item" | string;
  resource_link_lookup_uuid?: string;
}

export interface VisibleCourseNavToolsParams {
  context_codes: string[];
}
