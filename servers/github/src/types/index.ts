export interface GitHubConfig {
  token: string;
  baseUrl?: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  archived: boolean;
  disabled: boolean;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  assignee: User | null;
  assignees: User[];
  labels: Label[];
  milestone: Milestone | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  user: User;
  comments: number;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  draft: boolean;
  head: {
    ref: string;
    sha: string;
    repo: Repository | null;
  };
  base: {
    ref: string;
    sha: string;
    repo: Repository;
  };
  user: User;
  assignee: User | null;
  assignees: User[];
  reviewers: User[];
  labels: Label[];
  milestone: Milestone | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  mergeable: boolean | null;
  merged: boolean;
  comments: number;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
  html_url: string;
}

export interface User {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

export interface Milestone {
  id: number;
  number: number;
  title: string;
  description: string | null;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  due_on: string | null;
  closed_at: string | null;
}

export interface Comment {
  id: number;
  body: string;
  user: User;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface CreatePullRequestData {
  title: string;
  body?: string;
  head: string;
  base: string;
  draft?: boolean;
}

export interface UpdatePullRequestData {
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  base?: string;
}

export interface CreateIssueData {
  title: string;
  body?: string;
  assignees?: string[];
  labels?: string[];
  milestone?: number;
}

export interface UpdateIssueData {
  title?: string;
  body?: string;
  assignees?: string[];
  labels?: string[];
  milestone?: number;
  state?: 'open' | 'closed';
}

export interface GitHubSearchOptions {
  q: string;
  sort?: 'updated' | 'created' | 'comments';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface ListOptions {
  state?: 'open' | 'closed' | 'all';
  sort?: string;
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
