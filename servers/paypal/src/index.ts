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
      // Legacy payment tools
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

      // Invoice management tools
      case "paypal_create_invoice":
        return await this.paypalService.createInvoice(args);
      case "paypal_list_invoices":
        return await this.paypalService.listInvoices(args);
      case "paypal_get_invoice":
        return await this.paypalService.getInvoice(args.invoice_id);
      case "paypal_send_invoice":
        return await this.paypalService.sendInvoice(args.invoice_id, args);
      case "paypal_send_invoice_reminder":
        return await this.paypalService.sendInvoiceReminder(
          args.invoice_id,
          args
        );
      case "paypal_cancel_sent_invoice":
        return await this.paypalService.cancelSentInvoice(
          args.invoice_id,
          args
        );
      case "paypal_generate_invoice_qr_code":
        return await this.paypalService.generateInvoiceQrCode(
          args.invoice_id,
          args
        );

      // Order management tools
      case "paypal_create_order":
        return await this.paypalService.createOrder(args);
      case "paypal_get_order":
        return await this.paypalService.getOrder(args.order_id, args.fields);
      case "paypal_capture_order":
        return await this.paypalService.captureOrder(
          args.order_id,
          args.payment_source
        );

      // Dispute management tools
      case "paypal_list_disputes":
        return await this.paypalService.listDisputes(args);
      case "paypal_get_dispute":
        return await this.paypalService.getDispute(args.dispute_id);
      case "paypal_accept_dispute_claim":
        return await this.paypalService.acceptDisputeClaim(
          args.dispute_id,
          args
        );

      // Shipment tracking tools
      case "paypal_create_shipment_tracking":
        return await this.paypalService.createShipmentTracking(
          args.transaction_id,
          args
        );
      case "paypal_get_shipment_tracking":
        return await this.paypalService.getShipmentTracking(
          args.transaction_id
        );

      // Catalog management tools
      case "paypal_create_product":
        return await this.paypalService.createProduct(args);
      case "paypal_list_products":
        return await this.paypalService.listProducts(args);
      case "paypal_get_product":
        return await this.paypalService.getProduct(args.product_id);
      case "paypal_update_product":
        return await this.paypalService.updateProduct(
          args.product_id,
          args.operations
        );

      // Subscription management tools
      case "paypal_create_subscription_plan":
        return await this.paypalService.createSubscriptionPlan(args);
      case "paypal_list_subscription_plans":
        return await this.paypalService.listSubscriptionPlans(args);
      case "paypal_get_subscription_plan":
        return await this.paypalService.getSubscriptionPlan(args.plan_id);
      case "paypal_create_subscription":
        return await this.paypalService.createSubscription(args);
      case "paypal_get_subscription":
        return await this.paypalService.getSubscription(args.subscription_id);
      case "paypal_cancel_subscription":
        return await this.paypalService.cancelSubscription(
          args.subscription_id,
          args.reason
        );

      // Reporting tools
      case "paypal_list_transactions":
        return await this.paypalService.listTransactions(args);

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
