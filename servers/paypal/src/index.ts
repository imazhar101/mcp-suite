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
import { PayPalService } from "./services/paypal-service.js";
import { paypalTools } from "./tools/index.js";
import { PayPalConfig } from "./types/index.js";

class PayPalServer {
  private server: Server;
  private paypalService: PayPalService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(getLogLevel(), { server: "paypal" });

    const config: PayPalConfig = {
      clientId: getEnvVar("PAYPAL_CLIENT_ID"),
      clientSecret: getEnvVar("PAYPAL_CLIENT_SECRET"),
      environment:
        (process.env.PAYPAL_ENVIRONMENT as "sandbox" | "production") ||
        "sandbox",
    };

    this.paypalService = new PayPalService(config, this.logger);

    this.server = new Server(
      {
        name: "paypal-server",
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
      tools: paypalTools,
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
      case "paypal_create_payment":
        return await this.createPayment(args);
      case "paypal_execute_payment":
        return await this.paypalService.executePayment(args.payment_id, {
          payer_id: args.payer_id,
          transactions: args.transactions,
        });
      case "paypal_get_payment":
        return await this.paypalService.getPayment(args.payment_id);
      case "paypal_list_payments":
        return await this.paypalService.listPayments(args);
      case "paypal_refund_sale":
        return await this.paypalService.refundSale(args.sale_id, {
          amount: args.amount,
          description: args.description,
          invoice_number: args.invoice_number,
        });
      case "paypal_capture_authorization":
        return await this.paypalService.captureAuthorization(
          args.authorization_id,
          {
            amount: args.amount,
            is_final_capture: args.is_final_capture,
          }
        );
      case "paypal_void_authorization":
        return await this.paypalService.voidAuthorization(
          args.authorization_id
        );
      case "paypal_get_webhook_events":
        return await this.paypalService.getWebhookEvents(args);
      case "paypal_test_connection":
        return await this.paypalService.testConnection();
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${toolName}`
        );
    }
  }

  private async createPayment(args: any): Promise<any> {
    const paymentData = {
      intent: args.intent,
      payer: {
        payment_method: "paypal" as const,
        payer_info: args.payer_info,
      },
      transactions: [
        {
          amount: args.amount,
          description: args.description,
          invoice_number: args.invoice_number,
          item_list: args.items ? { items: args.items } : undefined,
        },
      ],
      redirect_urls: {
        return_url: args.return_url,
        cancel_url: args.cancel_url,
      },
    };

    return await this.paypalService.createPayment(paymentData);
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
      this.logger.info("Shutting down PayPal MCP server");
      await this.server.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      this.logger.info("Shutting down PayPal MCP server");
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info("PayPal MCP server running on stdio");
  }
}

const server = new PayPalServer();
server.run().catch((error) => {
  console.error("Failed to start PayPal MCP server:", error);
  process.exit(1);
});
