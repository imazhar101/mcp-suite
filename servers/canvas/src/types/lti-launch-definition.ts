export interface LtiLaunchDefinition {
  definition_type: string;
  definition_id: string;
  name: string;
  description?: string;
  url: string;
  domain?: string;
  placements: Record<string, LtiPlacementLaunchDefinition>;
}

export interface LtiPlacementLaunchDefinition {
  message_type: string;
  url: string;
  title: string;
}

export interface ListLtiLaunchDefinitionsParams {
  course_id?: string;
  account_id?: string;
  placements?: string[];
  only_visible?: boolean;
}
