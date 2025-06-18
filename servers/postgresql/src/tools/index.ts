import { McpTool } from "../../../../shared/types/mcp.js";

export const postgresqlTools: McpTool[] = [
  {
    name: "execute_query",
    description:
      "Execute a SQL query on the PostgreSQL database. When dangerous operations are disabled, only SELECT queries are allowed and automatically limited to 100 results. When enabled, supports INSERT, UPDATE, DELETE, and other write operations.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "SQL query to execute",
        },
        params: {
          type: "array",
          description: "Query parameters for prepared statements",
          items: {
            type: "string",
          },
        },
      },
      required: ["query"],
    },
  },
  {
    name: "check_dangerous_operations_allowed",
    description:
      "Check if dangerous operations (INSERT, UPDATE, DELETE, etc.) are allowed on this PostgreSQL server. This helps LLMs understand what operations they can perform.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];
