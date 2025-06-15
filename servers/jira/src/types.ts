export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}

export interface ADFNode {
  type: string;
  attrs?: Record<string, any>;
  content?: ADFNode[];
  marks?: ADFMark[];
  text?: string;
}

export interface ADFMark {
  type: string;
  attrs?: Record<string, any>;
}

export interface ADFDocument {
  type: "doc";
  version: 1;
  content: ADFNode[];
}

export interface JiraTransition {
  id: string;
  name: string;
  to: {
    name: string;
    id: string;
  };
}

export interface JiraIssue {
  key: string;
  summary: string;
  description?: string | ADFDocument;
  status: string;
  assignee?: string;
  reporter: string;
  priority: string;
  issueType: string;
  project: {
    key: string;
    name: string;
  };
  created: string;
  updated: string;
  comments?: JiraComment[];
}

export interface JiraComment {
  id: string;
  author: string;
  body: string | ADFDocument;
  created: string;
}

export interface JiraProject {
  key: string;
  name: string;
  description?: string;
  projectType: string;
  lead?: string;
  url?: string;
  issueTypes?: JiraIssueType[];
}

export interface JiraIssueType {
  name: string;
  description?: string;
}

export interface CreateIssueRequest {
  projectKey: string;
  summary: string;
  description?: string | ADFDocument;
  issueType?: string;
  priority?: string;
  assignee?: string;
}

export interface UpdateIssueRequest {
  issueKey: string;
  summary?: string;
  description?: string | ADFDocument;
  assignee?: string;
}

export interface SearchIssuesRequest {
  jql: string;
  maxResults?: number;
}