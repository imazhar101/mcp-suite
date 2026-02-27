import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';

describe('GitHub Server Integration Tests', () => {
  const serverPath = path.join(process.cwd(), 'servers/github/dist/index.js');
  let serverProcess: any;

  beforeAll(async () => {
    // Check if required environment variables are present
    if (!process.env.GITHUB_TOKEN) {
      console.warn('GITHUB_TOKEN not found. Skipping GitHub server tests.');
      return;
    }

    // Build the server first
    try {
      execSync('npm run build --server=github', { cwd: process.cwd() });
    } catch (error) {
      console.error('Failed to build GitHub server:', error);
      throw error;
    }
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('should build successfully', () => {
    if (!process.env.GITHUB_TOKEN) {
      console.warn('Skipping test: GITHUB_TOKEN not found');
      return;
    }

    expect(() => {
      const fs = require('fs');
      expect(fs.existsSync(serverPath)).toBe(true);
    }).not.toThrow();
  });

  it('should have correct package.json configuration', () => {
    const packageJsonPath = path.join(
      process.cwd(),
      'servers/github/package.json'
    );
    const packageJson = require(packageJsonPath);

    expect(packageJson.name).toBe('@mcp-suite/github-server');
    expect(packageJson.version).toBe('1.0.0');
    expect(packageJson.main).toBe('dist/index.js');
    expect(packageJson.dependencies).toHaveProperty(
      '@modelcontextprotocol/sdk'
    );
    expect(packageJson.dependencies).toHaveProperty('@octokit/rest');
  });

  it('should be registered in servers.json', () => {
    const serversConfig = require(
      path.join(process.cwd(), 'config/servers.json')
    );
    const githubServer = serversConfig.servers.find(
      (s: any) => s.name === 'github'
    );

    expect(githubServer).toBeDefined();
    expect(githubServer.displayName).toBe('GitHub Server');
    expect(githubServer.category).toBe('development');
    expect(githubServer.requiredEnvVars).toContain('GITHUB_TOKEN');
    expect(githubServer.tools).toContain('create_pull_request');
    expect(githubServer.tools).toContain('list_repositories');
    expect(githubServer.tools).toContain('search_issues');
  });

  it('should have all expected tool definitions', () => {
    // This test checks that all tools are properly defined
    const toolsPath = path.join(
      process.cwd(),
      'servers/github/src/tools/index.ts'
    );
    const fs = require('fs');
    const toolsContent = fs.readFileSync(toolsPath, 'utf8');

    const expectedTools = [
      'get_repository',
      'list_repositories',
      'search_repositories',
      'list_pull_requests',
      'get_pull_request',
      'create_pull_request',
      'update_pull_request',
      'merge_pull_request',
      'close_pull_request',
      'get_pull_request_files',
      'get_pull_request_commits',
      'list_issues',
      'get_issue',
      'create_issue',
      'update_issue',
      'close_issue',
      'search_issues',
      'list_issue_comments',
      'create_issue_comment',
      'update_comment',
      'delete_comment',
      'list_pull_request_reviews',
      'create_pull_request_review',
      'list_branches',
      'get_branch',
      'list_releases',
      'get_latest_release',
      'get_authenticated_user',
      'get_user',
    ];

    expectedTools.forEach((tool) => {
      expect(toolsContent).toContain(`name: '${tool}'`);
    });
  });

  it('should have TypeScript types defined', () => {
    const typesPath = path.join(
      process.cwd(),
      'servers/github/src/types/index.ts'
    );
    const fs = require('fs');
    const typesContent = fs.readFileSync(typesPath, 'utf8');

    const expectedTypes = [
      'GitHubConfig',
      'Repository',
      'Issue',
      'PullRequest',
      'User',
      'CreatePullRequestData',
      'UpdatePullRequestData',
      'CreateIssueData',
      'UpdateIssueData',
    ];

    expectedTypes.forEach((type) => {
      expect(typesContent).toContain(`interface ${type}`);
    });
  });

  it('should have GitHub service with all required methods', () => {
    const servicePath = path.join(
      process.cwd(),
      'servers/github/src/services/github-service.ts'
    );
    const fs = require('fs');
    const serviceContent = fs.readFileSync(servicePath, 'utf8');

    const expectedMethods = [
      'getRepository',
      'listRepositories',
      'searchRepositories',
      'listPullRequests',
      'getPullRequest',
      'createPullRequest',
      'updatePullRequest',
      'mergePullRequest',
      'closePullRequest',
      'listIssues',
      'getIssue',
      'createIssue',
      'updateIssue',
      'closeIssue',
      'searchIssues',
      'listIssueComments',
      'createIssueComment',
      'updateComment',
      'deleteComment',
    ];

    expectedMethods.forEach((method) => {
      expect(serviceContent).toContain(`async ${method}(`);
    });
  });
});
