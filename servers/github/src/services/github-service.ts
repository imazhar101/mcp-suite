import { Octokit } from '@octokit/rest';
import {
  GitHubConfig,
  Repository,
  Issue,
  PullRequest,
  Comment,
  CreatePullRequestData,
  UpdatePullRequestData,
  CreateIssueData,
  UpdateIssueData,
  GitHubSearchOptions,
  ListOptions,
} from '../types/index.js';

export class GitHubService {
  private octokit: Octokit;

  constructor(config: GitHubConfig) {
    this.octokit = new Octokit({
      auth: config.token,
      baseUrl: config.baseUrl || 'https://api.github.com',
    });
  }

  // Repository methods
  async getRepository(owner: string, repo: string): Promise<Repository> {
    const response = await this.octokit.repos.get({ owner, repo });
    return response.data as Repository;
  }

  async listRepositories(options?: ListOptions): Promise<Repository[]> {
    const response = await this.octokit.repos.listForAuthenticatedUser({
      per_page: options?.per_page || 30,
      page: options?.page || 1,
      sort: (options?.sort as any) || 'updated',
      direction: options?.direction || 'desc',
    });
    return response.data as Repository[];
  }

  async searchRepositories(
    searchOptions: GitHubSearchOptions
  ): Promise<Repository[]> {
    const response = await this.octokit.search.repos({
      q: searchOptions.q,
      sort: searchOptions.sort as any,
      order: searchOptions.order,
      per_page: searchOptions.per_page || 30,
      page: searchOptions.page || 1,
    });
    return response.data.items as Repository[];
  }

  // Pull Request methods
  async listPullRequests(
    owner: string,
    repo: string,
    options?: ListOptions
  ): Promise<PullRequest[]> {
    const response = await this.octokit.pulls.list({
      owner,
      repo,
      state: (options?.state as any) || 'open',
      sort: (options?.sort as any) || 'created',
      direction: options?.direction || 'desc',
      per_page: options?.per_page || 30,
      page: options?.page || 1,
    });
    return response.data as any[];
  }

  async getPullRequest(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<PullRequest> {
    const response = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });
    return response.data as any;
  }

  async createPullRequest(
    owner: string,
    repo: string,
    data: CreatePullRequestData
  ): Promise<PullRequest> {
    const response = await this.octokit.pulls.create({
      owner,
      repo,
      title: data.title,
      body: data.body,
      head: data.head,
      base: data.base,
      draft: data.draft || false,
    });
    return response.data as any;
  }

  async updatePullRequest(
    owner: string,
    repo: string,
    pullNumber: number,
    data: UpdatePullRequestData
  ): Promise<PullRequest> {
    const response = await this.octokit.pulls.update({
      owner,
      repo,
      pull_number: pullNumber,
      title: data.title,
      body: data.body,
      state: data.state,
      base: data.base,
    });
    return response.data as any;
  }

  async mergePullRequest(
    owner: string,
    repo: string,
    pullNumber: number,
    commitTitle?: string,
    commitMessage?: string,
    mergeMethod?: 'merge' | 'squash' | 'rebase'
  ): Promise<any> {
    const response = await this.octokit.pulls.merge({
      owner,
      repo,
      pull_number: pullNumber,
      commit_title: commitTitle,
      commit_message: commitMessage,
      merge_method: mergeMethod || 'merge',
    });
    return response.data;
  }

  async closePullRequest(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<PullRequest> {
    return this.updatePullRequest(owner, repo, pullNumber, { state: 'closed' });
  }

  async getPullRequestFiles(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<any[]> {
    const response = await this.octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber,
    });
    return response.data;
  }

  async getPullRequestCommits(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<any[]> {
    const response = await this.octokit.pulls.listCommits({
      owner,
      repo,
      pull_number: pullNumber,
    });
    return response.data;
  }

  // Issue methods
  async listIssues(
    owner: string,
    repo: string,
    options?: ListOptions
  ): Promise<Issue[]> {
    const response = await this.octokit.issues.listForRepo({
      owner,
      repo,
      state: (options?.state as any) || 'open',
      sort: (options?.sort as any) || 'created',
      direction: options?.direction || 'desc',
      per_page: options?.per_page || 30,
      page: options?.page || 1,
    });
    return response.data.filter((issue) => !issue.pull_request) as Issue[];
  }

  async getIssue(
    owner: string,
    repo: string,
    issueNumber: number
  ): Promise<Issue> {
    const response = await this.octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });
    return response.data as Issue;
  }

  async createIssue(
    owner: string,
    repo: string,
    data: CreateIssueData
  ): Promise<Issue> {
    const response = await this.octokit.issues.create({
      owner,
      repo,
      title: data.title,
      body: data.body,
      assignees: data.assignees,
      labels: data.labels,
      milestone: data.milestone,
    });
    return response.data as Issue;
  }

  async updateIssue(
    owner: string,
    repo: string,
    issueNumber: number,
    data: UpdateIssueData
  ): Promise<Issue> {
    const response = await this.octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      title: data.title,
      body: data.body,
      assignees: data.assignees,
      labels: data.labels,
      milestone: data.milestone,
      state: data.state,
    });
    return response.data as Issue;
  }

  async closeIssue(
    owner: string,
    repo: string,
    issueNumber: number
  ): Promise<Issue> {
    return this.updateIssue(owner, repo, issueNumber, { state: 'closed' });
  }

  async searchIssues(searchOptions: GitHubSearchOptions): Promise<Issue[]> {
    const response = await this.octokit.search.issuesAndPullRequests({
      q: searchOptions.q,
      sort: searchOptions.sort as any,
      order: searchOptions.order,
      per_page: searchOptions.per_page || 30,
      page: searchOptions.page || 1,
    });
    return response.data.items as Issue[];
  }

  // Comment methods
  async listIssueComments(
    owner: string,
    repo: string,
    issueNumber: number,
    options?: ListOptions
  ): Promise<Comment[]> {
    const response = await this.octokit.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      per_page: options?.per_page || 30,
      page: options?.page || 1,
    });
    return response.data as Comment[];
  }

  async createIssueComment(
    owner: string,
    repo: string,
    issueNumber: number,
    body: string
  ): Promise<Comment> {
    const response = await this.octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body,
    });
    return response.data as Comment;
  }

  async updateComment(
    owner: string,
    repo: string,
    commentId: number,
    body: string
  ): Promise<Comment> {
    const response = await this.octokit.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body,
    });
    return response.data as Comment;
  }

  async deleteComment(
    owner: string,
    repo: string,
    commentId: number
  ): Promise<void> {
    await this.octokit.issues.deleteComment({
      owner,
      repo,
      comment_id: commentId,
    });
  }

  // Review methods
  async listPullRequestReviews(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<any[]> {
    const response = await this.octokit.pulls.listReviews({
      owner,
      repo,
      pull_number: pullNumber,
    });
    return response.data;
  }

  async createPullRequestReview(
    owner: string,
    repo: string,
    pullNumber: number,
    body?: string,
    event?: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT'
  ): Promise<any> {
    const response = await this.octokit.pulls.createReview({
      owner,
      repo,
      pull_number: pullNumber,
      body,
      event,
    });
    return response.data;
  }

  // Branch methods
  async listBranches(
    owner: string,
    repo: string,
    options?: ListOptions
  ): Promise<any[]> {
    const response = await this.octokit.repos.listBranches({
      owner,
      repo,
      per_page: options?.per_page || 30,
      page: options?.page || 1,
    });
    return response.data;
  }

  async getBranch(owner: string, repo: string, branch: string): Promise<any> {
    const response = await this.octokit.repos.getBranch({
      owner,
      repo,
      branch,
    });
    return response.data;
  }

  // Release methods
  async listReleases(
    owner: string,
    repo: string,
    options?: ListOptions
  ): Promise<any[]> {
    const response = await this.octokit.repos.listReleases({
      owner,
      repo,
      per_page: options?.per_page || 30,
      page: options?.page || 1,
    });
    return response.data;
  }

  async getLatestRelease(owner: string, repo: string): Promise<any> {
    const response = await this.octokit.repos.getLatestRelease({
      owner,
      repo,
    });
    return response.data;
  }

  // User methods
  async getAuthenticatedUser(): Promise<any> {
    const response = await this.octokit.users.getAuthenticated();
    return response.data;
  }

  async getUser(username: string): Promise<any> {
    const response = await this.octokit.users.getByUsername({
      username,
    });
    return response.data;
  }
}
