#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { BitbucketService } from "./services/bitbucket-service.js";
import { tools } from "./tools/index.js";
import {
  CreatePullRequestData,
  UpdatePullRequestData,
  MergePullRequestData,
} from "./types/index.js";

class BitbucketServer {
  private server: Server;
  private bitbucketService: BitbucketService | undefined;

  constructor() {
    this.server = new Server(
      {
        name: "bitbucket-server",
        version: "0.1.0",
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

      if (!this.bitbucketService) {
        throw new Error(
          "Bitbucket service not initialized. Please check your environment variables."
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
    if (!this.bitbucketService) {
      throw new Error("Bitbucket service not initialized");
    }

    const service = this.bitbucketService;

    switch (name) {
      // Repository tools
      case "get_repositories":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getRepositories({
                  page: args.page,
                  pagelen: args.pagelen,
                  q: args.q,
                }),
                null,
                2
              ),
            },
          ],
        };

      case "get_repository":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getRepository(args.repo_slug),
                null,
                2
              ),
            },
          ],
        };

      // Pull Request tools
      case "get_pull_requests":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getPullRequests(args.repo_slug, {
                  state: args.state,
                  page: args.page,
                  pagelen: args.pagelen,
                }),
                null,
                2
              ),
            },
          ],
        };

      case "get_pull_request":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getPullRequest(
                  args.repo_slug,
                  args.pull_request_id
                ),
                null,
                2
              ),
            },
          ],
        };

      case "create_pull_request":
        const createData: CreatePullRequestData = {
          title: args.title,
          description: args.description,
          source: {
            branch: { name: args.source_branch },
            repository: args.source_repository
              ? { full_name: args.source_repository }
              : undefined,
          },
          destination: {
            branch: { name: args.destination_branch || "main" },
            repository: args.destination_repository
              ? { full_name: args.destination_repository }
              : undefined,
          },
          reviewers: args.reviewers?.map((uuid: string) => ({ uuid })),
          close_source_branch: args.close_source_branch,
          draft: args.draft,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.createPullRequest(args.repo_slug, createData),
                null,
                2
              ),
            },
          ],
        };

      case "update_pull_request":
        const updateData: UpdatePullRequestData = {
          title: args.title,
          description: args.description,
          reviewers: args.reviewers?.map((uuid: string) => ({ uuid })),
          close_source_branch: args.close_source_branch,
          draft: args.draft,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.updatePullRequest(
                  args.repo_slug,
                  args.pull_request_id,
                  updateData
                ),
                null,
                2
              ),
            },
          ],
        };

      case "merge_pull_request":
        const mergeData: MergePullRequestData = {
          type: args.type,
          message: args.message,
          close_source_branch: args.close_source_branch,
          merge_strategy: args.merge_strategy,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.mergePullRequest(
                  args.repo_slug,
                  args.pull_request_id,
                  mergeData
                ),
                null,
                2
              ),
            },
          ],
        };

      case "decline_pull_request":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.declinePullRequest(
                  args.repo_slug,
                  args.pull_request_id
                ),
                null,
                2
              ),
            },
          ],
        };

      case "get_pull_request_activity":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getPullRequestActivity(
                  args.repo_slug,
                  args.pull_request_id,
                  {
                    page: args.page,
                    pagelen: args.pagelen,
                  }
                ),
                null,
                2
              ),
            },
          ],
        };

      case "get_pull_request_comments":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getPullRequestComments(
                  args.repo_slug,
                  args.pull_request_id,
                  {
                    page: args.page,
                    pagelen: args.pagelen,
                  }
                ),
                null,
                2
              ),
            },
          ],
        };

      case "create_pull_request_comment":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.createPullRequestComment(
                  args.repo_slug,
                  args.pull_request_id,
                  args.content
                ),
                null,
                2
              ),
            },
          ],
        };

      case "update_pull_request_comment":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.updatePullRequestComment(
                  args.repo_slug,
                  args.pull_request_id,
                  args.comment_id,
                  args.content
                ),
                null,
                2
              ),
            },
          ],
        };

      case "delete_pull_request_comment":
        await service.deletePullRequestComment(
          args.repo_slug,
          args.pull_request_id,
          args.comment_id
        );
        return {
          content: [
            {
              type: "text",
              text: "Comment deleted successfully",
            },
          ],
        };

      case "get_pull_request_diff":
        return {
          content: [
            {
              type: "text",
              text: await service.getPullRequestDiff(
                args.repo_slug,
                args.pull_request_id
              ),
            },
          ],
        };

      case "get_pull_request_commits":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getPullRequestCommits(
                  args.repo_slug,
                  args.pull_request_id,
                  {
                    page: args.page,
                    pagelen: args.pagelen,
                  }
                ),
                null,
                2
              ),
            },
          ],
        };

      // Pull Request Approval tools
      case "approve_pull_request":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.approvePullRequest(
                  args.repo_slug,
                  args.pull_request_id
                ),
                null,
                2
              ),
            },
          ],
        };

      case "unapprove_pull_request":
        await service.unapprovePullRequest(
          args.repo_slug,
          args.pull_request_id
        );
        return {
          content: [
            {
              type: "text",
              text: "Pull request approval removed successfully",
            },
          ],
        };

      case "request_changes":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.requestChanges(
                  args.repo_slug,
                  args.pull_request_id
                ),
                null,
                2
              ),
            },
          ],
        };

      case "remove_change_request":
        await service.removeChangeRequest(args.repo_slug, args.pull_request_id);
        return {
          content: [
            {
              type: "text",
              text: "Change request removed successfully",
            },
          ],
        };

      // Pull Request Task tools
      case "get_pull_request_tasks":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getPullRequestTasks(
                  args.repo_slug,
                  args.pull_request_id,
                  {
                    page: args.page,
                    pagelen: args.pagelen,
                  }
                ),
                null,
                2
              ),
            },
          ],
        };

      case "create_pull_request_task":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.createPullRequestTask(
                  args.repo_slug,
                  args.pull_request_id,
                  args.content,
                  args.comment_id
                ),
                null,
                2
              ),
            },
          ],
        };

      case "update_pull_request_task":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.updatePullRequestTask(
                  args.repo_slug,
                  args.pull_request_id,
                  args.task_id,
                  {
                    content: args.content,
                    state: args.state,
                  }
                ),
                null,
                2
              ),
            },
          ],
        };

      case "delete_pull_request_task":
        await service.deletePullRequestTask(
          args.repo_slug,
          args.pull_request_id,
          args.task_id
        );
        return {
          content: [
            {
              type: "text",
              text: "Task deleted successfully",
            },
          ],
        };

      // Default Reviewer tools
      case "get_default_reviewers":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getDefaultReviewers(args.repo_slug),
                null,
                2
              ),
            },
          ],
        };

      case "get_effective_default_reviewers":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getEffectiveDefaultReviewers(args.repo_slug),
                null,
                2
              ),
            },
          ],
        };

      case "add_default_reviewer":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.addDefaultReviewer(args.repo_slug, args.username),
                null,
                2
              ),
            },
          ],
        };

      case "remove_default_reviewer":
        await service.removeDefaultReviewer(args.repo_slug, args.username);
        return {
          content: [
            {
              type: "text",
              text: "Default reviewer removed successfully",
            },
          ],
        };

      // Commit tools
      case "get_commits":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getCommits(args.repo_slug, {
                  branch: args.branch,
                  page: args.page,
                  pagelen: args.pagelen,
                }),
                null,
                2
              ),
            },
          ],
        };

      case "get_commit":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getCommit(args.repo_slug, args.commit_hash),
                null,
                2
              ),
            },
          ],
        };

      // Branch tools
      case "get_branches":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getBranches(args.repo_slug, {
                  page: args.page,
                  pagelen: args.pagelen,
                }),
                null,
                2
              ),
            },
          ],
        };

      // Additional tools
      case "get_pull_requests_for_commit":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getPullRequestsForCommit(
                  args.repo_slug,
                  args.commit_hash,
                  {
                    page: args.page,
                    pagelen: args.pagelen,
                  }
                ),
                null,
                2
              ),
            },
          ],
        };

      case "get_pull_request_statuses":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await service.getPullRequestStatuses(
                  args.repo_slug,
                  args.pull_request_id,
                  {
                    page: args.page,
                    pagelen: args.pagelen,
                  }
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
    const workspace = process.env.BITBUCKET_WORKSPACE;
    const username = process.env.BITBUCKET_USERNAME;
    const appPassword = process.env.BITBUCKET_APP_PASSWORD;

    if (!workspace || !username || !appPassword) {
      console.error(
        "Missing required environment variables: BITBUCKET_WORKSPACE, BITBUCKET_USERNAME, BITBUCKET_APP_PASSWORD"
      );
      process.exit(1);
    }

    this.bitbucketService = new BitbucketService(
      workspace,
      username,
      appPassword
    );

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Bitbucket MCP server running on stdio");
  }
}

const server = new BitbucketServer();
server.run().catch(console.error);
