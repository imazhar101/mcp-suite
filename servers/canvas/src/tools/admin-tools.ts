import { AdminService } from "../services/admin-service.js";

export class AdminTools {
  constructor(private adminService: AdminService) {}

  getToolDefinitions() {
    return [
      {
        name: "make_account_admin",
        description: "Make an account admin",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID where the admin will be created",
            },
            user_id: {
              type: "number",
              description: "The id of the user to promote",
            },
            role: {
              type: "string",
              description:
                "DEPRECATED - The user's admin relationship with the account will be created with the given role. Defaults to 'AccountAdmin'.",
            },
            role_id: {
              type: "number",
              description:
                "The user's admin relationship with the account will be created with the given role. Defaults to the built-in role for 'AccountAdmin'.",
            },
            send_confirmation: {
              type: "boolean",
              description:
                "Send a notification email to the new admin if true. Default is true.",
            },
          },
          required: ["account_id", "user_id"],
        },
      },
      {
        name: "remove_account_admin",
        description: "Remove account admin",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            user_id: {
              type: "string",
              description: "User ID",
            },
            role: {
              type: "string",
              description: "DEPRECATED - Account role to remove from the user.",
            },
            role_id: {
              type: "number",
              description:
                "The id of the role representing the user's admin relationship with the account.",
            },
          },
          required: ["account_id", "user_id", "role_id"],
        },
      },
      {
        name: "list_account_admins",
        description: "List account admins",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            user_id: {
              type: "array",
              items: {
                type: "number",
              },
              description:
                "Scope the results to those with user IDs equal to any of the IDs specified here.",
            },
          },
          required: ["account_id"],
        },
      },
      {
        name: "list_my_admin_roles",
        description: "List my admin roles",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
          },
          required: ["account_id"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "make_account_admin":
        return await this.adminService.createAdmin(args);

      case "remove_account_admin":
        return await this.adminService.removeAdmin(args);

      case "list_account_admins":
        return await this.adminService.listAdmins(args);

      case "list_my_admin_roles":
        return await this.adminService.listSelfAdminRoles(args);

      default:
        throw new Error(`Unknown admin tool: ${name}`);
    }
  }
}
