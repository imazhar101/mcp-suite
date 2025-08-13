import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ripplingTools: Tool[] = [
  // Connection test
  {
    name: "rippling_test_connection",
    description:
      "Test the connection to Rippling API and retrieve basic information",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // Employment Roles
  {
    name: "rippling_get_employment_roles",
    description: "Get employment roles for a specific user by user ID",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "The user ID to get employment roles for",
        },
      },
      required: ["userId"],
    },
  },

  // Employees
  {
    name: "rippling_list_employees",
    description:
      "List employees with optional search and pagination. Returns simplified employee data with id, fullName, email, title, and department",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
        },
        searchQuery: {
          type: "string",
          description: "Optional search query to filter employees by name",
        },
      },
      required: [],
    },
  },

  // Leave Types
  {
    name: "rippling_get_company_leave_types",
    description:
      "Get all company leave types including long-term leave types. Returns available leave types for the company",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // Terminated Employees
  {
    name: "rippling_list_terminated_employees",
    description:
      "List terminated employees with optional search and pagination. Returns terminated employee data including termination details",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
        },
        searchQuery: {
          type: "string",
          description:
            "Optional search query to filter terminated employees by name",
        },
      },
      required: [],
    },
  },

  // Documents
  {
    name: "rippling_get_document_folder_contents",
    description:
      "Get folder contents from Rippling documents platform. Returns files and folders in the specified folder",
    inputSchema: {
      type: "object",
      properties: {
        parent: {
          type: "string",
          description: "The parent folder ID (default: 'root')",
          default: "root",
        },
        resource: {
          type: "string",
          description: "The resource ID to filter documents by",
        },
      },
      required: ["resource"],
    },
  },

  // Anniversary Information
  {
    name: "rippling_get_anniversary_information",
    description:
      "Get anniversary email settings and information from Rippling anniversary app",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];
