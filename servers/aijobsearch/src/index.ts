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
import { AIJobSearchService } from "./services/aijobsearch-service.js";
import { aijobsearchTools } from "./tools/index.js";
import { AIJobSearchConfig } from "./types/index.js";

class AIJobSearchServer {
  private server: Server;
  private aijobsearchService: AIJobSearchService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(getLogLevel(), { server: "aijobsearch" });

    const config: AIJobSearchConfig = {
      apiUrl: getEnvVar("AIJOBSEARCH_API_URL", "https://api-main-poc.aiml.asu.edu"),
      apiToken: getEnvVar("AIJOBSEARCH_API_TOKEN"),
    };

    this.aijobsearchService = new AIJobSearchService(config, this.logger);

    this.server = new Server(
      {
        name: "aijobsearch-server",
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
      tools: aijobsearchTools,
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
      case "extract_skills":
        return await this.aijobsearchService.extractSkills(args);
      case "match_jobs":
        return await this.aijobsearchService.matchJobs(args);
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
    }
  }

  private formatResponse(result: any): { content: any[] } {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private setupErrorHandling(): void {
    process.on("SIGINT", async () => {
      this.logger.info("Received SIGINT, shutting down gracefully");
      await this.cleanup();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      this.logger.info("Received SIGTERM, shutting down gracefully");
      await this.cleanup();
      process.exit(0);
    });

    process.on("uncaughtException", (error: Error) => {
      this.logger.error("Uncaught exception", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason: any) => {
      this.logger.error("Unhandled rejection", reason);
      process.exit(1);
    });
  }

  private async cleanup(): Promise<void> {
    this.logger.info("Cleanup completed");
  }

  async start(): Promise<void> {
    this.logger.info("Starting AI Job Search MCP Server");
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info("AI Job Search MCP Server started successfully");
  }
}

const server = new AIJobSearchServer();
server.start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});