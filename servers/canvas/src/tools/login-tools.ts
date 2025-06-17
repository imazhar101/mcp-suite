import { LoginService } from "../services/login-service.js";

export class LoginTools {
  constructor(private loginService: LoginService) {}

  getToolDefinitions() {
    return [
      {
        name: "list_user_logins",
        description: "List user logins for an account or user",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID to list logins for",
            },
            user_id: {
              type: "string",
              description: "User ID to list logins for",
            },
          },
        },
      },
      {
        name: "create_user_login",
        description: "Create a new login for an existing user",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID where the login will be created",
            },
            user: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "The ID of the user to create the login for",
                },
                existing_user_id: {
                  type: "string",
                  description:
                    "A Canvas User ID to identify a user in a trusted account",
                },
                existing_integration_id: {
                  type: "string",
                  description:
                    "An Integration ID to identify a user in a trusted account",
                },
                existing_sis_user_id: {
                  type: "string",
                  description:
                    "An SIS User ID to identify a user in a trusted account",
                },
                trusted_account: {
                  type: "string",
                  description:
                    "The domain of the account to search for the user",
                },
              },
            },
            login: {
              type: "object",
              properties: {
                unique_id: {
                  type: "string",
                  description: "The unique ID for the new login",
                },
                password: {
                  type: "string",
                  description: "The new login's password",
                },
                sis_user_id: {
                  type: "string",
                  description: "SIS ID for the login",
                },
                integration_id: {
                  type: "string",
                  description: "Integration ID for the login",
                },
                authentication_provider_id: {
                  type: "string",
                  description:
                    "The authentication provider this login is associated with",
                },
                declared_user_type: {
                  type: "string",
                  enum: [
                    "administrative",
                    "observer",
                    "staff",
                    "student",
                    "student_other",
                    "teacher",
                  ],
                  description: "The declared intention of the user type",
                },
              },
              required: ["unique_id"],
            },
          },
          required: ["account_id", "login"],
        },
      },
      {
        name: "update_user_login",
        description: "Update an existing user login",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            id: {
              type: "string",
              description: "Login ID",
            },
            login: {
              type: "object",
              properties: {
                unique_id: {
                  type: "string",
                  description: "The new unique ID for the login",
                },
                password: {
                  type: "string",
                  description: "The new password for the login",
                },
                old_password: {
                  type: "string",
                  description:
                    "The prior password for the login (required if changing own password)",
                },
                sis_user_id: {
                  type: "string",
                  description: "SIS ID for the login",
                },
                integration_id: {
                  type: "string",
                  description: "Integration ID for the login",
                },
                authentication_provider_id: {
                  type: "string",
                  description:
                    "The authentication provider this login is associated with",
                },
                workflow_state: {
                  type: "string",
                  enum: ["active", "suspended"],
                  description: "Used to suspend or re-activate a login",
                },
                declared_user_type: {
                  type: "string",
                  enum: [
                    "administrative",
                    "observer",
                    "staff",
                    "student",
                    "student_other",
                    "teacher",
                  ],
                  description: "The declared intention of the user type",
                },
              },
            },
            override_sis_stickiness: {
              type: "boolean",
              description:
                "Default is true. If false, any fields containing 'sticky' changes will not be updated",
              default: true,
            },
          },
          required: ["account_id", "id"],
        },
      },
      {
        name: "delete_user_login",
        description: "Delete an existing user login",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID",
            },
            id: {
              type: "string",
              description: "Login ID",
            },
          },
          required: ["user_id", "id"],
        },
      },
      {
        name: "forgot_password",
        description: "Kickoff password recovery flow for a user",
        inputSchema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "User email address to send password recovery to",
            },
          },
          required: ["email"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "list_user_logins":
        return await this.loginService.listLogins(args);

      case "create_user_login":
        return await this.loginService.createLogin(args);

      case "update_user_login":
        return await this.loginService.updateLogin(args);

      case "delete_user_login":
        return await this.loginService.deleteLogin(args);

      case "forgot_password":
        return await this.loginService.forgotPassword(args);

      default:
        throw new Error(`Unknown login tool: ${name}`);
    }
  }
}
