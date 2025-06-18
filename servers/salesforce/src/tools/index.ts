import { McpTool } from "../../../../shared/types/mcp.js";

export const salesforceTools: McpTool[] = [
  {
    name: "salesforce_oauth_login",
    description: "Authenticate with Salesforce using OAuth username-password flow",
    inputSchema: {
      type: "object",
      properties: {
        client_id: {
          type: "string",
          description: "Salesforce Connected App Client ID",
        },
        client_secret: {
          type: "string",
          description: "Salesforce Connected App Client Secret",
        },
        username: {
          type: "string",
          description: "Salesforce username",
        },
        password: {
          type: "string",
          description: "Salesforce password (may need to append security token)",
        },
        grant_type: {
          type: "string",
          description: "OAuth grant type (should be 'password')",
          default: "password",
        },
        login_url: {
          type: "string",
          description: "Salesforce login URL (defaults to https://login.salesforce.com for production, use https://test.salesforce.com for sandbox)",
          default: "https://login.salesforce.com",
        },
      },
      required: ["client_id", "client_secret", "username", "password"],
    },
  },
  {
    name: "salesforce_auth_status",
    description: "Check current Salesforce authentication status",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "salesforce_query",
    description: "Execute a SOQL query to retrieve records from Salesforce",
    inputSchema: {
      type: "object",
      properties: {
        soql: {
          type: "string",
          description: "SOQL query to execute (e.g., 'SELECT Id, Name FROM Account LIMIT 10')",
        },
      },
      required: ["soql"],
    },
  },
  {
    name: "salesforce_create",
    description: "Create a new record in Salesforce",
    inputSchema: {
      type: "object",
      properties: {
        sobject_type: {
          type: "string",
          description: "Salesforce object type (e.g., 'Account', 'Contact', 'Opportunity')",
        },
        record: {
          type: "object",
          description: "Record data as key-value pairs (do not include Id field)",
        },
      },
      required: ["sobject_type", "record"],
    },
  },
  {
    name: "salesforce_read",
    description: "Read a specific record from Salesforce by ID",
    inputSchema: {
      type: "object",
      properties: {
        sobject_type: {
          type: "string",
          description: "Salesforce object type (e.g., 'Account', 'Contact', 'Opportunity')",
        },
        id: {
          type: "string",
          description: "Salesforce record ID (15 or 18 character ID)",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of fields to retrieve (if not specified, all fields are returned)",
        },
      },
      required: ["sobject_type", "id"],
    },
  },
  {
    name: "salesforce_update",
    description: "Update an existing record in Salesforce",
    inputSchema: {
      type: "object",
      properties: {
        sobject_type: {
          type: "string",
          description: "Salesforce object type (e.g., 'Account', 'Contact', 'Opportunity')",
        },
        id: {
          type: "string",
          description: "Salesforce record ID (15 or 18 character ID)",
        },
        record: {
          type: "object",
          description: "Record data to update as key-value pairs (do not include Id field)",
        },
      },
      required: ["sobject_type", "id", "record"],
    },
  },
  {
    name: "salesforce_delete",
    description: "Delete a record from Salesforce",
    inputSchema: {
      type: "object",
      properties: {
        sobject_type: {
          type: "string",
          description: "Salesforce object type (e.g., 'Account', 'Contact', 'Opportunity')",
        },
        id: {
          type: "string",
          description: "Salesforce record ID (15 or 18 character ID)",
        },
      },
      required: ["sobject_type", "id"],
    },
  },
  {
    name: "salesforce_describe",
    description: "Get metadata information about a Salesforce object type",
    inputSchema: {
      type: "object",
      properties: {
        sobject_type: {
          type: "string",
          description: "Salesforce object type (e.g., 'Account', 'Contact', 'Opportunity')",
        },
      },
      required: ["sobject_type"],
    },
  },
  {
    name: "salesforce_list_objects",
    description: "List all available Salesforce object types",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];