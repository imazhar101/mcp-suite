# Bitbucket MCP Server

A Model Context Protocol (MCP) server for Bitbucket that provides comprehensive tools for repository management, pull request operations, and code collaboration workflows.

## Installation & Usage

### Option 1: npm Package (Recommended)

```bash
# Install globally
npm install -g @imazhar101/mcp-bitbucket-server

# Or run directly with npx
npx @imazhar101/mcp-bitbucket-server
```

### Option 2: Build from Source

```bash
# From project root
npm install
npm run build

# The server will be available at:
./dist/servers/bitbucket/src/index.js
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
    "bitbucket-integration": {
      "command": "npx",
      "args": ["@imazhar101/mcp-bitbucket-server"],
      "env": {
        "BITBUCKET_USERNAME": "your-username",
        "BITBUCKET_APP_PASSWORD": "your-app-password"
      },
      "disabled": false,
      "alwaysAllow": [
        "search_repositories",
        "get_repository",
        "list_pull_requests"
      ]
    }
  }
}
```

## Features

### 🏗️ Repository Management

- **Repository Operations**: Get repositories, repository details with comprehensive metadata
- **Branch Management**: List and manage repository branches
- **Commit Tracking**: View commit history, detailed commit information, and pull requests for specific commits

### 🔄 Pull Request Lifecycle

- **PR Operations**: Create, read, update, merge, and decline pull requests
- **PR Management**: Support for draft PRs, cross-repository pull requests, and merge strategies
- **Review Process**: Approve, request changes, and manage reviewer assignments
- **Comments & Discussion**: Full comment management with create, update, and delete operations

### 📋 Task Management

- **PR Tasks**: Create, update, and delete tasks on pull requests
- **Task States**: Track task resolution status (UNRESOLVED/RESOLVED)
- **Task Organization**: Link tasks to specific comments for better context

### 👥 Collaboration Features

- **Reviewer Management**: Default reviewers, effective reviewer inheritance, and reviewer assignment
- **Build Integration**: Access pull request build statuses and CI/CD pipeline results
- **Activity Tracking**: Complete pull request activity feeds and audit trails

### 🔍 Advanced Features

- **Search & Filtering**: Repository search, pull request filtering by state, and pagination support
- **Diff Analysis**: Pull request diffs and commit comparisons
- **Merge Strategies**: Support for merge commits, squash merging, and fast-forward merges

## Installation

### Prerequisites

- Node.js 18+
- Bitbucket workspace access
- Bitbucket App Password or OAuth token

### Setup

1. **Install the package:**

```bash
npm install @imazhar101/bitbucket-server
```

2. **Environment Configuration:**
   Create a `.env` file with required credentials:

```bash
# Required: Bitbucket Authentication
BITBUCKET_USERNAME=your-username
BITBUCKET_APP_PASSWORD=your-app-password
BITBUCKET_WORKSPACE=your-workspace-name

# Optional: API Configuration
BITBUCKET_API_BASE_URL=https://api.bitbucket.org/2.0  # Default value
```

3. **MCP Configuration:**
   Add to your MCP settings file:

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "mcp-bitbucket",
      "env": {
        "BITBUCKET_USERNAME": "your-username",
        "BITBUCKET_APP_PASSWORD": "your-app-password",
        "BITBUCKET_WORKSPACE": "your-workspace-name"
      }
    }
  }
}
```

## Authentication Setup

### App Password (Recommended)

1. Go to Bitbucket Settings → Personal settings → App passwords
2. Create a new app password with required permissions:
   - **Repositories**: Read, Write
   - **Pull requests**: Read, Write
   - **Account**: Read

### OAuth Token (Alternative)

Configure OAuth application and use the generated token as `BITBUCKET_APP_PASSWORD`.

## Available Tools

### Repository Operations

```bash
# Get all repositories in workspace
get_repositories

# Get specific repository details
get_repository --repo_slug="my-repo"

# Get repository branches
get_branches --repo_slug="my-repo"

# Get repository commits
get_commits --repo_slug="my-repo" --branch="main"

# Get specific commit details
get_commit --repo_slug="my-repo" --commit_hash="abc123"
```

### Pull Request Management

```bash
# List pull requests
get_pull_requests --repo_slug="my-repo" --state="OPEN"

# Get specific pull request
get_pull_request --repo_slug="my-repo" --pull_request_id=123

# Create new pull request
create_pull_request --repo_slug="my-repo" --title="Feature: New functionality" --source_branch="feature/new-feature" --destination_branch="main"

# Update pull request
update_pull_request --repo_slug="my-repo" --pull_request_id=123 --title="Updated title"

# Merge pull request
merge_pull_request --repo_slug="my-repo" --pull_request_id=123 --type="squash"

# Decline pull request
decline_pull_request --repo_slug="my-repo" --pull_request_id=123
```

### Review & Approval Workflow

```bash
# Approve pull request
approve_pull_request --repo_slug="my-repo" --pull_request_id=123

# Request changes
request_changes --repo_slug="my-repo" --pull_request_id=123

# Remove approval
unapprove_pull_request --repo_slug="my-repo" --pull_request_id=123

# Remove change request
remove_change_request --repo_slug="my-repo" --pull_request_id=123
```

### Comments & Discussion

```bash
# Get pull request comments
get_pull_request_comments --repo_slug="my-repo" --pull_request_id=123

# Add comment
create_pull_request_comment --repo_slug="my-repo" --pull_request_id=123 --content="This looks good!"

# Update comment
update_pull_request_comment --repo_slug="my-repo" --pull_request_id=123 --comment_id=456 --content="Updated comment"

# Delete comment
delete_pull_request_comment --repo_slug="my-repo" --pull_request_id=123 --comment_id=456
```

### Task Management

```bash
# Get pull request tasks
get_pull_request_tasks --repo_slug="my-repo" --pull_request_id=123

# Create task
create_pull_request_task --repo_slug="my-repo" --pull_request_id=123 --content="Fix styling issue"

# Update task
update_pull_request_task --repo_slug="my-repo" --pull_request_id=123 --task_id=789 --state="RESOLVED"

# Delete task
delete_pull_request_task --repo_slug="my-repo" --pull_request_id=123 --task_id=789
```

### Advanced Operations

```bash
# Get pull request diff
get_pull_request_diff --repo_slug="my-repo" --pull_request_id=123

# Get pull request commits
get_pull_request_commits --repo_slug="my-repo" --pull_request_id=123

# Get pull request activity
get_pull_request_activity --repo_slug="my-repo" --pull_request_id=123

# Get build statuses
get_pull_request_statuses --repo_slug="my-repo" --pull_request_id=123

# Find pull requests for commit
get_pull_requests_for_commit --repo_slug="my-repo" --commit_hash="abc123"
```

### Reviewer Management

```bash
# Get default reviewers
get_default_reviewers --repo_slug="my-repo"

# Get effective default reviewers (including inherited)
get_effective_default_reviewers --repo_slug="my-repo"

# Add default reviewer
add_default_reviewer --repo_slug="my-repo" --username="reviewer-username"

# Remove default reviewer
remove_default_reviewer --repo_slug="my-repo" --username="reviewer-username"
```

## Usage Examples

### Complete Pull Request Workflow

```typescript
// Create feature branch pull request
const pr = await create_pull_request({
  repo_slug: "my-project",
  title: "Feature: User authentication",
  description: "Implements OAuth2 authentication system",
  source_branch: "feature/auth",
  destination_branch: "develop",
  reviewers: ["teammate1", "teammate2"],
  draft: false,
});

// Add reviewer comment
await create_pull_request_comment({
  repo_slug: "my-project",
  pull_request_id: pr.id,
  content: "Please review the security implementation in auth.ts",
});

// Create review task
await create_pull_request_task({
  repo_slug: "my-project",
  pull_request_id: pr.id,
  content: "Verify password hashing algorithm",
});

// Approve and merge
await approve_pull_request({
  repo_slug: "my-project",
  pull_request_id: pr.id,
});

await merge_pull_request({
  repo_slug: "my-project",
  pull_request_id: pr.id,
  type: "squash",
  message: "Feature: Add OAuth2 authentication system",
});
```

### Repository Analysis

```typescript
// Get repository overview
const repo = await get_repository({ repo_slug: "my-project" });
const branches = await get_branches({ repo_slug: "my-project" });
const recentCommits = await get_commits({
  repo_slug: "my-project",
  branch: "main",
  pagelen: 10,
});

// Analyze pull request activity
const openPRs = await get_pull_requests({
  repo_slug: "my-project",
  state: "OPEN",
});

for (const pr of openPRs.values) {
  const activity = await get_pull_request_activity({
    repo_slug: "my-project",
    pull_request_id: pr.id,
  });

  const statuses = await get_pull_request_statuses({
    repo_slug: "my-project",
    pull_request_id: pr.id,
  });
}
```

## Error Handling

The server includes comprehensive error handling for common scenarios:

- **Authentication Errors**: Invalid credentials or expired tokens
- **Permission Errors**: Insufficient access rights for operations
- **Resource Not Found**: Non-existent repositories, pull requests, or comments
- **Rate Limiting**: Automatic handling of Bitbucket API rate limits
- **Validation Errors**: Invalid input parameters or missing required fields

## API Limits & Pagination

- **Rate Limits**: Respects Bitbucket API rate limits (varies by plan)
- **Pagination**: All list operations support pagination with `page` and `pagelen` parameters
- **Batch Operations**: Efficient handling of bulk operations where supported

## Security Considerations

- **Credential Management**: Store credentials securely using environment variables
- **Access Control**: Use principle of least privilege for app password permissions
- **Token Rotation**: Regularly rotate app passwords and OAuth tokens
- **Audit Logging**: All operations are logged for security audit trails

## Troubleshooting

### Common Issues

1. **Authentication Failed**

   - Verify `BITBUCKET_USERNAME` and `BITBUCKET_APP_PASSWORD`
   - Check app password permissions
   - Ensure workspace name is correct

2. **Repository Not Found**

   - Verify repository slug format: `repository-name` (not full path)
   - Check repository access permissions
   - Ensure repository exists in specified workspace

3. **Permission Denied**
   - Review app password permissions
   - Check user access level in repository
   - Verify workspace membership

### Debug Mode

Enable debug logging by setting:

```bash
export DEBUG=bitbucket:*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- **Documentation**: [MCP Suite Documentation](https://github.com/imazhar101/mcp-suite)
- **Issues**: [GitHub Issues](https://github.com/imazhar101/mcp-suite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/imazhar101/mcp-suite/discussions)
