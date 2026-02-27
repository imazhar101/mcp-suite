#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { Logger } from '../../../shared/utils/logger.js';
import { getEnvVar, getLogLevel } from '../../../shared/utils/config.js';
import { AirtableService } from './services/airtable-service.js';
import { airtableTools } from './tools/index.js';
import { AirtableConfig } from './types/index.js';

class AirtableServer {
  private server: Server;
  private airtableService: AirtableService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(getLogLevel(), { server: 'airtable' });

    const config: AirtableConfig = {
      apiKey: getEnvVar('AIRTABLE_API_KEY'),
    };

    this.airtableService = new AirtableService(config, this.logger);

    this.server = new Server(
      {
        name: 'airtable-server',
        version: '1.0.0',
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

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: airtableTools,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const result = await this.handleToolCall(
          request.params.name,
          request.params.arguments
        );
        return this.formatResponse(result);
      } catch (error) {
        this.logger.error('Tool call failed', error);
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error}`
        );
      }
    });
  }

  private async handleToolCall(toolName: string, args: any): Promise<any> {
    switch (toolName) {
      case 'list_bases':
        return await this.airtableService.listBases();
      case 'list_tables':
        return await this.airtableService.listTables(args.baseId);
      case 'get_table_schema':
        return await this.airtableService.getTableSchema(
          args.baseId,
          args.tableIdOrName
        );
      case 'list_records':
        return await this.airtableService.listRecords(args);
      case 'get_record':
        return await this.airtableService.getRecord(
          args.baseId,
          args.tableIdOrName,
          args.recordId
        );
      case 'create_record':
        return await this.airtableService.createRecord(args);
      case 'update_record':
        return await this.airtableService.updateRecord(args);
      case 'delete_record':
        return await this.airtableService.deleteRecord(
          args.baseId,
          args.tableIdOrName,
          args.recordId
        );
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${toolName}`
        );
    }
  }

  private formatResponse(result: any) {
    if (result.success) {
      const text = result.data
        ? JSON.stringify(result.data, null, 2)
        : result.message || 'Operation completed successfully';
      return {
        content: [
          {
            type: 'text' as const,
            text: text,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: 'text' as const,
            text: result.error || result.message || 'Operation failed',
          },
        ],
        isError: true,
      };
    }
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      this.logger.error('MCP Server error', error);
    };

    process.on('SIGINT', async () => {
      this.logger.info('Shutting down Airtable MCP server');
      await this.server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      this.logger.info('Shutting down Airtable MCP server');
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('Airtable MCP server running on stdio');
  }
}

const server = new AirtableServer();
server.run().catch((error) => {
  console.error('Failed to start Airtable MCP server:', error);
  process.exit(1);
});
