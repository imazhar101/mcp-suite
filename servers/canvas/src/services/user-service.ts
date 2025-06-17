import { AxiosInstance } from "axios";
import {
  User,
  Profile,
  Avatar,
  PageView,
  CourseNickname,
  UserSettings,
  CustomColors,
  DashboardPositions,
  AccountUserListParams,
  UserCreateParams,
  UserUpdateParams,
  MissingSubmissionsParams,
  PageViewParams,
  ActivityStreamParams,
  TodoItemsParams,
  CustomDataParams,
} from "../types/user.js";

export class UserService {
  constructor(private canvasClient: AxiosInstance) {}

  /**
   * List users in an account
   */
  async listAccountUsers(params: AccountUserListParams): Promise<User[]> {
    const { account_id, ...queryParams } = params;

    const response = await this.canvasClient.get(
      `/accounts/${account_id}/users`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  /**
   * Show user details
   */
  async getUser(
    userId: string,
    include?: Array<"uuid" | "last_login">
  ): Promise<User> {
    const params: any = {};
    if (include) {
      params["include[]"] = include;
    }

    const response = await this.canvasClient.get(`/users/${userId}`, {
      params,
    });
    return response.data;
  }

  /**
   * Create a user
   */
  async createUser(params: UserCreateParams): Promise<User> {
    const { account_id, ...userData } = params;

    const response = await this.canvasClient.post(
      `/accounts/${account_id}/users`,
      userData
    );
    return response.data;
  }

  /**
   * Edit a user
   */
  async updateUser(params: UserUpdateParams): Promise<User> {
    const { user_id, ...userData } = params;

    const response = await this.canvasClient.put(`/users/${user_id}`, userData);
    return response.data;
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<Profile> {
    const response = await this.canvasClient.get(`/users/${userId}/profile`);
    return response.data;
  }

  /**
   * List avatar options
   */
  async listAvatarOptions(userId: string): Promise<Avatar[]> {
    const response = await this.canvasClient.get(`/users/${userId}/avatars`);
    return response.data;
  }

  /**
   * List user page views
   */
  async listPageViews(params: PageViewParams): Promise<PageView[]> {
    const { user_id, ...queryParams } = params;

    const response = await this.canvasClient.get(
      `/users/${user_id}/page_views`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  /**
   * List the activity stream
   */
  async getActivityStream(params: ActivityStreamParams = {}): Promise<any[]> {
    const response = await this.canvasClient.get(
      "/users/self/activity_stream",
      {
        params,
      }
    );
    return response.data;
  }

  /**
   * Activity stream summary
   */
  async getActivityStreamSummary(
    params: ActivityStreamParams = {}
  ): Promise<any[]> {
    const response = await this.canvasClient.get(
      "/users/self/activity_stream/summary",
      {
        params,
      }
    );
    return response.data;
  }

  /**
   * List the TODO items
   */
  async getTodoItems(params: TodoItemsParams = {}): Promise<any[]> {
    const queryParams: any = {};
    if (params.include) {
      queryParams["include[]"] = params.include;
    }

    const response = await this.canvasClient.get("/users/self/todo", {
      params: queryParams,
    });
    return response.data;
  }

  /**
   * List counts for todo items
   */
  async getTodoItemCount(params: TodoItemsParams = {}): Promise<any> {
    const queryParams: any = {};
    if (params.include) {
      queryParams["include[]"] = params.include;
    }

    const response = await this.canvasClient.get(
      "/users/self/todo_item_count",
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  /**
   * List upcoming assignments, calendar events
   */
  async getUpcomingEvents(): Promise<any[]> {
    const response = await this.canvasClient.get("/users/self/upcoming_events");
    return response.data;
  }

  /**
   * List Missing Submissions
   */
  async getMissingSubmissions(
    params: MissingSubmissionsParams
  ): Promise<any[]> {
    const { user_id, ...queryParams } = params;

    // Convert array parameters to Canvas API format
    if (queryParams.include) {
      (queryParams as any)["include[]"] = queryParams.include;
      delete queryParams.include;
    }
    if (queryParams.filter) {
      (queryParams as any)["filter[]"] = queryParams.filter;
      delete queryParams.filter;
    }
    if (queryParams.course_ids) {
      (queryParams as any)["course_ids[]"] = queryParams.course_ids;
      delete queryParams.course_ids;
    }

    const response = await this.canvasClient.get(
      `/users/${user_id}/missing_submissions`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  /**
   * Hide a stream item
   */
  async hideStreamItem(streamItemId: string): Promise<{ hidden: boolean }> {
    const response = await this.canvasClient.delete(
      `/users/self/activity_stream/${streamItemId}`
    );
    return response.data;
  }

  /**
   * Hide all stream items
   */
  async hideAllStreamItems(): Promise<{ hidden: boolean }> {
    const response = await this.canvasClient.delete(
      "/users/self/activity_stream"
    );
    return response.data;
  }

  /**
   * Get user settings
   */
  async getUserSettings(userId: string): Promise<UserSettings> {
    const response = await this.canvasClient.get(`/users/${userId}/settings`);
    return response.data;
  }

  /**
   * Update user settings
   */
  async updateUserSettings(
    userId: string,
    settings: Partial<UserSettings>
  ): Promise<UserSettings> {
    const response = await this.canvasClient.put(
      `/users/${userId}/settings`,
      settings
    );
    return response.data;
  }

  /**
   * Get custom colors
   */
  async getCustomColors(userId: string): Promise<CustomColors> {
    const response = await this.canvasClient.get(`/users/${userId}/colors`);
    return response.data;
  }

  /**
   * Get custom color
   */
  async getCustomColor(
    userId: string,
    assetString: string
  ): Promise<{ hexcode: string }> {
    const response = await this.canvasClient.get(
      `/users/${userId}/colors/${assetString}`
    );
    return response.data;
  }

  /**
   * Update custom color
   */
  async updateCustomColor(
    userId: string,
    assetString: string,
    hexcode: string
  ): Promise<{ hexcode: string }> {
    const response = await this.canvasClient.put(
      `/users/${userId}/colors/${assetString}`,
      {
        hexcode,
      }
    );
    return response.data;
  }

  /**
   * Update text editor preference
   */
  async updateTextEditorPreference(
    userId: string,
    preference: "block_editor" | "rce" | ""
  ): Promise<{ text_editor_preference: string }> {
    const response = await this.canvasClient.put(
      `/users/${userId}/text_editor_preference`,
      {
        text_editor_preference: preference,
      }
    );
    return response.data;
  }

  /**
   * Update files UI version preference
   */
  async updateFilesUIVersionPreference(
    userId: string,
    version: "v1" | "v2"
  ): Promise<{ files_ui_version: string }> {
    const response = await this.canvasClient.put(
      `/users/${userId}/files_ui_version_preference`,
      {
        files_ui_version: version,
      }
    );
    return response.data;
  }

  /**
   * Get dashboard positions
   */
  async getDashboardPositions(userId: string): Promise<DashboardPositions> {
    const response = await this.canvasClient.get(
      `/users/${userId}/dashboard_positions`
    );
    return response.data;
  }

  /**
   * Update dashboard positions
   */
  async updateDashboardPositions(
    userId: string,
    positions: Record<string, number>
  ): Promise<DashboardPositions> {
    const requestData: any = {};
    Object.keys(positions).forEach((key) => {
      requestData[`dashboard_positions[${key}]`] = positions[key];
    });

    const response = await this.canvasClient.put(
      `/users/${userId}/dashboard_positions`,
      requestData
    );
    return response.data;
  }

  /**
   * Terminate all user sessions
   */
  async terminateAllSessions(userId: string): Promise<void> {
    await this.canvasClient.delete(`/users/${userId}/sessions`);
  }

  /**
   * Log users out of all mobile apps
   */
  async expireMobileSessions(userId?: string): Promise<void> {
    if (userId) {
      await this.canvasClient.delete(`/users/${userId}/mobile_sessions`);
    } else {
      await this.canvasClient.delete("/users/mobile_sessions");
    }
  }

  /**
   * Merge user into another user
   */
  async mergeUser(
    userId: string,
    destinationUserId: string,
    destinationAccountId?: string
  ): Promise<User> {
    let endpoint = `/users/${userId}/merge_into/${destinationUserId}`;
    if (destinationAccountId) {
      endpoint = `/users/${userId}/merge_into/accounts/${destinationAccountId}/users/${destinationUserId}`;
    }

    const response = await this.canvasClient.put(endpoint);
    return response.data;
  }

  /**
   * Split merged users into separate users
   */
  async splitUser(userId: string): Promise<User[]> {
    const response = await this.canvasClient.post(`/users/${userId}/split`);
    return response.data;
  }

  /**
   * Get a users most recently graded submissions
   */
  async getGradedSubmissions(userId: string): Promise<any[]> {
    const response = await this.canvasClient.get(
      `/users/${userId}/graded_submissions`
    );
    return response.data;
  }

  /**
   * Store custom data
   */
  async storeCustomData(params: CustomDataParams): Promise<{ data: any }> {
    const { user_id, scope = "", ns, data } = params;
    const endpoint = `/users/${user_id}/custom_data${scope ? `/${scope}` : ""}`;

    const response = await this.canvasClient.put(endpoint, { ns, data });
    return response.data;
  }

  /**
   * Load custom data
   */
  async loadCustomData(
    params: Omit<CustomDataParams, "data">
  ): Promise<{ data: any }> {
    const { user_id, scope = "", ns } = params;
    const endpoint = `/users/${user_id}/custom_data${scope ? `/${scope}` : ""}`;

    const response = await this.canvasClient.get(endpoint, { params: { ns } });
    return response.data;
  }

  /**
   * Delete custom data
   */
  async deleteCustomData(
    params: Omit<CustomDataParams, "data">
  ): Promise<{ data: any }> {
    const { user_id, scope = "", ns } = params;
    const endpoint = `/users/${user_id}/custom_data${scope ? `/${scope}` : ""}`;

    const response = await this.canvasClient.delete(endpoint, {
      params: { ns },
    });
    return response.data;
  }

  /**
   * List course nicknames
   */
  async listCourseNicknames(): Promise<CourseNickname[]> {
    const response = await this.canvasClient.get(
      "/users/self/course_nicknames"
    );
    return response.data;
  }

  /**
   * Get course nickname
   */
  async getCourseNickname(courseId: string): Promise<CourseNickname> {
    const response = await this.canvasClient.get(
      `/users/self/course_nicknames/${courseId}`
    );
    return response.data;
  }

  /**
   * Set course nickname
   */
  async setCourseNickname(
    courseId: string,
    nickname: string
  ): Promise<CourseNickname> {
    const response = await this.canvasClient.put(
      `/users/self/course_nicknames/${courseId}`,
      {
        nickname,
      }
    );
    return response.data;
  }

  /**
   * Remove course nickname
   */
  async removeCourseNickname(courseId: string): Promise<CourseNickname> {
    const response = await this.canvasClient.delete(
      `/users/self/course_nicknames/${courseId}`
    );
    return response.data;
  }

  /**
   * Clear course nicknames
   */
  async clearCourseNicknames(): Promise<void> {
    await this.canvasClient.delete("/users/self/course_nicknames");
  }

  /**
   * Upload a file to user's personal files
   */
  async uploadFile(userId: string, fileData: any): Promise<any> {
    const response = await this.canvasClient.post(
      `/users/${userId}/files`,
      fileData
    );
    return response.data;
  }

  /**
   * Get Pandata Events token (mobile apps only)
   */
  async getPandataEventsToken(appKey: string): Promise<{
    url: string;
    auth_token: string;
    props_token: string;
    expires_at: number;
  }> {
    const response = await this.canvasClient.post(
      "/users/self/pandata_events_token",
      {
        app_key: appKey,
      }
    );
    return response.data;
  }
}
