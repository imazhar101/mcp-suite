#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

import { Logger } from "../../../shared/utils/logger.js";
import { getEnvVar, getLogLevel } from "../../../shared/utils/config.js";
import { RipplingService } from "./services/rippling-service.js";
import { ripplingTools } from "./tools/index.js";
import { RipplingConfig } from "./types/index.js";

class RipplingServer {
  private server: Server;
  private ripplingService: RipplingService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(getLogLevel(), { server: "rippling" });

    const config: RipplingConfig = {
      token: getEnvVar("RIPPLING_TOKEN"),
      role: getEnvVar("RIPPLING_ROLE"),
      company: getEnvVar("RIPPLING_COMPANY"),
      userId: getEnvVar("RIPPLING_USER_ID"),
    };

    this.ripplingService = new RipplingService(config, this.logger);

    this.server = new Server(
      {
        name: "rippling-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: ripplingTools,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const result = await this.handleToolCall(
          request.params.name,
          request.params.arguments
        );
        return this.formatResponse(result);
      } catch (error) {
        this.logger.error("Tool call failed", error);
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error}`
        );
      }
    });
  }

  private async handleToolCall(toolName: string, args: any): Promise<any> {
    switch (toolName) {
      // Connection test
      case "rippling_test_connection":
        return await this.ripplingService.testConnection();

      // Employment Roles
      case "rippling_get_employment_roles":
        return await this.ripplingService.getEmploymentRoles(args);

      // Employees
      case "rippling_list_employees":
        return await this.ripplingService.listEmployees(args);

      // Leave Types
      case "rippling_get_company_leave_types":
        return await this.ripplingService.getCompanyLeaveTypes();

      // Terminated Employees
      case "rippling_list_terminated_employees":
        return await this.ripplingService.listTerminatedEmployees(args);

      // Signed Documents
      case "rippling_get_signed_documents":
        return await this.ripplingService.getSignedDocuments();

      // Anniversary Information
      case "rippling_get_anniversary_information":
        return await this.ripplingService.getAnniversaryInformation();

      // Action Request Filters
      case "rippling_get_action_request_filters":
        return await this.ripplingService.getActionRequestFilters(args);

      // Open Interviews and Feedbacks
      case "rippling_get_open_interviews_and_feedbacks":
        return await this.ripplingService.getOpenInterviewsAndFeedbacks(args);

      // Update Feedback Form Response
      case "rippling_update_feedback_form_response":
        return await this.ripplingService.updateFeedbackFormResponse(args);

      // Get Alerts
      case "rippling_get_alerts":
        return await this.ripplingService.getAlerts(args);

      // Time Off Requests
      case "rippling_time_off_requests":
        return await this.ripplingService.getTimeOffRequests(args);

      // Holiday Calendar
      case "rippling_get_holiday_calendar":
        return await this.ripplingService.getHolidayCalendar(args);

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${toolName}`
        );
    }
  }

  private formatResponse(result: any) {
    if (result.success) {
      const text = result.data
        ? JSON.stringify(result.data, null, 2)
        : result.message || "Operation completed successfully";
      return {
        content: [
          {
            type: "text" as const,
            text: text,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text" as const,
            text: result.error || result.message || "Operation failed",
          },
        ],
        isError: true,
      };
    }
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      this.logger.error("MCP Server error", error);
    };

    process.on("SIGINT", async () => {
      this.logger.info("Shutting down Rippling MCP server");
      await this.server.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      this.logger.info("Shutting down Rippling MCP server");
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info("Rippling MCP server running on stdio");
  }
}

const server = new RipplingServer();
server.run().catch((error) => {
  console.error("Failed to start Rippling MCP server:", error);
  process.exit(1);
});
