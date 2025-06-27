# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Build all servers
npm run build

# Build specific server
npm run build --server=jira

# Build shared modules only
npm run build:shared

# Interactive build menu
node scripts/build.js
```

## Test Commands

```bash
# Run all integration tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npx vitest run tests/integration/jira-server.test.ts
```

## Linting and Type Checking

```bash
# Lint entire codebase
npm run lint

# TypeScript type checking
npm run type-check

# Clean build artifacts
npm run clean
```

## Development Commands

```bash
# Deploy server with version bump
npm run deploy

# Publish packages to npm
npm run publish
```

## Architecture Overview

This is a monorepo containing multiple MCP (Model Context Protocol) servers with a shared utilities layer:

### Core Structure
- **servers/**: Individual MCP server implementations (11 servers total)
- **shared/**: Common utilities, types, and middleware used across all servers
- **config/**: Environment-specific configurations and server registry
- **scripts/**: Build, deployment, and publishing automation
- **tests/**: Integration and unit tests with Vitest

### Shared Layer Architecture
- **shared/types/**: Common TypeScript interfaces including MCP protocol types
- **shared/utils/**: Core utilities (logger, config management, validation)
- **shared/middleware/**: Reusable middleware (authentication, error handling)

### MCP Server Pattern
Each server follows a consistent architecture:
1. **index.ts**: Main server entry point with MCP SDK integration
2. **handlers/**: Service classes containing business logic
3. **tools/**: MCP tool definitions and schemas
4. **types/**: Server-specific TypeScript interfaces

### Key Servers
- **jira**: Issue management (11 tools)
- **canvas**: Learning management system (185 tools)
- **postgresql**: Database operations (5 tools)
- **salesforce**: CRM integration with OAuth (7 tools)
- **bitbucket**: Repository management (40 tools)
- **aws**: DynamoDB, Lambda, API Gateway (29 tools)

### Build System
- Uses custom build script (`scripts/build.js`) with progress tracking
- Builds shared modules first, then individual servers
- Each server compiles to its own `dist/` directory
- Supports interactive and command-line build modes

### Environment Configuration
- Servers use environment variables for API credentials
- Configuration loaded via `shared/utils/config.js`
- Development/production configs in `config/` directory

### Testing Strategy
- Integration tests with Vitest framework
- Tests require environment variables for external services
- Automatically skipped when environment variables missing
- Fixtures stored in `tests/fixtures/`