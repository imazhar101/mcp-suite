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
import { DuffelService } from "./services/duffel-service.js";
import { flightTools } from "./tools/index.js";
import { DuffelConfig } from "./types/index.js";

class FlightServer {
  private server: Server;
  private duffelService: DuffelService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(getLogLevel(), { server: "flight" });

    const config: DuffelConfig = {
      apiKey: getEnvVar("DUFFEL_API_KEY"),
      environment: (process.env.DUFFEL_ENVIRONMENT as 'test' | 'live') || 'test',
    };

    this.duffelService = new DuffelService(config, this.logger);

    this.server = new Server(
      {
        name: "flight-server",
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
      tools: flightTools,
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
      case "duffel_test_connection":
        return await this.duffelService.testConnection();

      // Flight search
      case "duffel_search_flights":
        return await this.duffelService.searchFlights(args);

      // Offer requests
      case "duffel_get_offer_request":
        return await this.duffelService.getOfferRequest(args.offer_request_id);

      // Offers
      case "duffel_get_offers":
        return await this.duffelService.getOffers(args.offer_request_id, args.limit);
      case "duffel_get_offer":
        return await this.duffelService.getOffer(args.offer_id);

      // Orders
      case "duffel_create_order":
        return await this.duffelService.createOrder(args);
      case "duffel_get_order":
        return await this.duffelService.getOrder(args.order_id);
      case "duffel_list_orders":
        return await this.duffelService.listOrders(args.limit, args.after);
      case "duffel_cancel_order":
        return await this.duffelService.cancelOrder(args.order_id);

      // Seat maps
      case "duffel_get_seat_maps":
        return await this.duffelService.getSeatMaps(args.offer_id);

      // Airlines and airports
      case "duffel_get_airlines":
        return await this.duffelService.getAirlines(args.limit);
      case "duffel_get_airports":
        return await this.duffelService.getAirports(args.limit, args.iata_code, args.iata_country_code, args.after, args.before);

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
      this.logger.info("Shutting down Flight MCP server");
      await this.server.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      this.logger.info("Shutting down Flight MCP server");
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info("Flight MCP server running on stdio");
  }
}

const server = new FlightServer();
server.run().catch((error) => {
  console.error("Failed to start Flight MCP server:", error);
  process.exit(1);
});