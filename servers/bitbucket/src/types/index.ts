export interface BitbucketRepository {
  uuid: string;
  name: string;
  full_name: string;
  description?: string;
  is_private: boolean;
  language?: string;
  created_on: string;
  updated_on: string;
  size: number;
  owner: {
    display_name: string;
    uuid: string;
  };
}

export interface BitbucketPullRequest {
  id: number;
  title: string;
  description?: string;
  state: "OPEN" | "MERGED" | "DECLINED" | "SUPERSEDED";
  author: {
    display_name: string;
    uuid: string;
  };
  source: {
    branch: {
      name: string;
    };
    repository: {
      name: string;
      full_name: string;
    };
    commit?: {
      hash: string;
    };
  };
  destination: {
    branch: {
      name: string;
    };
    repository: {
      name: string;
      full_name: string;
    };
    commit?: {
      hash: string;
    };
  };
  created_on: string;
  updated_on: string;
  reviewers?: Array<{
    display_name: string;
    uuid: string;
  }>;
  participants?: Array<{
    user: {
      display_name: string;
      uuid: string;
    };
    role: string;
    approved: boolean;
  }>;
  comment_count?: number;
  task_count?: number;
  draft?: boolean;
  close_source_branch?: boolean;
}

export interface BitbucketPRActivity {
  comment?: {
    id: number;
    content: {
      raw: string;
      markup?: string;
      html?: string;
    };
    user: {
      display_name: string;
      uuid: string;
    };
    created_on: string;
    updated_on: string;
    inline?: {
      from: number;
      to: number;
      path: string;
    };
  };
  approval?: {
    user: {
      display_name: string;
      uuid: string;
    };
    date: string;
  };
  update?: {
    description: string;
    date: string;
    author: {
      display_name: string;
      uuid: string;
    };
    state: string;
  };
}

export interface BitbucketCommit {
  hash: string;
  message: string;
  author: {
    user?: {
      display_name: string;
      uuid: string;
    };
    raw: string;
  };
  date: string;
  parents?: Array<{
    hash: string;
  }>;
}

export interface BitbucketBranch {
  name: string;
  target: {
    hash: string;
    message: string;
    author: {
      user?: {
        display_name: string;
        uuid: string;
      };
      raw: string;
    };
    date: string;
  };
}

export interface BitbucketComment {
  id: number;
  content: {
    raw: string;
    markup?: string;
    html?: string;
  };
  user: {
    display_name: string;
    uuid: string;
  };
  created_on: string;
  updated_on: string;
  inline?: {
    from: number;
    to: number;
    path: string;
  };
  deleted?: boolean;
  pending?: boolean;
}

export interface BitbucketTask {
  id: number;
  content: {
    raw: string;
    markup?: string;
    html?: string;
  };
  state: "UNRESOLVED" | "RESOLVED";
  creator: {
    display_name: string;
    uuid: string;
  };
  created_on: string;
  updated_on: string;
  resolved_on?: string;
  resolved_by?: {
    display_name: string;
    uuid: string;
  };
  comment?: {
    id: number;
  };
}

export interface BitbucketDefaultReviewer {
  user: {
    display_name: string;
    uuid: string;
  };
  reviewer_type: "repository" | "project";
  type: "default_reviewer";
}

export interface CreatePullRequestData {
  title: string;
  description?: string;
  source: {
    branch: {
      name: string;
    };
    repository?: {
      full_name: string;
    };
  };
  destination?: {
    branch: {
      name: string;
    };
    repository?: {
      full_name: string;
    };
  };
  reviewers?: Array<{
    uuid: string;
  }>;
  close_source_branch?: boolean;
  draft?: boolean;
}

export interface UpdatePullRequestData {
  title?: string;
  description?: string;
  reviewers?: Array<{
    uuid: string;
  }>;
  close_source_branch?: boolean;
  draft?: boolean;
}

export interface MergePullRequestData {
  type: string;
  message?: string;
  close_source_branch?: boolean;
  merge_strategy?: "merge_commit" | "squash" | "fast_forward";
}
