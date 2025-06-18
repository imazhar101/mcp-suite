import { McpTool } from "../../../../shared/types/mcp.js";

export const salesforceTools: McpTool[] = [
  {
    name: "salesforce_query",
    description: "Execute a SOQL query to retrieve records from Salesforce",
    inputSchema: {
      type: "object",
      properties: {
        soql: {
          type: "string",
          description:
            "SOQL query to execute (e.g., 'SELECT Id, Name FROM Account LIMIT 10')",
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
          description:
            "Salesforce object type (e.g., 'Account', 'Contact', 'Opportunity')",
        },
        record: {
          type: "object",
          description:
            "Record data as key-value pairs (do not include Id field)",
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
          description:
            "Salesforce object type (e.g., 'Account', 'Contact', 'Opportunity')",
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
          description:
            "Optional list of fields to retrieve (if not specified, all fields are returned)",
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
          description:
            "Salesforce object type (e.g., 'Account', 'Contact', 'Opportunity')",
        },
        id: {
          type: "string",
          description: "Salesforce record ID (15 or 18 character ID)",
        },
        record: {
          type: "object",
          description:
            "Record data to update as key-value pairs (do not include Id field)",
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
          description:
            "Salesforce object type (e.g., 'Account', 'Contact', 'Opportunity')",
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
          description:
            "Salesforce object type (e.g., 'Account', 'Contact', 'Opportunity')",
        },
      },
      required: ["sobject_type"],
    },
  },
  {
    name: "salesforce_list_objects",
    description:
      "List all available Salesforce object types (returns only object names for efficiency)",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];
