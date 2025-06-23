# MCP Setup Guide

This guide shows how to set up the MCP servers from this suite with different AI coding assistants. Each platform has its own configuration format and requirements.

## 🚀 Quick Start

All servers in this suite are available as npm packages and can be used in two ways:

### Option 1: Install from npm (Recommended)

```bash
# Install globally to use anywhere
npm install -g @imazhar101/mcp-jira-server
npm install -g @imazhar101/mcp-postgresql-server

# Or run directly with npx (no installation needed)
npx @imazhar101/mcp-jira-server
npx @imazhar101/mcp-postgresql-server
```

### Option 2: Build from source

```bash
# Build the server
npm run build

# The executable will be available at:
./dist/servers/{server-name}/src/index.js
```

## 📋 Server Information

### Available Servers

| Server | npm Package | Binary Command | Environment Variables |
|--------|-------------|----------------|----------------------|
| AWS | `@imazhar101/mcp-aws-server` | `mcp-aws` | `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |
| Bitbucket | `@imazhar101/mcp-bitbucket-server` | `mcp-bitbucket` | `BITBUCKET_USERNAME`, `BITBUCKET_APP_PASSWORD` |
| Canvas | `@imazhar101/mcp-canvas-server` | `mcp-canvas` | `CANVAS_BASE_URL`, `CANVAS_API_TOKEN` |
| ClickUp | `@imazhar101/mcp-clickup-server` | `mcp-clickup` | `CLICKUP_API_TOKEN` |
| Elasticsearch | `@imazhar101/mcp-elasticsearch-server` | `mcp-elasticsearch` | `ELASTICSEARCH_URL`, `ELASTICSEARCH_USERNAME`, `ELASTICSEARCH_PASSWORD` |
| Figma | `@imazhar101/mcp-figma-server` | `mcp-figma` | `FIGMA_ACCESS_TOKEN` |
| Jira | `@imazhar101/mcp-jira-server` | `mcp-jira` | `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` |
| Notion | `@imazhar101/mcp-notion-server` | `mcp-notion` | `NOTION_API_TOKEN` |
| PostgreSQL | `@imazhar101/mcp-postgresql-server` | `mcp-postgresql` | `POSTGRESQL_CONNECTION_STRING` |
| Puppeteer | `@imazhar101/mcp-puppeteer-server` | `mcp-puppeteer` | None required |
| Salesforce | `@imazhar101/mcp-salesforce-server` | `mcp-salesforce` | `SALESFORCE_LOGIN_URL`, `SALESFORCE_USERNAME`, `SALESFORCE_PASSWORD`, `SALESFORCE_SECURITY_TOKEN` |

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

### Using npm Packages (Recommended)

All configurations below can use either the local build path or the npm package with npx. Here are examples using the npm packages:

#### With npx (No Installation Required)

```bash
# Configure with npx commands
npx @imazhar101/mcp-jira-server
npx @imazhar101/mcp-postgresql-server
npx @imazhar101/mcp-canvas-server
```

#### With Global Installation

```bash
# Install first
npm install -g @imazhar101/mcp-jira-server

# Then use the binary directly
mcp-jira
```

### Continue.dev

Continue.dev supports MCP servers through both YAML and JSON configuration formats.

#### YAML Configuration (`.continue/config.yaml`)

```yaml
mcpServers:
  # Using npm packages with npx (recommended)
  - name: PostgreSQL Database
    command: npx
    args:
      - "@imazhar101/mcp-postgresql-server"
    env:
      POSTGRESQL_CONNECTION_STRING: "postgresql://user:password@localhost:5432/database"
  
  - name: Jira Integration
    command: npx
    args:
      - "@imazhar101/mcp-jira-server"
    env:
      JIRA_BASE_URL: "https://your-company.atlassian.net"
      JIRA_EMAIL: "your-email@company.com"
      JIRA_API_TOKEN: "your-api-token"
  
  - name: Canvas LMS
    command: npx
    args:
      - "@imazhar101/mcp-canvas-server"
    env:
      CANVAS_BASE_URL: "https://your-school.instructure.com" 
      CANVAS_API_TOKEN: "your-canvas-token"

  # Alternative: Using local build (if building from source)
  # - name: PostgreSQL Database
  #   command: node
  #   args:
  #     - "/path/to/mcp-suite/dist/servers/postgresql/src/index.js"
  #   env:
  #     POSTGRESQL_CONNECTION_STRING: "postgresql://user:password@localhost:5432/database"
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
          "command": "npx",
          "args": ["@imazhar101/mcp-postgresql-server"]
        },
        "env": {
          "POSTGRESQL_CONNECTION_STRING": "postgresql://user:password@localhost:5432/database"
        }
      },
      {
        "name": "Jira Integration", 
        "transport": {
          "type": "stdio",
          "command": "npx",
          "args": ["@imazhar101/mcp-jira-server"]
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
          "command": "npx",
          "args": ["@imazhar101/mcp-canvas-server"]
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
# Add PostgreSQL server using npm package
claude mcp add postgresql-db \
  -e POSTGRESQL_CONNECTION_STRING="postgresql://user:password@localhost:5432/database" \
  -- npx @imazhar101/mcp-postgresql-server

# Add Jira server using npm package
claude mcp add jira-integration \
  -e JIRA_BASE_URL="https://your-company.atlassian.net" \
  -e JIRA_EMAIL="your-email@company.com" \
  -e JIRA_API_TOKEN="your-api-token" \
  -- npx @imazhar101/mcp-jira-server

# Add Canvas server using npm package
claude mcp add canvas-lms \
  -e CANVAS_BASE_URL="https://your-school.instructure.com" \
  -e CANVAS_API_TOKEN="your-canvas-token" \
  -- npx @imazhar101/mcp-canvas-server

# Alternative: Using globally installed packages
# npm install -g @imazhar101/mcp-jira-server
# claude mcp add jira-integration -e ... -- mcp-jira
```

#### Project-Scoped Configuration (`.mcp.json`)

For team-shared configuration:

```json
{
  "mcpServers": {
    "postgresql-db": {
      "command": "npx",
      "args": ["@imazhar101/mcp-postgresql-server"],
      "env": {
        "POSTGRESQL_CONNECTION_STRING": "postgresql://user:password@localhost:5432/database"
      }
    },
    "jira-integration": {
      "command": "npx", 
      "args": ["@imazhar101/mcp-jira-server"],
      "env": {
        "JIRA_BASE_URL": "https://your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    },
    "canvas-lms": {
      "command": "npx",
      "args": ["@imazhar101/mcp-canvas-server"], 
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
      "command": "npx",
      "args": ["@imazhar101/mcp-postgresql-server"],
      "env": {
        "POSTGRESQL_CONNECTION_STRING": "postgresql://user:password@localhost:5432/database"
      },
      "disabled": false,
      "alwaysAllow": ["execute_query", "list_tables"]
    },
    "jira-integration": {
      "command": "npx",
      "args": ["@imazhar101/mcp-jira-server"],
      "env": {
        "JIRA_BASE_URL": "https://your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com", 
        "JIRA_API_TOKEN": "your-api-token"
      },
      "disabled": false,
      "alwaysAllow": ["search_issues", "get_issue", "create_issue"]
    },
    "canvas-lms": {
      "command": "npx",
      "args": ["@imazhar101/mcp-canvas-server"],
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
# Test server directly with npx
npx @imazhar101/mcp-postgresql-server

# Test with environment variables
POSTGRESQL_CONNECTION_STRING="postgresql://user:pass@localhost:5432/db" npx @imazhar101/mcp-postgresql-server

# Check environment variables
echo $POSTGRESQL_CONNECTION_STRING

# Test global installation
npm install -g @imazhar101/mcp-postgresql-server
mcp-postgresql
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