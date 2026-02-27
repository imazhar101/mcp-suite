# GitHub MCP Server

A Model Context Protocol (MCP) server that provides comprehensive GitHub integration with pull request capabilities and basic repository management tools.

## Features

### Pull Request Management

- List, create, update, and merge pull requests
- Get pull request files and commits
- Close pull requests without merging
- Review management (list reviews, create reviews)

### Repository Management

- Get repository information
- List user repositories
- Search repositories

### Issue Management

- List, create, update, and close issues
- Search issues across GitHub
- Comment management (create, update, delete)

### Branch & Release Tools

- List and get branch information
- List releases and get latest release

### User Tools

- Get authenticated user information
- Get user information by username

## Installation

```bash
npm install @mcp-suite/github-server
```

## Configuration

Set the following environment variable:

```bash
export GITHUB_TOKEN="your_github_personal_access_token"
```

**Creating a GitHub Personal Access Token:**

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give your token a descriptive name
4. Select the required scopes (see "GitHub Token Permissions" section below)
5. Click "Generate token"
6. Copy the token and set it as the `GITHUB_TOKEN` environment variable

For GitHub Enterprise Server, also set:

```bash
export GITHUB_API_URL="https://your-github-enterprise-server/api/v3"
```

## Usage

The server provides 26 tools for GitHub operations:

### Repository Tools

- `get_repository` - Get information about a specific repository
- `list_repositories` - List repositories for the authenticated user
- `search_repositories` - Search for repositories on GitHub

### Pull Request Tools

- `list_pull_requests` - List pull requests for a repository
- `get_pull_request` - Get details of a specific pull request
- `create_pull_request` - Create a new pull request
- `update_pull_request` - Update an existing pull request
- `merge_pull_request` - Merge a pull request
- `close_pull_request` - Close a pull request without merging
- `get_pull_request_files` - Get list of files changed in a pull request
- `get_pull_request_commits` - Get commits in a pull request

### Issue Tools

- `list_issues` - List issues for a repository
- `get_issue` - Get details of a specific issue
- `create_issue` - Create a new issue
- `update_issue` - Update an existing issue
- `close_issue` - Close an issue
- `search_issues` - Search for issues across GitHub

### Comment Tools

- `list_issue_comments` - List comments on an issue
- `create_issue_comment` - Create a comment on an issue
- `update_comment` - Update a comment
- `delete_comment` - Delete a comment

### Review Tools

- `list_pull_request_reviews` - List reviews for a pull request
- `create_pull_request_review` - Create a review for a pull request

### Branch Tools

- `list_branches` - List branches for a repository
- `get_branch` - Get details of a specific branch

### Release Tools

- `list_releases` - List releases for a repository
- `get_latest_release` - Get the latest release for a repository

### User Tools

- `get_authenticated_user` - Get information about the authenticated user
- `get_user` - Get information about a specific user

## Example Usage

```bash
# List pull requests for a repository
{
  "tool": "list_pull_requests",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "state": "open"
  }
}

# Create a new pull request
{
  "tool": "create_pull_request",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "title": "Amazing new feature",
    "body": "This PR adds an amazing new feature",
    "head": "feature-branch",
    "base": "main"
  }
}

# Search for issues
{
  "tool": "search_issues",
  "arguments": {
    "q": "is:issue is:open label:bug repo:octocat/Hello-World"
  }
}
```

## GitHub Token Permissions

The GitHub token should have the following scopes:

- `repo` - Full control of private repositories
- `read:user` - Read user profile data
- `read:org` - Read organization and team membership

For public repositories only:

- `public_repo` - Access public repositories

## Error Handling

The server provides detailed error messages for common issues:

- Invalid authentication tokens
- Repository not found
- Insufficient permissions
- Rate limit exceeded

## Development

```bash
# Build the server
npm run build

# Start in development mode
npm run dev
```
