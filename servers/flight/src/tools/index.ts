import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const flightTools: Tool[] = [
  {
    name: "duffel_test_connection",
    description: "Test connection to Duffel API",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "duffel_search_flights",
    description: "Search for flights between two airports",
    inputSchema: {
      type: "object",
      properties: {
        origin: {
          type: "string",
          description: "Origin airport IATA code (e.g., JFK, LAX, LHR)",
        },
        destination: {
          type: "string",
          description: "Destination airport IATA code (e.g., JFK, LAX, LHR)",
        },
        departure_date: {
          type: "string",
          description: "Departure date in ISO format (YYYY-MM-DD)",
        },
        return_date: {
          type: "string",
          description: "Return date in ISO format (YYYY-MM-DD) for round-trip flights",
        },
        passengers: {
          type: "object",
          description: "Number of passengers",
          properties: {
            adults: {
              type: "number",
              description: "Number of adult passengers",
              minimum: 1,
            },
            children: {
              type: "number",
              description: "Number of child passengers",
              minimum: 0,
            },
            infants: {
              type: "number",
              description: "Number of infant passengers",
              minimum: 0,
            },
          },
          required: ["adults"],
        },
        cabin_class: {
          type: "string",
          description: "Preferred cabin class",
          enum: ["economy", "premium_economy", "business", "first"],
        },
        max_connections: {
          type: "number",
          description: "Maximum number of connections allowed",
          minimum: 0,
        },
      },
      required: ["origin", "destination", "departure_date", "passengers"],
    },
  },
  {
    name: "duffel_get_offer_request",
    description: "Get details of a specific offer request",
    inputSchema: {
      type: "object",
      properties: {
        offer_request_id: {
          type: "string",
          description: "The ID of the offer request",
        },
      },
      required: ["offer_request_id"],
    },
  },
  {
    name: "duffel_get_offers",
    description: "Get available offers for a specific offer request",
    inputSchema: {
      type: "object",
      properties: {
        offer_request_id: {
          type: "string",
          description: "The ID of the offer request",
        },
        limit: {
          type: "number",
          description: "Maximum number of offers to return",
          minimum: 1,
          maximum: 200,
        },
      },
      required: ["offer_request_id"],
    },
  },
  {
    name: "duffel_get_offer",
    description: "Get details of a specific offer",
    inputSchema: {
      type: "object",
      properties: {
        offer_id: {
          type: "string",
          description: "The ID of the offer",
        },
      },
      required: ["offer_id"],
    },
  },
  {
    name: "duffel_create_order",
    description: "Create a booking order from selected offers",
    inputSchema: {
      type: "object",
      properties: {
        selected_offers: {
          type: "array",
          description: "Array of offer IDs to book",
          items: {
            type: "string",
          },
        },
        passengers: {
          type: "array",
          description: "Passenger details for the booking",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Passenger ID (must match offer request passengers)",
              },
              type: {
                type: "string",
                enum: ["adult", "child", "infant_without_seat"],
                description: "Passenger type",
              },
              title: {
                type: "string",
                description: "Passenger title (Mr, Mrs, Ms, etc.)",
              },
              given_name: {
                type: "string",
                description: "Passenger's first name",
              },
              family_name: {
                type: "string",
                description: "Passenger's last name",
              },
              gender: {
                type: "string",
                enum: ["M", "F"],
                description: "Passenger's gender",
              },
              born_on: {
                type: "string",
                description: "Date of birth in ISO format (YYYY-MM-DD)",
              },
              email: {
                type: "string",
                description: "Passenger's email address",
              },
              phone_number: {
                type: "string",
                description: "Passenger's phone number",
              },
              identity_documents: {
                type: "array",
                description: "Identity documents (passport, etc.)",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["passport", "tax_id", "known_traveler_number", "passenger_redress_number"],
                    },
                    unique_identifier: {
                      type: "string",
                      description: "Document number",
                    },
                    expires_on: {
                      type: "string",
                      description: "Document expiry date in ISO format (YYYY-MM-DD)",
                    },
                    issued_on: {
                      type: "string",
                      description: "Document issue date in ISO format (YYYY-MM-DD)",
                    },
                    issuing_country_code: {
                      type: "string",
                      description: "Two-letter country code",
                    },
                  },
                  required: ["type", "unique_identifier"],
                },
              },
            },
            required: ["id", "type", "given_name", "family_name"],
          },
        },
        type: {
          type: "string",
          enum: ["instant", "hold"],
          description: "Order type - instant payment or hold",
        },
        payment: {
          type: "object",
          description: "Payment details (for instant orders)",
          properties: {
            type: {
              type: "string",
              enum: ["balance", "card", "arc_bsp_cash"],
              description: "Payment method",
            },
            amount: {
              type: "string",
              description: "Payment amount",
            },
            currency: {
              type: "string",
              description: "Payment currency code",
            },
            card: {
              type: "object",
              description: "Credit card details",
              properties: {
                number: {
                  type: "string",
                  description: "Card number",
                },
                expiry_month: {
                  type: "string",
                  description: "Card expiry month (MM)",
                },
                expiry_year: {
                  type: "string",
                  description: "Card expiry year (YYYY)",
                },
                cvc: {
                  type: "string",
                  description: "Card security code",
                },
                name: {
                  type: "string",
                  description: "Cardholder name",
                },
                address_line_1: {
                  type: "string",
                  description: "Billing address line 1",
                },
                address_line_2: {
                  type: "string",
                  description: "Billing address line 2",
                },
                address_city: {
                  type: "string",
                  description: "Billing address city",
                },
                address_region: {
                  type: "string",
                  description: "Billing address region/state",
                },
                address_postal_code: {
                  type: "string",
                  description: "Billing address postal code",
                },
                address_country_code: {
                  type: "string",
                  description: "Billing address country code",
                },
              },
              required: ["number", "expiry_month", "expiry_year", "cvc", "name"],
            },
          },
          required: ["type", "amount", "currency"],
        },
      },
      required: ["selected_offers", "passengers", "type"],
    },
  },
  {
    name: "duffel_get_order",
    description: "Get details of a specific order",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: "The ID of the order",
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "duffel_list_orders",
    description: "List all orders with optional pagination",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of orders to return",
          minimum: 1,
          maximum: 200,
        },
        after: {
          type: "string",
          description: "Cursor for pagination",
        },
      },
      required: [],
    },
  },
  {
    name: "duffel_cancel_order",
    description: "Cancel a specific order",
    inputSchema: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: "The ID of the order to cancel",
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "duffel_get_seat_maps",
    description: "Get seat maps for a specific offer",
    inputSchema: {
      type: "object",
      properties: {
        offer_id: {
          type: "string",
          description: "The ID of the offer",
        },
      },
      required: ["offer_id"],
    },
  },
  {
    name: "duffel_get_airlines",
    description: "Get list of airlines",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of airlines to return",
          minimum: 1,
          maximum: 200,
        },
      },
      required: [],
    },
  },
  {
    name: "duffel_get_airports",
    description: "Get list of airports",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of airports to return",
          minimum: 1,
          maximum: 200,
        },
        iata_code: {
          type: "string",
          description: "Filter by specific IATA code",
        },
        iata_country_code: {
          type: "string",
          description: "Filter by specific country IATA code (e.g., 'GB', 'US')",
        },
        after: {
          type: "string",
          description: "Cursor for pagination - get airports after this cursor",
        },
        before: {
          type: "string",
          description: "Cursor for pagination - get airports before this cursor",
        },
      },
      required: [],
    },
  },
];