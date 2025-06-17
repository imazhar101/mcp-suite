import { AxiosInstance } from "axios";
import {
  ExternalTool,
  ExternalToolListParams,
  ExternalToolCreateParams,
  ExternalToolUpdateParams,
  SessionlessLaunchParams,
  SessionlessLaunchResponse,
  VisibleCourseNavToolsParams,
} from "../types/external-tool.js";

export class ExternalToolService {
  constructor(private canvasClient: AxiosInstance) {}

  // External Tool Management
  async listExternalTools(
    context: "courses" | "accounts" | "groups",
    contextId: string,
    params?: ExternalToolListParams
  ): Promise<ExternalTool[]> {
    const response = await this.canvasClient.get(
      `/${context}/${contextId}/external_tools`,
      { params }
    );
    return response.data;
  }

  async getExternalTool(
    context: "courses" | "accounts",
    contextId: string,
    toolId: string
  ): Promise<ExternalTool> {
    const response = await this.canvasClient.get(
      `/${context}/${contextId}/external_tools/${toolId}`
    );
    return response.data;
  }

  async createExternalTool(
    context: "courses" | "accounts",
    contextId: string,
    toolData: ExternalToolCreateParams
  ): Promise<ExternalTool> {
    const response = await this.canvasClient.post(
      `/${context}/${contextId}/external_tools`,
      toolData
    );
    return response.data;
  }

  async updateExternalTool(
    context: "courses" | "accounts",
    contextId: string,
    toolId: string,
    toolData: ExternalToolUpdateParams
  ): Promise<ExternalTool> {
    const response = await this.canvasClient.put(
      `/${context}/${contextId}/external_tools/${toolId}`,
      toolData
    );
    return response.data;
  }

  async deleteExternalTool(
    context: "courses" | "accounts",
    contextId: string,
    toolId: string
  ): Promise<ExternalTool> {
    const response = await this.canvasClient.delete(
      `/${context}/${contextId}/external_tools/${toolId}`
    );
    return response.data;
  }

  // Sessionless Launch
  async getSessionlessLaunch(
    context: "courses" | "accounts",
    contextId: string,
    params: SessionlessLaunchParams
  ): Promise<SessionlessLaunchResponse> {
    const response = await this.canvasClient.get(
      `/${context}/${contextId}/external_tools/sessionless_launch`,
      { params }
    );
    return response.data;
  }

  // RCE Favorites
  async addRceFavorite(accountId: string, toolId: string): Promise<void> {
    await this.canvasClient.post(
      `/accounts/${accountId}/external_tools/rce_favorites/${toolId}`
    );
  }

  async removeRceFavorite(accountId: string, toolId: string): Promise<void> {
    await this.canvasClient.delete(
      `/accounts/${accountId}/external_tools/rce_favorites/${toolId}`
    );
  }

  // Top Navigation Favorites
  async addTopNavFavorite(accountId: string, toolId: string): Promise<void> {
    await this.canvasClient.post(
      `/accounts/${accountId}/external_tools/top_nav_favorites/${toolId}`
    );
  }

  async removeTopNavFavorite(accountId: string, toolId: string): Promise<void> {
    await this.canvasClient.delete(
      `/accounts/${accountId}/external_tools/top_nav_favorites/${toolId}`
    );
  }

  // Visible Course Navigation Tools
  async getVisibleCourseNavTools(
    params: VisibleCourseNavToolsParams
  ): Promise<ExternalTool[]> {
    const response = await this.canvasClient.get(
      "/external_tools/visible_course_nav_tools",
      { params }
    );
    return response.data;
  }

  async getVisibleCourseNavToolsForCourse(
    courseId: string
  ): Promise<ExternalTool[]> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/external_tools/visible_course_nav_tools`
    );
    return response.data;
  }
}
