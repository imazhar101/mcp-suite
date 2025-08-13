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

  // Action Request Filters
  {
    name: "rippling_get_action_request_filters",
    description:
      "Get filtered action requests with pagination. Use 'requestedByRoles' to see actions YOU submitted (your own requests). Use 'pendingReviewerRoles' to see actions waiting for YOUR review. Defaults to showing actions pending your review if neither is specified.",
    inputSchema: {
      type: "object",
      properties: {
        pageSize: {
          type: "number",
          description: "Number of results per page (default: 30)",
          default: 30,
        },
        actionTypes: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by action types (e.g., LEAVE_REQUEST_APPROVAL)",
        },
        pendingReviewerRoles: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Role IDs for actions awaiting review. Use this to see actions waiting for approval/review by specific users.",
        },
        requestedByRoles: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Role IDs for actions that were submitted/requested. Use this with your user ID to see YOUR OWN submitted requests (e.g., leave requests you submitted).",
        },
        sortColumn: {
          type: "string",
          description: "Column to sort by (default: dateRequested)",
          default: "dateRequested",
        },
        sortOrder: {
          type: "string",
          enum: ["ASC", "DESC"],
          description: "Sort order (default: DESC)",
          default: "DESC",
        },
        includeRoleDetails: {
          type: "boolean",
          description: "Include role details in the response (default: true)",
          default: true,
        },
      },
      required: [],
    },
  },

  // Open Interviews and Feedbacks
  {
    name: "rippling_get_open_interviews_and_feedbacks",
    description:
      "Get open interviews and feedbacks for an employee from ATS. Returns today's interviews, pending interviews/feedbacks, and upcoming interviews.",
    inputSchema: {
      type: "object",
      properties: {
        searchQuery: {
          type: "string",
          description: "Optional search query to filter results",
          default: "",
        },
        timezone: {
          type: "string",
          description: "Timezone for the request (default: America/Phoenix)",
          default: "America/Phoenix",
        },
      },
      required: [],
    },
  },
];
