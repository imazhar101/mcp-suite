import { AxiosInstance } from "axios";
import {
  LtiLaunchDefinition,
  ListLtiLaunchDefinitionsParams,
} from "../types/lti-launch-definition.js";

export class LtiLaunchDefinitionService {
  constructor(private canvasClient: AxiosInstance) {}

  async listLtiLaunchDefinitions(
    params: ListLtiLaunchDefinitionsParams
  ): Promise<LtiLaunchDefinition[]> {
    let endpoint: string;

    if (params.course_id) {
      endpoint = `/courses/${params.course_id}/lti_apps/launch_definitions`;
    } else if (params.account_id) {
      endpoint = `/accounts/${params.account_id}/lti_apps/launch_definitions`;
    } else {
      throw new Error("Either course_id or account_id must be provided");
    }

    const queryParams = new URLSearchParams();

    if (params.placements && params.placements.length > 0) {
      params.placements.forEach((placement) => {
        queryParams.append("placements[]", placement);
      });
    }

    if (params.only_visible !== undefined) {
      queryParams.append("only_visible", params.only_visible.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    const response = await this.canvasClient.get(url);
    return response.data;
  }
}
