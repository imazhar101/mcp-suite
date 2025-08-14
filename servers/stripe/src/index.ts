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
import { StripeService } from "./services/stripe-service.js";
import { stripeTools } from "./tools/index.js";
import { StripeConfig } from "./types/index.js";

class StripeServer {
  private server: Server;
  private stripeService: StripeService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(getLogLevel(), { server: "stripe" });

    const config: StripeConfig = {
      secretKey: getEnvVar("STRIPE_SECRET_KEY"),
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    };

    this.stripeService = new StripeService(config, this.logger);

    this.server = new Server(
      {
        name: "stripe-server",
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
      tools: stripeTools,
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
      case "stripe_test_connection":
        return await this.stripeService.testConnection();

      // Payment Intents
      case "stripe_create_payment_intent":
        return await this.stripeService.createPaymentIntent(args);
      case "stripe_get_payment_intent":
        return await this.stripeService.getPaymentIntent(args.payment_intent_id);
      case "stripe_confirm_payment_intent":
        return await this.stripeService.confirmPaymentIntent(
          args.payment_intent_id,
          args.payment_method
        );
      case "stripe_cancel_payment_intent":
        return await this.stripeService.cancelPaymentIntent(args.payment_intent_id);
      case "stripe_list_payment_intents":
        return await this.stripeService.listPaymentIntents(args);

      // Customers
      case "stripe_create_customer":
        return await this.stripeService.createCustomer(args);
      case "stripe_get_customer":
        return await this.stripeService.getCustomer(args.customer_id);
      case "stripe_update_customer":
        const { customer_id, ...updateData } = args;
        return await this.stripeService.updateCustomer(customer_id, updateData);
      case "stripe_list_customers":
        return await this.stripeService.listCustomers(args);

      // Payment Methods
      case "stripe_create_payment_method":
        return await this.stripeService.createPaymentMethod(args.type, args.card);
      case "stripe_attach_payment_method":
        return await this.stripeService.attachPaymentMethod(
          args.payment_method_id,
          args.customer_id
        );
      case "stripe_list_payment_methods":
        return await this.stripeService.listPaymentMethods(
          args.customer_id,
          args.type
        );

      // Refunds
      case "stripe_create_refund":
        return await this.stripeService.createRefund(args);
      case "stripe_get_refund":
        return await this.stripeService.getRefund(args.refund_id);

      // Products
      case "stripe_create_product":
        return await this.stripeService.createProduct(args);
      case "stripe_list_products":
        return await this.stripeService.listProducts(args);

      // Prices
      case "stripe_create_price":
        return await this.stripeService.createPrice(args);
      case "stripe_list_prices":
        return await this.stripeService.listPrices(args);

      // Subscriptions
      case "stripe_create_subscription":
        return await this.stripeService.createSubscription(args);
      case "stripe_get_subscription":
        return await this.stripeService.getSubscription(args.subscription_id);
      case "stripe_cancel_subscription":
        return await this.stripeService.cancelSubscription(args.subscription_id);
      case "stripe_list_subscriptions":
        return await this.stripeService.listSubscriptions(args);

      // Invoices
      case "stripe_create_invoice":
        return await this.stripeService.createInvoice(args);
      case "stripe_list_invoices":
        return await this.stripeService.listInvoices(args);

      // Webhook Endpoints
      case "stripe_create_webhook_endpoint":
        return await this.stripeService.createWebhookEndpoint(args);
      case "stripe_list_webhook_endpoints":
        return await this.stripeService.listWebhookEndpoints();

      // Charges
      case "stripe_list_charges":
        return await this.stripeService.listCharges(args);
      case "stripe_get_charge":
        return await this.stripeService.getCharge(args.charge_id);

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
      this.logger.info("Shutting down Stripe MCP server");
      await this.server.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      this.logger.info("Shutting down Stripe MCP server");
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info("Stripe MCP server running on stdio");
  }
}

const server = new StripeServer();
server.run().catch((error) => {
  console.error("Failed to start Stripe MCP server:", error);
  process.exit(1);
});