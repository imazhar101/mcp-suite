import { McpTool } from "../../../../shared/types/mcp.js";

export const paypalTools: McpTool[] = [
  {
    name: "paypal_create_payment",
    description:
      "Create a new PayPal payment with specified intent (sale, authorize, or order)",
    inputSchema: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          enum: ["sale", "authorize", "order"],
          description:
            "Payment intent - sale for immediate payment, authorize for later capture, order for order processing",
        },
        amount: {
          type: "object",
          properties: {
            total: { type: "string", description: "Total amount" },
            currency: {
              type: "string",
              description: "Currency code (e.g., USD, EUR)",
            },
            details: {
              type: "object",
              properties: {
                subtotal: { type: "string", description: "Subtotal amount" },
                tax: { type: "string", description: "Tax amount" },
                shipping: { type: "string", description: "Shipping amount" },
              },
            },
          },
          required: ["total", "currency"],
        },
        description: { type: "string", description: "Payment description" },
        invoice_number: {
          type: "string",
          description: "Invoice number for tracking",
        },
        return_url: {
          type: "string",
          description: "URL to redirect after successful payment",
        },
        cancel_url: {
          type: "string",
          description: "URL to redirect after cancelled payment",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Item name" },
              sku: { type: "string", description: "Item SKU" },
              price: { type: "string", description: "Item price" },
              currency: { type: "string", description: "Item currency" },
              quantity: { type: "string", description: "Item quantity" },
              description: { type: "string", description: "Item description" },
            },
            required: ["name", "price", "currency", "quantity"],
          },
        },
        payer_info: {
          type: "object",
          properties: {
            email: { type: "string", description: "Payer email" },
            first_name: { type: "string", description: "Payer first name" },
            last_name: { type: "string", description: "Payer last name" },
          },
        },
      },
      required: ["intent", "amount", "return_url", "cancel_url"],
    },
  },
  {
    name: "paypal_execute_payment",
    description: "Execute a PayPal payment after user approval",
    inputSchema: {
      type: "object",
      properties: {
        payment_id: { type: "string", description: "Payment ID to execute" },
        payer_id: {
          type: "string",
          description: "Payer ID from PayPal approval",
        },
        transactions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              amount: {
                type: "object",
                properties: {
                  total: { type: "string", description: "Total amount" },
                  currency: { type: "string", description: "Currency code" },
                },
                required: ["total", "currency"],
              },
            },
          },
        },
      },
      required: ["payment_id", "payer_id"],
    },
  },
  {
    name: "paypal_get_payment",
    description: "Get details of a specific PayPal payment",
    inputSchema: {
      type: "object",
      properties: {
        payment_id: { type: "string", description: "Payment ID to retrieve" },
      },
      required: ["payment_id"],
    },
  },
  {
    name: "paypal_list_payments",
    description: "List PayPal payments with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        count: {
          type: "number",
          description: "Number of payments to return (max 20)",
          maximum: 20,
        },
        start_index: {
          type: "number",
          description: "Starting index for pagination",
        },
        start_time: {
          type: "string",
          description: "Start time filter (RFC 3339 format)",
        },
        end_time: {
          type: "string",
          description: "End time filter (RFC 3339 format)",
        },
        payee_id: { type: "string", description: "Filter by payee ID" },
        sort_by: {
          type: "string",
          enum: ["create_time", "update_time"],
          description: "Sort field",
        },
        sort_order: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort order",
        },
      },
    },
  },
  {
    name: "paypal_refund_sale",
    description: "Refund a completed PayPal sale",
    inputSchema: {
      type: "object",
      properties: {
        sale_id: { type: "string", description: "Sale ID to refund" },
        amount: {
          type: "object",
          properties: {
            total: {
              type: "string",
              description: "Refund amount (leave empty for full refund)",
            },
            currency: { type: "string", description: "Currency code" },
          },
        },
        description: { type: "string", description: "Refund description" },
        invoice_number: {
          type: "string",
          description: "Invoice number for tracking",
        },
      },
      required: ["sale_id"],
    },
  },
  {
    name: "paypal_capture_authorization",
    description: "Capture funds from a PayPal authorization",
    inputSchema: {
      type: "object",
      properties: {
        authorization_id: {
          type: "string",
          description: "Authorization ID to capture",
        },
        amount: {
          type: "object",
          properties: {
            total: { type: "string", description: "Amount to capture" },
            currency: { type: "string", description: "Currency code" },
          },
          required: ["total", "currency"],
        },
        is_final_capture: {
          type: "boolean",
          description:
            "Whether this is the final capture for this authorization",
        },
      },
      required: ["authorization_id", "amount"],
    },
  },
  {
    name: "paypal_void_authorization",
    description: "Void a PayPal authorization",
    inputSchema: {
      type: "object",
      properties: {
        authorization_id: {
          type: "string",
          description: "Authorization ID to void",
        },
      },
      required: ["authorization_id"],
    },
  },
  {
    name: "paypal_get_webhook_events",
    description: "Get PayPal webhook events for monitoring transactions",
    inputSchema: {
      type: "object",
      properties: {
        page_size: {
          type: "number",
          description: "Number of events to return (max 300)",
          maximum: 300,
        },
        start_time: {
          type: "string",
          description: "Start time filter (RFC 3339 format)",
        },
        end_time: {
          type: "string",
          description: "End time filter (RFC 3339 format)",
        },
        transaction_id: {
          type: "string",
          description: "Filter by transaction ID",
        },
      },
    },
  },
  {
    name: "paypal_test_connection",
    description: "Test the PayPal API connection and authentication",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];
