import axios, { AxiosInstance } from "axios";
import { Logger } from "../../../../shared/utils/logger.js";
import { ErrorHandler } from "../../../../shared/middleware/error-handler.js";
import { AuthMiddleware } from "../../../../shared/middleware/auth.js";
import { ServerResponse } from "../../../../shared/types/common.js";
import {
  JiraConfig,
  ADFDocument,
  ADFNode,
  JiraIssue,
  JiraProject,
  JiraTransition,
  CreateIssueRequest,
  UpdateIssueRequest,
  SearchIssuesRequest,
} from "../types.js";

export class JiraService {
  private client: AxiosInstance;
  private logger: Logger;
  private errorHandler: ErrorHandler;
  private config: JiraConfig;

  constructor(config: JiraConfig, logger: Logger) {
    this.config = config;
    this.logger = logger.withContext({ server: "jira" });
    this.errorHandler = new ErrorHandler(this.logger);

    const auth = new AuthMiddleware({
      username: config.email,
      password: config.apiToken,
      baseUrl: config.baseUrl,
    });

    this.client = axios.create({
      baseURL: `${config.baseUrl}/rest/api/3`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...auth.getAuthHeaders(),
      },
    });
  }

  textToADF(text: string, format: "plain" | "rich" = "plain"): ADFDocument {
    if (format === "plain") {
      return {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: text,
              },
            ],
          },
        ],
      };
    }

    return {
      type: "doc",
      version: 1,
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Rich Text Example" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "This is " },
            { type: "text", text: "bold", marks: [{ type: "strong" }] },
            { type: "text", text: " and this is " },
            { type: "text", text: "italic", marks: [{ type: "em" }] },
            { type: "text", text: " text." },
          ],
        },
      ],
    };
  }

  processDescription(
    description: string | ADFDocument | undefined
  ): ADFDocument | undefined {
    if (!description) return undefined;
    if (typeof description === "string") {
      return this.textToADF(description);
    }
    return description;
  }

  async searchIssues(
    request: SearchIssuesRequest
  ): Promise<ServerResponse<JiraIssue[]>> {
    try {
      this.logger.info("Searching issues", { jql: request.jql });

      const response = await this.client.get("/search", {
        params: {
          jql: request.jql,
          maxResults: request.maxResults || 50,
          fields:
            "summary,status,assignee,reporter,priority,issuetype,project,created,updated,description",
        },
      });

      const issues: JiraIssue[] = response.data.issues.map((issue: any) => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        assignee: issue.fields.assignee?.displayName || "Unassigned",
        reporter: issue.fields.reporter.displayName,
        priority: issue.fields.priority.name,
        issueType: issue.fields.issuetype.name,
        project: {
          key: issue.fields.project.key,
          name: issue.fields.project.name,
        },
        created: issue.fields.created,
        updated: issue.fields.updated,
      }));

      return {
        success: true,
        data: issues,
        message: `Found ${response.data.total} issues (showing ${issues.length})`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }

  async getIssue(issueKey: string): Promise<ServerResponse<JiraIssue>> {
    try {
      this.logger.info("Getting issue", { issueKey });

      const response = await this.client.get(`/issue/${issueKey}`, {
        params: {
          fields:
            "summary,status,assignee,reporter,priority,issuetype,project,created,updated,description,comment",
        },
      });

      const issue = response.data;
      const issueData: JiraIssue = {
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description || "No description",
        status: issue.fields.status.name,
        assignee: issue.fields.assignee?.displayName || "Unassigned",
        reporter: issue.fields.reporter.displayName,
        priority: issue.fields.priority.name,
        issueType: issue.fields.issuetype.name,
        project: {
          key: issue.fields.project.key,
          name: issue.fields.project.name,
        },
        created: issue.fields.created,
        updated: issue.fields.updated,
        comments:
          issue.fields.comment?.comments?.slice(-5).map((comment: any) => ({
            id: comment.id,
            author: comment.author.displayName,
            body: comment.body,
            created: comment.created,
          })) || [],
      };

      return {
        success: true,
        data: issueData,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }

  async createIssue(
    request: CreateIssueRequest
  ): Promise<ServerResponse<{ key: string; url: string }>> {
    try {
      this.logger.info("Creating issue", {
        projectKey: request.projectKey,
        summary: request.summary,
      });

      const issueData: any = {
        fields: {
          project: { key: request.projectKey },
          summary: request.summary,
          issuetype: { name: request.issueType || "Task" },
          priority: { name: request.priority || "Medium" },
        },
      };

      const processedDescription = this.processDescription(request.description);
      if (processedDescription) {
        issueData.fields.description = processedDescription;
      }

      if (request.assignee) {
        issueData.fields.assignee = { emailAddress: request.assignee };
      }

      const response = await this.client.post("/issue", issueData);

      return {
        success: true,
        data: {
          key: response.data.key,
          url: `${this.config.baseUrl}/browse/${response.data.key}`,
        },
        message: "Issue created successfully",
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }

  async updateIssue(
    request: UpdateIssueRequest
  ): Promise<ServerResponse<void>> {
    try {
      this.logger.info("Updating issue", { issueKey: request.issueKey });

      const updateData: any = { fields: {} };

      if (request.summary) {
        updateData.fields.summary = request.summary;
      }

      if (request.description !== undefined) {
        const processedDescription = this.processDescription(
          request.description
        );
        if (processedDescription) {
          updateData.fields.description = processedDescription;
        }
      }

      if (request.assignee) {
        updateData.fields.assignee = { emailAddress: request.assignee };
      }

      await this.client.put(`/issue/${request.issueKey}`, updateData);

      return {
        success: true,
        message: `Issue ${request.issueKey} updated successfully`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }

  async transitionIssue(
    issueKey: string,
    transitionName: string
  ): Promise<ServerResponse<void>> {
    try {
      this.logger.info("Transitioning issue", { issueKey, transitionName });

      const transitionsResponse = await this.client.get(
        `/issue/${issueKey}/transitions`
      );
      const transitions = transitionsResponse.data.transitions;

      const transition = transitions.find(
        (t: JiraTransition) =>
          t.name.toLowerCase() === transitionName.toLowerCase()
      );

      if (!transition) {
        const availableTransitions = transitions
          .map((t: JiraTransition) => t.name)
          .join(", ");
        return {
          success: false,
          error: `Transition "${transitionName}" not found. Available transitions: ${availableTransitions}`,
        };
      }

      await this.client.post(`/issue/${issueKey}/transitions`, {
        transition: { id: transition.id },
      });

      return {
        success: true,
        message: `Issue ${issueKey} transitioned to "${transition.to.name}" successfully`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }

  async addComment(
    issueKey: string,
    comment: string | ADFDocument,
    format: "plain" | "rich" = "plain"
  ): Promise<ServerResponse<{ id: string }>> {
    try {
      this.logger.info("Adding comment", { issueKey });

      const processedComment =
        typeof comment === "string" ? this.textToADF(comment, format) : comment;

      const response = await this.client.post(`/issue/${issueKey}/comment`, {
        body: processedComment,
      });

      return {
        success: true,
        data: { id: response.data.id },
        message: `Comment added to issue ${issueKey} successfully`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }

  async listProjects(): Promise<ServerResponse<JiraProject[]>> {
    try {
      this.logger.info("Listing projects");

      const response = await this.client.get("/project");
      const projects: JiraProject[] = response.data.map((project: any) => ({
        key: project.key,
        name: project.name,
        projectType: project.projectTypeKey,
        lead: project.lead?.displayName || "No lead assigned",
      }));

      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }

  async getProject(projectKey: string): Promise<ServerResponse<JiraProject>> {
    try {
      this.logger.info("Getting project", { projectKey });

      const response = await this.client.get(`/project/${projectKey}`);
      const project = response.data;

      const projectData: JiraProject = {
        key: project.key,
        name: project.name,
        description: project.description || "No description",
        projectType: project.projectTypeKey,
        lead: project.lead?.displayName || "No lead assigned",
        url: project.self,
        issueTypes:
          project.issueTypes?.map((type: any) => ({
            name: type.name,
            description: type.description,
          })) || [],
      };

      return {
        success: true,
        data: projectData,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }

  async getIssueTransitions(
    issueKey: string
  ): Promise<ServerResponse<JiraTransition[]>> {
    try {
      this.logger.info("Getting issue transitions", { issueKey });

      const response = await this.client.get(`/issue/${issueKey}/transitions`);
      const transitions: JiraTransition[] = response.data.transitions.map(
        (transition: JiraTransition) => ({
          id: transition.id,
          name: transition.name,
          to: transition.to,
        })
      );

      return {
        success: true,
        data: transitions,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }

  async assignIssue(
    issueKey: string,
    assignee: string
  ): Promise<ServerResponse<void>> {
    try {
      this.logger.info("Assigning issue", { issueKey, assignee });

      await this.client.put(`/issue/${issueKey}/assignee`, {
        emailAddress: assignee,
      });

      return {
        success: true,
        message: `Issue ${issueKey} assigned to ${assignee} successfully`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }

  async deleteIssue(issueKey: string): Promise<ServerResponse<void>> {
    try {
      this.logger.info("Deleting issue", { issueKey });

      await this.client.delete(`/issue/${issueKey}`);

      return {
        success: true,
        message: `Issue ${issueKey} deleted successfully`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, "Jira");
    }
  }
}
