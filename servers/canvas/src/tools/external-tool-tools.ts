import { ExternalToolService } from "../services/external-tool-service.js";

export class ExternalToolTools {
  constructor(private externalToolService: ExternalToolService) {}

  getToolDefinitions() {
    return [
      // External Tool Management
      {
        name: "list_external_tools",
        description:
          "List external tools (LTI tools) in a course, account, or group",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              enum: ["courses", "accounts", "groups"],
              description: "Context type",
            },
            context_id: {
              type: "string",
              description: "Context ID (course, account, or group ID)",
            },
            search_term: {
              type: "string",
              description: "Partial name of tools to match and return",
            },
            selectable: {
              type: "boolean",
              description: "If true, only return tools meant to be selectable",
            },
            include_parents: {
              type: "boolean",
              description: "Include tools from parent accounts",
            },
            placement: {
              type: "string",
              description:
                "Filter by placement type (e.g., 'course_navigation', 'editor_button')",
            },
          },
          required: ["context", "context_id"],
        },
      },
      {
        name: "get_external_tool",
        description: "Get details of a specific external tool",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              enum: ["courses", "accounts"],
              description: "Context type",
            },
            context_id: {
              type: "string",
              description: "Context ID (course or account ID)",
            },
            tool_id: {
              type: "string",
              description: "External tool ID",
            },
          },
          required: ["context", "context_id", "tool_id"],
        },
      },
      {
        name: "create_external_tool",
        description: "Create a new external tool (LTI tool)",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              enum: ["courses", "accounts"],
              description: "Context type",
            },
            context_id: {
              type: "string",
              description: "Context ID (course or account ID)",
            },
            client_id: {
              type: "string",
              description:
                "Client ID for LTI 1.3 (if provided, other params ignored)",
            },
            name: {
              type: "string",
              description: "Tool name",
            },
            privacy_level: {
              type: "string",
              enum: ["anonymous", "name_only", "email_only", "public"],
              description: "How much user info to send to tool",
            },
            consumer_key: {
              type: "string",
              description: "Consumer key for LTI 1.1",
            },
            shared_secret: {
              type: "string",
              description: "Shared secret for LTI 1.1",
            },
            description: {
              type: "string",
              description: "Tool description",
            },
            url: {
              type: "string",
              description: "Launch URL (either url or domain required)",
            },
            domain: {
              type: "string",
              description: "Domain to match (either url or domain required)",
            },
            icon_url: {
              type: "string",
              description: "Icon URL",
            },
            text: {
              type: "string",
              description: "Default text to show",
            },
            custom_fields: {
              type: "object",
              description: "Custom fields as key-value pairs",
            },
            // Course Navigation
            course_navigation_enabled: {
              type: "boolean",
              description: "Enable course navigation placement",
            },
            course_navigation_text: {
              type: "string",
              description: "Text for course navigation",
            },
            course_navigation_url: {
              type: "string",
              description: "Custom URL for course navigation",
            },
            course_navigation_visibility: {
              type: "string",
              enum: ["admins", "members", "public"],
              description: "Who can see the navigation tab",
            },
            course_navigation_default: {
              type: "string",
              enum: ["disabled", "enabled"],
              description: "Default visibility in course navigation",
            },
            course_navigation_window_target: {
              type: "string",
              enum: ["_blank", "_self"],
              description: "How to open the tool",
            },
            // Resource Selection
            resource_selection_enabled: {
              type: "boolean",
              description: "Enable resource selection placement",
            },
            resource_selection_url: {
              type: "string",
              description: "URL for resource selection",
            },
            resource_selection_icon_url: {
              type: "string",
              description: "Icon for module tool list",
            },
            resource_selection_selection_width: {
              type: "number",
              description: "Dialog width",
            },
            resource_selection_selection_height: {
              type: "number",
              description: "Dialog height",
            },
            // Editor Button
            editor_button_enabled: {
              type: "boolean",
              description: "Enable editor button placement",
            },
            editor_button_url: {
              type: "string",
              description: "URL for editor button",
            },
            editor_button_icon_url: {
              type: "string",
              description: "Icon for WYSIWYG editor",
            },
            editor_button_selection_width: {
              type: "number",
              description: "Dialog width",
            },
            editor_button_selection_height: {
              type: "number",
              description: "Dialog height",
            },
            editor_button_message_type: {
              type: "string",
              description:
                "Set to 'ContentItemSelectionRequest' for content-item",
            },
            // Configuration
            config_type: {
              type: "string",
              enum: ["by_url", "by_xml"],
              description: "Configuration method",
            },
            config_url: {
              type: "string",
              description: "URL to retrieve XML configuration",
            },
            config_xml: {
              type: "string",
              description: "XML configuration content",
            },
            not_selectable: {
              type: "boolean",
              description: "Hide from selection UI in modules/assignments",
            },
            oauth_compliant: {
              type: "boolean",
              description: "LTI query params not copied to POST body",
            },
          },
          required: ["context", "context_id"],
        },
      },
      {
        name: "update_external_tool",
        description: "Update an existing external tool",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              enum: ["courses", "accounts"],
              description: "Context type",
            },
            context_id: {
              type: "string",
              description: "Context ID (course or account ID)",
            },
            tool_id: {
              type: "string",
              description: "External tool ID",
            },
            name: {
              type: "string",
              description: "Tool name",
            },
            privacy_level: {
              type: "string",
              enum: ["anonymous", "name_only", "email_only", "public"],
              description: "How much user info to send to tool",
            },
            description: {
              type: "string",
              description: "Tool description",
            },
            url: {
              type: "string",
              description: "Launch URL",
            },
            domain: {
              type: "string",
              description: "Domain to match",
            },
            icon_url: {
              type: "string",
              description: "Icon URL",
            },
            custom_fields: {
              type: "object",
              description: "Custom fields as key-value pairs",
            },
            // Same navigation options as create
            course_navigation_enabled: {
              type: "boolean",
              description: "Enable course navigation placement",
            },
            course_navigation_text: {
              type: "string",
              description: "Text for course navigation",
            },
            resource_selection_enabled: {
              type: "boolean",
              description: "Enable resource selection placement",
            },
            editor_button_enabled: {
              type: "boolean",
              description: "Enable editor button placement",
            },
          },
          required: ["context", "context_id", "tool_id"],
        },
      },
      {
        name: "delete_external_tool",
        description: "Delete an external tool",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              enum: ["courses", "accounts"],
              description: "Context type",
            },
            context_id: {
              type: "string",
              description: "Context ID (course or account ID)",
            },
            tool_id: {
              type: "string",
              description: "External tool ID",
            },
          },
          required: ["context", "context_id", "tool_id"],
        },
      },
      {
        name: "get_sessionless_launch",
        description: "Get a sessionless launch URL for an external tool",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              enum: ["courses", "accounts"],
              description: "Context type",
            },
            context_id: {
              type: "string",
              description: "Context ID (course or account ID)",
            },
            id: {
              type: "string",
              description: "External tool ID",
            },
            url: {
              type: "string",
              description: "LTI launch URL",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID for assessment launch",
            },
            module_item_id: {
              type: "string",
              description: "Module item ID for module item launch",
            },
            launch_type: {
              type: "string",
              description:
                "Launch type (assessment, module_item, or placement name)",
            },
            resource_link_lookup_uuid: {
              type: "string",
              description: "Resource link lookup identifier",
            },
          },
          required: ["context", "context_id"],
        },
      },
      // RCE and Navigation Favorites
      {
        name: "add_rce_favorite",
        description: "Add tool to RCE (Rich Content Editor) favorites",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            tool_id: {
              type: "string",
              description: "External tool ID",
            },
          },
          required: ["account_id", "tool_id"],
        },
      },
      {
        name: "remove_rce_favorite",
        description: "Remove tool from RCE favorites",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            tool_id: {
              type: "string",
              description: "External tool ID",
            },
          },
          required: ["account_id", "tool_id"],
        },
      },
      {
        name: "add_top_nav_favorite",
        description: "Add tool to top navigation favorites",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            tool_id: {
              type: "string",
              description: "External tool ID",
            },
          },
          required: ["account_id", "tool_id"],
        },
      },
      {
        name: "remove_top_nav_favorite",
        description: "Remove tool from top navigation favorites",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            tool_id: {
              type: "string",
              description: "External tool ID",
            },
          },
          required: ["account_id", "tool_id"],
        },
      },
      // Visible Course Navigation Tools
      {
        name: "get_visible_course_nav_tools",
        description:
          "Get visible course navigation tools across multiple courses",
        inputSchema: {
          type: "object",
          properties: {
            context_codes: {
              type: "array",
              items: { type: "string" },
              description:
                "Array of context codes (e.g., ['course_123', 'course_456'])",
            },
          },
          required: ["context_codes"],
        },
      },
      {
        name: "get_visible_course_nav_tools_for_course",
        description: "Get visible course navigation tools for a single course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
          },
          required: ["course_id"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "list_external_tools":
        return await this.externalToolService.listExternalTools(
          args.context,
          args.context_id,
          {
            search_term: args.search_term,
            selectable: args.selectable,
            include_parents: args.include_parents,
            placement: args.placement,
          }
        );

      case "get_external_tool":
        return await this.externalToolService.getExternalTool(
          args.context,
          args.context_id,
          args.tool_id
        );

      case "create_external_tool":
        const createData: any = {
          client_id: args.client_id,
          name: args.name,
          privacy_level: args.privacy_level,
          consumer_key: args.consumer_key,
          shared_secret: args.shared_secret,
          description: args.description,
          url: args.url,
          domain: args.domain,
          icon_url: args.icon_url,
          text: args.text,
          custom_fields: args.custom_fields,
          config_type: args.config_type,
          config_url: args.config_url,
          config_xml: args.config_xml,
          not_selectable: args.not_selectable,
          oauth_compliant: args.oauth_compliant,
        };

        // Course Navigation
        if (args.course_navigation_enabled) {
          createData.course_navigation = {
            enabled: args.course_navigation_enabled,
            text: args.course_navigation_text,
            url: args.course_navigation_url,
            visibility: args.course_navigation_visibility,
            default: args.course_navigation_default,
            windowTarget: args.course_navigation_window_target,
          };
        }

        // Resource Selection
        if (args.resource_selection_enabled) {
          createData.resource_selection = {
            enabled: args.resource_selection_enabled,
            url: args.resource_selection_url,
            icon_url: args.resource_selection_icon_url,
            selection_width: args.resource_selection_selection_width,
            selection_height: args.resource_selection_selection_height,
          };
        }

        // Editor Button
        if (args.editor_button_enabled) {
          createData.editor_button = {
            enabled: args.editor_button_enabled,
            url: args.editor_button_url,
            icon_url: args.editor_button_icon_url,
            selection_width: args.editor_button_selection_width,
            selection_height: args.editor_button_selection_height,
            message_type: args.editor_button_message_type,
          };
        }

        return await this.externalToolService.createExternalTool(
          args.context,
          args.context_id,
          createData
        );

      case "update_external_tool":
        const updateData: any = {
          name: args.name,
          privacy_level: args.privacy_level,
          description: args.description,
          url: args.url,
          domain: args.domain,
          icon_url: args.icon_url,
          custom_fields: args.custom_fields,
        };

        // Add navigation settings if provided
        if (args.course_navigation_enabled !== undefined) {
          updateData.course_navigation = {
            enabled: args.course_navigation_enabled,
            text: args.course_navigation_text,
          };
        }

        if (args.resource_selection_enabled !== undefined) {
          updateData.resource_selection = {
            enabled: args.resource_selection_enabled,
          };
        }

        if (args.editor_button_enabled !== undefined) {
          updateData.editor_button = {
            enabled: args.editor_button_enabled,
          };
        }

        return await this.externalToolService.updateExternalTool(
          args.context,
          args.context_id,
          args.tool_id,
          updateData
        );

      case "delete_external_tool":
        return await this.externalToolService.deleteExternalTool(
          args.context,
          args.context_id,
          args.tool_id
        );

      case "get_sessionless_launch":
        return await this.externalToolService.getSessionlessLaunch(
          args.context,
          args.context_id,
          {
            id: args.id,
            url: args.url,
            assignment_id: args.assignment_id,
            module_item_id: args.module_item_id,
            launch_type: args.launch_type,
            resource_link_lookup_uuid: args.resource_link_lookup_uuid,
          }
        );

      case "add_rce_favorite":
        return await this.externalToolService.addRceFavorite(
          args.account_id,
          args.tool_id
        );

      case "remove_rce_favorite":
        return await this.externalToolService.removeRceFavorite(
          args.account_id,
          args.tool_id
        );

      case "add_top_nav_favorite":
        return await this.externalToolService.addTopNavFavorite(
          args.account_id,
          args.tool_id
        );

      case "remove_top_nav_favorite":
        return await this.externalToolService.removeTopNavFavorite(
          args.account_id,
          args.tool_id
        );

      case "get_visible_course_nav_tools":
        return await this.externalToolService.getVisibleCourseNavTools({
          context_codes: args.context_codes,
        });

      case "get_visible_course_nav_tools_for_course":
        return await this.externalToolService.getVisibleCourseNavToolsForCourse(
          args.course_id
        );

      default:
        throw new Error(`Unknown external tool: ${name}`);
    }
  }
}
