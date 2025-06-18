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
import { SalesforceService } from "./services/salesforce-service.js";
import { salesforceTools } from "./tools/index.js";
import { SalesforceConfig } from "./types/salesforce.js";

class SalesforceServer {
  private server: Server;
  private salesforceService: SalesforceService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(getLogLevel(), { server: "salesforce" });

    // Load tokens from environment variables if available
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
    const accessToken = process.env.SALESFORCE_ACCESS_TOKEN;
    const apiVersion = process.env.SALESFORCE_API_VERSION || "v59.0";

    const config: SalesforceConfig = {
      instanceUrl,
      accessToken,
      apiVersion,
    };

    this.logger.info(`Salesforce server starting with${accessToken ? '' : 'out'} stored access token`);

    this.salesforceService = new SalesforceService(config, this.logger);

    this.server = new Server(
      {
        name: "salesforce-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: salesforceTools,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await this.handleToolCall(name, args),
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error: error instanceof Error ? error.message : "Unknown error",
                },
                null,
                2
              ),
            },
          ],
        };
      }
    });
  }

  private async handleToolCall(toolName: string, args: any): Promise<any> {
    try {
      switch (toolName) {
        case "salesforce_query":
          return await this.salesforceService.query(args.soql);

        case "salesforce_create":
          return await this.salesforceService.create(
            args.sobject_type,
            args.record
          );

        case "salesforce_read":
          return await this.salesforceService.read(
            args.sobject_type,
            args.id,
            args.fields
          );

        case "salesforce_update":
          return await this.salesforceService.update(
            args.sobject_type,
            args.id,
            args.record
          );

        case "salesforce_delete":
          return await this.salesforceService.delete(
            args.sobject_type,
            args.id
          );

        case "salesforce_describe":
          return await this.salesforceService.describe(args.sobject_type);

        case "salesforce_list_objects":
          return await this.salesforceService.listSObjects();

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${toolName}`
          );
      }
    } catch (error) {
      // Enhanced error handling for authentication issues
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      if (errorMessage.includes("OAuth credentials not available") || 
          errorMessage.includes("Auto-authentication failed") ||
          errorMessage.includes("Not authenticated")) {
        return {
          success: false,
          error: `Authentication failed. Please ensure the following environment variables are set correctly:
- SALESFORCE_CLIENT_ID: Your Connected App Client ID
- SALESFORCE_CLIENT_SECRET: Your Connected App Client Secret  
- SALESFORCE_USERNAME: Your Salesforce username
- SALESFORCE_PASSWORD: Your Salesforce password (with security token appended if required)

Optional environment variables:
- SALESFORCE_GRANT_TYPE: OAuth grant type (defaults to "password")
- SALESFORCE_LOGIN_URL: Salesforce login URL (defaults to "https://login.salesforce.com")

Original error: ${errorMessage}`
        };
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    this.logger.info("Salesforce MCP server started");
  }
}

const server = new SalesforceServer();
server.run().catch((error) => {
  console.error("Server failed:", error);
  process.exit(1);
});