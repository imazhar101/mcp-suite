# MCP Setup Guide

This guide shows how to set up the MCP servers from this suite with different AI coding assistants. Each platform has its own configuration format and requirements.

## 🚀 Quick Start

All servers in this suite are built with standardized MCP protocol support. You can use any server with any MCP-compatible client by running:

```bash
# Build the server
npm run build

# The executable will be available at:
./dist/servers/{server-name}/src/index.js
```

## 📋 Server Information

### Available Servers

| Server | Package | Binary Command | Environment Variables |
|--------|---------|----------------|----------------------|
| PostgreSQL | `@mcp-suite/postgresql-server` | `mcp-postgresql` | `POSTGRESQL_CONNECTION_STRING` |
| Jira | `@mcp-suite/jira-server` | `mcp-jira` | `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` |
| Canvas | `@mcp-suite/canvas-server` | `mcp-canvas` | `CANVAS_BASE_URL`, `CANVAS_API_TOKEN` |

### Environment Variables Setup

Create a `.env` file or set environment variables:

```bash
# PostgreSQL Server
POSTGRESQL_CONNECTION_STRING=postgresql://user:password@localhost:5432/database

# Jira Server  
JIRA_BASE_URL=https://your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token

# Canvas Server
CANVAS_BASE_URL=https://your-school.instructure.com
CANVAS_API_TOKEN=your-canvas-token
```

## 🔧 Platform-Specific Setup

### Continue.dev

Continue.dev supports MCP servers through both YAML and JSON configuration formats.

#### YAML Configuration (`.continue/config.yaml`)

```yaml
mcpServers:
  - name: PostgreSQL Database
    command: node
    args:
      - "/path/to/mcp-suite/dist/servers/postgresql/src/index.js"
    env:
      POSTGRESQL_CONNECTION_STRING: "postgresql://user:password@localhost:5432/database"
  
  - name: Jira Integration
    command: node
    args:
      - "/path/to/mcp-suite/dist/servers/jira/src/index.js"
    env:
      JIRA_BASE_URL: "https://your-company.atlassian.net"
      JIRA_EMAIL: "your-email@company.com"
      JIRA_API_TOKEN: "your-api-token"
  
  - name: Canvas LMS
    command: node
    args:
      - "/path/to/mcp-suite/dist/servers/canvas/src/index.js"
    env:
      CANVAS_BASE_URL: "https://your-school.instructure.com" 
      CANVAS_API_TOKEN: "your-canvas-token"
```

#### JSON Configuration (`.continue/config.json`)

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "name": "PostgreSQL Database",
        "transport": {
          "type": "stdio",
          "command": "node",
          "args": ["/path/to/mcp-suite/dist/servers/postgresql/src/index.js"]
        },
        "env": {
          "POSTGRESQL_CONNECTION_STRING": "postgresql://user:password@localhost:5432/database"
        }
      },
      {
        "name": "Jira Integration", 
        "transport": {
          "type": "stdio",
          "command": "node",
          "args": ["/path/to/mcp-suite/dist/servers/jira/src/index.js"]
        },
        "env": {
          "JIRA_BASE_URL": "https://your-company.atlassian.net",
          "JIRA_EMAIL": "your-email@company.com",
          "JIRA_API_TOKEN": "your-api-token"
        }
      },
      {
        "name": "Canvas LMS",
        "transport": {
          "type": "stdio", 
          "command": "node",
          "args": ["/path/to/mcp-suite/dist/servers/canvas/src/index.js"]
        },
        "env": {
          "CANVAS_BASE_URL": "https://your-school.instructure.com",
          "CANVAS_API_TOKEN": "your-canvas-token"
        }
      }
    ]
  }
}
```

### Claude Code

Claude Code offers multiple configuration methods with different scopes.

#### CLI Configuration (Recommended)

```bash
# Add PostgreSQL server
claude mcp add postgresql-db \
  -e POSTGRESQL_CONNECTION_STRING="postgresql://user:password@localhost:5432/database" \
  -- node /path/to/mcp-suite/dist/servers/postgresql/src/index.js

# Add Jira server
claude mcp add jira-integration \
  -e JIRA_BASE_URL="https://your-company.atlassian.net" \
  -e JIRA_EMAIL="your-email@company.com" \
  -e JIRA_API_TOKEN="your-api-token" \
  -- node /path/to/mcp-suite/dist/servers/jira/src/index.js

# Add Canvas server
claude mcp add canvas-lms \
  -e CANVAS_BASE_URL="https://your-school.instructure.com" \
  -e CANVAS_API_TOKEN="your-canvas-token" \
  -- node /path/to/mcp-suite/dist/servers/canvas/src/index.js
```

#### Project-Scoped Configuration (`.mcp.json`)

For team-shared configuration:

```json
{
  "mcpServers": {
    "postgresql-db": {
      "command": "node",
      "args": ["/path/to/mcp-suite/dist/servers/postgresql/src/index.js"],
      "env": {
        "POSTGRESQL_CONNECTION_STRING": "postgresql://user:password@localhost:5432/database"
      }
    },
    "jira-integration": {
      "command": "node", 
      "args": ["/path/to/mcp-suite/dist/servers/jira/src/index.js"],
      "env": {
        "JIRA_BASE_URL": "https://your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    },
    "canvas-lms": {
      "command": "node",
      "args": ["/path/to/mcp-suite/dist/servers/canvas/src/index.js"], 
      "env": {
        "CANVAS_BASE_URL": "https://your-school.instructure.com",
        "CANVAS_API_TOKEN": "your-canvas-token"
      }
    }
  }
}
```

#### Management Commands

```bash
# List all configured servers
claude mcp list

# Get details for specific server
claude mcp get postgresql-db

# Remove a server
claude mcp remove postgresql-db

# Reset project approvals
claude mcp reset-project-choices
```

### Cline (VS Code Extension)

Cline uses JSON configuration files stored in VS Code's global storage.

#### Configuration File Location

- **macOS**: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **Windows**: `%APPDATA%/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **Linux**: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

#### Configuration Format

```json
{
  "mcpServers": {
    "postgresql-db": {
      "command": "node",
      "args": ["/path/to/mcp-suite/dist/servers/postgresql/src/index.js"],
      "env": {
        "POSTGRESQL_CONNECTION_STRING": "postgresql://user:password@localhost:5432/database"
      },
      "disabled": false,
      "alwaysAllow": ["execute_query", "list_tables"]
    },
    "jira-integration": {
      "command": "node",
      "args": ["/path/to/mcp-suite/dist/servers/jira/src/index.js"],
      "env": {
        "JIRA_BASE_URL": "https://your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com", 
        "JIRA_API_TOKEN": "your-api-token"
      },
      "disabled": false,
      "alwaysAllow": ["search_issues", "get_issue", "create_issue"]
    },
    "canvas-lms": {
      "command": "node",
      "args": ["/path/to/mcp-suite/dist/servers/canvas/src/index.js"],
      "env": {
        "CANVAS_BASE_URL": "https://your-school.instructure.com",
        "CANVAS_API_TOKEN": "your-canvas-token"
      },
      "disabled": false,
      "alwaysAllow": ["list_courses", "get_course", "list_assignments"]
    }
  }
}
```

#### Configuration Parameters

- **command**: Executable command to run the server
- **args**: Array of command-line arguments
- **env**: Environment variables for the server
- **disabled**: Boolean to enable/disable the server
- **alwaysAllow**: Array of tools that don't require approval
- **autoApprove**: Alternative to alwaysAllow

#### Management Through UI

Access server settings through the Cline extension:
1. Click the "MCP Servers" icon in the top navigation
2. Configure individual servers through their panels
3. Set network timeouts using the dropdown in each server's config box

## 🐛 Troubleshooting

### Common Issues

1. **Server not starting**: Check that the built files exist in `dist/servers/{server-name}/src/index.js`
2. **Environment variables not loaded**: Ensure variables are set in your shell or configuration file
3. **Permission issues**: Make sure the server files have execute permissions

### Debug Mode

Enable debug mode for troubleshooting:

```bash
# Claude Code
claude --mcp-debug

# Continue.dev - check logs in the extension
# Cline - check VS Code developer console
```

### Verification

Test your server setup:

```bash
# Test server directly
node /path/to/mcp-suite/dist/servers/postgresql/src/index.js

# Check environment variables
echo $POSTGRESQL_CONNECTION_STRING
```

## 📚 Additional Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Continue.dev MCP Guide](https://docs.continue.dev/customize/deep-dives/mcp)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Cline MCP Documentation](https://docs.cline.bot/mcp/configuring-mcp-servers)

## 🔐 Security Notes

- Store API tokens and connection strings securely
- Use environment variables instead of hardcoding credentials
- Review tool permissions before allowing automatic approval
- Consider using project-scoped configurations for team environments