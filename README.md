# MCP Suite

A comprehensive monorepo suite of MCP (Model Context Protocol) servers built for standardized development and deployment.

## 🏗️ Architecture

```
mcp-suite/
├── shared/              # Shared utilities and types
│   ├── types/          # Common TypeScript interfaces
│   ├── utils/          # Utility functions (logger, config, validation)
│   └── middleware/     # Reusable middleware (auth, error handling)
├── servers/            # Individual MCP servers
│   └── jira/          # Jira server for issue management
├── scripts/           # Build and deployment scripts
├── config/            # Environment-specific configurations
└── tests/             # Test suite (unit, integration, fixtures)
```

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd mcp-suite
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build all servers:**
   ```bash
   npm run build
   ```

4. **Start a specific server:**
   ```bash
   npm run build:server jira
   ```

## 📦 Available Servers

### Jira Server
**Package:** `@mcp-suite/jira-server`  
**Description:** Comprehensive Jira integration for issue management, project tracking, and workflow automation.

📖 **[Full Documentation](servers/jira/README.md)**

**Quick Setup:**
- `JIRA_BASE_URL` - Your Jira instance URL
- `JIRA_EMAIL` - Your Jira account email  
- `JIRA_API_TOKEN` - Your Jira API token

**Key Features:** Issue management, JQL search, workflow automation, project tracking, comments, and assignments.

## 🛠️ Development

### Building Servers
```bash
# Build all servers
npm run build

# Build specific server
cd servers/jira && npm run build
```

### Running Servers
```bash
# Start a specific server
npm run build:server jira

# Start all servers
npm run start:all
```

### Testing
```bash
# Run integration tests
npm test

# Run specific test file
npx vitest run tests/integration/jira-server.test.ts
```

### Creating New Servers

1. Create server directory:
   ```bash
   mkdir -p servers/your-server/src/{handlers,tools,types}
   ```

2. Set up package.json following the existing pattern
3. Implement your server using the shared utilities
4. Add configuration to `config/servers.json`
5. Update this README

## 📋 Scripts

- `npm run build` - Build all servers
- `npm run build:server <name>` - Start specific server
- `npm run start:all` - Start all servers
- `npm run deploy <server> [version-type]` - Deploy server with version bump
- `npm test` - Run integration tests
- `npm run lint` - Lint codebase
- `npm run type-check` - TypeScript type checking

## 🔧 Configuration

### Environment-specific configs
- `config/development.json` - Development settings
- `config/production.json` - Production settings
- `config/servers.json` - Server registry and metadata

### Shared Utilities
- **Logger:** Structured logging with context
- **Config:** Environment variable management
- **Validation:** Input validation utilities
- **Auth:** Authentication middleware
- **Error Handling:** Standardized error responses

## 🧪 Testing

The test suite includes:
- **Integration tests:** Test server startup and MCP protocol communication using Vitest
- Tests require environment variables (e.g., `JIRA_BASE_URL`) to run against real services
- Tests are skipped automatically when environment variables are not configured

## 📈 Monitoring

Each server includes built-in monitoring capabilities:
- Structured logging with contextual information
- Error tracking and reporting
- Performance metrics collection
- Health check endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the established patterns
4. Add tests for your changes
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add your feature'`
7. Push to the branch: `git push origin feature/your-feature`
8. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Create an issue for bug reports or feature requests
- Check existing documentation in individual server README files
- Review the shared utilities documentation for development guidance