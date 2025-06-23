# PostgreSQL MCP Server

This server provides tools and services for interacting with PostgreSQL databases through the Model Context Protocol (MCP).

## Installation & Usage

### Option 1: npm Package (Recommended)

```bash
# Install globally
npm install -g @imazhar101/mcp-postgresql-server

# Or run directly with npx
npx @imazhar101/mcp-postgresql-server
```

### Option 2: Build from Source

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the server:

   ```bash
   npm run build
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Configuration

Set the following environment variable:

```bash
export POSTGRESQL_CONNECTION_STRING="postgresql://username:password@localhost:5432/database"
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
    "postgresql-db": {
      "command": "npx",
      "args": ["@imazhar101/mcp-postgresql-server"],
      "env": {
        "POSTGRESQL_CONNECTION_STRING": "postgresql://username:password@localhost:5432/database"
      },
      "disabled": false,
      "alwaysAllow": ["list_tables", "describe_table", "execute_query"]
    }
  }
}
```

## Features

- Execute SQL queries
- Manage database connections
- Retrieve table schemas
- Perform CRUD operations
- Transaction support
