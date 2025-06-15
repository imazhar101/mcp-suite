#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

import { Logger } from '../../../shared/utils/logger.js';
import { getEnvVar, getLogLevel } from '../../../shared/utils/config.js';
import { JiraService } from './handlers/jira-service.js';
import { jiraTools } from './tools/index.js';
import { JiraConfig } from './types.js';

class JiraServer {
  private server: Server;
  private jiraService: JiraService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(getLogLevel(), { server: 'jira' });

    const config: JiraConfig = {
      baseUrl: getEnvVar('JIRA_BASE_URL'),
      email: getEnvVar('JIRA_EMAIL'),
      apiToken: getEnvVar('JIRA_API_TOKEN')
    };

    this.jiraService = new JiraService(config, this.logger);

    this.server = new Server(
      {
        name: 'jira-server',
        version: '2.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: jiraTools
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const result = await this.handleToolCall(request.params.name, request.params.arguments);
        return this.formatResponse(result);
      } catch (error) {
        this.logger.error('Tool call failed', error);
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
      }
    });
  }

  private async handleToolCall(toolName: string, args: any): Promise<any> {
    switch (toolName) {
      case 'search_issues':
        return await this.jiraService.searchIssues(args);
      case 'get_issue':
        return await this.jiraService.getIssue(args.issueKey);
      case 'create_issue':
        return await this.jiraService.createIssue(args);
      case 'update_issue':
        return await this.jiraService.updateIssue(args);
      case 'transition_issue':
        return await this.jiraService.transitionIssue(args.issueKey, args.transitionName);
      case 'add_comment':
        return await this.jiraService.addComment(args.issueKey, args.comment, args.format);
      case 'list_projects':
        return await this.jiraService.listProjects();
      case 'get_project':
        return await this.jiraService.getProject(args.projectKey);
      case 'get_issue_transitions':
        return await this.jiraService.getIssueTransitions(args.issueKey);
      case 'assign_issue':
        return await this.jiraService.assignIssue(args.issueKey, args.assignee);
      case 'delete_issue':
        return await this.jiraService.deleteIssue(args.issueKey);
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
    }
  }

  private formatResponse(result: any) {
    if (result.success) {
      const text = result.data ? JSON.stringify(result.data, null, 2) : result.message || 'Operation completed successfully';
      return {
        content: [
          {
            type: 'text' as const,
            text: text
          }
        ]
      };
    } else {
      return {
        content: [
          {
            type: 'text' as const,
            text: result.error || result.message || 'Operation failed'
          }
        ],
        isError: true
      };
    }
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      this.logger.error('MCP Server error', error);
    };

    process.on('SIGINT', async () => {
      this.logger.info('Shutting down Jira MCP server');
      await this.server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      this.logger.info('Shutting down Jira MCP server');
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('Jira MCP server running on stdio');
  }
}

const server = new JiraServer();
server.run().catch((error) => {
  console.error('Failed to start Jira MCP server:', error);
  process.exit(1);
});