#!/usr/bin/env node

/**
 * Notion MCP Server
 *
 * This MCP server provides integration with Notion's API, allowing you to:
 * - Search and retrieve pages from your Notion workspace
 * - Create new pages in databases
 * - Update existing pages
 * - Query databases
 * - Read page content and properties
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListResourceTemplatesRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@notionhq/client";

// Initialize Notion client
const NOTION_API_KEY = process.env.NOTION_API_KEY;
if (!NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY environment variable is required");
}

const notion = new Client({
  auth: NOTION_API_KEY,
});

/**
 * Helper function to validate tool arguments
 */
function validateArgs(args: any, requiredFields: string[]): boolean {
  if (!args || typeof args !== "object") return false;
  return requiredFields.every((field) => field in args);
}

/**
 * Helper function to format page content for display
 */
function formatPageContent(page: any): string {
  const title = getPageTitle(page);
  const properties = formatProperties(page.properties);

  return JSON.stringify(
    {
      id: page.id,
      title,
      url: page.url,
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
      properties,
      archived: page.archived,
    },
    null,
    2
  );
}

/**
 * Extract page title from Notion page object
 */
function getPageTitle(page: any): string {
  if (!page.properties) return "Untitled";

  // Look for title property
  for (const [key, property] of Object.entries(page.properties as any)) {
    const prop = property as any;
    if (
      prop.type === "title" &&
      Array.isArray(prop.title) &&
      prop.title.length > 0
    ) {
      return (
        prop.title[0]?.plain_text || prop.title[0]?.text?.content || "Untitled"
      );
    }
  }

  return "Untitled";
}

/**
 * Format page properties for display
 */
function formatProperties(properties: any): Record<string, any> {
  const formatted: Record<string, any> = {};

  for (const [key, property] of Object.entries(properties as any)) {
    const prop = property as any;
    switch (prop.type) {
      case "title":
        formatted[key] = Array.isArray(prop.title)
          ? prop.title
              .map((t: any) => t.plain_text || t.text?.content || "")
              .join("")
          : "";
        break;
      case "rich_text":
        formatted[key] = Array.isArray(prop.rich_text)
          ? prop.rich_text
              .map((t: any) => t.plain_text || t.text?.content || "")
              .join("")
          : "";
        break;
      case "number":
        formatted[key] = prop.number;
        break;
      case "select":
        formatted[key] = prop.select?.name || null;
        break;
      case "multi_select":
        formatted[key] = Array.isArray(prop.multi_select)
          ? prop.multi_select.map((s: any) => s.name)
          : [];
        break;
      case "date":
        formatted[key] = prop.date?.start || null;
        break;
      case "checkbox":
        formatted[key] = prop.checkbox;
        break;
      case "url":
        formatted[key] = prop.url;
        break;
      case "email":
        formatted[key] = prop.email;
        break;
      case "phone_number":
        formatted[key] = prop.phone_number;
        break;
      case "people":
        formatted[key] = Array.isArray(prop.people)
          ? prop.people.map((p: any) => p.name || p.id)
          : [];
        break;
      case "files":
        formatted[key] = Array.isArray(prop.files)
          ? prop.files.map((f: any) => f.name || f.file?.url || f.external?.url)
          : [];
        break;
      case "relation":
        formatted[key] = Array.isArray(prop.relation)
          ? prop.relation.map((r: any) => r.id)
          : [];
        break;
      case "formula":
        formatted[key] =
          prop.formula?.string ||
          prop.formula?.number ||
          prop.formula?.boolean ||
          prop.formula?.date ||
          null;
        break;
      case "rollup":
        formatted[key] =
          prop.rollup?.string ||
          prop.rollup?.number ||
          prop.rollup?.date ||
          prop.rollup?.array ||
          null;
        break;
      case "status":
        formatted[key] = prop.status?.name || null;
        break;
      case "created_time":
        formatted[key] = prop.created_time;
        break;
      case "created_by":
        formatted[key] = prop.created_by?.name || prop.created_by?.id || null;
        break;
      case "last_edited_time":
        formatted[key] = prop.last_edited_time;
        break;
      case "last_edited_by":
        formatted[key] =
          prop.last_edited_by?.name || prop.last_edited_by?.id || null;
        break;
      default:
        formatted[key] = prop;
    }
  }

  return formatted;
}

/**
 * Create the MCP server
 */
const server = new Server(
  {
    name: "notion-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

/**
 * List available resources (recent pages)
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  try {
    const response = await notion.search({
      filter: {
        property: "object",
        value: "page",
      },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
      page_size: 20,
    });

    const resources = response.results.map((page: any) => ({
      uri: `notion://page/${page.id}`,
      mimeType: "application/json",
      name: getPageTitle(page),
      description: `Notion page: ${getPageTitle(page)} (last edited: ${
        page.last_edited_time
      })`,
    }));

    return { resources };
  } catch (error) {
    console.error("Error listing resources:", error);
    return { resources: [] };
  }
});

/**
 * List resource templates
 */
server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
  resourceTemplates: [
    {
      uriTemplate: "notion://page/{page_id}",
      name: "Notion Page",
      mimeType: "application/json",
      description: "Get a specific Notion page by ID",
    },
    {
      uriTemplate: "notion://database/{database_id}",
      name: "Notion Database",
      mimeType: "application/json",
      description: "Get pages from a specific Notion database",
    },
  ],
}));

/**
 * Read specific resources
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  try {
    if (uri.startsWith("notion://page/")) {
      const pageId = uri.replace("notion://page/", "");
      const page = await notion.pages.retrieve({ page_id: pageId });

      return {
        contents: [
          {
            uri: request.params.uri,
            mimeType: "application/json",
            text: formatPageContent(page),
          },
        ],
      };
    } else if (uri.startsWith("notion://database/")) {
      const databaseId = uri.replace("notion://database/", "");
      const response = await notion.databases.query({
        database_id: databaseId,
        page_size: 50,
      });

      const pages = response.results.map(formatPageContent);

      return {
        contents: [
          {
            uri: request.params.uri,
            mimeType: "application/json",
            text: JSON.stringify(pages, null, 2),
          },
        ],
      };
    } else {
      throw new McpError(ErrorCode.InvalidRequest, `Unsupported URI: ${uri}`);
    }
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to read resource: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
});

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "search_pages",
      description: "Search for pages in your Notion workspace",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query text",
          },
          filter: {
            type: "object",
            description: "Optional filter criteria",
            properties: {
              property: {
                type: "string",
                enum: ["object"],
                description: "Property to filter by",
              },
              value: {
                type: "string",
                enum: ["page", "database"],
                description: "Value to filter by",
              },
            },
          },
          page_size: {
            type: "number",
            description: "Number of results to return (max 100)",
            minimum: 1,
            maximum: 100,
          },
        },
        required: ["query"],
      },
    },
    {
      name: "get_page",
      description: "Get a specific page by ID",
      inputSchema: {
        type: "object",
        properties: {
          page_id: {
            type: "string",
            description: "The ID of the page to retrieve",
          },
        },
        required: ["page_id"],
      },
    },
    {
      name: "get_page_content",
      description: "Get the content blocks of a specific page",
      inputSchema: {
        type: "object",
        properties: {
          page_id: {
            type: "string",
            description: "The ID of the page to get content from",
          },
        },
        required: ["page_id"],
      },
    },
    {
      name: "query_database",
      description: "Query a Notion database",
      inputSchema: {
        type: "object",
        properties: {
          database_id: {
            type: "string",
            description: "The ID of the database to query",
          },
          filter: {
            type: "object",
            description: "Optional filter criteria for the query",
          },
          sorts: {
            type: "array",
            description: "Optional sort criteria for the query",
          },
          page_size: {
            type: "number",
            description: "Number of results to return (max 100)",
            minimum: 1,
            maximum: 100,
          },
        },
        required: ["database_id"],
      },
    },
    {
      name: "create_page",
      description: "Create a new page in a database",
      inputSchema: {
        type: "object",
        properties: {
          parent: {
            type: "object",
            description: "Parent database or page",
            properties: {
              database_id: {
                type: "string",
                description: "ID of the parent database",
              },
            },
          },
          properties: {
            type: "object",
            description: "Page properties (varies by database schema)",
          },
          children: {
            type: "array",
            description: "Optional content blocks for the page",
          },
        },
        required: ["parent", "properties"],
      },
    },
    {
      name: "update_page",
      description: "Update properties of an existing page",
      inputSchema: {
        type: "object",
        properties: {
          page_id: {
            type: "string",
            description: "The ID of the page to update",
          },
          properties: {
            type: "object",
            description: "Properties to update",
          },
        },
        required: ["page_id", "properties"],
      },
    },
    {
      name: "get_database",
      description: "Get information about a database",
      inputSchema: {
        type: "object",
        properties: {
          database_id: {
            type: "string",
            description: "The ID of the database to retrieve",
          },
        },
        required: ["database_id"],
      },
    },
  ],
}));

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const toolArgs = args as any;

  try {
    switch (name) {
      case "search_pages": {
        if (!validateArgs(toolArgs, ["query"])) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Missing required parameter: query"
          );
        }

        const searchParams: any = {
          query: toolArgs.query,
          page_size: toolArgs.page_size || 20,
        };

        if (toolArgs.filter) {
          searchParams.filter = toolArgs.filter;
        }

        const response = await notion.search(searchParams);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                response.results.map(formatPageContent),
                null,
                2
              ),
            },
          ],
        };
      }

      case "get_page": {
        if (!validateArgs(toolArgs, ["page_id"])) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Missing required parameter: page_id"
          );
        }

        const page = await notion.pages.retrieve({
          page_id: toolArgs.page_id as string,
        });

        return {
          content: [
            {
              type: "text",
              text: formatPageContent(page),
            },
          ],
        };
      }

      case "get_page_content": {
        if (!validateArgs(toolArgs, ["page_id"])) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Missing required parameter: page_id"
          );
        }

        const response = await notion.blocks.children.list({
          block_id: toolArgs.page_id as string,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.results, null, 2),
            },
          ],
        };
      }

      case "query_database": {
        if (!validateArgs(toolArgs, ["database_id"])) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Missing required parameter: database_id"
          );
        }

        const queryParams: any = {
          database_id: toolArgs.database_id,
          page_size: toolArgs.page_size || 50,
        };

        if (toolArgs.filter) {
          queryParams.filter = toolArgs.filter;
        }

        if (toolArgs.sorts) {
          queryParams.sorts = toolArgs.sorts;
        }

        const response = await notion.databases.query(queryParams);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                response.results.map(formatPageContent),
                null,
                2
              ),
            },
          ],
        };
      }

      case "create_page": {
        if (!validateArgs(toolArgs, ["parent", "properties"])) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Missing required parameters: parent, properties"
          );
        }

        const createParams: any = {
          parent: toolArgs.parent,
          properties: toolArgs.properties,
        };

        if (toolArgs.children) {
          createParams.children = toolArgs.children;
        }

        const page = await notion.pages.create(createParams);

        return {
          content: [
            {
              type: "text",
              text: `Created page: ${formatPageContent(page)}`,
            },
          ],
        };
      }

      case "update_page": {
        if (!validateArgs(toolArgs, ["page_id", "properties"])) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Missing required parameters: page_id, properties"
          );
        }

        const page = await notion.pages.update({
          page_id: toolArgs.page_id as string,
          properties: toolArgs.properties as any,
        });

        return {
          content: [
            {
              type: "text",
              text: `Updated page: ${formatPageContent(page)}`,
            },
          ],
        };
      }

      case "get_database": {
        if (!validateArgs(toolArgs, ["database_id"])) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Missing required parameter: database_id"
          );
        }

        const database = await notion.databases.retrieve({
          database_id: toolArgs.database_id as string,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(database, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }

    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : "Unknown error occurred"
          }`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Notion MCP server running on stdio");
}

// Error handling
server.onerror = (error) => console.error("[MCP Error]", error);
process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
