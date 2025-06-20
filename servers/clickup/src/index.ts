#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosInstance } from "axios";

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;

if (!CLICKUP_API_TOKEN) {
  throw new Error("CLICKUP_API_TOKEN environment variable is required");
}

class ClickUpServer {
  private server: Server;
  private api: AxiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: "clickup-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.api = axios.create({
      baseURL: "https://api.clickup.com/api/v2",
      headers: {
        Authorization: CLICKUP_API_TOKEN,
        "Content-Type": "application/json",
      },
    });

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error: any) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // Task operations
        {
          name: "get_tasks",
          description: "Get tasks from a list, folder, or space",
          inputSchema: {
            type: "object",
            properties: {
              list_id: {
                type: "string",
                description: "List ID to get tasks from",
              },
              folder_id: {
                type: "string",
                description: "Folder ID to get tasks from",
              },
              space_id: {
                type: "string",
                description: "Space ID to get tasks from",
              },
              archived: {
                type: "boolean",
                description: "Include archived tasks",
                default: false,
              },
              page: {
                type: "number",
                description: "Page number for pagination",
                default: 0,
              },
              order_by: {
                type: "string",
                description: "Order tasks by field",
                enum: ["id", "created", "updated", "due_date"],
                default: "created",
              },
              reverse: {
                type: "boolean",
                description: "Reverse the order",
                default: false,
              },
              subtasks: {
                type: "boolean",
                description: "Include subtasks",
                default: false,
              },
              statuses: {
                type: "array",
                items: { type: "string" },
                description: "Filter by status names",
              },
              include_closed: {
                type: "boolean",
                description: "Include closed tasks",
                default: false,
              },
              assignees: {
                type: "array",
                items: { type: "string" },
                description: "Filter by assignee user IDs",
              },
            },
          },
        },
        {
          name: "get_task",
          description: "Get a specific task by ID",
          inputSchema: {
            type: "object",
            properties: {
              task_id: {
                type: "string",
                description: "Task ID",
              },
              custom_task_ids: {
                type: "boolean",
                description: "Use custom task IDs",
                default: false,
              },
              team_id: {
                type: "string",
                description: "Team ID (required when using custom task IDs)",
              },
              include_subtasks: {
                type: "boolean",
                description: "Include subtasks",
                default: false,
              },
            },
            required: ["task_id"],
          },
        },
        {
          name: "create_task",
          description: "Create a new task",
          inputSchema: {
            type: "object",
            properties: {
              list_id: {
                type: "string",
                description: "List ID where the task will be created",
              },
              name: {
                type: "string",
                description: "Task name",
              },
              description: {
                type: "string",
                description: "Task description",
              },
              assignees: {
                type: "array",
                items: { type: "string" },
                description: "Array of assignee user IDs",
              },
              tags: {
                type: "array",
                items: { type: "string" },
                description: "Array of tag names",
              },
              status: {
                type: "string",
                description: "Task status",
              },
              priority: {
                type: "number",
                description: "Priority (1=urgent, 2=high, 3=normal, 4=low)",
                enum: [1, 2, 3, 4],
              },
              due_date: {
                type: "string",
                description: "Due date (Unix timestamp in milliseconds)",
              },
              due_date_time: {
                type: "boolean",
                description: "Include time in due date",
                default: false,
              },
              time_estimate: {
                type: "number",
                description: "Time estimate in milliseconds",
              },
              start_date: {
                type: "string",
                description: "Start date (Unix timestamp in milliseconds)",
              },
              start_date_time: {
                type: "boolean",
                description: "Include time in start date",
                default: false,
              },
              notify_all: {
                type: "boolean",
                description: "Notify all assignees",
                default: true,
              },
              parent: {
                type: "string",
                description: "Parent task ID (for subtasks)",
              },
            },
            required: ["list_id", "name"],
          },
        },
        {
          name: "update_task",
          description: "Update an existing task",
          inputSchema: {
            type: "object",
            properties: {
              task_id: {
                type: "string",
                description: "Task ID",
              },
              name: {
                type: "string",
                description: "Task name",
              },
              description: {
                type: "string",
                description: "Task description",
              },
              status: {
                type: "string",
                description: "Task status",
              },
              priority: {
                type: "number",
                description: "Priority (1=urgent, 2=high, 3=normal, 4=low)",
                enum: [1, 2, 3, 4],
              },
              due_date: {
                type: "string",
                description: "Due date (Unix timestamp in milliseconds)",
              },
              due_date_time: {
                type: "boolean",
                description: "Include time in due date",
                default: false,
              },
              assignees: {
                type: "object",
                properties: {
                  add: {
                    type: "array",
                    items: { type: "string" },
                    description: "User IDs to add as assignees",
                  },
                  rem: {
                    type: "array",
                    items: { type: "string" },
                    description: "User IDs to remove as assignees",
                  },
                },
              },
              archived: {
                type: "boolean",
                description: "Archive the task",
              },
            },
            required: ["task_id"],
          },
        },
        {
          name: "delete_task",
          description: "Delete a task",
          inputSchema: {
            type: "object",
            properties: {
              task_id: {
                type: "string",
                description: "Task ID",
              },
            },
            required: ["task_id"],
          },
        },
        // Comments
        {
          name: "get_task_comments",
          description: "Get comments for a task",
          inputSchema: {
            type: "object",
            properties: {
              task_id: {
                type: "string",
                description: "Task ID",
              },
            },
            required: ["task_id"],
          },
        },
        {
          name: "create_task_comment",
          description: "Create a comment on a task",
          inputSchema: {
            type: "object",
            properties: {
              task_id: {
                type: "string",
                description: "Task ID",
              },
              comment_text: {
                type: "string",
                description: "Comment text",
              },
              notify_all: {
                type: "boolean",
                description: "Notify all task assignees",
                default: true,
              },
            },
            required: ["task_id", "comment_text"],
          },
        },
        // Lists
        {
          name: "get_lists",
          description: "Get lists in a folder",
          inputSchema: {
            type: "object",
            properties: {
              folder_id: {
                type: "string",
                description: "Folder ID",
              },
              archived: {
                type: "boolean",
                description: "Include archived lists",
                default: false,
              },
            },
            required: ["folder_id"],
          },
        },
        {
          name: "get_folderless_lists",
          description: "Get folderless lists in a space",
          inputSchema: {
            type: "object",
            properties: {
              space_id: {
                type: "string",
                description: "Space ID",
              },
              archived: {
                type: "boolean",
                description: "Include archived lists",
                default: false,
              },
            },
            required: ["space_id"],
          },
        },
        {
          name: "create_list",
          description: "Create a new list",
          inputSchema: {
            type: "object",
            properties: {
              folder_id: {
                type: "string",
                description: "Folder ID",
              },
              name: {
                type: "string",
                description: "List name",
              },
              content: {
                type: "string",
                description: "List description",
              },
            },
            required: ["folder_id", "name"],
          },
        },
        {
          name: "create_folderless_list",
          description: "Create a folderless list in a space",
          inputSchema: {
            type: "object",
            properties: {
              space_id: {
                type: "string",
                description: "Space ID",
              },
              name: {
                type: "string",
                description: "List name",
              },
              content: {
                type: "string",
                description: "List description",
              },
            },
            required: ["space_id", "name"],
          },
        },
        {
          name: "update_list",
          description: "Update a list",
          inputSchema: {
            type: "object",
            properties: {
              list_id: {
                type: "string",
                description: "List ID",
              },
              name: {
                type: "string",
                description: "List name",
              },
              content: {
                type: "string",
                description: "List description",
              },
            },
            required: ["list_id"],
          },
        },
        {
          name: "delete_list",
          description: "Delete a list",
          inputSchema: {
            type: "object",
            properties: {
              list_id: {
                type: "string",
                description: "List ID",
              },
            },
            required: ["list_id"],
          },
        },
        // Folders
        {
          name: "get_folders",
          description: "Get folders in a space",
          inputSchema: {
            type: "object",
            properties: {
              space_id: {
                type: "string",
                description: "Space ID",
              },
              archived: {
                type: "boolean",
                description: "Include archived folders",
                default: false,
              },
            },
            required: ["space_id"],
          },
        },
        {
          name: "create_folder",
          description: "Create a new folder",
          inputSchema: {
            type: "object",
            properties: {
              space_id: {
                type: "string",
                description: "Space ID",
              },
              name: {
                type: "string",
                description: "Folder name",
              },
            },
            required: ["space_id", "name"],
          },
        },
        {
          name: "update_folder",
          description: "Update a folder",
          inputSchema: {
            type: "object",
            properties: {
              folder_id: {
                type: "string",
                description: "Folder ID",
              },
              name: {
                type: "string",
                description: "Folder name",
              },
            },
            required: ["folder_id", "name"],
          },
        },
        {
          name: "delete_folder",
          description: "Delete a folder",
          inputSchema: {
            type: "object",
            properties: {
              folder_id: {
                type: "string",
                description: "Folder ID",
              },
            },
            required: ["folder_id"],
          },
        },
        // Spaces
        {
          name: "get_spaces",
          description: "Get spaces in a team",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "Team ID",
              },
              archived: {
                type: "boolean",
                description: "Include archived spaces",
                default: false,
              },
            },
            required: ["team_id"],
          },
        },
        {
          name: "get_space",
          description: "Get a specific space",
          inputSchema: {
            type: "object",
            properties: {
              space_id: {
                type: "string",
                description: "Space ID",
              },
            },
            required: ["space_id"],
          },
        },
        {
          name: "create_space",
          description: "Create a new space",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "Team ID",
              },
              name: {
                type: "string",
                description: "Space name",
              },
              multiple_assignees: {
                type: "boolean",
                description: "Allow multiple assignees",
                default: true,
              },
            },
            required: ["team_id", "name"],
          },
        },
        {
          name: "update_space",
          description: "Update a space",
          inputSchema: {
            type: "object",
            properties: {
              space_id: {
                type: "string",
                description: "Space ID",
              },
              name: {
                type: "string",
                description: "Space name",
              },
              color: {
                type: "string",
                description: "Space color",
              },
              private: {
                type: "boolean",
                description: "Make space private",
              },
              multiple_assignees: {
                type: "boolean",
                description: "Allow multiple assignees",
              },
            },
            required: ["space_id"],
          },
        },
        {
          name: "delete_space",
          description: "Delete a space",
          inputSchema: {
            type: "object",
            properties: {
              space_id: {
                type: "string",
                description: "Space ID",
              },
            },
            required: ["space_id"],
          },
        },
        // Teams
        {
          name: "get_teams",
          description: "Get authorized teams for the user",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        // Users
        {
          name: "get_team_members",
          description: "Get members of a team",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "Team ID",
              },
            },
            required: ["team_id"],
          },
        },
        {
          name: "get_user",
          description: "Get user information",
          inputSchema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                description: "User ID",
              },
            },
            required: ["user_id"],
          },
        },
        // Time tracking
        {
          name: "get_time_entries",
          description: "Get time entries for a team",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "Team ID",
              },
              start_date: {
                type: "string",
                description: "Start date (Unix timestamp in milliseconds)",
              },
              end_date: {
                type: "string",
                description: "End date (Unix timestamp in milliseconds)",
              },
              assignee: {
                type: "string",
                description: "Filter by assignee user ID",
              },
            },
            required: ["team_id"],
          },
        },
        {
          name: "create_time_entry",
          description: "Create a time entry",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "Team ID",
              },
              description: {
                type: "string",
                description: "Time entry description",
              },
              start: {
                type: "string",
                description: "Start time (Unix timestamp in milliseconds)",
              },
              duration: {
                type: "number",
                description: "Duration in milliseconds",
              },
              assignee: {
                type: "string",
                description: "Assignee user ID",
              },
              tid: {
                type: "string",
                description: "Task ID",
              },
            },
            required: ["team_id", "start", "duration"],
          },
        },
        // Goals
        {
          name: "get_goals",
          description: "Get goals for a team",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "Team ID",
              },
              include_completed: {
                type: "boolean",
                description: "Include completed goals",
                default: false,
              },
            },
            required: ["team_id"],
          },
        },
        {
          name: "create_goal",
          description: "Create a new goal",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "Team ID",
              },
              name: {
                type: "string",
                description: "Goal name",
              },
              due_date: {
                type: "string",
                description: "Due date (Unix timestamp in milliseconds)",
              },
              description: {
                type: "string",
                description: "Goal description",
              },
              owners: {
                type: "array",
                items: { type: "string" },
                description: "Array of owner user IDs",
              },
              color: {
                type: "string",
                description: "Goal color",
              },
            },
            required: ["team_id", "name"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        // Task operations
        case "get_tasks":
          return this.getTasks(request.params.arguments);
        case "get_task":
          return this.getTask(request.params.arguments);
        case "create_task":
          return this.createTask(request.params.arguments);
        case "update_task":
          return this.updateTask(request.params.arguments);
        case "delete_task":
          return this.deleteTask(request.params.arguments);

        // Comments
        case "get_task_comments":
          return this.getTaskComments(request.params.arguments);
        case "create_task_comment":
          return this.createTaskComment(request.params.arguments);

        // Lists
        case "get_lists":
          return this.getLists(request.params.arguments);
        case "get_folderless_lists":
          return this.getFolderlessLists(request.params.arguments);
        case "create_list":
          return this.createList(request.params.arguments);
        case "create_folderless_list":
          return this.createFolderlessList(request.params.arguments);
        case "update_list":
          return this.updateList(request.params.arguments);
        case "delete_list":
          return this.deleteList(request.params.arguments);

        // Folders
        case "get_folders":
          return this.getFolders(request.params.arguments);
        case "create_folder":
          return this.createFolder(request.params.arguments);
        case "update_folder":
          return this.updateFolder(request.params.arguments);
        case "delete_folder":
          return this.deleteFolder(request.params.arguments);

        // Spaces
        case "get_spaces":
          return this.getSpaces(request.params.arguments);
        case "get_space":
          return this.getSpace(request.params.arguments);
        case "create_space":
          return this.createSpace(request.params.arguments);
        case "update_space":
          return this.updateSpace(request.params.arguments);
        case "delete_space":
          return this.deleteSpace(request.params.arguments);

        // Teams
        case "get_teams":
          return this.getTeams(request.params.arguments);

        // Users
        case "get_team_members":
          return this.getTeamMembers(request.params.arguments);
        case "get_user":
          return this.getUser(request.params.arguments);

        // Time tracking
        case "get_time_entries":
          return this.getTimeEntries(request.params.arguments);
        case "create_time_entry":
          return this.createTimeEntry(request.params.arguments);

        // Goals
        case "get_goals":
          return this.getGoals(request.params.arguments);
        case "create_goal":
          return this.createGoal(request.params.arguments);

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  // Task operations
  private async getTasks(args: any) {
    try {
      let endpoint = "";
      const params: any = {};

      if (args.list_id) {
        endpoint = `/list/${args.list_id}/task`;
      } else if (args.folder_id) {
        endpoint = `/folder/${args.folder_id}/task`;
      } else if (args.space_id) {
        endpoint = `/space/${args.space_id}/task`;
      } else {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Either list_id, folder_id, or space_id is required"
        );
      }

      // Add query parameters
      if (args.archived !== undefined) params.archived = args.archived;
      if (args.page !== undefined) params.page = args.page;
      if (args.order_by) params.order_by = args.order_by;
      if (args.reverse !== undefined) params.reverse = args.reverse;
      if (args.subtasks !== undefined) params.subtasks = args.subtasks;
      if (args.statuses) params.statuses = args.statuses;
      if (args.include_closed !== undefined)
        params.include_closed = args.include_closed;
      if (args.assignees) params.assignees = args.assignees;

      const response = await this.api.get(endpoint, { params });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async getTask(args: any) {
    if (!args || !args.task_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "task_id is required for getting a task"
      );
    }

    try {
      const params: any = {};
      if (args.custom_task_ids) params.custom_task_ids = args.custom_task_ids;
      if (args.team_id) params.team_id = args.team_id;
      if (args.include_subtasks)
        params.include_subtasks = args.include_subtasks;

      const response = await this.api.get(`/task/${args.task_id}`, { params });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createTask(args: any) {
    if (!args || !args.list_id || !args.name) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "list_id and name are required for creating a task"
      );
    }

    try {
      const taskData: any = {
        name: args.name,
      };

      if (args.description) taskData.description = args.description;
      if (args.assignees) taskData.assignees = args.assignees;
      if (args.tags) taskData.tags = args.tags;
      if (args.status) taskData.status = args.status;
      if (args.priority) taskData.priority = args.priority;
      if (args.due_date) taskData.due_date = args.due_date;
      if (args.due_date_time !== undefined)
        taskData.due_date_time = args.due_date_time;
      if (args.time_estimate) taskData.time_estimate = args.time_estimate;
      if (args.start_date) taskData.start_date = args.start_date;
      if (args.start_date_time !== undefined)
        taskData.start_date_time = args.start_date_time;
      if (args.notify_all !== undefined) taskData.notify_all = args.notify_all;
      if (args.parent) taskData.parent = args.parent;

      const response = await this.api.post(
        `/list/${args.list_id}/task`,
        taskData
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateTask(args: any) {
    if (!args || !args.task_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "task_id is required for updating a task"
      );
    }

    try {
      const taskData: any = {};

      if (args.name) taskData.name = args.name;
      if (args.description) taskData.description = args.description;
      if (args.status) taskData.status = args.status;
      if (args.priority) taskData.priority = args.priority;
      if (args.due_date) taskData.due_date = args.due_date;
      if (args.due_date_time !== undefined)
        taskData.due_date_time = args.due_date_time;
      if (args.assignees) taskData.assignees = args.assignees;
      if (args.archived !== undefined) taskData.archived = args.archived;

      const response = await this.api.put(`/task/${args.task_id}`, taskData);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteTask(args: any) {
    if (!args || !args.task_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "task_id is required for deleting a task"
      );
    }

    try {
      const response = await this.api.delete(`/task/${args.task_id}`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async getTaskComments(args: any) {
    if (!args || !args.task_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "task_id is required for getting task comments"
      );
    }

    try {
      const response = await this.api.get(`/task/${args.task_id}/comment`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createTaskComment(args: any) {
    if (!args || !args.task_id || !args.comment_text) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "task_id and comment_text are required for creating a task comment"
      );
    }

    try {
      const commentData: any = {
        comment_text: args.comment_text,
      };

      if (args.notify_all !== undefined)
        commentData.notify_all = args.notify_all;

      const response = await this.api.post(
        `/task/${args.task_id}/comment`,
        commentData
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async getLists(args: any) {
    if (!args || !args.folder_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "folder_id is required for getting lists"
      );
    }

    try {
      const params: any = {};
      if (args.archived !== undefined) params.archived = args.archived;

      const response = await this.api.get(`/folder/${args.folder_id}/list`, {
        params,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async getFolderlessLists(args: any) {
    if (!args || !args.space_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "space_id is required for getting folderless lists"
      );
    }

    try {
      const params: any = {};
      if (args.archived !== undefined) params.archived = args.archived;

      const response = await this.api.get(`/space/${args.space_id}/list`, {
        params,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createList(args: any) {
    if (!args || !args.folder_id || !args.name) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "folder_id and name are required for creating a list"
      );
    }

    try {
      const listData: any = {
        name: args.name,
      };

      if (args.content) listData.content = args.content;

      const response = await this.api.post(
        `/folder/${args.folder_id}/list`,
        listData
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createFolderlessList(args: any) {
    if (!args || !args.space_id || !args.name) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "space_id and name are required for creating a folderless list"
      );
    }

    try {
      const listData: any = {
        name: args.name,
      };

      if (args.content) listData.content = args.content;

      const response = await this.api.post(
        `/space/${args.space_id}/list`,
        listData
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateList(args: any) {
    if (!args || !args.list_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "list_id is required for updating a list"
      );
    }

    try {
      const listData: any = {};

      if (args.name) listData.name = args.name;
      if (args.content) listData.content = args.content;

      const response = await this.api.put(`/list/${args.list_id}`, listData);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteList(args: any) {
    if (!args || !args.list_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "list_id is required for deleting a list"
      );
    }

    try {
      const response = await this.api.delete(`/list/${args.list_id}`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Folder operations
  private async getFolders(args: any) {
    if (!args || !args.space_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "space_id is required for getting folders"
      );
    }

    try {
      const params: any = {};
      if (args.archived !== undefined) params.archived = args.archived;

      const response = await this.api.get(`/space/${args.space_id}/folder`, {
        params,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createFolder(args: any) {
    if (!args || !args.space_id || !args.name) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "space_id and name are required for creating a folder"
      );
    }

    try {
      const folderData = {
        name: args.name,
      };

      const response = await this.api.post(
        `/space/${args.space_id}/folder`,
        folderData
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateFolder(args: any) {
    if (!args || !args.folder_id || !args.name) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "folder_id and name are required for updating a folder"
      );
    }

    try {
      const folderData = {
        name: args.name,
      };

      const response = await this.api.put(
        `/folder/${args.folder_id}`,
        folderData
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteFolder(args: any) {
    if (!args || !args.folder_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "folder_id is required for deleting a folder"
      );
    }

    try {
      const response = await this.api.delete(`/folder/${args.folder_id}`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Space operations
  private async getSpaces(args: any) {
    if (!args || !args.team_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "team_id is required for getting spaces"
      );
    }

    try {
      const params: any = {};
      if (args.archived !== undefined) params.archived = args.archived;

      const response = await this.api.get(`/team/${args.team_id}/space`, {
        params,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async getSpace(args: any) {
    if (!args || !args.space_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "space_id is required for getting a space"
      );
    }

    try {
      const response = await this.api.get(`/space/${args.space_id}`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createSpace(args: any) {
    if (!args || !args.team_id || !args.name) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "team_id and name are required for creating a space"
      );
    }

    try {
      const spaceData: any = {
        name: args.name,
      };

      if (args.multiple_assignees !== undefined) {
        spaceData.multiple_assignees = args.multiple_assignees;
      }

      const response = await this.api.post(
        `/team/${args.team_id}/space`,
        spaceData
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateSpace(args: any) {
    if (!args || !args.space_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "space_id is required for updating a space"
      );
    }

    try {
      const spaceData: any = {};

      if (args.name) spaceData.name = args.name;
      if (args.color) spaceData.color = args.color;
      if (args.private !== undefined) spaceData.private = args.private;
      if (args.multiple_assignees !== undefined) {
        spaceData.multiple_assignees = args.multiple_assignees;
      }

      const response = await this.api.put(`/space/${args.space_id}`, spaceData);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteSpace(args: any) {
    if (!args || !args.space_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "space_id is required for deleting a space"
      );
    }

    try {
      const response = await this.api.delete(`/space/${args.space_id}`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Team operations
  private async getTeams(args: any) {
    try {
      const response = await this.api.get("/team");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // User operations
  private async getTeamMembers(args: any) {
    if (!args || !args.team_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "team_id is required for getting team members"
      );
    }

    try {
      const response = await this.api.get(`/team/${args.team_id}/member`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async getUser(args: any) {
    if (!args || !args.user_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "user_id is required for getting user info"
      );
    }

    try {
      const response = await this.api.get(`/user/${args.user_id}`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Time tracking operations
  private async getTimeEntries(args: any) {
    if (!args || !args.team_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "team_id is required for getting time entries"
      );
    }

    try {
      const params: any = {};
      if (args.start_date) params.start_date = args.start_date;
      if (args.end_date) params.end_date = args.end_date;
      if (args.assignee) params.assignee = args.assignee;

      const response = await this.api.get(
        `/team/${args.team_id}/time_entries`,
        { params }
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createTimeEntry(args: any) {
    if (!args || !args.team_id || !args.start || !args.duration) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "team_id, start, and duration are required for creating a time entry"
      );
    }

    try {
      const timeData: any = {
        start: args.start,
        duration: args.duration,
      };

      if (args.description) timeData.description = args.description;
      if (args.assignee) timeData.assignee = args.assignee;
      if (args.tid) timeData.tid = args.tid;

      const response = await this.api.post(
        `/team/${args.team_id}/time_entries`,
        timeData
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Goal operations
  private async getGoals(args: any) {
    if (!args || !args.team_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "team_id is required for getting goals"
      );
    }

    try {
      const params: any = {};
      if (args.include_completed !== undefined)
        params.include_completed = args.include_completed;

      const response = await this.api.get(`/team/${args.team_id}/goal`, {
        params,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createGoal(args: any) {
    if (!args || !args.team_id || !args.name) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "team_id and name are required for creating a goal"
      );
    }

    try {
      const goalData: any = {
        name: args.name,
      };

      if (args.due_date) goalData.due_date = args.due_date;
      if (args.description) goalData.description = args.description;
      if (args.owners) goalData.owners = args.owners;
      if (args.color) goalData.color = args.color;

      const response = await this.api.post(
        `/team/${args.team_id}/goal`,
        goalData
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any) {
    return {
      content: [
        {
          type: "text",
          text: `ClickUp API Error: ${error.message || "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("ClickUp MCP server running on stdio");
  }
}

const server = new ClickUpServer();
server.run().catch(console.error);
