# Notion MCP Server

A Model Context Protocol (MCP) server for interacting with Notion databases and pages.

## Features

- Search and query Notion databases
- Retrieve page content and properties
- Manage database entries
- Access workspace information

## Installation & Usage

### Option 1: npm Package (Recommended)

```bash
# Install globally
npm install -g @imazhar101/mcp-notion-server

# Or run directly with npx
npx @imazhar101/mcp-notion-server
```

### Option 2: Build from Source

```bash
# From project root
npm install
npm run build

# The server will be available at:
./dist/servers/notion/src/index.js
```

## Configuration

Set the following environment variable:

```bash
export NOTION_API_TOKEN="your-notion-integration-token"
```

### Getting Your Notion API Token

1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name and select your workspace
4. Copy the Internal Integration Token
5. Share your databases/pages with the integration

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
    "notion-integration": {
      "command": "npx",
      "args": ["@imazhar101/mcp-notion-server"],
      "env": {
        "NOTION_API_TOKEN": "your-notion-integration-token"
      },
      "disabled": false,
      "alwaysAllow": ["search_pages", "get_database", "query_database"]
    }
  }
}
```

## Available Tools

- `search_pages` - Search for pages and databases
- `get_database` - Retrieve database schema and properties
- `query_database` - Query database entries with filters
- `get_page` - Get page content and properties
- `create_page` - Create new pages in databases
- `update_page` - Update existing page properties

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
