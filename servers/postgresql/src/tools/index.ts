import { McpTool } from "../../../../shared/types/mcp.js";

export const postgresqlTools: McpTool[] = [
  {
    name: "execute_query",
    description:
      "Execute a SQL query on the PostgreSQL database (SELECT queries automatically limited to 100 results)",
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
];
