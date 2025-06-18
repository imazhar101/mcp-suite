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

    // Make OAuth credentials optional - they can be provided via environment variables or through the OAuth tool
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
    const accessToken = process.env.SALESFORCE_ACCESS_TOKEN;
    const apiVersion = process.env.SALESFORCE_API_VERSION || "v59.0";

    const config: SalesforceConfig = {
      instanceUrl,
      accessToken,
      apiVersion,
    };

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
    switch (toolName) {
      case "salesforce_oauth_login":
        const oauthConfig = {
          clientId: args.client_id,
          clientSecret: args.client_secret,
          username: args.username,
          password: args.password,
          grantType: args.grant_type || "password",
          loginUrl: args.login_url || "https://login.salesforce.com",
        };
        return await this.salesforceService.authenticateWithOAuth(oauthConfig);

      case "salesforce_auth_status":
        return {
          success: true,
          data: this.salesforceService.getAuthenticationStatus(),
        };

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