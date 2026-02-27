# Airtable MCP Server

A comprehensive Airtable integration for the Model Context Protocol (MCP) that enables database operations and record management.

## Overview

The Airtable MCP Server provides seamless integration with Airtable, allowing you to perform essential database operations through the MCP protocol. This server is part of the MCP Suite monorepo and leverages shared utilities for consistent development patterns.

## Features

- **Base Management**: List all accessible Airtable bases
- **Table Operations**: List tables and retrieve table schemas
- **Record CRUD**: Create, read, update, and delete records
- **Advanced Queries**: Filter records using Airtable formulas
- **Pagination**: Handle large datasets with built-in pagination support
- **Sorting**: Sort records by multiple fields
- **Field Selection**: Retrieve only specific fields to optimize performance

## Setup

### Prerequisites

- Node.js 18+
- Airtable account with API access
- Airtable API key for authentication

### Environment Variables

Create a `.env` file in the project root with the following variable:

```bash
AIRTABLE_API_KEY=your-api-key-here
```

Optional:

```bash
LOG_LEVEL=info  # Options: debug, info, warn, error
```

### Getting Your Airtable API Key

1. Go to [Airtable Account Settings](https://airtable.com/create/tokens)
2. Click "Create new token"
3. Give your token a name
4. Add the following scopes:
   - `data.records:read` - Read records
   - `data.records:write` - Create/update records
   - `schema.bases:read` - Read base schemas
5. Select the bases you want to access
6. Click "Create token"
7. Copy the generated token to your `.env` file

**Note**: Airtable is deprecating API keys in favor of Personal Access Tokens. This server uses the bearer token authentication method which works with both.

## Installation & Usage

### Option 1: npm Package (Recommended)

```bash
# Install globally
npm install -g @imazhar101/mcp-airtable-server

# Or run directly with npx
npx @imazhar101/mcp-airtable-server
```

### Option 2: Build from Source

#### As Part of MCP Suite

From the project root:

```bash
# Install dependencies
npm install

# Build the server
npm run build --server=airtable

# Or build all servers
npm run build
```

#### Standalone Usage

```bash
# Navigate to the airtable server directory
cd servers/airtable

# Install dependencies
npm install

# Build the server
npm run build

# Start the server
node dist/servers/airtable/src/index.js
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
    "airtable": {
      "command": "npx",
      "args": ["-y", "@imazhar101/mcp-airtable-server"],
      "env": {
        "AIRTABLE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Or if building from source:

```json
{
  "mcpServers": {
    "airtable": {
      "command": "node",
      "args": [
        "/absolute/path/to/servers/airtable/dist/servers/airtable/src/index.js"
      ],
      "env": {
        "AIRTABLE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

### 1. list_bases

List all Airtable bases accessible with your API key.

**Parameters**: None

**Example Response**:

```json
[
  {
    "id": "appXXXXXXXXXXXXXX",
    "name": "My Database",
    "permissionLevel": "create"
  }
]
```

### 2. list_tables

List all tables in a specific base.

**Parameters**:

- `baseId` (string, required): The ID of the base

**Example**:

```json
{
  "baseId": "appXXXXXXXXXXXXXX"
}
```

### 3. get_table_schema

Get the complete schema for a table, including all fields and their types.

**Parameters**:

- `baseId` (string, required): The ID of the base
- `tableIdOrName` (string, required): The ID or name of the table

**Example**:

```json
{
  "baseId": "appXXXXXXXXXXXXXX",
  "tableIdOrName": "Contacts"
}
```

### 4. list_records

List records from a table with optional filtering, sorting, and pagination.

**Parameters**:

- `baseId` (string, required): The ID of the base
- `tableIdOrName` (string, required): The ID or name of the table
- `pageSize` (number, optional): Number of records per page (max 100, default 100)
- `offset` (string, optional): Pagination offset from previous response
- `fields` (string[], optional): Specific fields to return
- `filterByFormula` (string, optional): Airtable formula to filter records
- `sort` (array, optional): Sort configuration with field and direction

**Example**:

```json
{
  "baseId": "appXXXXXXXXXXXXXX",
  "tableIdOrName": "Contacts",
  "pageSize": 50,
  "fields": ["Name", "Email", "Status"],
  "filterByFormula": "{Status} = 'Active'",
  "sort": [{ "field": "Name", "direction": "asc" }]
}
```

**Response includes**:

- `records`: Array of records
- `offset`: Token for retrieving next page (if more records exist)

### 5. get_record

Get a specific record by ID.

**Parameters**:

- `baseId` (string, required): The ID of the base
- `tableIdOrName` (string, required): The ID or name of the table
- `recordId` (string, required): The ID of the record

**Example**:

```json
{
  "baseId": "appXXXXXXXXXXXXXX",
  "tableIdOrName": "Contacts",
  "recordId": "recXXXXXXXXXXXXXX"
}
```

### 6. create_record

Create a new record in a table.

**Parameters**:

- `baseId` (string, required): The ID of the base
- `tableIdOrName` (string, required): The ID or name of the table
- `fields` (object, required): Field names and values for the record
- `typecast` (boolean, optional): Automatically convert field values to appropriate types

**Example**:

```json
{
  "baseId": "appXXXXXXXXXXXXXX",
  "tableIdOrName": "Contacts",
  "fields": {
    "Name": "John Doe",
    "Email": "john@example.com",
    "Status": "Active"
  },
  "typecast": true
}
```

### 7. update_record

Update an existing record.

**Parameters**:

- `baseId` (string, required): The ID of the base
- `tableIdOrName` (string, required): The ID or name of the table
- `recordId` (string, required): The ID of the record to update
- `fields` (object, required): Field names and values to update
- `replace` (boolean, optional): Replace all fields (true) or merge (false, default)
- `typecast` (boolean, optional): Automatically convert field values

**Example**:

```json
{
  "baseId": "appXXXXXXXXXXXXXX",
  "tableIdOrName": "Contacts",
  "recordId": "recXXXXXXXXXXXXXX",
  "fields": {
    "Status": "Inactive"
  }
}
```

### 8. delete_record

Delete a record from a table.

**Parameters**:

- `baseId` (string, required): The ID of the base
- `tableIdOrName` (string, required): The ID or name of the table
- `recordId` (string, required): The ID of the record to delete

**Example**:

```json
{
  "baseId": "appXXXXXXXXXXXXXX",
  "tableIdOrName": "Contacts",
  "recordId": "recXXXXXXXXXXXXXX"
}
```

## Rate Limits

Airtable enforces rate limits on API requests:

- **5 requests per second per base**
- Exceeding this limit will result in HTTP 429 (Too Many Requests) errors

**Recommendations**:

- Implement delays between rapid requests
- Use pagination with appropriate page sizes
- Cache frequently accessed data
- Use field selection to reduce data transfer

## Error Handling

The server handles various error scenarios:

- **401 Unauthorized**: Invalid or expired API key
- **403 Forbidden**: Insufficient permissions for the requested operation
- **404 Not Found**: Base, table, or record not found
- **422 Unprocessable Entity**: Invalid request data or field validation errors
- **429 Too Many Requests**: Rate limit exceeded

All errors include descriptive messages to help diagnose issues.

## Airtable Formula Syntax

When using `filterByFormula`, you can use Airtable's formula syntax:

**Examples**:

- `{Status} = 'Active'` - Exact match
- `AND({Status} = 'Active', {Age} > 18)` - Multiple conditions
- `OR({Type} = 'A', {Type} = 'B')` - Alternative conditions
- `FIND('keyword', {Description})` - Text search
- `IS_AFTER({Date}, '2024-01-01')` - Date comparison

See [Airtable Formula Reference](https://support.airtable.com/docs/formula-field-reference) for complete documentation.

## Development

### Project Structure

```
servers/airtable/
├── src/
│   ├── index.ts                    # Server entry point
│   ├── services/
│   │   └── airtable-service.ts     # Business logic
│   ├── tools/
│   │   └── index.ts                # Tool definitions
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── package.json
├── tsconfig.json
└── README.md
```

### Running Tests

```bash
# From project root
npm test

# Run specific test file
npx vitest run tests/integration/airtable-server.test.ts
```

### Building

```bash
# Build this server only
npm run build --server=airtable

# Build all servers
npm run build

# Clean build artifacts
npm run clean
```

## Contributing

Contributions are welcome! Please follow the established patterns in the MCP Suite:

1. Use shared utilities from `shared/` directory
2. Follow TypeScript best practices
3. Add comprehensive JSDoc comments
4. Update tests for new features
5. Follow the existing code style

## License

MIT

## Support

For issues and questions:

- GitHub Issues: [mcp-suite issues](https://github.com/imazhar101/mcp-suite/issues)
- Documentation: See other servers in the MCP Suite for patterns and examples

## Related

- [MCP Suite](https://github.com/imazhar101/mcp-suite) - Complete monorepo
- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Model Context Protocol](https://modelcontextprotocol.io/)
