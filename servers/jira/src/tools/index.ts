import { McpTool } from '../../../../shared/types/mcp.js';

export const jiraTools: McpTool[] = [
  {
    name: 'search_issues',
    description: 'Search for Jira issues using JQL (Jira Query Language)',
    inputSchema: {
      type: 'object',
      properties: {
        jql: {
          type: 'string',
          description: 'JQL query string (e.g., "project = PROJ AND status = Open")'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results to return (default: 50)',
          minimum: 1,
          maximum: 100
        }
      },
      required: ['jql']
    }
  },
  {
    name: 'get_issue',
    description: 'Get detailed information about a specific Jira issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key (e.g., "PROJ-123")'
        }
      },
      required: ['issueKey']
    }
  },
  {
    name: 'create_issue',
    description: 'Create a new Jira issue',
    inputSchema: {
      type: 'object',
      properties: {
        projectKey: {
          type: 'string',
          description: 'Project key where the issue will be created'
        },
        summary: {
          type: 'string',
          description: 'Issue summary/title'
        },
        description: {
          type: 'string',
          description: 'Issue description'
        },
        issueType: {
          type: 'string',
          description: 'Issue type (e.g., "Bug", "Task", "Story")',
          default: 'Task'
        },
        priority: {
          type: 'string',
          description: 'Issue priority (e.g., "High", "Medium", "Low")',
          default: 'Medium'
        },
        assignee: {
          type: 'string',
          description: 'Assignee email address (optional)'
        }
      },
      required: ['projectKey', 'summary']
    }
  },
  {
    name: 'update_issue',
    description: 'Update an existing Jira issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key to update'
        },
        summary: {
          type: 'string',
          description: 'New summary/title'
        },
        description: {
          type: 'string',
          description: 'New description'
        },
        assignee: {
          type: 'string',
          description: 'New assignee email address'
        }
      },
      required: ['issueKey']
    }
  },
  {
    name: 'transition_issue',
    description: 'Transition an issue to a different status',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key to transition'
        },
        transitionName: {
          type: 'string',
          description: 'Name of the transition (e.g., "Done", "In Progress", "To Do")'
        }
      },
      required: ['issueKey', 'transitionName']
    }
  },
  {
    name: 'add_comment',
    description: 'Add a comment to a Jira issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key to comment on'
        },
        comment: {
          type: 'string',
          description: 'Comment text'
        },
        format: {
          type: 'string',
          enum: ['plain', 'rich'],
          description: 'Format to use (default: plain)',
          default: 'plain'
        }
      },
      required: ['issueKey', 'comment']
    }
  },
  {
    name: 'list_projects',
    description: 'List all accessible Jira projects',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_project',
    description: 'Get detailed information about a specific project',
    inputSchema: {
      type: 'object',
      properties: {
        projectKey: {
          type: 'string',
          description: 'Project key (e.g., "PROJ")'
        }
      },
      required: ['projectKey']
    }
  },
  {
    name: 'get_issue_transitions',
    description: 'Get available transitions for an issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key to get transitions for'
        }
      },
      required: ['issueKey']
    }
  },
  {
    name: 'assign_issue',
    description: 'Assign an issue to a user',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key to assign'
        },
        assignee: {
          type: 'string',
          description: 'Email address of the assignee'
        }
      },
      required: ['issueKey', 'assignee']
    }
  },
  {
    name: 'delete_issue',
    description: 'Delete a Jira issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key to delete'
        }
      },
      required: ['issueKey']
    }
  }
];