import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { GradingStandardService } from "../services/grading-standard-service.js";
import {
  GradingStandardCreateParams,
  GradingStandardListParams,
  GradingStandardGetParams,
} from "../types/grading-standard.js";

export class GradingStandardTools {
  constructor(private gradingStandardService: GradingStandardService) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: "create_grading_standard",
        description: "Create a new grading standard in a course or account",
        inputSchema: {
          type: "object",
          properties: {
            context_type: {
              type: "string",
              enum: ["course", "account"],
              description: "Context type (course or account)",
            },
            context_id: {
              type: "string",
              description: "Context ID (course or account ID)",
            },
            title: {
              type: "string",
              description: "The title for the Grading Standard",
            },
            points_based: {
              type: "boolean",
              description:
                "Whether or not a grading scheme is points based. Defaults to false",
            },
            scaling_factor: {
              type: "number",
              description:
                "The factor by which to scale a percentage into a points based scheme grade. This is the maximum number of points possible in the grading scheme. Defaults to 1. Not required for percentage based grading schemes",
            },
            grading_scheme_entry: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description:
                      "The name for an entry value within a GradingStandard that describes the range of the value e.g. A-",
                  },
                  value: {
                    type: "number",
                    description:
                      "The value for the name of the entry within a GradingStandard. The entry represents the lower bound of the range for the entry. This range includes the value up to the next entry in the GradingStandard, or 100 if there is no upper bound. The lowest value will have a lower bound range of 0. e.g. 93",
                  },
                },
                required: ["name", "value"],
              },
              description: "Array of grading scheme entries",
            },
          },
          required: [
            "context_type",
            "context_id",
            "title",
            "grading_scheme_entry",
          ],
        },
      },
      {
        name: "list_grading_standards",
        description: "List grading standards available in a context",
        inputSchema: {
          type: "object",
          properties: {
            context_type: {
              type: "string",
              enum: ["course", "account"],
              description: "Context type (course or account)",
            },
            context_id: {
              type: "string",
              description: "Context ID (course or account ID)",
            },
          },
          required: ["context_type", "context_id"],
        },
      },
      {
        name: "get_grading_standard",
        description: "Get details of a specific grading standard",
        inputSchema: {
          type: "object",
          properties: {
            context_type: {
              type: "string",
              enum: ["course", "account"],
              description: "Context type (course or account)",
            },
            context_id: {
              type: "string",
              description: "Context ID (course or account ID)",
            },
            grading_standard_id: {
              type: "string",
              description: "Grading standard ID",
            },
          },
          required: ["context_type", "context_id", "grading_standard_id"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any): Promise<any> {
    switch (name) {
      case "create_grading_standard":
        return this.createGradingStandard(args);
      case "list_grading_standards":
        return this.listGradingStandards(args);
      case "get_grading_standard":
        return this.getGradingStandard(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async createGradingStandard(args: {
    context_type: "course" | "account";
    context_id: string;
    title: string;
    points_based?: boolean;
    scaling_factor?: number;
    grading_scheme_entry: Array<{
      name: string;
      value: number;
    }>;
  }) {
    const params: GradingStandardCreateParams = {
      title: args.title,
      grading_scheme_entry: args.grading_scheme_entry,
    };

    if (args.points_based !== undefined) {
      params.points_based = args.points_based;
    }

    if (args.scaling_factor !== undefined) {
      params.scaling_factor = args.scaling_factor;
    }

    return await this.gradingStandardService.createGradingStandard(
      args.context_type,
      args.context_id,
      params
    );
  }

  private async listGradingStandards(args: {
    context_type: "course" | "account";
    context_id: string;
  }) {
    return await this.gradingStandardService.listGradingStandards(
      args.context_type,
      args.context_id
    );
  }

  private async getGradingStandard(args: {
    context_type: "course" | "account";
    context_id: string;
    grading_standard_id: string;
  }) {
    return await this.gradingStandardService.getGradingStandard(
      args.context_type,
      args.context_id,
      args.grading_standard_id
    );
  }
}
