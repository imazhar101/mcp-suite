#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ElasticsearchService } from "./services/elasticsearch-service.js";
import { tools } from "./tools/index.js";
import { ElasticsearchConfig } from "./types/index.js";

class ElasticsearchServer {
  private server: Server;
  private elasticsearchService: ElasticsearchService | undefined;

  constructor() {
    this.server = new Server(
      {
        name: "elasticsearch-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!this.elasticsearchService) {
        throw new Error(
          "Elasticsearch service not initialized. Please check your Elasticsearch configuration."
        );
      }

      try {
        return await this.handleToolCall(name, args || {});
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(`Error executing ${name}: ${errorMessage}`);
      }
    });
  }

  private async handleToolCall(name: string, args: any) {
    if (!this.elasticsearchService) {
      throw new Error("Elasticsearch service not initialized");
    }

    const service = this.elasticsearchService;

    switch (name) {
      // Connection and Health Tools
      case "elasticsearch_test_connection":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await service.testConnection(), null, 2),
            },
          ],
        };

      case "elasticsearch_cluster_health":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await service.getClusterHealth(), null, 2),
            },
          ],
        };

      case "elasticsearch_node_stats":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await service.getNodeStats(), null, 2),
            },
          ],
        };

      // Index Management Tools
      case "elasticsearch_list_indices":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await service.listIndices(), null, 2),
            },
          ],
        };

      case "elasticsearch_get_index_info":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getIndexInfo(args.index),
                null,
                2
              ),
            },
          ],
        };

      case "elasticsearch_create_index":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.createIndex({
                  index: args.index,
                  mappings: args.mappings,
                  settings: args.settings,
                }),
                null,
                2
              ),
            },
          ],
        };

      case "elasticsearch_delete_index":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.deleteIndex(args.index),
                null,
                2
              ),
            },
          ],
        };

      case "elasticsearch_index_exists":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { exists: await service.indexExists(args.index) },
                null,
                2
              ),
            },
          ],
        };

      // Search Tools
      case "elasticsearch_search":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.search({
                  index: args.index,
                  query: args.query,
                  size: args.size,
                  from: args.from,
                  sort: args.sort,
                  _source: args._source,
                  highlight: args.highlight,
                  aggs: args.aggs,
                  track_total_hits: args.track_total_hits,
                }),
                null,
                2
              ),
            },
          ],
        };

      case "elasticsearch_count":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.count(args.index, args.query),
                null,
                2
              ),
            },
          ],
        };

      case "elasticsearch_aggregation":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.performAggregation({
                  index: args.index,
                  aggs: args.aggs,
                  query: args.query,
                  size: args.size,
                }),
                null,
                2
              ),
            },
          ],
        };

      // Document Management Tools
      case "elasticsearch_get_document":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getDocument(args.index, args.id),
                null,
                2
              ),
            },
          ],
        };

      case "elasticsearch_index_document":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.indexDocument({
                  index: args.index,
                  id: args.id,
                  document: args.document,
                  refresh: args.refresh,
                }),
                null,
                2
              ),
            },
          ],
        };

      case "elasticsearch_update_document":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.updateDocument(
                  args.index,
                  args.id,
                  args.document,
                  args.refresh
                ),
                null,
                2
              ),
            },
          ],
        };

      case "elasticsearch_delete_document":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.deleteDocument(args.index, args.id, args.refresh),
                null,
                2
              ),
            },
          ],
        };

      // Bulk Operations
      case "elasticsearch_bulk_operation":
        // Limit bulk operations to prevent overwhelming the system
        if (args.operations && args.operations.length > 100) {
          throw new Error("Bulk operations are limited to 100 operations per request");
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.bulkOperation({
                  index: args.index,
                  operations: args.operations,
                  refresh: args.refresh,
                }),
                null,
                2
              ),
            },
          ],
        };

      case "elasticsearch_delete_by_query":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.deleteByQuery(args.index, args.query, args.refresh),
                null,
                2
              ),
            },
          ],
        };

      // Advanced Operations
      case "elasticsearch_reindex":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.reindex(
                  args.source_index,
                  args.dest_index,
                  args.query
                ),
                null,
                2
              ),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  async run(): Promise<void> {
    // Get Elasticsearch configuration from environment variables
    const elasticsearchNode = process.env.ELASTICSEARCH_NODE || "http://localhost:9200";
    
    const config: ElasticsearchConfig = {
      node: elasticsearchNode,
    };

    // Add authentication if provided
    if (process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD) {
      config.auth = {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      };
    } else if (process.env.ELASTICSEARCH_API_KEY) {
      config.auth = {
        apiKey: process.env.ELASTICSEARCH_API_KEY,
      };
    }

    // Optional configuration
    if (process.env.ELASTICSEARCH_MAX_RETRIES) {
      config.maxRetries = parseInt(process.env.ELASTICSEARCH_MAX_RETRIES);
    }

    if (process.env.ELASTICSEARCH_REQUEST_TIMEOUT) {
      config.requestTimeout = parseInt(process.env.ELASTICSEARCH_REQUEST_TIMEOUT);
    }

    this.elasticsearchService = new ElasticsearchService(config);

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Elasticsearch MCP server running on stdio");
  }
}

const server = new ElasticsearchServer();
server.run().catch(console.error);