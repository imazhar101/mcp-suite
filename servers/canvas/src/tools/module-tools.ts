import { ModuleService } from "../services/module-service.js";

export class ModuleTools {
  constructor(private moduleService: ModuleService) {}

  getToolDefinitions() {
    return [
      // Module Management
      {
        name: "list_modules",
        description: "List modules in a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["items", "content_details"],
              },
              description: "Additional information to include",
            },
            search_term: {
              type: "string",
              description: "Search term to filter modules",
            },
            student_id: {
              type: "string",
              description: "Student ID for completion information",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "get_module",
        description: "Get details of a specific module",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["items", "content_details"],
              },
              description: "Additional information to include",
            },
            student_id: {
              type: "string",
              description: "Student ID for completion information",
            },
          },
          required: ["course_id", "module_id"],
        },
      },
      {
        name: "create_module",
        description: "Create a new module",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            name: {
              type: "string",
              description: "Module name",
            },
            unlock_at: {
              type: "string",
              description: "Date when module unlocks (ISO 8601 format)",
            },
            position: {
              type: "number",
              description: "Position in course (1-based)",
            },
            require_sequential_progress: {
              type: "boolean",
              description: "Whether items must be unlocked in order",
            },
            prerequisite_module_ids: {
              type: "array",
              items: { type: "number" },
              description: "IDs of prerequisite modules",
            },
            publish_final_grade: {
              type: "boolean",
              description: "Publish final grade upon completion",
            },
          },
          required: ["course_id", "name"],
        },
      },
      {
        name: "update_module",
        description: "Update an existing module",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            name: {
              type: "string",
              description: "Module name",
            },
            unlock_at: {
              type: "string",
              description: "Date when module unlocks (ISO 8601 format)",
            },
            position: {
              type: "number",
              description: "Position in course (1-based)",
            },
            require_sequential_progress: {
              type: "boolean",
              description: "Whether items must be unlocked in order",
            },
            prerequisite_module_ids: {
              type: "array",
              items: { type: "number" },
              description: "IDs of prerequisite modules",
            },
            publish_final_grade: {
              type: "boolean",
              description: "Publish final grade upon completion",
            },
            published: {
              type: "boolean",
              description: "Whether module is published",
            },
          },
          required: ["course_id", "module_id"],
        },
      },
      {
        name: "delete_module",
        description: "Delete a module",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
          },
          required: ["course_id", "module_id"],
        },
      },
      {
        name: "relock_module",
        description:
          "Re-lock module progressions and recalculate based on current requirements",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
          },
          required: ["course_id", "module_id"],
        },
      },

      // Module Item Management
      {
        name: "list_module_items",
        description: "List items in a module",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["content_details"],
              },
              description: "Additional information to include",
            },
            search_term: {
              type: "string",
              description: "Search term to filter items",
            },
            student_id: {
              type: "string",
              description: "Student ID for completion information",
            },
          },
          required: ["course_id", "module_id"],
        },
      },
      {
        name: "get_module_item",
        description: "Get details of a specific module item",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            item_id: {
              type: "string",
              description: "Module item ID",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["content_details"],
              },
              description: "Additional information to include",
            },
            student_id: {
              type: "string",
              description: "Student ID for completion information",
            },
          },
          required: ["course_id", "module_id", "item_id"],
        },
      },
      {
        name: "create_module_item",
        description: "Create a new module item",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            title: {
              type: "string",
              description: "Item title",
            },
            type: {
              type: "string",
              enum: [
                "File",
                "Page",
                "Discussion",
                "Assignment",
                "Quiz",
                "SubHeader",
                "ExternalUrl",
                "ExternalTool",
              ],
              description: "Type of content",
            },
            content_id: {
              type: "string",
              description: "ID of content to link (required for most types)",
            },
            position: {
              type: "number",
              description: "Position in module (1-based)",
            },
            indent: {
              type: "number",
              description: "Indent level (0-based)",
            },
            page_url: {
              type: "string",
              description: "Page URL suffix (required for Page type)",
            },
            external_url: {
              type: "string",
              description:
                "External URL (required for ExternalUrl and ExternalTool)",
            },
            new_tab: {
              type: "boolean",
              description: "Open external tool in new tab",
            },
            completion_requirement_type: {
              type: "string",
              enum: [
                "must_view",
                "must_contribute",
                "must_submit",
                "must_mark_done",
              ],
              description: "Completion requirement type",
            },
            completion_requirement_min_score: {
              type: "number",
              description: "Minimum score for completion (for min_score type)",
            },
            iframe_width: {
              type: "number",
              description: "ExternalTool iframe width",
            },
            iframe_height: {
              type: "number",
              description: "ExternalTool iframe height",
            },
          },
          required: ["course_id", "module_id", "type"],
        },
      },
      {
        name: "update_module_item",
        description: "Update an existing module item",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            item_id: {
              type: "string",
              description: "Module item ID",
            },
            title: {
              type: "string",
              description: "Item title",
            },
            position: {
              type: "number",
              description: "Position in module (1-based)",
            },
            indent: {
              type: "number",
              description: "Indent level (0-based)",
            },
            external_url: {
              type: "string",
              description: "External URL (for ExternalUrl type)",
            },
            new_tab: {
              type: "boolean",
              description: "Open external tool in new tab",
            },
            completion_requirement_type: {
              type: "string",
              enum: [
                "must_view",
                "must_contribute",
                "must_submit",
                "must_mark_done",
              ],
              description: "Completion requirement type",
            },
            completion_requirement_min_score: {
              type: "number",
              description: "Minimum score for completion",
            },
            published: {
              type: "boolean",
              description: "Whether item is published",
            },
            move_to_module_id: {
              type: "string",
              description: "Move item to different module",
            },
          },
          required: ["course_id", "module_id", "item_id"],
        },
      },
      {
        name: "delete_module_item",
        description: "Delete a module item",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            item_id: {
              type: "string",
              description: "Module item ID",
            },
          },
          required: ["course_id", "module_id", "item_id"],
        },
      },
      {
        name: "mark_module_item_done",
        description: "Mark a module item as done",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            item_id: {
              type: "string",
              description: "Module item ID",
            },
          },
          required: ["course_id", "module_id", "item_id"],
        },
      },
      {
        name: "mark_module_item_not_done",
        description: "Mark a module item as not done",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            item_id: {
              type: "string",
              description: "Module item ID",
            },
          },
          required: ["course_id", "module_id", "item_id"],
        },
      },
      {
        name: "mark_module_item_read",
        description:
          "Mark a module item as read (fulfills must_view requirement)",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            item_id: {
              type: "string",
              description: "Module item ID",
            },
          },
          required: ["course_id", "module_id", "item_id"],
        },
      },
      {
        name: "get_module_item_sequence",
        description: "Get module item sequence information for navigation",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            asset_type: {
              type: "string",
              enum: [
                "ModuleItem",
                "File",
                "Page",
                "Discussion",
                "Assignment",
                "Quiz",
                "ExternalTool",
              ],
              description: "Type of asset to find sequence for",
            },
            asset_id: {
              type: "number",
              description: "ID of the asset",
            },
          },
          required: ["course_id", "asset_type", "asset_id"],
        },
      },
      {
        name: "select_mastery_path",
        description:
          "Select a mastery path for a module item (requires Mastery Paths feature)",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            item_id: {
              type: "string",
              description: "Module item ID",
            },
            assignment_set_id: {
              type: "string",
              description: "Assignment set to choose",
            },
            student_id: {
              type: "string",
              description: "Student ID (defaults to current user)",
            },
          },
          required: ["course_id", "module_id", "item_id"],
        },
      },

      // Module Assignment Overrides
      {
        name: "list_module_overrides",
        description: "List assignment overrides for a module",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
          },
          required: ["course_id", "module_id"],
        },
      },
      {
        name: "update_module_overrides",
        description: "Update assignment overrides for a module",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            module_id: {
              type: "string",
              description: "Module ID",
            },
            overrides: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                    description: "Override ID (for existing overrides)",
                  },
                  title: {
                    type: "string",
                    description: "Override title",
                  },
                  student_ids: {
                    type: "array",
                    items: { type: "number" },
                    description: "Student IDs for adhoc overrides",
                  },
                  course_section_id: {
                    type: "number",
                    description: "Section ID for section overrides",
                  },
                  group_id: {
                    type: "number",
                    description: "Group ID for group overrides",
                  },
                },
              },
              description: "List of overrides to apply",
            },
          },
          required: ["course_id", "module_id", "overrides"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      // Module Management
      case "list_modules":
        return await this.moduleService.listModules(args.course_id, {
          include: args.include,
          search_term: args.search_term,
          student_id: args.student_id,
        });

      case "get_module":
        return await this.moduleService.getModule(
          args.course_id,
          args.module_id,
          {
            include: args.include,
            student_id: args.student_id,
          }
        );

      case "create_module":
        const {
          course_id: createCourseId,
          name,
          unlock_at,
          position,
          require_sequential_progress,
          prerequisite_module_ids,
          publish_final_grade,
        } = args;
        return await this.moduleService.createModule(createCourseId, {
          name,
          unlock_at,
          position,
          require_sequential_progress,
          prerequisite_module_ids,
          publish_final_grade,
        });

      case "update_module":
        const {
          course_id: updateCourseId,
          module_id: updateModuleId,
          name: updateName,
          unlock_at: updateUnlockAt,
          position: updatePosition,
          require_sequential_progress: updateSequential,
          prerequisite_module_ids: updatePrereqs,
          publish_final_grade: updatePublishGrade,
          published,
        } = args;
        return await this.moduleService.updateModule(
          updateCourseId,
          updateModuleId,
          {
            name: updateName,
            unlock_at: updateUnlockAt,
            position: updatePosition,
            require_sequential_progress: updateSequential,
            prerequisite_module_ids: updatePrereqs,
            publish_final_grade: updatePublishGrade,
            published,
          }
        );

      case "delete_module":
        return await this.moduleService.deleteModule(
          args.course_id,
          args.module_id
        );

      case "relock_module":
        return await this.moduleService.relockModule(
          args.course_id,
          args.module_id
        );

      // Module Item Management
      case "list_module_items":
        return await this.moduleService.listModuleItems(
          args.course_id,
          args.module_id,
          {
            include: args.include,
            search_term: args.search_term,
            student_id: args.student_id,
          }
        );

      case "get_module_item":
        return await this.moduleService.getModuleItem(
          args.course_id,
          args.module_id,
          args.item_id,
          {
            include: args.include,
            student_id: args.student_id,
          }
        );

      case "create_module_item":
        const {
          course_id: itemCourseId,
          module_id: itemModuleId,
          title,
          type,
          content_id,
          position: itemPosition,
          indent,
          page_url,
          external_url,
          new_tab,
          completion_requirement_type,
          completion_requirement_min_score,
          iframe_width,
          iframe_height,
        } = args;

        const itemData: any = {
          title,
          type,
          content_id,
          position: itemPosition,
          indent,
          page_url,
          external_url,
          new_tab,
        };

        if (completion_requirement_type) {
          itemData.completion_requirement = {
            type: completion_requirement_type,
            min_score: completion_requirement_min_score,
          };
        }

        if (iframe_width || iframe_height) {
          itemData.iframe = {
            width: iframe_width,
            height: iframe_height,
          };
        }

        return await this.moduleService.createModuleItem(
          itemCourseId,
          itemModuleId,
          itemData
        );

      case "update_module_item":
        const {
          course_id: updateItemCourseId,
          module_id: updateItemModuleId,
          item_id: updateItemId,
          title: updateTitle,
          position: updateItemPosition,
          indent: updateIndent,
          external_url: updateExternalUrl,
          new_tab: updateNewTab,
          completion_requirement_type: updateCompletionType,
          completion_requirement_min_score: updateMinScore,
          published: updateItemPublished,
          move_to_module_id,
        } = args;

        const updateItemData: any = {
          title: updateTitle,
          position: updateItemPosition,
          indent: updateIndent,
          external_url: updateExternalUrl,
          new_tab: updateNewTab,
          published: updateItemPublished,
          module_id: move_to_module_id,
        };

        if (updateCompletionType) {
          updateItemData.completion_requirement = {
            type: updateCompletionType,
            min_score: updateMinScore,
          };
        }

        return await this.moduleService.updateModuleItem(
          updateItemCourseId,
          updateItemModuleId,
          updateItemId,
          updateItemData
        );

      case "delete_module_item":
        return await this.moduleService.deleteModuleItem(
          args.course_id,
          args.module_id,
          args.item_id
        );

      case "mark_module_item_done":
        return await this.moduleService.markModuleItemAsDone(
          args.course_id,
          args.module_id,
          args.item_id
        );

      case "mark_module_item_not_done":
        return await this.moduleService.markModuleItemAsNotDone(
          args.course_id,
          args.module_id,
          args.item_id
        );

      case "mark_module_item_read":
        return await this.moduleService.markModuleItemRead(
          args.course_id,
          args.module_id,
          args.item_id
        );

      case "get_module_item_sequence":
        return await this.moduleService.getModuleItemSequence(args.course_id, {
          asset_type: args.asset_type,
          asset_id: args.asset_id,
        });

      case "select_mastery_path":
        return await this.moduleService.selectMasteryPath(
          args.course_id,
          args.module_id,
          args.item_id,
          {
            assignment_set_id: args.assignment_set_id,
            student_id: args.student_id,
          }
        );

      // Module Assignment Overrides
      case "list_module_overrides":
        return await this.moduleService.listModuleOverrides(
          args.course_id,
          args.module_id
        );

      case "update_module_overrides":
        return await this.moduleService.updateModuleOverrides(
          args.course_id,
          args.module_id,
          {
            overrides: args.overrides,
          }
        );

      default:
        throw new Error(`Unknown module tool: ${name}`);
    }
  }
}
