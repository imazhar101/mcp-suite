# Rippling MCP Server

A Model Context Protocol (MCP) server for Rippling HR platform integration. This server provides tools to interact with Rippling's API for employee management and HR operations.

## Features

- **Employee Management**: List and search employees with pagination
- **Employment Roles**: Get employment role details for specific users
- **Connection Testing**: Verify API connectivity and authentication

## Tools

### `rippling_test_connection`
Test the connection to Rippling API and retrieve basic information.

### `rippling_list_employees`
List employees with optional search and pagination. Returns simplified employee data including:
- Employee ID
- Full name
- Email
- Title
- Department
- Employee number
- Start date
- Role state

**Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `searchQuery` (string, optional): Search query to filter employees by name

### `rippling_get_employment_roles`
Get employment roles for a specific user by user ID.

**Parameters:**
- `userId` (string, required): The user ID to get employment roles for

## Configuration

Set the following environment variables:

```bash
export RIPPLING_TOKEN="your_rippling_bearer_token"
export RIPPLING_ROLE="your_rippling_role_id"
export RIPPLING_COMPANY="your_rippling_company_id"
```

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
npx @imazhar101/mcp-rippling-server
```

## API Endpoints Used

- `GET /employment_roles_with_company/{userId}/` - Get employment roles for a user
- `POST /employee_list/find_paginated` - List employees with pagination and search

## License

MIT