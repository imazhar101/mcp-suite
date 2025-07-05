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
  {
    name: "paypal_create_invoice",
    description: "Create a new PayPal invoice",
    inputSchema: {
      type: "object",
      properties: {
        invoice_number: { type: "string", description: "Invoice number" },
        invoice_date: {
          type: "string",
          description: "Invoice date (YYYY-MM-DD)",
        },
        due_date: { type: "string", description: "Due date (YYYY-MM-DD)" },
        currency_code: {
          type: "string",
          description: "Currency code (e.g., USD)",
        },
        note: { type: "string", description: "Invoice note" },
        terms: { type: "string", description: "Payment terms" },
        memo: { type: "string", description: "Invoice memo" },
        invoice_logo_url: { type: "string", description: "Logo URL" },
        merchant_info: {
          type: "object",
          properties: {
            email: { type: "string", description: "Merchant email" },
            first_name: { type: "string", description: "Merchant first name" },
            last_name: { type: "string", description: "Merchant last name" },
            business_name: { type: "string", description: "Business name" },
            phone: {
              type: "object",
              properties: {
                country_code: { type: "string", description: "Country code" },
                national_number: {
                  type: "string",
                  description: "Phone number",
                },
              },
            },
            address: {
              type: "object",
              properties: {
                line1: { type: "string", description: "Address line 1" },
                line2: { type: "string", description: "Address line 2" },
                city: { type: "string", description: "City" },
                state: { type: "string", description: "State" },
                postal_code: { type: "string", description: "Postal code" },
                country_code: { type: "string", description: "Country code" },
              },
            },
          },
        },
        billing_info: {
          type: "array",
          items: {
            type: "object",
            properties: {
              email: { type: "string", description: "Billing email" },
              first_name: { type: "string", description: "First name" },
              last_name: { type: "string", description: "Last name" },
              business_name: { type: "string", description: "Business name" },
              phone: {
                type: "object",
                properties: {
                  country_code: { type: "string", description: "Country code" },
                  national_number: {
                    type: "string",
                    description: "Phone number",
                  },
                },
              },
              address: {
                type: "object",
                properties: {
                  line1: { type: "string", description: "Address line 1" },
                  line2: { type: "string", description: "Address line 2" },
                  city: { type: "string", description: "City" },
                  state: { type: "string", description: "State" },
                  postal_code: { type: "string", description: "Postal code" },
                  country_code: { type: "string", description: "Country code" },
                },
              },
            },
            required: ["email"],
          },
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Item name" },
              description: { type: "string", description: "Item description" },
              quantity: { type: "number", description: "Quantity" },
              unit_price: {
                type: "object",
                properties: {
                  currency: { type: "string", description: "Currency code" },
                  value: { type: "string", description: "Unit price" },
                },
                required: ["currency", "value"],
              },
              tax: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Tax name" },
                  percent: { type: "number", description: "Tax percentage" },
                },
              },
              date: { type: "string", description: "Item date" },
              discount: {
                type: "object",
                properties: {
                  percent: {
                    type: "number",
                    description: "Discount percentage",
                  },
                  amount: {
                    type: "object",
                    properties: {
                      currency: {
                        type: "string",
                        description: "Currency code",
                      },
                      value: { type: "string", description: "Discount amount" },
                    },
                  },
                },
              },
            },
            required: ["name", "quantity", "unit_price"],
          },
        },
        payment_term: {
          type: "object",
          properties: {
            term_type: {
              type: "string",
              enum: [
                "NET_10",
                "NET_15",
                "NET_30",
                "NET_45",
                "NET_60",
                "NET_90",
                "NO_DUE_DATE",
              ],
              description: "Payment term type",
            },
            due_date: {
              type: "string",
              description: "Custom due date (YYYY-MM-DD)",
            },
          },
        },
        reference: { type: "string", description: "Invoice reference" },
        discount: {
          type: "object",
          properties: {
            percent: { type: "number", description: "Discount percentage" },
            amount: {
              type: "object",
              properties: {
                currency: { type: "string", description: "Currency code" },
                value: { type: "string", description: "Discount amount" },
              },
            },
          },
        },
        shipping_info: {
          type: "object",
          properties: {
            first_name: { type: "string", description: "First name" },
            last_name: { type: "string", description: "Last name" },
            business_name: { type: "string", description: "Business name" },
            address: {
              type: "object",
              properties: {
                line1: { type: "string", description: "Address line 1" },
                line2: { type: "string", description: "Address line 2" },
                city: { type: "string", description: "City" },
                state: { type: "string", description: "State" },
                postal_code: { type: "string", description: "Postal code" },
                country_code: { type: "string", description: "Country code" },
              },
            },
          },
        },
        shipping_cost: {
          type: "object",
          properties: {
            amount: {
              type: "object",
              properties: {
                currency: { type: "string", description: "Currency code" },
                value: { type: "string", description: "Shipping cost" },
              },
              required: ["currency", "value"],
            },
          },
        },
        custom: {
          type: "object",
          properties: {
            label: { type: "string", description: "Custom field label" },
            amount: {
              type: "object",
              properties: {
                currency: { type: "string", description: "Currency code" },
                value: { type: "string", description: "Custom amount" },
              },
            },
          },
        },
        allow_partial_payment: {
          type: "boolean",
          description: "Allow partial payments",
        },
        minimum_amount_due: {
          type: "object",
          properties: {
            currency: { type: "string", description: "Currency code" },
            value: { type: "string", description: "Minimum amount due" },
          },
        },
        tax_calculated_after_discount: {
          type: "boolean",
          description: "Calculate tax after discount",
        },
        tax_inclusive: {
          type: "boolean",
          description: "Tax inclusive pricing",
        },
        attachments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Attachment name" },
              url: { type: "string", description: "Attachment URL" },
            },
            required: ["name", "url"],
          },
        },
      },
      required: ["currency_code", "billing_info", "items"],
    },
  },
  {
    name: "paypal_list_invoices",
    description: "List PayPal invoices with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number (default: 1)" },
        page_size: {
          type: "number",
          description: "Number of invoices per page (max: 100)",
        },
        total_count_required: {
          type: "boolean",
          description: "Include total count in response",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include",
        },
        archived: { type: "boolean", description: "Filter by archived status" },
        invoice_number: {
          type: "string",
          description: "Filter by invoice number",
        },
        invoice_date_start: {
          type: "string",
          description: "Start date filter (YYYY-MM-DD)",
        },
        invoice_date_end: {
          type: "string",
          description: "End date filter (YYYY-MM-DD)",
        },
        creation_date_start: {
          type: "string",
          description: "Creation start date filter (YYYY-MM-DD)",
        },
        creation_date_end: {
          type: "string",
          description: "Creation end date filter (YYYY-MM-DD)",
        },
        due_date_start: {
          type: "string",
          description: "Due date start filter (YYYY-MM-DD)",
        },
        due_date_end: {
          type: "string",
          description: "Due date end filter (YYYY-MM-DD)",
        },
        recipient_email: {
          type: "string",
          description: "Filter by recipient email",
        },
        recipient_first_name: {
          type: "string",
          description: "Filter by recipient first name",
        },
        recipient_last_name: {
          type: "string",
          description: "Filter by recipient last name",
        },
        recipient_business_name: {
          type: "string",
          description: "Filter by recipient business name",
        },
        reference: {
          type: "string",
          description: "Filter by invoice reference",
        },
        currency_code: {
          type: "string",
          description: "Filter by currency code",
        },
        memo: { type: "string", description: "Filter by memo" },
        total_amount_range: {
          type: "string",
          description: "Filter by total amount range",
        },
        status: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "DRAFT",
              "SENT",
              "SCHEDULED",
              "PAID",
              "MARKED_AS_PAID",
              "CANCELLED",
              "REFUNDED",
              "PARTIALLY_REFUNDED",
              "MARKED_AS_REFUNDED",
              "UNPAID",
              "PAYMENT_PENDING",
            ],
          },
          description: "Filter by invoice status",
        },
        sort_by: {
          type: "string",
          enum: ["INVOICE_DATE", "DUE_DATE", "CREATE_TIME", "UPDATE_TIME"],
          description: "Sort field",
        },
        sort_order: {
          type: "string",
          enum: ["ASC", "DESC"],
          description: "Sort order",
        },
      },
    },
  },
  {
    name: "paypal_get_invoice",
    description: "Get details of a specific PayPal invoice",
    inputSchema: {
      type: "object",
      properties: {
        invoice_id: { type: "string", description: "Invoice ID to retrieve" },
      },
      required: ["invoice_id"],
    },
  },
  {
    name: "paypal_send_invoice",
    description: "Send a PayPal invoice to recipients",
    inputSchema: {
      type: "object",
      properties: {
        invoice_id: { type: "string", description: "Invoice ID to send" },
        subject: { type: "string", description: "Email subject" },
        note: { type: "string", description: "Personal note to include" },
        send_to_merchant: {
          type: "boolean",
          description: "Send copy to merchant",
        },
        send_to_recipient: {
          type: "boolean",
          description: "Send to recipient",
        },
        additional_recipients: {
          type: "array",
          items: { type: "string", description: "Additional email addresses" },
        },
      },
      required: ["invoice_id"],
    },
  },
  {
    name: "paypal_send_invoice_reminder",
    description: "Send a reminder for an existing PayPal invoice",
    inputSchema: {
      type: "object",
      properties: {
        invoice_id: {
          type: "string",
          description: "Invoice ID to send reminder for",
        },
        subject: { type: "string", description: "Reminder email subject" },
        note: { type: "string", description: "Personal note to include" },
        send_to_merchant: {
          type: "boolean",
          description: "Send copy to merchant",
        },
        send_to_recipient: {
          type: "boolean",
          description: "Send to recipient",
        },
        additional_recipients: {
          type: "array",
          items: { type: "string", description: "Additional email addresses" },
        },
      },
      required: ["invoice_id"],
    },
  },
  {
    name: "paypal_cancel_sent_invoice",
    description: "Cancel a sent PayPal invoice",
    inputSchema: {
      type: "object",
      properties: {
        invoice_id: { type: "string", description: "Invoice ID to cancel" },
        subject: { type: "string", description: "Cancellation email subject" },
        note: { type: "string", description: "Cancellation note" },
        send_to_merchant: {
          type: "boolean",
          description: "Send copy to merchant",
        },
        send_to_recipient: {
          type: "boolean",
          description: "Send to recipient",
        },
        additional_recipients: {
          type: "array",
          items: { type: "string", description: "Additional email addresses" },
        },
      },
      required: ["invoice_id"],
    },
  },
  {
    name: "paypal_generate_invoice_qr_code",
    description: "Generate a QR code for a PayPal invoice",
    inputSchema: {
      type: "object",
      properties: {
        invoice_id: {
          type: "string",
          description: "Invoice ID to generate QR code for",
        },
        width: {
          type: "number",
          description: "QR code width in pixels (default: 100)",
        },
        height: {
          type: "number",
          description: "QR code height in pixels (default: 100)",
        },
        action: {
          type: "string",
          enum: ["pay", "details"],
          description: "QR code action (default: pay)",
        },
      },
      required: ["invoice_id"],
    },
  },
  {
    name: "paypal_create_order",
    description: "Create a new PayPal order",
    inputSchema: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          enum: ["CAPTURE", "AUTHORIZE"],
          description:
            "Order intent - CAPTURE for immediate capture, AUTHORIZE for later capture",
        },
        purchase_units: {
          type: "array",
          items: {
            type: "object",
            properties: {
              reference_id: {
                type: "string",
                description: "Purchase unit reference ID",
              },
              amount: {
                type: "object",
                properties: {
                  currency_code: {
                    type: "string",
                    description: "Currency code (e.g., USD)",
                  },
                  value: { type: "string", description: "Total amount" },
                  breakdown: {
                    type: "object",
                    properties: {
                      item_total: {
                        type: "object",
                        properties: {
                          currency_code: {
                            type: "string",
                            description: "Currency code",
                          },
                          value: { type: "string", description: "Item total" },
                        },
                      },
                      shipping: {
                        type: "object",
                        properties: {
                          currency_code: {
                            type: "string",
                            description: "Currency code",
                          },
                          value: {
                            type: "string",
                            description: "Shipping amount",
                          },
                        },
                      },
                      handling: {
                        type: "object",
                        properties: {
                          currency_code: {
                            type: "string",
                            description: "Currency code",
                          },
                          value: {
                            type: "string",
                            description: "Handling amount",
                          },
                        },
                      },
                      tax_total: {
                        type: "object",
                        properties: {
                          currency_code: {
                            type: "string",
                            description: "Currency code",
                          },
                          value: { type: "string", description: "Tax total" },
                        },
                      },
                      insurance: {
                        type: "object",
                        properties: {
                          currency_code: {
                            type: "string",
                            description: "Currency code",
                          },
                          value: {
                            type: "string",
                            description: "Insurance amount",
                          },
                        },
                      },
                      shipping_discount: {
                        type: "object",
                        properties: {
                          currency_code: {
                            type: "string",
                            description: "Currency code",
                          },
                          value: {
                            type: "string",
                            description: "Shipping discount",
                          },
                        },
                      },
                      discount: {
                        type: "object",
                        properties: {
                          currency_code: {
                            type: "string",
                            description: "Currency code",
                          },
                          value: {
                            type: "string",
                            description: "Discount amount",
                          },
                        },
                      },
                    },
                  },
                },
                required: ["currency_code", "value"],
              },
              payee: {
                type: "object",
                properties: {
                  email_address: { type: "string", description: "Payee email" },
                  merchant_id: { type: "string", description: "Merchant ID" },
                },
              },
              payment_instruction: {
                type: "object",
                properties: {
                  platform_fees: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        amount: {
                          type: "object",
                          properties: {
                            currency_code: {
                              type: "string",
                              description: "Currency code",
                            },
                            value: {
                              type: "string",
                              description: "Fee amount",
                            },
                          },
                        },
                        payee: {
                          type: "object",
                          properties: {
                            email_address: {
                              type: "string",
                              description: "Payee email",
                            },
                            merchant_id: {
                              type: "string",
                              description: "Merchant ID",
                            },
                          },
                        },
                      },
                    },
                  },
                  disbursement_mode: {
                    type: "string",
                    enum: ["INSTANT", "DELAYED"],
                    description: "Disbursement mode",
                  },
                },
              },
              description: {
                type: "string",
                description: "Purchase unit description",
              },
              custom_id: { type: "string", description: "Custom ID" },
              invoice_id: { type: "string", description: "Invoice ID" },
              soft_descriptor: {
                type: "string",
                description: "Soft descriptor",
              },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Item name" },
                    unit_amount: {
                      type: "object",
                      properties: {
                        currency_code: {
                          type: "string",
                          description: "Currency code",
                        },
                        value: { type: "string", description: "Unit price" },
                      },
                      required: ["currency_code", "value"],
                    },
                    tax: {
                      type: "object",
                      properties: {
                        currency_code: {
                          type: "string",
                          description: "Currency code",
                        },
                        value: { type: "string", description: "Tax amount" },
                      },
                    },
                    quantity: { type: "string", description: "Quantity" },
                    description: {
                      type: "string",
                      description: "Item description",
                    },
                    sku: { type: "string", description: "SKU" },
                    category: {
                      type: "string",
                      enum: ["DIGITAL_GOODS", "PHYSICAL_GOODS", "DONATION"],
                      description: "Item category",
                    },
                  },
                  required: ["name", "unit_amount", "quantity"],
                },
              },
              shipping: {
                type: "object",
                properties: {
                  method: { type: "string", description: "Shipping method" },
                  address: {
                    type: "object",
                    properties: {
                      address_line_1: {
                        type: "string",
                        description: "Address line 1",
                      },
                      address_line_2: {
                        type: "string",
                        description: "Address line 2",
                      },
                      admin_area_2: { type: "string", description: "City" },
                      admin_area_1: { type: "string", description: "State" },
                      postal_code: {
                        type: "string",
                        description: "Postal code",
                      },
                      country_code: {
                        type: "string",
                        description: "Country code",
                      },
                    },
                  },
                },
              },
            },
            required: ["amount"],
          },
        },
        payer: {
          type: "object",
          properties: {
            name: {
              type: "object",
              properties: {
                given_name: { type: "string", description: "Given name" },
                surname: { type: "string", description: "Surname" },
              },
            },
            email_address: { type: "string", description: "Email address" },
            phone: {
              type: "object",
              properties: {
                phone_type: {
                  type: "string",
                  enum: ["FAX", "HOME", "MOBILE", "OTHER", "PAGER", "WORK"],
                  description: "Phone type",
                },
                phone_number: {
                  type: "object",
                  properties: {
                    national_number: {
                      type: "string",
                      description: "Phone number",
                    },
                  },
                },
              },
            },
            birth_date: {
              type: "string",
              description: "Birth date (YYYY-MM-DD)",
            },
            tax_info: {
              type: "object",
              properties: {
                tax_id: { type: "string", description: "Tax ID" },
                tax_id_type: {
                  type: "string",
                  enum: ["BR_CPF", "BR_CNPJ"],
                  description: "Tax ID type",
                },
              },
            },
            address: {
              type: "object",
              properties: {
                address_line_1: {
                  type: "string",
                  description: "Address line 1",
                },
                address_line_2: {
                  type: "string",
                  description: "Address line 2",
                },
                admin_area_2: { type: "string", description: "City" },
                admin_area_1: { type: "string", description: "State" },
                postal_code: { type: "string", description: "Postal code" },
                country_code: { type: "string", description: "Country code" },
              },
            },
          },
        },
        application_context: {
          type: "object",
          properties: {
            brand_name: { type: "string", description: "Brand name" },
            locale: { type: "string", description: "Locale (e.g., en-US)" },
            landing_page: {
              type: "string",
              enum: ["LOGIN", "BILLING", "NO_PREFERENCE"],
              description: "Landing page preference",
            },
            shipping_preference: {
              type: "string",
              enum: ["GET_FROM_FILE", "NO_SHIPPING", "SET_PROVIDED_ADDRESS"],
              description: "Shipping preference",
            },
            user_action: {
              type: "string",
              enum: ["CONTINUE", "PAY_NOW"],
              description: "User action on approval",
            },
            payment_method: {
              type: "object",
              properties: {
                payer_selected: {
                  type: "string",
                  enum: ["PAYPAL", "PAYPAL_CREDIT"],
                  description: "Payer selected payment method",
                },
                payee_preferred: {
                  type: "string",
                  enum: ["UNRESTRICTED", "IMMEDIATE_PAYMENT_REQUIRED"],
                  description: "Payee preferred payment method",
                },
              },
            },
            return_url: { type: "string", description: "Return URL" },
            cancel_url: { type: "string", description: "Cancel URL" },
          },
        },
      },
      required: ["intent", "purchase_units"],
    },
  },
  {
    name: "paypal_get_order",
    description: "Get details of a specific PayPal order",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "string", description: "Order ID to retrieve" },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include",
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "paypal_capture_order",
    description: "Capture payment for a PayPal order",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "string", description: "Order ID to capture" },
        payment_source: {
          type: "object",
          properties: {
            paypal: {
              type: "object",
              properties: {
                email_address: { type: "string", description: "PayPal email" },
                account_id: {
                  type: "string",
                  description: "PayPal account ID",
                },
                name: {
                  type: "object",
                  properties: {
                    given_name: { type: "string", description: "Given name" },
                    surname: { type: "string", description: "Surname" },
                  },
                },
                phone: {
                  type: "object",
                  properties: {
                    phone_type: {
                      type: "string",
                      enum: ["FAX", "HOME", "MOBILE", "OTHER", "PAGER", "WORK"],
                      description: "Phone type",
                    },
                    phone_number: {
                      type: "object",
                      properties: {
                        national_number: {
                          type: "string",
                          description: "Phone number",
                        },
                      },
                    },
                  },
                },
                birth_date: {
                  type: "string",
                  description: "Birth date (YYYY-MM-DD)",
                },
                tax_info: {
                  type: "object",
                  properties: {
                    tax_id: { type: "string", description: "Tax ID" },
                    tax_id_type: {
                      type: "string",
                      enum: ["BR_CPF", "BR_CNPJ"],
                      description: "Tax ID type",
                    },
                  },
                },
                address: {
                  type: "object",
                  properties: {
                    address_line_1: {
                      type: "string",
                      description: "Address line 1",
                    },
                    address_line_2: {
                      type: "string",
                      description: "Address line 2",
                    },
                    admin_area_2: { type: "string", description: "City" },
                    admin_area_1: { type: "string", description: "State" },
                    postal_code: { type: "string", description: "Postal code" },
                    country_code: {
                      type: "string",
                      description: "Country code",
                    },
                  },
                },
              },
            },
          },
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "paypal_list_disputes",
    description: "List PayPal disputes with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        start_time: {
          type: "string",
          description: "Start time filter (RFC 3339 format)",
        },
        end_time: {
          type: "string",
          description: "End time filter (RFC 3339 format)",
        },
        page_size: {
          type: "number",
          description: "Number of disputes per page (max: 50)",
        },
        next_page_token: { type: "string", description: "Token for next page" },
        dispute_state: {
          type: "string",
          enum: [
            "REQUIRED_ACTION",
            "REQUIRED_OTHER_PARTY_ACTION",
            "UNDER_PAYPAL_REVIEW",
            "RESOLVED",
            "OPEN_INQUIRIES",
            "APPEALABLE",
          ],
          description: "Filter by dispute state",
        },
      },
    },
  },
  {
    name: "paypal_get_dispute",
    description: "Get detailed information about a specific PayPal dispute",
    inputSchema: {
      type: "object",
      properties: {
        dispute_id: { type: "string", description: "Dispute ID to retrieve" },
      },
      required: ["dispute_id"],
    },
  },
  {
    name: "paypal_accept_dispute_claim",
    description: "Accept a PayPal dispute claim",
    inputSchema: {
      type: "object",
      properties: {
        dispute_id: { type: "string", description: "Dispute ID to accept" },
        note: {
          type: "string",
          description: "Optional note for accepting the claim",
        },
        accept_claim_type: {
          type: "string",
          enum: ["REFUND", "REPLACE"],
          description: "Type of claim acceptance",
        },
      },
      required: ["dispute_id"],
    },
  },
  {
    name: "paypal_create_shipment_tracking",
    description: "Create a shipment tracking record for PayPal",
    inputSchema: {
      type: "object",
      properties: {
        transaction_id: {
          type: "string",
          description: "Transaction ID for the shipment",
        },
        tracking_number: { type: "string", description: "Tracking number" },
        status: {
          type: "string",
          enum: [
            "SHIPPED",
            "ON_HOLD",
            "DELIVERED",
            "EXCEPTION",
            "EXPIRED",
            "PENDING_PICKUP",
          ],
          description: "Shipment status",
        },
        carrier: {
          type: "string",
          enum: [
            "FEDEX",
            "UPS",
            "USPS",
            "DHL",
            "DHL_EXPRESS",
            "DHL_GLOBAL_MAIL",
            "ARAMEX",
            "AUSTRALIA_POST",
            "CANADA_POST",
            "CHINA_POST",
            "HONGKONG_POST",
            "ISRAEL_POST",
            "JAPAN_POST",
            "ROYAL_MAIL",
            "SINGAPORE_POST",
            "SWISS_POST",
            "TNT",
            "OTHER",
          ],
          description: "Shipping carrier",
        },
        carrier_name_other: {
          type: "string",
          description: "Custom carrier name if carrier is OTHER",
        },
        postage_payment_id: {
          type: "string",
          description: "Postage payment ID",
        },
        notify_buyer: {
          type: "boolean",
          description: "Whether to notify the buyer",
        },
        quantity: { type: "number", description: "Quantity of items shipped" },
        tracking_number_type: {
          type: "string",
          enum: ["CARRIER_PROVIDED", "E2E_PARTNER_PROVIDED", "MANUAL"],
          description: "Type of tracking number",
        },
        shipment_date: {
          type: "string",
          description: "Shipment date (YYYY-MM-DD)",
        },
        shipment_uploader: {
          type: "string",
          enum: ["PAYPAL", "EBAY", "API"],
          description: "Who uploaded the shipment info",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Item name" },
              quantity: { type: "number", description: "Item quantity" },
              sku: { type: "string", description: "Item SKU" },
              url: { type: "string", description: "Item URL" },
              category: {
                type: "string",
                enum: [
                  "ANIMALS_AND_PET_SUPPLIES",
                  "APPAREL_AND_ACCESSORIES",
                  "ARTS_AND_ENTERTAINMENT",
                ],
                description: "Item category",
              },
            },
          },
        },
      },
      required: ["transaction_id", "tracking_number", "status", "carrier"],
    },
  },
  {
    name: "paypal_get_shipment_tracking",
    description: "Get shipment tracking information from PayPal",
    inputSchema: {
      type: "object",
      properties: {
        transaction_id: {
          type: "string",
          description: "Transaction ID to get tracking for",
        },
      },
      required: ["transaction_id"],
    },
  },
  {
    name: "paypal_create_product",
    description: "Create a new product in PayPal catalog",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Product name" },
        description: { type: "string", description: "Product description" },
        type: {
          type: "string",
          enum: ["PHYSICAL", "DIGITAL", "SERVICE"],
          description: "Product type",
        },
        category: {
          type: "string",
          enum: [
            "BOOKS_PERIODICALS_AND_NEWSPAPERS",
            "COMPUTERS_ELECTRONICS_AND_TECHNOLOGY",
            "FINANCIAL_SERVICES_AND_PRODUCTS",
            "HEALTH_AND_PERSONAL_CARE",
            "HOME_AND_GARDEN",
            "NONPROFIT",
            "EDUCATION_AND_TRAINING",
            "ENTERTAINMENT_AND_MEDIA",
            "FOOD_RETAIL_AND_SERVICE",
            "GOVERNMENT",
            "INDUSTRIAL_AND_MANUFACTURING",
            "JEWELRY_AND_WATCHES",
            "LEGAL_AND_ACCOUNTING_SERVICES",
            "MISCELLANEOUS",
            "OTHER",
          ],
          description: "Product category",
        },
        image_url: { type: "string", description: "Product image URL" },
        home_url: { type: "string", description: "Product home page URL" },
      },
      required: ["name", "type"],
    },
  },
  {
    name: "paypal_list_products",
    description: "List products in PayPal catalog with pagination",
    inputSchema: {
      type: "object",
      properties: {
        page_size: {
          type: "number",
          description: "Number of products per page (max: 100)",
        },
        page: { type: "number", description: "Page number" },
        total_required: {
          type: "boolean",
          description: "Include total count in response",
        },
      },
    },
  },
  {
    name: "paypal_get_product",
    description: "Get details of a specific product from PayPal catalog",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID to retrieve" },
      },
      required: ["product_id"],
    },
  },
  {
    name: "paypal_update_product",
    description: "Update an existing product in PayPal catalog",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID to update" },
        operations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              op: {
                type: "string",
                enum: ["add", "remove", "replace", "move", "copy", "test"],
                description: "Operation type",
              },
              path: { type: "string", description: "JSON path to modify" },
              value: { description: "New value for the path" },
              from: {
                type: "string",
                description: "Source path for move/copy operations",
              },
            },
            required: ["op", "path"],
          },
        },
      },
      required: ["product_id", "operations"],
    },
  },
  {
    name: "paypal_create_subscription_plan",
    description: "Create a new subscription plan in PayPal",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID for this plan" },
        name: { type: "string", description: "Plan name" },
        description: { type: "string", description: "Plan description" },
        status: {
          type: "string",
          enum: ["CREATED", "INACTIVE", "ACTIVE"],
          description: "Plan status",
        },
        billing_cycles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              frequency: {
                type: "object",
                properties: {
                  interval_unit: {
                    type: "string",
                    enum: ["DAY", "WEEK", "MONTH", "YEAR"],
                    description: "Billing interval unit",
                  },
                  interval_count: {
                    type: "number",
                    description: "Billing interval count",
                  },
                },
                required: ["interval_unit", "interval_count"],
              },
              tenure_type: {
                type: "string",
                enum: ["REGULAR", "TRIAL"],
                description: "Billing cycle type",
              },
              sequence: {
                type: "number",
                description: "Billing cycle sequence",
              },
              total_cycles: {
                type: "number",
                description: "Total billing cycles (0 for infinite)",
              },
              pricing_scheme: {
                type: "object",
                properties: {
                  fixed_price: {
                    type: "object",
                    properties: {
                      value: { type: "string", description: "Price value" },
                      currency_code: {
                        type: "string",
                        description: "Currency code",
                      },
                    },
                    required: ["value", "currency_code"],
                  },
                  version: {
                    type: "number",
                    description: "Pricing scheme version",
                  },
                  create_time: { type: "string", description: "Creation time" },
                  update_time: { type: "string", description: "Update time" },
                },
              },
            },
            required: ["frequency", "tenure_type", "sequence", "total_cycles"],
          },
        },
        payment_preferences: {
          type: "object",
          properties: {
            auto_bill_outstanding: {
              type: "boolean",
              description: "Auto bill outstanding amount",
            },
            setup_fee: {
              type: "object",
              properties: {
                value: { type: "string", description: "Setup fee amount" },
                currency_code: { type: "string", description: "Currency code" },
              },
            },
            setup_fee_failure_action: {
              type: "string",
              enum: ["CONTINUE", "CANCEL"],
              description: "Action when setup fee fails",
            },
            payment_failure_threshold: {
              type: "number",
              description: "Payment failure threshold",
            },
          },
        },
        taxes: {
          type: "object",
          properties: {
            percentage: { type: "string", description: "Tax percentage" },
            inclusive: {
              type: "boolean",
              description: "Tax inclusive pricing",
            },
          },
        },
      },
      required: ["product_id", "name", "billing_cycles"],
    },
  },
  {
    name: "paypal_list_subscription_plans",
    description: "List subscription plans with pagination",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Filter by product ID" },
        plan_ids: {
          type: "array",
          items: { type: "string" },
          description: "Filter by plan IDs",
        },
        page_size: {
          type: "number",
          description: "Number of plans per page (max: 100)",
        },
        page: { type: "number", description: "Page number" },
        total_required: {
          type: "boolean",
          description: "Include total count in response",
        },
      },
    },
  },
  {
    name: "paypal_get_subscription_plan",
    description: "Get details of a specific subscription plan",
    inputSchema: {
      type: "object",
      properties: {
        plan_id: { type: "string", description: "Plan ID to retrieve" },
      },
      required: ["plan_id"],
    },
  },
  {
    name: "paypal_create_subscription",
    description: "Create a new subscription",
    inputSchema: {
      type: "object",
      properties: {
        plan_id: { type: "string", description: "Subscription plan ID" },
        start_time: {
          type: "string",
          description: "Subscription start time (RFC 3339)",
        },
        quantity: { type: "string", description: "Subscription quantity" },
        shipping_amount: {
          type: "object",
          properties: {
            currency_code: { type: "string", description: "Currency code" },
            value: { type: "string", description: "Shipping amount" },
          },
        },
        subscriber: {
          type: "object",
          properties: {
            name: {
              type: "object",
              properties: {
                given_name: { type: "string", description: "Given name" },
                surname: { type: "string", description: "Surname" },
              },
            },
            email_address: { type: "string", description: "Email address" },
            phone: {
              type: "object",
              properties: {
                phone_type: {
                  type: "string",
                  enum: ["FAX", "HOME", "MOBILE", "OTHER", "PAGER", "WORK"],
                  description: "Phone type",
                },
                phone_number: {
                  type: "object",
                  properties: {
                    national_number: {
                      type: "string",
                      description: "Phone number",
                    },
                  },
                },
              },
            },
            shipping_address: {
              type: "object",
              properties: {
                name: {
                  type: "object",
                  properties: {
                    full_name: { type: "string", description: "Full name" },
                  },
                },
                address: {
                  type: "object",
                  properties: {
                    address_line_1: {
                      type: "string",
                      description: "Address line 1",
                    },
                    address_line_2: {
                      type: "string",
                      description: "Address line 2",
                    },
                    admin_area_2: { type: "string", description: "City" },
                    admin_area_1: { type: "string", description: "State" },
                    postal_code: { type: "string", description: "Postal code" },
                    country_code: {
                      type: "string",
                      description: "Country code",
                    },
                  },
                },
              },
            },
          },
        },
        application_context: {
          type: "object",
          properties: {
            brand_name: { type: "string", description: "Brand name" },
            locale: { type: "string", description: "Locale (e.g., en-US)" },
            shipping_preference: {
              type: "string",
              enum: ["GET_FROM_FILE", "NO_SHIPPING", "SET_PROVIDED_ADDRESS"],
              description: "Shipping preference",
            },
            user_action: {
              type: "string",
              enum: ["SUBSCRIBE_NOW", "CONTINUE"],
              description: "User action on approval",
            },
            payment_method: {
              type: "object",
              properties: {
                payer_selected: {
                  type: "string",
                  enum: ["PAYPAL"],
                  description: "Payer selected payment method",
                },
                payee_preferred: {
                  type: "string",
                  enum: ["UNRESTRICTED", "IMMEDIATE_PAYMENT_REQUIRED"],
                  description: "Payee preferred payment method",
                },
              },
            },
            return_url: { type: "string", description: "Return URL" },
            cancel_url: { type: "string", description: "Cancel URL" },
          },
        },
        custom_id: { type: "string", description: "Custom subscription ID" },
      },
      required: ["plan_id"],
    },
  },
  {
    name: "paypal_get_subscription",
    description: "Get details of a specific subscription",
    inputSchema: {
      type: "object",
      properties: {
        subscription_id: {
          type: "string",
          description: "Subscription ID to retrieve",
        },
      },
      required: ["subscription_id"],
    },
  },
  {
    name: "paypal_cancel_subscription",
    description: "Cancel an active subscription",
    inputSchema: {
      type: "object",
      properties: {
        subscription_id: {
          type: "string",
          description: "Subscription ID to cancel",
        },
        reason: { type: "string", description: "Reason for cancellation" },
      },
      required: ["subscription_id", "reason"],
    },
  },
  {
    name: "paypal_list_transactions",
    description:
      "List PayPal transactions with filtering and pagination. Note: The date range between start_date and end_date cannot exceed 31 days.",
    inputSchema: {
      type: "object",
      properties: {
        transaction_id: {
          type: "string",
          description: "Filter by transaction ID",
        },
        transaction_type: {
          type: "string",
          enum: [
            "T00",
            "T01",
            "T02",
            "T03",
            "T04",
            "T05",
            "T06",
            "T07",
            "T08",
            "T09",
            "T10",
            "T11",
            "T12",
            "T13",
            "T14",
          ],
          description: "Filter by transaction type",
        },
        transaction_status: {
          type: "string",
          enum: ["D", "P", "S", "V"],
          description:
            "Filter by transaction status (D=Denied, P=Pending, S=Success, V=Voided)",
        },
        transaction_amount: {
          type: "string",
          description: "Filter by transaction amount",
        },
        transaction_currency: {
          type: "string",
          description: "Filter by transaction currency",
        },
        start_date: {
          type: "string",
          description:
            "Start date filter (format: 2023-01-01T00:00:00.000Z). Note: Date range cannot exceed 31 days from end_date.",
        },
        end_date: {
          type: "string",
          description:
            "End date filter (format: 2023-01-01T00:00:00.000Z). Note: Date range cannot exceed 31 days from start_date.",
        },
        payment_instrument_type: {
          type: "string",
          enum: ["CREDITCARD", "DEBITCARD", "PAYPAL", "PAYPAL_CREDIT"],
          description: "Filter by payment instrument type",
        },
        store_id: { type: "string", description: "Filter by store ID" },
        terminal_id: { type: "string", description: "Filter by terminal ID" },
        page_size: {
          type: "number",
          description: "Number of transactions per page (max: 500)",
        },
        page: { type: "number", description: "Page number" },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to include",
        },
      },
    },
  },
];
