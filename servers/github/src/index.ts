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
import { GitHubService } from './services/github-service.js';
import { githubTools } from './tools/index.js';
import { GitHubConfig } from './types/index.js';

class GitHubServer {
  private server: Server;
  private githubService: GitHubService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(getLogLevel(), { server: 'github' });

    const config: GitHubConfig = {
      token: getEnvVar('GITHUB_TOKEN'),
      baseUrl: process.env.GITHUB_API_URL, // Optional for GitHub Enterprise
    };

    this.githubService = new GitHubService(config);

    this.server = new Server(
      {
        name: 'github-server',
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
      tools: githubTools,
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
      // Repository tools
      case 'get_repository':
        return await this.githubService.getRepository(args.owner, args.repo);
      case 'list_repositories':
        return await this.githubService.listRepositories(args);
      case 'search_repositories':
        return await this.githubService.searchRepositories(args);

      // Pull Request tools
      case 'list_pull_requests':
        return await this.githubService.listPullRequests(
          args.owner,
          args.repo,
          args
        );
      case 'get_pull_request':
        return await this.githubService.getPullRequest(
          args.owner,
          args.repo,
          args.pull_number
        );
      case 'create_pull_request':
        return await this.githubService.createPullRequest(
          args.owner,
          args.repo,
          {
            title: args.title,
            body: args.body,
            head: args.head,
            base: args.base,
            draft: args.draft,
          }
        );
      case 'update_pull_request':
        return await this.githubService.updatePullRequest(
          args.owner,
          args.repo,
          args.pull_number,
          {
            title: args.title,
            body: args.body,
            state: args.state,
            base: args.base,
          }
        );
      case 'merge_pull_request':
        return await this.githubService.mergePullRequest(
          args.owner,
          args.repo,
          args.pull_number,
          args.commit_title,
          args.commit_message,
          args.merge_method
        );
      case 'close_pull_request':
        return await this.githubService.closePullRequest(
          args.owner,
          args.repo,
          args.pull_number
        );
      case 'get_pull_request_files':
        return await this.githubService.getPullRequestFiles(
          args.owner,
          args.repo,
          args.pull_number
        );
      case 'get_pull_request_commits':
        return await this.githubService.getPullRequestCommits(
          args.owner,
          args.repo,
          args.pull_number
        );

      // Issue tools
      case 'list_issues':
        return await this.githubService.listIssues(args.owner, args.repo, args);
      case 'get_issue':
        return await this.githubService.getIssue(
          args.owner,
          args.repo,
          args.issue_number
        );
      case 'create_issue':
        return await this.githubService.createIssue(args.owner, args.repo, {
          title: args.title,
          body: args.body,
          assignees: args.assignees,
          labels: args.labels,
          milestone: args.milestone,
        });
      case 'update_issue':
        return await this.githubService.updateIssue(
          args.owner,
          args.repo,
          args.issue_number,
          {
            title: args.title,
            body: args.body,
            assignees: args.assignees,
            labels: args.labels,
            milestone: args.milestone,
            state: args.state,
          }
        );
      case 'close_issue':
        return await this.githubService.closeIssue(
          args.owner,
          args.repo,
          args.issue_number
        );
      case 'search_issues':
        return await this.githubService.searchIssues(args);

      // Comment tools
      case 'list_issue_comments':
        return await this.githubService.listIssueComments(
          args.owner,
          args.repo,
          args.issue_number,
          args
        );
      case 'create_issue_comment':
        return await this.githubService.createIssueComment(
          args.owner,
          args.repo,
          args.issue_number,
          args.body
        );
      case 'update_comment':
        return await this.githubService.updateComment(
          args.owner,
          args.repo,
          args.comment_id,
          args.body
        );
      case 'delete_comment':
        await this.githubService.deleteComment(
          args.owner,
          args.repo,
          args.comment_id
        );
        return { success: true, message: 'Comment deleted successfully' };

      // Review tools
      case 'list_pull_request_reviews':
        return await this.githubService.listPullRequestReviews(
          args.owner,
          args.repo,
          args.pull_number
        );
      case 'create_pull_request_review':
        return await this.githubService.createPullRequestReview(
          args.owner,
          args.repo,
          args.pull_number,
          args.body,
          args.event
        );

      // Branch tools
      case 'list_branches':
        return await this.githubService.listBranches(
          args.owner,
          args.repo,
          args
        );
      case 'get_branch':
        return await this.githubService.getBranch(
          args.owner,
          args.repo,
          args.branch
        );

      // Release tools
      case 'list_releases':
        return await this.githubService.listReleases(
          args.owner,
          args.repo,
          args
        );
      case 'get_latest_release':
        return await this.githubService.getLatestRelease(args.owner, args.repo);

      // User tools
      case 'get_authenticated_user':
        return await this.githubService.getAuthenticatedUser();
      case 'get_user':
        return await this.githubService.getUser(args.username);

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${toolName}`
        );
    }
  }

  private formatResponse(result: any) {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      this.logger.error('MCP Server error', error);
    };

    process.on('SIGINT', async () => {
      this.logger.info('Shutting down GitHub MCP server');
      await this.server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      this.logger.info('Shutting down GitHub MCP server');
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('GitHub MCP server running on stdio');
  }
}

const server = new GitHubServer();
server.run().catch((error) => {
  console.error('Failed to start GitHub MCP server:', error);
  process.exit(1);
});
