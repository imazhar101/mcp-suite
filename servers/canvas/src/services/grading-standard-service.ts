import { AxiosInstance } from "axios";
import {
  GradingStandard,
  GradingStandardCreateParams,
  GradingStandardListParams,
  GradingStandardGetParams,
} from "../types/grading-standard.js";

export class GradingStandardService {
  constructor(private canvasClient: AxiosInstance) {}

  async createGradingStandard(
    contextType: "course" | "account",
    contextId: string,
    params: GradingStandardCreateParams
  ): Promise<GradingStandard> {
    const requestData: any = {
      title: params.title,
    };

    if (params.points_based !== undefined) {
      requestData.points_based = params.points_based;
    }

    if (params.scaling_factor !== undefined) {
      requestData.scaling_factor = params.scaling_factor;
    }

    // Convert grading scheme entries to the format expected by Canvas API
    if (params.grading_scheme_entry) {
      params.grading_scheme_entry.forEach((entry, index) => {
        requestData[`grading_scheme_entry[${index}][name]`] = entry.name;
        requestData[`grading_scheme_entry[${index}][value]`] = entry.value;
      });
    }

    const endpoint =
      contextType === "course"
        ? `/courses/${contextId}/grading_standards`
        : `/accounts/${contextId}/grading_standards`;

    const response = await this.canvasClient.post(endpoint, requestData);
    return response.data;
  }

  async listGradingStandards(
    contextType: "course" | "account",
    contextId: string
  ): Promise<GradingStandard[]> {
    const endpoint =
      contextType === "course"
        ? `/courses/${contextId}/grading_standards`
        : `/accounts/${contextId}/grading_standards`;

    const response = await this.canvasClient.get(endpoint);
    return response.data;
  }

  async getGradingStandard(
    contextType: "course" | "account",
    contextId: string,
    gradingStandardId: string
  ): Promise<GradingStandard> {
    const endpoint =
      contextType === "course"
        ? `/courses/${contextId}/grading_standards/${gradingStandardId}`
        : `/accounts/${contextId}/grading_standards/${gradingStandardId}`;

    const response = await this.canvasClient.get(endpoint);
    return response.data;
  }
}
