export const githubTools = [
  // Repository tools
  {
    name: 'get_repository',
    description: 'Get information about a specific GitHub repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner (username or organization)',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'list_repositories',
    description: 'List repositories for the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {
        per_page: {
          type: 'number',
          description: 'Number of results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
        sort: {
          type: 'string',
          enum: ['created', 'updated', 'pushed', 'full_name'],
          description: 'Sort field (default: updated)',
        },
        direction: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort direction (default: desc)',
        },
      },
    },
  },
  {
    name: 'search_repositories',
    description: 'Search for repositories on GitHub',
    inputSchema: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query',
        },
        sort: {
          type: 'string',
          enum: ['stars', 'forks', 'help-wanted-issues', 'updated'],
          description: 'Sort field',
        },
        order: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort order',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['q'],
    },
  },

  // Pull Request tools
  {
    name: 'list_pull_requests',
    description: 'List pull requests for a repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Pull request state (default: open)',
        },
        sort: {
          type: 'string',
          enum: ['created', 'updated', 'popularity'],
          description: 'Sort field (default: created)',
        },
        direction: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort direction (default: desc)',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'get_pull_request',
    description: 'Get details of a specific pull request',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },
  {
    name: 'create_pull_request',
    description: 'Create a new pull request',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        title: {
          type: 'string',
          description: 'Pull request title',
        },
        body: {
          type: 'string',
          description: 'Pull request description',
        },
        head: {
          type: 'string',
          description: 'Branch name containing changes',
        },
        base: {
          type: 'string',
          description: 'Branch name to merge into',
        },
        draft: {
          type: 'boolean',
          description: 'Create as draft (default: false)',
        },
      },
      required: ['owner', 'repo', 'title', 'head', 'base'],
    },
  },
  {
    name: 'update_pull_request',
    description: 'Update an existing pull request',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
        title: {
          type: 'string',
          description: 'New title',
        },
        body: {
          type: 'string',
          description: 'New description',
        },
        state: {
          type: 'string',
          enum: ['open', 'closed'],
          description: 'New state',
        },
        base: {
          type: 'string',
          description: 'New base branch',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },
  {
    name: 'merge_pull_request',
    description: 'Merge a pull request',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
        commit_title: {
          type: 'string',
          description: 'Merge commit title',
        },
        commit_message: {
          type: 'string',
          description: 'Merge commit message',
        },
        merge_method: {
          type: 'string',
          enum: ['merge', 'squash', 'rebase'],
          description: 'Merge method (default: merge)',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },
  {
    name: 'close_pull_request',
    description: 'Close a pull request without merging',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },
  {
    name: 'get_pull_request_files',
    description: 'Get list of files changed in a pull request',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },
  {
    name: 'get_pull_request_commits',
    description: 'Get commits in a pull request',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },

  // Issue tools
  {
    name: 'list_issues',
    description: 'List issues for a repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Issue state (default: open)',
        },
        sort: {
          type: 'string',
          enum: ['created', 'updated', 'comments'],
          description: 'Sort field (default: created)',
        },
        direction: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort direction (default: desc)',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'get_issue',
    description: 'Get details of a specific issue',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        issue_number: {
          type: 'number',
          description: 'Issue number',
        },
      },
      required: ['owner', 'repo', 'issue_number'],
    },
  },
  {
    name: 'create_issue',
    description: 'Create a new issue',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        title: {
          type: 'string',
          description: 'Issue title',
        },
        body: {
          type: 'string',
          description: 'Issue body/description',
        },
        assignees: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of usernames to assign',
        },
        labels: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of label names',
        },
        milestone: {
          type: 'number',
          description: 'Milestone number',
        },
      },
      required: ['owner', 'repo', 'title'],
    },
  },
  {
    name: 'update_issue',
    description: 'Update an existing issue',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        issue_number: {
          type: 'number',
          description: 'Issue number',
        },
        title: {
          type: 'string',
          description: 'New title',
        },
        body: {
          type: 'string',
          description: 'New body/description',
        },
        assignees: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of usernames to assign',
        },
        labels: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of label names',
        },
        milestone: {
          type: 'number',
          description: 'Milestone number',
        },
        state: {
          type: 'string',
          enum: ['open', 'closed'],
          description: 'New state',
        },
      },
      required: ['owner', 'repo', 'issue_number'],
    },
  },
  {
    name: 'close_issue',
    description: 'Close an issue',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        issue_number: {
          type: 'number',
          description: 'Issue number',
        },
      },
      required: ['owner', 'repo', 'issue_number'],
    },
  },
  {
    name: 'search_issues',
    description: 'Search for issues across GitHub',
    inputSchema: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query',
        },
        sort: {
          type: 'string',
          enum: [
            'comments',
            'reactions',
            'reactions-+1',
            'reactions--1',
            'reactions-smile',
            'reactions-thinking_face',
            'reactions-heart',
            'reactions-tada',
            'interactions',
            'created',
            'updated',
          ],
          description: 'Sort field',
        },
        order: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort order',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['q'],
    },
  },

  // Comment tools
  {
    name: 'list_issue_comments',
    description: 'List comments on an issue',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        issue_number: {
          type: 'number',
          description: 'Issue number',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo', 'issue_number'],
    },
  },
  {
    name: 'create_issue_comment',
    description: 'Create a comment on an issue',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        issue_number: {
          type: 'number',
          description: 'Issue number',
        },
        body: {
          type: 'string',
          description: 'Comment body',
        },
      },
      required: ['owner', 'repo', 'issue_number', 'body'],
    },
  },
  {
    name: 'update_comment',
    description: 'Update a comment',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        comment_id: {
          type: 'number',
          description: 'Comment ID',
        },
        body: {
          type: 'string',
          description: 'New comment body',
        },
      },
      required: ['owner', 'repo', 'comment_id', 'body'],
    },
  },
  {
    name: 'delete_comment',
    description: 'Delete a comment',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        comment_id: {
          type: 'number',
          description: 'Comment ID',
        },
      },
      required: ['owner', 'repo', 'comment_id'],
    },
  },

  // Review tools
  {
    name: 'list_pull_request_reviews',
    description: 'List reviews for a pull request',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },
  {
    name: 'create_pull_request_review',
    description: 'Create a review for a pull request',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
        body: {
          type: 'string',
          description: 'Review body',
        },
        event: {
          type: 'string',
          enum: ['APPROVE', 'REQUEST_CHANGES', 'COMMENT'],
          description: 'Review event type',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },

  // Branch tools
  {
    name: 'list_branches',
    description: 'List branches for a repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'get_branch',
    description: 'Get details of a specific branch',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        branch: {
          type: 'string',
          description: 'Branch name',
        },
      },
      required: ['owner', 'repo', 'branch'],
    },
  },

  // Release tools
  {
    name: 'list_releases',
    description: 'List releases for a repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'get_latest_release',
    description: 'Get the latest release for a repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },

  // User tools
  {
    name: 'get_authenticated_user',
    description: 'Get information about the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_user',
    description: 'Get information about a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'GitHub username',
        },
      },
      required: ['username'],
    },
  },
];
