# Jira MCP Server

A comprehensive Jira integration for the Model Context Protocol (MCP) that enables issue management, project tracking, and workflow automation.

## Overview

The Jira MCP Server provides seamless integration with Atlassian Jira, allowing you to perform all essential issue management operations through the MCP protocol. This server is part of the MCP Suite monorepo and leverages shared utilities for consistent development patterns.

## Features

- **Issue Management**: Create, read, update, and delete Jira issues
- **Project Operations**: List and retrieve project information
- **Workflow Management**: Transition issues through workflow states
- **Search & Query**: Advanced issue searching using JQL (Jira Query Language)
- **Comments**: Add and manage issue comments
- **Assignment**: Assign issues to team members

## Setup

### Prerequisites

- Node.js 18+
- Access to a Jira instance (Cloud or Server)
- Jira API token for authentication

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@domain.com
JIRA_API_TOKEN=your-api-token
```

### Getting Your Jira API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Enter a label for your token
4. Copy the generated token to your `.env` file

## Installation & Usage

### Option 1: npm Package (Recommended)

```bash
# Install globally
npm install -g @imazhar101/mcp-jira-server

# Or run directly with npx
npx @imazhar101/mcp-jira-server
```

### Option 2: Build from Source

#### As Part of MCP Suite

From the project root:

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Start the Jira server
npm run build:server jira
```

#### Standalone Usage

```bash
# Navigate to the jira server directory
cd servers/jira

# Install dependencies
npm install

# Build the server
npm run build

# Start the server
npm start
```

## Cline MCP Configuration

To use this server with Cline (VS Code extension), add the following to your Cline MCP settings:

**File Location:**

- **macOS**: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **Windows**: `%APPDATA%/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **Linux**: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

**Configuration:**

```json
{
  "mcpServers": {
    "jira-integration": {
      "command": "npx",
      "args": ["@imazhar101/mcp-jira-server"],
      "env": {
        "JIRA_BASE_URL": "https://your-domain.atlassian.net",
        "JIRA_EMAIL": "your-email@domain.com",
        "JIRA_API_TOKEN": "your-api-token"
      },
      "disabled": false,
      "alwaysAllow": ["search_issues", "get_issue", "list_projects"]
    }
  }
}
```

## Available Tools

### Issue Operations

#### `search_issues`

Search for issues using JQL (Jira Query Language).

**Parameters:**

- `jql` (string): The JQL query string
- `maxResults` (number, optional): Maximum number of results (default: 50)
- `startAt` (number, optional): Starting index for pagination (default: 0)

**Example:**

```javascript
{
  "jql": "project = PROJ AND status = 'To Do'",
  "maxResults": 25
}
```

#### `get_issue`

Retrieve detailed information about a specific issue.

**Parameters:**

- `issueIdOrKey` (string): The issue ID or key (e.g., "PROJ-123")

#### `create_issue`

Create a new Jira issue.

**Parameters:**

- `project` (string): Project key
- `summary` (string): Issue summary/title
- `description` (string, optional): Issue description
- `issueType` (string): Issue type (e.g., "Task", "Bug", "Story")
- `priority` (string, optional): Priority level
- `assignee` (string, optional): Assignee account ID
- `labels` (array, optional): Array of label strings

#### `update_issue`

Update an existing issue.

**Parameters:**

- `issueIdOrKey` (string): The issue ID or key
- `summary` (string, optional): New summary
- `description` (string, optional): New description
- `priority` (string, optional): New priority
- `assignee` (string, optional): New assignee account ID
- `labels` (array, optional): New labels array

#### `transition_issue`

Change the status of an issue through workflow transitions.

**Parameters:**

- `issueIdOrKey` (string): The issue ID or key
- `transitionId` (string): The transition ID to execute

#### `get_issue_transitions`

Get available transitions for an issue.

**Parameters:**

- `issueIdOrKey` (string): The issue ID or key

#### `assign_issue`

Assign an issue to a user.

**Parameters:**

- `issueIdOrKey` (string): The issue ID or key
- `assignee` (string): Account ID of the assignee

#### `delete_issue`

Delete an issue.

**Parameters:**

- `issueIdOrKey` (string): The issue ID or key

### Comment Operations

#### `add_comment`

Add a comment to an issue.

**Parameters:**

- `issueIdOrKey` (string): The issue ID or key
- `body` (string): Comment text

### Project Operations

#### `list_projects`

List all accessible projects.

**Parameters:** None

#### `get_project`

Get detailed information about a specific project.

**Parameters:**

- `projectIdOrKey` (string): The project ID or key

## Error Handling

The server includes comprehensive error handling:

- **Authentication Errors**: Invalid credentials or expired tokens
- **Permission Errors**: Insufficient permissions for operations
- **Validation Errors**: Invalid parameters or data formats
- **API Errors**: Jira API-specific errors with detailed messages

All errors are logged with contextual information and returned with appropriate error codes.

## Development

### Project Structure

```
servers/jira/
├── src/
│   ├── handlers/
│   │   └── jira-service.ts    # Jira API service implementation
│   ├── tools/
│   │   └── index.ts           # MCP tool definitions
│   ├── types/                 # TypeScript type definitions
│   ├── types.ts              # Main type definitions
│   └── index.ts              # Server entry point
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
# Build TypeScript
npm run build

# Watch mode for development
npm run dev
```

### Testing

Tests are located in the main `tests/` directory:

```bash
# Run integration tests
cd ../.. && npm test

# Run specific Jira tests
npx vitest run tests/integration/jira-server.test.ts
```

## Contributing

1. Follow the established patterns in the MCP Suite
2. Use the shared utilities from `../../shared/`
3. Add comprehensive error handling
4. Update tests for new functionality
5. Follow TypeScript best practices

## Support

- Check the main [MCP Suite README](../../README.md) for general information
- Review the [shared utilities documentation](../../shared/) for development guidance
- Create issues in the main repository for bugs or feature requests

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
