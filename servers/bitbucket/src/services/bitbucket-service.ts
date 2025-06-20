import axios, { AxiosInstance } from "axios";
import {
  BitbucketRepository,
  BitbucketPullRequest,
  BitbucketPRActivity,
  BitbucketCommit,
  BitbucketBranch,
  BitbucketComment,
  BitbucketTask,
  BitbucketDefaultReviewer,
  CreatePullRequestData,
  UpdatePullRequestData,
  MergePullRequestData,
} from "../types/index.js";

export class BitbucketService {
  private client: AxiosInstance;
  private workspace: string;

  constructor(workspace: string, username: string, appPassword: string) {
    this.workspace = workspace;
    this.client = axios.create({
      baseURL: "https://api.bitbucket.org/2.0",
      auth: {
        username,
        password: appPassword,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  // Repository methods
  async getRepositories(params: {
    page?: number;
    pagelen?: number;
    q?: string;
  }) {
    const response = await this.client.get(`/repositories/${this.workspace}`, {
      params,
    });
    return response.data;
  }

  async getRepository(repoSlug: string) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}`
    );
    return response.data;
  }

  // Pull Request methods
  async getPullRequests(
    repoSlug: string,
    params: {
      state?: string;
      page?: number;
      pagelen?: number;
    }
  ) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests`,
      { params }
    );
    return response.data;
  }

  async getPullRequest(repoSlug: string, pullRequestId: number) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}`
    );
    return response.data;
  }

  async createPullRequest(repoSlug: string, data: CreatePullRequestData) {
    const response = await this.client.post(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests`,
      data
    );
    return response.data;
  }

  async updatePullRequest(
    repoSlug: string,
    pullRequestId: number,
    data: UpdatePullRequestData
  ) {
    const response = await this.client.put(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}`,
      data
    );
    return response.data;
  }

  async mergePullRequest(
    repoSlug: string,
    pullRequestId: number,
    data: MergePullRequestData
  ) {
    const response = await this.client.post(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/merge`,
      data
    );
    return response.data;
  }

  async declinePullRequest(repoSlug: string, pullRequestId: number) {
    const response = await this.client.post(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/decline`
    );
    return response.data;
  }

  async getPullRequestActivity(
    repoSlug: string,
    pullRequestId: number,
    params: { page?: number; pagelen?: number }
  ) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/activity`,
      { params }
    );
    return response.data;
  }

  async getPullRequestDiff(repoSlug: string, pullRequestId: number) {
    // First get the pull request to extract commit hashes
    const prResponse = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}`
    );

    const pr = prResponse.data;
    const sourceCommit = pr.source.commit.hash;
    const destinationCommit = pr.destination.commit.hash;

    // Use the diff endpoint with commit hashes
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/diff/${sourceCommit}..${destinationCommit}`,
      {
        headers: {
          Accept: "text/plain",
        },
      }
    );
    return response.data;
  }

  async getPullRequestDiffStat(repoSlug: string, pullRequestId: number) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/diffstat`
    );
    return response.data;
  }

  async getPullRequestCommits(
    repoSlug: string,
    pullRequestId: number,
    params: { page?: number; pagelen?: number }
  ) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/commits`,
      { params }
    );
    return response.data;
  }

  // Pull Request Comments
  async getPullRequestComments(
    repoSlug: string,
    pullRequestId: number,
    params: { page?: number; pagelen?: number }
  ) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/comments`,
      { params }
    );
    return response.data;
  }

  async createPullRequestComment(
    repoSlug: string,
    pullRequestId: number,
    content: string
  ) {
    const commentData = {
      content: {
        raw: content,
      },
    };

    const response = await this.client.post(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/comments`,
      commentData
    );
    return response.data;
  }

  async getPullRequestComment(
    repoSlug: string,
    pullRequestId: number,
    commentId: number
  ) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/comments/${commentId}`
    );
    return response.data;
  }

  async updatePullRequestComment(
    repoSlug: string,
    pullRequestId: number,
    commentId: number,
    content: string
  ) {
    const commentData = {
      content: {
        raw: content,
      },
    };

    const response = await this.client.put(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/comments/${commentId}`,
      commentData
    );
    return response.data;
  }

  async deletePullRequestComment(
    repoSlug: string,
    pullRequestId: number,
    commentId: number
  ) {
    await this.client.delete(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/comments/${commentId}`
    );
  }

  // Pull Request Approvals
  async approvePullRequest(repoSlug: string, pullRequestId: number) {
    const response = await this.client.post(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/approve`
    );
    return response.data;
  }

  async unapprovePullRequest(repoSlug: string, pullRequestId: number) {
    await this.client.delete(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/approve`
    );
  }

  async requestChanges(repoSlug: string, pullRequestId: number) {
    const response = await this.client.post(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/request-changes`
    );
    return response.data;
  }

  async removeChangeRequest(repoSlug: string, pullRequestId: number) {
    await this.client.delete(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/request-changes`
    );
  }

  // Pull Request Tasks
  async getPullRequestTasks(
    repoSlug: string,
    pullRequestId: number,
    params: { page?: number; pagelen?: number }
  ) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/tasks`,
      { params }
    );
    return response.data;
  }

  async createPullRequestTask(
    repoSlug: string,
    pullRequestId: number,
    content: string,
    commentId?: number
  ) {
    const taskData: any = {
      content: {
        raw: content,
      },
    };

    if (commentId) {
      taskData.comment = { id: commentId };
    }

    const response = await this.client.post(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/tasks`,
      taskData
    );
    return response.data;
  }

  async getPullRequestTask(
    repoSlug: string,
    pullRequestId: number,
    taskId: number
  ) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/tasks/${taskId}`
    );
    return response.data;
  }

  async updatePullRequestTask(
    repoSlug: string,
    pullRequestId: number,
    taskId: number,
    data: { content?: string; state?: "UNRESOLVED" | "RESOLVED" }
  ) {
    const taskData: any = {};
    if (data.content) {
      taskData.content = { raw: data.content };
    }
    if (data.state) {
      taskData.state = data.state;
    }

    const response = await this.client.put(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/tasks/${taskId}`,
      taskData
    );
    return response.data;
  }

  async deletePullRequestTask(
    repoSlug: string,
    pullRequestId: number,
    taskId: number
  ) {
    await this.client.delete(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/tasks/${taskId}`
    );
  }

  // Default Reviewers
  async getDefaultReviewers(repoSlug: string) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/default-reviewers`
    );
    return response.data;
  }

  async getEffectiveDefaultReviewers(repoSlug: string) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/effective-default-reviewers`
    );
    return response.data;
  }

  async addDefaultReviewer(repoSlug: string, username: string) {
    const response = await this.client.put(
      `/repositories/${this.workspace}/${repoSlug}/default-reviewers/${username}`
    );
    return response.data;
  }

  async removeDefaultReviewer(repoSlug: string, username: string) {
    await this.client.delete(
      `/repositories/${this.workspace}/${repoSlug}/default-reviewers/${username}`
    );
  }

  // Commits
  async getCommits(
    repoSlug: string,
    params: {
      branch?: string;
      page?: number;
      pagelen?: number;
    }
  ) {
    let url = `/repositories/${this.workspace}/${repoSlug}/commits`;
    if (params.branch) {
      url += `/${params.branch}`;
    }

    const response = await this.client.get(url, {
      params: { page: params.page, pagelen: params.pagelen },
    });
    return response.data;
  }

  async getCommit(repoSlug: string, commitHash: string) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/commit/${commitHash}`
    );
    return response.data;
  }

  // Branches
  async getBranches(
    repoSlug: string,
    params: { page?: number; pagelen?: number }
  ) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/refs/branches`,
      { params }
    );
    return response.data;
  }

  // Pull requests containing a commit
  async getPullRequestsForCommit(
    repoSlug: string,
    commitHash: string,
    params: { page?: number; pagelen?: number }
  ) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/commit/${commitHash}/pullrequests`,
      { params }
    );
    return response.data;
  }

  // Pull Request Statuses
  async getPullRequestStatuses(
    repoSlug: string,
    pullRequestId: number,
    params: { page?: number; pagelen?: number }
  ) {
    const response = await this.client.get(
      `/repositories/${this.workspace}/${repoSlug}/pullrequests/${pullRequestId}/statuses`,
      { params }
    );
    return response.data;
  }
}
