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
import { PostgreSQLService } from "./services/postgresql-service.js";
import { postgresqlTools } from "./tools/index.js";

class PostgreSQLServer {
  private server: Server;
  private postgresqlService: PostgreSQLService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(getLogLevel(), { server: "postgresql" });

    const connectionString = getEnvVar("POSTGRESQL_CONNECTION_STRING");
    this.postgresqlService = new PostgreSQLService(
      connectionString,
      this.logger
    );

    this.server = new Server(
      {
        name: "postgresql-server",
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
      tools: postgresqlTools,
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
      case "execute_query":
        return await this.postgresqlService.executeQuery(
          args.query,
          args.params
        );
      case "list_tables":
        return await this.postgresqlService.listTables();
      case "get_database_stats":
        return await this.postgresqlService.getDatabaseStats();
      case "test_connection":
        return await this.postgresqlService.testConnection();
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
      this.logger.info("Shutting down PostgreSQL MCP server");
      await this.postgresqlService.disconnect();
      await this.server.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      this.logger.info("Shutting down PostgreSQL MCP server");
      await this.postgresqlService.disconnect();
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info("PostgreSQL MCP server running on stdio");
  }
}

const server = new PostgreSQLServer();
server.run().catch((error) => {
  console.error("Failed to start PostgreSQL MCP server:", error);
  process.exit(1);
});
