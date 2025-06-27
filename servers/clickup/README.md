# ClickUp Server

A comprehensive MCP server for ClickUp integration, providing task management, project organization, time tracking, and team collaboration features.

## Installation & Usage

### Option 1: npm Package (Recommended)

```bash
# Install globally
npm install -g @imazhar101/mcp-clickup-server

# Or run directly with npx
npx @imazhar101/mcp-clickup-server
```

### Option 2: Build from Source

```bash
# From project root
npm install
npm run build

# The server will be available at:
./dist/servers/clickup/src/index.js
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
    "clickup-integration": {
      "command": "npx",
      "args": ["@imazhar101/mcp-clickup-server"],
      "env": {
        "CLICKUP_API_TOKEN": "your-api-token"
      },
      "disabled": false,
      "alwaysAllow": ["list_teams", "list_spaces", "list_tasks"]
    }
  }
}
```

## Features

- **Task Management**: Create, read, update, and delete tasks with full metadata support
- **Project Organization**: Manage spaces, folders, and lists with hierarchical organization
- **Comments**: Add and retrieve task comments with notification options
- **Team Collaboration**: Access team members and user information
- **Time Tracking**: Create and retrieve time entries for productivity tracking
- **Goals**: Create and manage team goals with progress tracking

## Installation

```bash
npm install @imazhar101/clickup-server
```

## Configuration

Set your ClickUp API token as an environment variable:

```bash
export CLICKUP_API_TOKEN="your_clickup_api_token_here"
```

To get your ClickUp API token:

1. Go to your ClickUp settings
2. Navigate to "Apps" section
3. Generate a new API token
4. Copy the token and set it as the environment variable

## Usage

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "clickup": {
      "command": "npx",
      "args": ["@imazhar101/clickup-server"],
      "env": {
        "CLICKUP_API_TOKEN": "your_clickup_api_token_here"
      }
    }
  }
}
```

### With Other MCP Clients

Run the server:

```bash
npx @imazhar101/clickup-server
```

## Available Tools

### Task Operations (5 tools)

- `get_tasks` - Get tasks from a list, folder, or space with filtering options
- `get_task` - Get detailed information about a specific task
- `create_task` - Create a new task with full metadata support
- `update_task` - Update existing task properties and assignments
- `delete_task` - Delete a task permanently

### Comment Operations (2 tools)

- `get_task_comments` - Retrieve all comments for a specific task
- `create_task_comment` - Add a comment to a task with notification options

### List Operations (6 tools)

- `get_lists` - Get lists within a folder
- `get_folderless_lists` - Get lists directly in a space (no folder)
- `create_list` - Create a new list in a folder
- `create_folderless_list` - Create a new list directly in a space
- `update_list` - Update list properties
- `delete_list` - Delete a list permanently

### Folder Operations (4 tools)

- `get_folders` - Get folders within a space
- `create_folder` - Create a new folder in a space
- `update_folder` - Update folder properties
- `delete_folder` - Delete a folder permanently

### Space Operations (5 tools)

- `get_spaces` - Get spaces within a team
- `get_space` - Get detailed information about a specific space
- `create_space` - Create a new space in a team
- `update_space` - Update space properties and settings
- `delete_space` - Delete a space permanently

### Team & User Operations (3 tools)

- `get_teams` - Get all authorized teams for the user
- `get_team_members` - Get members of a specific team
- `get_user` - Get detailed user information

### Time Tracking Operations (2 tools)

- `get_time_entries` - Get time entries for a team with filtering
- `create_time_entry` - Create a new time entry for productivity tracking

### Goal Operations (2 tools)

- `get_goals` - Get goals for a team with completion filtering
- `create_goal` - Create a new team goal with owners and deadlines

## Tool Examples

### Creating a Task

```json
{
  "name": "create_task",
  "arguments": {
    "list_id": "123456789",
    "name": "Implement new feature",
    "description": "Add user authentication to the application",
    "priority": 2,
    "assignees": ["987654321"],
    "tags": ["feature", "authentication"],
    "due_date": "1640995200000"
  }
}
```

### Getting Tasks with Filters

```json
{
  "name": "get_tasks",
  "arguments": {
    "list_id": "123456789",
    "statuses": ["in progress", "review"],
    "assignees": ["987654321"],
    "order_by": "due_date",
    "include_closed": false
  }
}
```

### Creating a Time Entry

```json
{
  "name": "create_time_entry",
  "arguments": {
    "team_id": "456789123",
    "description": "Working on authentication feature",
    "start": "1640995200000",
    "duration": 7200000,
    "tid": "task_id_here"
  }
}
```

## Priority Levels

When creating or updating tasks, use these priority values:

- `1` - Urgent (red)
- `2` - High (yellow)
- `3` - Normal (blue)
- `4` - Low (gray)

## Date Formats

All dates should be provided as Unix timestamps in milliseconds. For example:

- `"1640995200000"` represents January 1, 2022, 00:00:00 UTC

## Error Handling

The server provides detailed error messages for:

- Invalid API tokens
- Missing required parameters
- ClickUp API rate limits
- Network connectivity issues
- Invalid resource IDs

All errors are returned in a structured format with descriptive messages to help troubleshoot issues.

## Development

### Building

```bash
npm run build
```

### Testing

Ensure you have a valid ClickUp API token set:

```bash
export CLICKUP_API_TOKEN="your_token"
npm test
```

## API Reference

This server implements the full ClickUp REST API v2 functionality. For detailed parameter descriptions and response formats, refer to the [ClickUp API Documentation](https://clickup.com/api/).

## License

MIT License - see LICENSE file for details.
