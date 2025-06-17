import { McpTool } from "../../../../shared/types/mcp.js";

export const postgresqlTools: McpTool[] = [
  {
    name: "execute_query",
    description: "Execute a SQL query on the PostgreSQL database",
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
    name: "get_table_schema",
    description: "Get the schema information for a specific table",
    inputSchema: {
      type: "object",
      properties: {
        tableName: {
          type: "string",
          description: "Name of the table to get schema for",
        },
      },
      required: ["tableName"],
    },
  },
  {
    name: "list_tables",
    description: "List all tables in the database",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_database_stats",
    description:
      "Get database statistics including table count, row count, and size",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "test_connection",
    description: "Test the database connection",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];
