import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const stripeTools: Tool[] = [
  // Connection test
  {
    name: "stripe_test_connection",
    description: "Test the connection to Stripe API and retrieve account information",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // Payment Intents
  {
    name: "stripe_create_payment_intent",
    description: "Create a new payment intent for processing payments",
    inputSchema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "Amount in smallest currency unit (e.g., cents for USD)",
        },
        currency: {
          type: "string",
          description: "Three-letter ISO currency code (e.g., 'usd')",
        },
        description: {
          type: "string",
          description: "Optional description for the payment",
        },
        customer: {
          type: "string",
          description: "Optional customer ID to associate with payment",
        },
        payment_method: {
          type: "string",
          description: "Optional payment method ID",
        },
        confirm: {
          type: "boolean",
          description: "Whether to immediately confirm the payment intent",
        },
        automatic_payment_methods: {
          type: "object",
          properties: {
            enabled: {
              type: "boolean",
              description: "Whether to enable automatic payment methods",
            },
          },
        },
        metadata: {
          type: "object",
          description: "Optional metadata as key-value pairs",
        },
      },
      required: ["amount", "currency"],
    },
  },
  {
    name: "stripe_get_payment_intent",
    description: "Retrieve a payment intent by ID",
    inputSchema: {
      type: "object",
      properties: {
        payment_intent_id: {
          type: "string",
          description: "The payment intent ID to retrieve",
        },
      },
      required: ["payment_intent_id"],
    },
  },
  {
    name: "stripe_confirm_payment_intent",
    description: "Confirm a payment intent to complete the payment",
    inputSchema: {
      type: "object",
      properties: {
        payment_intent_id: {
          type: "string",
          description: "The payment intent ID to confirm",
        },
        payment_method: {
          type: "string",
          description: "Optional payment method ID to use for confirmation",
        },
      },
      required: ["payment_intent_id"],
    },
  },
  {
    name: "stripe_cancel_payment_intent",
    description: "Cancel a payment intent",
    inputSchema: {
      type: "object",
      properties: {
        payment_intent_id: {
          type: "string",
          description: "The payment intent ID to cancel",
        },
      },
      required: ["payment_intent_id"],
    },
  },
  {
    name: "stripe_list_payment_intents",
    description: "List payment intents with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of payment intents to return (default: 10)",
        },
        customer: {
          type: "string",
          description: "Filter by customer ID",
        },
      },
      required: [],
    },
  },

  // Customers
  {
    name: "stripe_create_customer",
    description: "Create a new customer",
    inputSchema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Customer's email address",
        },
        name: {
          type: "string",
          description: "Customer's full name",
        },
        phone: {
          type: "string",
          description: "Customer's phone number",
        },
        description: {
          type: "string",
          description: "Optional description for the customer",
        },
        address: {
          type: "object",
          properties: {
            line1: { type: "string" },
            line2: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            postal_code: { type: "string" },
            country: { type: "string" },
          },
          description: "Customer's address",
        },
        metadata: {
          type: "object",
          description: "Optional metadata as key-value pairs",
        },
      },
      required: [],
    },
  },
  {
    name: "stripe_get_customer",
    description: "Retrieve a customer by ID",
    inputSchema: {
      type: "object",
      properties: {
        customer_id: {
          type: "string",
          description: "The customer ID to retrieve",
        },
      },
      required: ["customer_id"],
    },
  },
  {
    name: "stripe_update_customer",
    description: "Update an existing customer",
    inputSchema: {
      type: "object",
      properties: {
        customer_id: {
          type: "string",
          description: "The customer ID to update",
        },
        email: {
          type: "string",
          description: "Customer's email address",
        },
        name: {
          type: "string",
          description: "Customer's full name",
        },
        phone: {
          type: "string",
          description: "Customer's phone number",
        },
        description: {
          type: "string",
          description: "Description for the customer",
        },
        metadata: {
          type: "object",
          description: "Metadata as key-value pairs",
        },
      },
      required: ["customer_id"],
    },
  },
  {
    name: "stripe_list_customers",
    description: "List customers with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of customers to return (default: 10)",
        },
        email: {
          type: "string",
          description: "Filter by email address",
        },
      },
      required: [],
    },
  },

  // Payment Methods
  {
    name: "stripe_create_payment_method",
    description: "Create a new payment method",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["card", "us_bank_account", "sepa_debit"],
          description: "The type of payment method",
        },
        card: {
          type: "object",
          properties: {
            number: { type: "string", description: "Card number" },
            exp_month: { type: "number", description: "Expiration month" },
            exp_year: { type: "number", description: "Expiration year" },
            cvc: { type: "string", description: "Card verification code" },
          },
          description: "Card details (for type 'card')",
        },
      },
      required: ["type"],
    },
  },
  {
    name: "stripe_attach_payment_method",
    description: "Attach a payment method to a customer",
    inputSchema: {
      type: "object",
      properties: {
        payment_method_id: {
          type: "string",
          description: "The payment method ID to attach",
        },
        customer_id: {
          type: "string",
          description: "The customer ID to attach the payment method to",
        },
      },
      required: ["payment_method_id", "customer_id"],
    },
  },
  {
    name: "stripe_list_payment_methods",
    description: "List payment methods for a customer",
    inputSchema: {
      type: "object",
      properties: {
        customer_id: {
          type: "string",
          description: "The customer ID to list payment methods for",
        },
        type: {
          type: "string",
          description: "Filter by payment method type",
        },
      },
      required: ["customer_id"],
    },
  },

  // Refunds
  {
    name: "stripe_create_refund",
    description: "Create a refund for a payment intent or charge",
    inputSchema: {
      type: "object",
      properties: {
        payment_intent: {
          type: "string",
          description: "The payment intent ID to refund",
        },
        charge: {
          type: "string",
          description: "The charge ID to refund (alternative to payment_intent)",
        },
        amount: {
          type: "number",
          description: "Amount to refund in smallest currency unit (optional, defaults to full amount)",
        },
        reason: {
          type: "string",
          enum: ["duplicate", "fraudulent", "requested_by_customer"],
          description: "Reason for the refund",
        },
        metadata: {
          type: "object",
          description: "Optional metadata as key-value pairs",
        },
      },
      required: [],
    },
  },
  {
    name: "stripe_get_refund",
    description: "Retrieve a refund by ID",
    inputSchema: {
      type: "object",
      properties: {
        refund_id: {
          type: "string",
          description: "The refund ID to retrieve",
        },
      },
      required: ["refund_id"],
    },
  },

  // Products
  {
    name: "stripe_create_product",
    description: "Create a new product",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The product name",
        },
        description: {
          type: "string",
          description: "Optional product description",
        },
        images: {
          type: "array",
          items: { type: "string" },
          description: "Array of image URLs",
        },
        type: {
          type: "string",
          enum: ["good", "service"],
          description: "The type of product",
        },
        active: {
          type: "boolean",
          description: "Whether the product is active",
        },
        metadata: {
          type: "object",
          description: "Optional metadata as key-value pairs",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "stripe_list_products",
    description: "List products with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of products to return (default: 10)",
        },
        active: {
          type: "boolean",
          description: "Filter by active status",
        },
      },
      required: [],
    },
  },

  // Prices
  {
    name: "stripe_create_price",
    description: "Create a new price for a product",
    inputSchema: {
      type: "object",
      properties: {
        currency: {
          type: "string",
          description: "Three-letter ISO currency code",
        },
        product: {
          type: "string",
          description: "The product ID this price belongs to",
        },
        unit_amount: {
          type: "number",
          description: "Price in smallest currency unit (for per-unit billing)",
        },
        billing_scheme: {
          type: "string",
          enum: ["per_unit", "tiered"],
          description: "Billing scheme",
        },
        recurring: {
          type: "object",
          properties: {
            interval: {
              type: "string",
              enum: ["day", "week", "month", "year"],
              description: "Billing interval",
            },
            interval_count: {
              type: "number",
              description: "Number of intervals between billings",
            },
          },
          description: "Recurring billing configuration",
        },
        metadata: {
          type: "object",
          description: "Optional metadata as key-value pairs",
        },
      },
      required: ["currency", "product"],
    },
  },
  {
    name: "stripe_list_prices",
    description: "List prices with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of prices to return (default: 10)",
        },
        product: {
          type: "string",
          description: "Filter by product ID",
        },
        active: {
          type: "boolean",
          description: "Filter by active status",
        },
      },
      required: [],
    },
  },

  // Subscriptions
  {
    name: "stripe_create_subscription",
    description: "Create a new subscription for a customer",
    inputSchema: {
      type: "object",
      properties: {
        customer: {
          type: "string",
          description: "The customer ID to create subscription for",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              price: { type: "string", description: "Price ID" },
              quantity: { type: "number", description: "Quantity (default: 1)" },
            },
            required: ["price"],
          },
          description: "Array of subscription items",
        },
        trial_period_days: {
          type: "number",
          description: "Number of trial days",
        },
        metadata: {
          type: "object",
          description: "Optional metadata as key-value pairs",
        },
      },
      required: ["customer", "items"],
    },
  },
  {
    name: "stripe_get_subscription",
    description: "Retrieve a subscription by ID",
    inputSchema: {
      type: "object",
      properties: {
        subscription_id: {
          type: "string",
          description: "The subscription ID to retrieve",
        },
      },
      required: ["subscription_id"],
    },
  },
  {
    name: "stripe_cancel_subscription",
    description: "Cancel a subscription",
    inputSchema: {
      type: "object",
      properties: {
        subscription_id: {
          type: "string",
          description: "The subscription ID to cancel",
        },
      },
      required: ["subscription_id"],
    },
  },
  {
    name: "stripe_list_subscriptions",
    description: "List subscriptions with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of subscriptions to return (default: 10)",
        },
        customer: {
          type: "string",
          description: "Filter by customer ID",
        },
        status: {
          type: "string",
          enum: ["active", "canceled", "incomplete", "past_due", "trialing"],
          description: "Filter by subscription status",
        },
      },
      required: [],
    },
  },

  // Invoices
  {
    name: "stripe_create_invoice",
    description: "Create a new invoice for a customer",
    inputSchema: {
      type: "object",
      properties: {
        customer: {
          type: "string",
          description: "The customer ID to create invoice for",
        },
        description: {
          type: "string",
          description: "Optional invoice description",
        },
        auto_advance: {
          type: "boolean",
          description: "Whether to automatically advance through collection steps",
        },
        collection_method: {
          type: "string",
          enum: ["charge_automatically", "send_invoice"],
          description: "How the invoice will be collected",
        },
        due_date: {
          type: "number",
          description: "Due date as Unix timestamp",
        },
        metadata: {
          type: "object",
          description: "Optional metadata as key-value pairs",
        },
      },
      required: ["customer"],
    },
  },
  {
    name: "stripe_list_invoices",
    description: "List invoices with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of invoices to return (default: 10)",
        },
        customer: {
          type: "string",
          description: "Filter by customer ID",
        },
      },
      required: [],
    },
  },

  // Webhook Endpoints
  {
    name: "stripe_create_webhook_endpoint",
    description: "Create a new webhook endpoint",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to send webhook events to",
        },
        enabled_events: {
          type: "array",
          items: { type: "string" },
          description: "Array of event types to listen for",
        },
        description: {
          type: "string",
          description: "Optional description for the webhook",
        },
        metadata: {
          type: "object",
          description: "Optional metadata as key-value pairs",
        },
      },
      required: ["url", "enabled_events"],
    },
  },
  {
    name: "stripe_list_webhook_endpoints",
    description: "List all webhook endpoints",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // Charges
  {
    name: "stripe_list_charges",
    description: "List charges with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of charges to return (default: 10)",
        },
        customer: {
          type: "string",
          description: "Filter by customer ID",
        },
      },
      required: [],
    },
  },
  {
    name: "stripe_get_charge",
    description: "Retrieve a charge by ID",
    inputSchema: {
      type: "object",
      properties: {
        charge_id: {
          type: "string",
          description: "The charge ID to retrieve",
        },
      },
      required: ["charge_id"],
    },
  },
];