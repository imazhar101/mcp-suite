import { LtiLaunchDefinitionService } from "../services/lti-launch-definition-service.js";

export class LtiLaunchDefinitionTools {
  constructor(private ltiLaunchDefinitionService: LtiLaunchDefinitionService) {}

  getToolDefinitions() {
    return [
      {
        name: "list_lti_launch_definitions",
        description: "List LTI launch definitions for a course or account",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description:
                "Course ID (either course_id or account_id required)",
            },
            account_id: {
              type: "string",
              description:
                "Account ID (either course_id or account_id required)",
            },
            placements: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "Array of placement types to return launch definitions for",
            },
            only_visible: {
              type: "boolean",
              description:
                "Only return launch definitions visible to current user",
              default: true,
            },
          },
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "list_lti_launch_definitions":
        return await this.ltiLaunchDefinitionService.listLtiLaunchDefinitions(
          args
        );

      default:
        throw new Error(`Unknown LTI launch definition tool: ${name}`);
    }
  }
}
