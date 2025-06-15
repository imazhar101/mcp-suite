#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

// Figma API types
interface FigmaFile {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  document: any;
  components: Record<string, any>;
  componentSets: Record<string, any>;
  schemaVersion: number;
  styles: Record<string, any>;
}

interface FigmaTeam {
  id: string;
  name: string;
}

interface FigmaProject {
  id: string;
  name: string;
}

interface FigmaFileNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaFileNode[];
}

interface FigmaComment {
  id: string;
  message: string;
  user: {
    id: string;
    handle: string;
  };
  created_at: string;
  resolved_at?: string;
  file_key: string;
  parent_id?: string;
  order_id: string;
}

class FigmaServer {
  private server: Server;
  private accessToken: string;

  constructor() {
    this.server = new Server(
      {
        name: "figma-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.accessToken = process.env.FIGMA_ACCESS_TOKEN || "";
    if (!this.accessToken) {
      console.error("FIGMA_ACCESS_TOKEN environment variable is required");
      process.exit(1);
    }

    this.setupToolHandlers();
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    const url = `https://api.figma.com/v1${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "X-Figma-Token": this.accessToken,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new McpError(
        ErrorCode.InternalError,
        `Figma API error: ${response.status} ${error}`
      );
    }

    return response.json();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_file",
          description: "Get a Figma file by key",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The key of the Figma file",
              },
              version: {
                type: "string",
                description: "Optional version ID to get a specific version",
              },
              ids: {
                type: "string",
                description:
                  "Optional comma-separated list of node IDs to retrieve",
              },
              depth: {
                type: "number",
                description: "Optional depth to traverse (default: 1)",
              },
              geometry: {
                type: "string",
                description: "Set to 'paths' to export vector data",
              },
              plugin_data: {
                type: "string",
                description: "Optional plugin ID to include plugin data",
              },
              branch_data: {
                type: "boolean",
                description: "Returns branch metadata for the requested file",
              },
            },
            required: ["file_key"],
          },
        },
        {
          name: "get_file_nodes",
          description: "Get specific nodes from a Figma file",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The key of the Figma file",
              },
              ids: {
                type: "string",
                description: "Comma-separated list of node IDs to retrieve",
              },
              version: {
                type: "string",
                description: "Optional version ID",
              },
              depth: {
                type: "number",
                description: "Optional depth to traverse",
              },
              geometry: {
                type: "string",
                description: "Set to 'paths' to export vector data",
              },
              plugin_data: {
                type: "string",
                description: "Optional plugin ID to include plugin data",
              },
            },
            required: ["file_key", "ids"],
          },
        },
        {
          name: "get_images",
          description: "Get image URLs for nodes in a Figma file",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The key of the Figma file",
              },
              ids: {
                type: "string",
                description: "Comma-separated list of node IDs",
              },
              scale: {
                type: "number",
                description: "Image scale factor (0.01 to 4)",
              },
              format: {
                type: "string",
                description: "Image format: jpg, png, svg, pdf",
                enum: ["jpg", "png", "svg", "pdf"],
              },
              svg_include_id: {
                type: "boolean",
                description: "Include id attributes for SVG format",
              },
              svg_simplify_stroke: {
                type: "boolean",
                description: "Simplify inside/outside strokes for SVG",
              },
              use_absolute_bounds: {
                type: "boolean",
                description: "Use absolute bounding box for images",
              },
              version: {
                type: "string",
                description: "Optional version ID",
              },
            },
            required: ["file_key", "ids"],
          },
        },
        {
          name: "get_image_fills",
          description: "Get image fill URLs from a Figma file",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The key of the Figma file",
              },
            },
            required: ["file_key"],
          },
        },
        {
          name: "get_comments",
          description: "Get comments from a Figma file",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The key of the Figma file",
              },
            },
            required: ["file_key"],
          },
        },
        {
          name: "post_comment",
          description: "Post a comment to a Figma file",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The key of the Figma file",
              },
              message: {
                type: "string",
                description: "The comment message",
              },
              client_meta: {
                type: "object",
                description: "Position and viewport information",
                properties: {
                  x: { type: "number" },
                  y: { type: "number" },
                  node_id: { type: "string" },
                  node_offset: {
                    type: "object",
                    properties: {
                      x: { type: "number" },
                      y: { type: "number" },
                    },
                  },
                },
              },
            },
            required: ["file_key", "message"],
          },
        },
        {
          name: "delete_comment",
          description: "Delete a comment from a Figma file",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The key of the Figma file",
              },
              comment_id: {
                type: "string",
                description: "The ID of the comment to delete",
              },
            },
            required: ["file_key", "comment_id"],
          },
        },
        {
          name: "get_me",
          description: "Get current user information",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_team_projects",
          description: "Get projects for a team",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "The ID of the team",
              },
            },
            required: ["team_id"],
          },
        },
        {
          name: "get_project_files",
          description: "Get files in a project",
          inputSchema: {
            type: "object",
            properties: {
              project_id: {
                type: "string",
                description: "The ID of the project",
              },
              branch_data: {
                type: "boolean",
                description: "Returns branch metadata for the files",
              },
            },
            required: ["project_id"],
          },
        },
        {
          name: "get_component",
          description: "Get a component by key",
          inputSchema: {
            type: "object",
            properties: {
              key: {
                type: "string",
                description: "The key of the component",
              },
            },
            required: ["key"],
          },
        },
        {
          name: "get_component_sets",
          description: "Get component sets by key",
          inputSchema: {
            type: "object",
            properties: {
              key: {
                type: "string",
                description: "The key of the component set",
              },
            },
            required: ["key"],
          },
        },
        {
          name: "get_team_components",
          description: "Get published components for a team",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "The ID of the team",
              },
              page_size: {
                type: "number",
                description: "Number of components to return (max 1000)",
              },
              after: {
                type: "string",
                description: "Cursor for pagination",
              },
              before: {
                type: "string",
                description: "Cursor for pagination",
              },
            },
            required: ["team_id"],
          },
        },
        {
          name: "get_file_components",
          description: "Get components from a specific file",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The key of the Figma file",
              },
            },
            required: ["file_key"],
          },
        },
        {
          name: "get_team_styles",
          description: "Get published styles for a team",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "The ID of the team",
              },
              page_size: {
                type: "number",
                description: "Number of styles to return (max 1000)",
              },
              after: {
                type: "string",
                description: "Cursor for pagination",
              },
              before: {
                type: "string",
                description: "Cursor for pagination",
              },
            },
            required: ["team_id"],
          },
        },
        {
          name: "get_file_styles",
          description: "Get styles from a specific file",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The key of the Figma file",
              },
            },
            required: ["file_key"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        throw new McpError(ErrorCode.InvalidParams, "Missing arguments");
      }

      try {
        switch (name) {
          case "get_file": {
            const params = new URLSearchParams();
            if (args.version) params.append("version", String(args.version));
            if (args.ids) params.append("ids", String(args.ids));
            if (args.depth) params.append("depth", String(args.depth));
            if (args.geometry) params.append("geometry", String(args.geometry));
            if (args.plugin_data)
              params.append("plugin_data", String(args.plugin_data));
            if (args.branch_data)
              params.append("branch_data", String(args.branch_data));

            const queryString = params.toString();
            const endpoint = `/files/${String(args.file_key)}${
              queryString ? `?${queryString}` : ""
            }`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_file_nodes": {
            const params = new URLSearchParams();
            params.append("ids", String(args.ids));
            if (args.version) params.append("version", String(args.version));
            if (args.depth) params.append("depth", String(args.depth));
            if (args.geometry) params.append("geometry", String(args.geometry));
            if (args.plugin_data)
              params.append("plugin_data", String(args.plugin_data));

            const endpoint = `/files/${String(
              args.file_key
            )}/nodes?${params.toString()}`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_images": {
            const params = new URLSearchParams();
            params.append("ids", String(args.ids));
            if (args.scale) params.append("scale", String(args.scale));
            if (args.format) params.append("format", String(args.format));
            if (args.svg_include_id)
              params.append("svg_include_id", String(args.svg_include_id));
            if (args.svg_simplify_stroke)
              params.append(
                "svg_simplify_stroke",
                String(args.svg_simplify_stroke)
              );
            if (args.use_absolute_bounds)
              params.append(
                "use_absolute_bounds",
                String(args.use_absolute_bounds)
              );
            if (args.version) params.append("version", String(args.version));

            const endpoint = `/images/${String(
              args.file_key
            )}?${params.toString()}`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_image_fills": {
            const endpoint = `/files/${args.file_key}/images`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_comments": {
            const endpoint = `/files/${args.file_key}/comments`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "post_comment": {
            const endpoint = `/files/${args.file_key}/comments`;
            const body: any = {
              message: args.message,
            };
            if (args.client_meta) {
              body.client_meta = args.client_meta;
            }

            const result = await this.makeRequest(endpoint, {
              method: "POST",
              body: JSON.stringify(body),
            });

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "delete_comment": {
            const endpoint = `/files/${args.file_key}/comments/${args.comment_id}`;
            await this.makeRequest(endpoint, {
              method: "DELETE",
            });

            return {
              content: [
                {
                  type: "text",
                  text: "Comment deleted successfully",
                },
              ],
            };
          }

          case "get_me": {
            const endpoint = "/me";
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_team_projects": {
            const endpoint = `/teams/${args.team_id}/projects`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_project_files": {
            const params = new URLSearchParams();
            if (args.branch_data)
              params.append("branch_data", args.branch_data.toString());

            const queryString = params.toString();
            const endpoint = `/projects/${args.project_id}/files${
              queryString ? `?${queryString}` : ""
            }`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_component": {
            const endpoint = `/components/${args.key}`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_component_sets": {
            const endpoint = `/component_sets/${args.key}`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_team_components": {
            const params = new URLSearchParams();
            if (args.page_size)
              params.append("page_size", String(args.page_size));
            if (args.after) params.append("after", String(args.after));
            if (args.before) params.append("before", String(args.before));

            const queryString = params.toString();
            const endpoint = `/teams/${args.team_id}/components${
              queryString ? `?${queryString}` : ""
            }`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_file_components": {
            const endpoint = `/files/${args.file_key}/components`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_team_styles": {
            const params = new URLSearchParams();
            if (args.page_size)
              params.append("page_size", String(args.page_size));
            if (args.after) params.append("after", String(args.after));
            if (args.before) params.append("before", String(args.before));

            const queryString = params.toString();
            const endpoint = `/teams/${args.team_id}/styles${
              queryString ? `?${queryString}` : ""
            }`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_file_styles": {
            const endpoint = `/files/${args.file_key}/styles`;
            const result = await this.makeRequest(endpoint);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${error}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Figma MCP server running on stdio");
  }
}

const server = new FigmaServer();
server.run().catch(console.error);
