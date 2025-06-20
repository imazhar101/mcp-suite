import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "get_repositories",
    description: "Get repositories in the workspace",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          minimum: 1,
        },
        pagelen: {
          type: "number",
          description: "Number of results per page (default: 10, max: 100)",
          minimum: 1,
          maximum: 100,
        },
        q: {
          type: "string",
          description: "Search query to filter repositories",
        },
      },
    },
  },
  {
    name: "get_repository",
    description: "Get detailed information about a specific repository",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
      },
      required: ["repo_slug"],
    },
  },
  {
    name: "get_pull_requests",
    description: "Get pull requests for a repository",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        state: {
          type: "string",
          description: "PR state filter",
          enum: ["OPEN", "MERGED", "DECLINED", "SUPERSEDED"],
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          minimum: 1,
        },
        pagelen: {
          type: "number",
          description: "Number of results per page (default: 10, max: 50)",
          minimum: 1,
          maximum: 50,
        },
      },
      required: ["repo_slug"],
    },
  },
  {
    name: "get_pull_request",
    description: "Get detailed information about a specific pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "create_pull_request",
    description: "Create a new pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        title: {
          type: "string",
          description: "Pull request title",
        },
        description: {
          type: "string",
          description: "Pull request description",
        },
        source_branch: {
          type: "string",
          description: "Source branch name",
        },
        destination_branch: {
          type: "string",
          description: "Destination branch name (default: main)",
        },
        source_repository: {
          type: "string",
          description: "Source repository full name (for cross-repo PRs)",
        },
        destination_repository: {
          type: "string",
          description: "Destination repository full name (for cross-repo PRs)",
        },
        reviewers: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of reviewer UUIDs",
        },
        close_source_branch: {
          type: "boolean",
          description: "Close source branch after merge",
        },
        draft: {
          type: "boolean",
          description: "Create as draft pull request",
        },
      },
      required: ["repo_slug", "title", "source_branch"],
    },
  },
  {
    name: "update_pull_request",
    description: "Update an existing pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        title: {
          type: "string",
          description: "Pull request title",
        },
        description: {
          type: "string",
          description: "Pull request description",
        },
        reviewers: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of reviewer UUIDs",
        },
        close_source_branch: {
          type: "boolean",
          description: "Close source branch after merge",
        },
        draft: {
          type: "boolean",
          description: "Mark as draft pull request",
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "merge_pull_request",
    description: "Merge a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        type: {
          type: "string",
          description: "Merge type",
          enum: ["merge", "squash"],
          default: "merge",
        },
        message: {
          type: "string",
          description: "Merge commit message",
        },
        close_source_branch: {
          type: "boolean",
          description: "Close source branch after merge",
        },
        merge_strategy: {
          type: "string",
          description: "Merge strategy",
          enum: ["merge_commit", "squash", "fast_forward"],
        },
      },
      required: ["repo_slug", "pull_request_id", "type"],
    },
  },
  {
    name: "decline_pull_request",
    description: "Decline a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "get_pull_request_activity",
    description: "Get activity (comments, approvals, etc.) for a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          minimum: 1,
        },
        pagelen: {
          type: "number",
          description: "Number of results per page (default: 20, max: 100)",
          minimum: 1,
          maximum: 100,
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "get_pull_request_comments",
    description: "Get comments for a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          minimum: 1,
        },
        pagelen: {
          type: "number",
          description: "Number of results per page (default: 20, max: 100)",
          minimum: 1,
          maximum: 100,
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "create_pull_request_comment",
    description: "Add a comment to a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        content: {
          type: "string",
          description: "Comment content",
        },
      },
      required: ["repo_slug", "pull_request_id", "content"],
    },
  },
  {
    name: "update_pull_request_comment",
    description: "Update a pull request comment",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        comment_id: {
          type: "number",
          description: "Comment ID",
        },
        content: {
          type: "string",
          description: "Updated comment content",
        },
      },
      required: ["repo_slug", "pull_request_id", "comment_id", "content"],
    },
  },
  {
    name: "delete_pull_request_comment",
    description: "Delete a pull request comment",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        comment_id: {
          type: "number",
          description: "Comment ID",
        },
      },
      required: ["repo_slug", "pull_request_id", "comment_id"],
    },
  },
  {
    name: "get_pull_request_diff",
    description: "Get the diff for a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "get_pull_request_commits",
    description: "Get commits for a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          minimum: 1,
        },
        pagelen: {
          type: "number",
          description: "Number of results per page (default: 20, max: 100)",
          minimum: 1,
          maximum: 100,
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "approve_pull_request",
    description: "Approve a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "unapprove_pull_request",
    description: "Remove approval from a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "request_changes",
    description: "Request changes on a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "remove_change_request",
    description: "Remove change request from a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "get_pull_request_tasks",
    description: "Get tasks for a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          minimum: 1,
        },
        pagelen: {
          type: "number",
          description: "Number of results per page (default: 20, max: 100)",
          minimum: 1,
          maximum: 100,
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
  {
    name: "create_pull_request_task",
    description: "Create a task on a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        content: {
          type: "string",
          description: "Task content",
        },
        comment_id: {
          type: "number",
          description: "Comment ID to attach task to",
        },
      },
      required: ["repo_slug", "pull_request_id", "content"],
    },
  },
  {
    name: "update_pull_request_task",
    description: "Update a pull request task",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        task_id: {
          type: "number",
          description: "Task ID",
        },
        content: {
          type: "string",
          description: "Updated task content",
        },
        state: {
          type: "string",
          description: "Task state",
          enum: ["UNRESOLVED", "RESOLVED"],
        },
      },
      required: ["repo_slug", "pull_request_id", "task_id"],
    },
  },
  {
    name: "delete_pull_request_task",
    description: "Delete a pull request task",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        task_id: {
          type: "number",
          description: "Task ID",
        },
      },
      required: ["repo_slug", "pull_request_id", "task_id"],
    },
  },
  {
    name: "get_default_reviewers",
    description: "Get default reviewers for a repository",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
      },
      required: ["repo_slug"],
    },
  },
  {
    name: "get_effective_default_reviewers",
    description:
      "Get effective default reviewers for a repository (including inherited)",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
      },
      required: ["repo_slug"],
    },
  },
  {
    name: "add_default_reviewer",
    description: "Add a default reviewer to a repository",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        username: {
          type: "string",
          description: "Username to add as default reviewer",
        },
      },
      required: ["repo_slug", "username"],
    },
  },
  {
    name: "remove_default_reviewer",
    description: "Remove a default reviewer from a repository",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        username: {
          type: "string",
          description: "Username to remove as default reviewer",
        },
      },
      required: ["repo_slug", "username"],
    },
  },
  {
    name: "get_commits",
    description: "Get commits for a repository",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        branch: {
          type: "string",
          description: "Branch name (default: main/master)",
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          minimum: 1,
        },
        pagelen: {
          type: "number",
          description: "Number of results per page (default: 10, max: 100)",
          minimum: 1,
          maximum: 100,
        },
      },
      required: ["repo_slug"],
    },
  },
  {
    name: "get_commit",
    description: "Get detailed information about a specific commit",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        commit_hash: {
          type: "string",
          description: "Commit hash",
        },
      },
      required: ["repo_slug", "commit_hash"],
    },
  },
  {
    name: "get_branches",
    description: "Get branches for a repository",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          minimum: 1,
        },
        pagelen: {
          type: "number",
          description: "Number of results per page (default: 10, max: 100)",
          minimum: 1,
          maximum: 100,
        },
      },
      required: ["repo_slug"],
    },
  },
  {
    name: "get_pull_requests_for_commit",
    description: "Get pull requests containing a specific commit",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        commit_hash: {
          type: "string",
          description: "Commit hash",
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          minimum: 1,
        },
        pagelen: {
          type: "number",
          description: "Number of results per page (default: 10, max: 100)",
          minimum: 1,
          maximum: 100,
        },
      },
      required: ["repo_slug", "commit_hash"],
    },
  },
  {
    name: "get_pull_request_statuses",
    description: "Get build statuses for a pull request",
    inputSchema: {
      type: "object",
      properties: {
        repo_slug: {
          type: "string",
          description: "Repository slug/name",
        },
        pull_request_id: {
          type: "number",
          description: "Pull request ID",
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          minimum: 1,
        },
        pagelen: {
          type: "number",
          description: "Number of results per page (default: 20, max: 100)",
          minimum: 1,
          maximum: 100,
        },
      },
      required: ["repo_slug", "pull_request_id"],
    },
  },
];
