import { AssignmentService } from "../services/assignment-service.js";

export class AssignmentTools {
  constructor(private assignmentService: AssignmentService) {}

  getToolDefinitions() {
    return [
      {
        name: "list_assignments",
        description: "List assignments for a course",
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
                enum: [
                  "submission",
                  "assignment_visibility",
                  "all_dates",
                  "overrides",
                  "observed_users",
                  "can_edit",
                  "score_statistics",
                  "ab_guid",
                ],
              },
              description: "Additional information to include",
            },
            search_term: {
              type: "string",
              description: "Search term to filter assignments",
            },
            override_assignment_dates: {
              type: "boolean",
              description: "Apply assignment overrides",
            },
            needs_grading_count_by_section: {
              type: "boolean",
              description: "Split needs grading count by section",
            },
            bucket: {
              type: "string",
              enum: [
                "past",
                "overdue",
                "undated",
                "ungraded",
                "unsubmitted",
                "upcoming",
                "future",
              ],
              description:
                "Filter assignments by due date and submission status",
            },
            assignment_ids: {
              type: "array",
              items: { type: "string" },
              description: "Specific assignment IDs to return",
            },
            order_by: {
              type: "string",
              enum: ["position", "name", "due_at"],
              description: "Order assignments by field",
            },
            post_to_sis: {
              type: "boolean",
              description: "Filter by post to SIS setting",
            },
            new_quizzes: {
              type: "boolean",
              description: "Return only New Quizzes assignments",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "get_assignment",
        description: "Get details of a specific assignment",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "submission",
                  "assignment_visibility",
                  "overrides",
                  "observed_users",
                  "can_edit",
                  "score_statistics",
                  "ab_guid",
                ],
              },
              description: "Additional information to include",
            },
            override_assignment_dates: {
              type: "boolean",
              description: "Apply assignment overrides",
            },
            needs_grading_count_by_section: {
              type: "boolean",
              description: "Split needs grading count by section",
            },
            all_dates: {
              type: "boolean",
              description: "Include all dates associated with assignment",
            },
          },
          required: ["course_id", "assignment_id"],
        },
      },
      {
        name: "create_assignment",
        description: "Create a new assignment",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            name: {
              type: "string",
              description: "Assignment name",
            },
            description: {
              type: "string",
              description: "Assignment description (HTML supported)",
            },
            points_possible: {
              type: "number",
              description: "Maximum points possible",
            },
            grading_type: {
              type: "string",
              enum: [
                "pass_fail",
                "percent",
                "letter_grade",
                "gpa_scale",
                "points",
                "not_graded",
              ],
              description: "Grading strategy",
            },
            submission_types: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "online_quiz",
                  "none",
                  "on_paper",
                  "discussion_topic",
                  "external_tool",
                  "online_upload",
                  "online_text_entry",
                  "online_url",
                  "media_recording",
                  "student_annotation",
                ],
              },
              description: "Allowed submission types",
            },
            allowed_extensions: {
              type: "array",
              items: { type: "string" },
              description: "Allowed file extensions for uploads",
            },
            due_at: {
              type: "string",
              description: "Due date (ISO 8601 format)",
            },
            unlock_at: {
              type: "string",
              description: "Unlock date (ISO 8601 format)",
            },
            lock_at: {
              type: "string",
              description: "Lock date (ISO 8601 format)",
            },
            assignment_group_id: {
              type: "number",
              description: "Assignment group ID",
            },
            position: {
              type: "number",
              description: "Position in assignment group",
            },
            peer_reviews: {
              type: "boolean",
              description: "Enable peer reviews",
            },
            automatic_peer_reviews: {
              type: "boolean",
              description: "Automatically assign peer reviews",
            },
            group_category_id: {
              type: "number",
              description: "Group category ID for group assignments",
            },
            grade_group_students_individually: {
              type: "boolean",
              description: "Grade group members individually",
            },
            turnitin_enabled: {
              type: "boolean",
              description: "Enable Turnitin",
            },
            vericite_enabled: {
              type: "boolean",
              description: "Enable VeriCite",
            },
            published: {
              type: "boolean",
              description: "Publish assignment",
            },
            only_visible_to_overrides: {
              type: "boolean",
              description: "Only visible to overrides",
            },
            omit_from_final_grade: {
              type: "boolean",
              description: "Omit from final grade",
            },
            hide_in_gradebook: {
              type: "boolean",
              description: "Hide in gradebook",
            },
            moderated_grading: {
              type: "boolean",
              description: "Enable moderated grading",
            },
            grader_count: {
              type: "number",
              description: "Number of graders for moderated grading",
            },
            final_grader_id: {
              type: "number",
              description: "Final grader user ID",
            },
            anonymous_grading: {
              type: "boolean",
              description: "Enable anonymous grading",
            },
            allowed_attempts: {
              type: "number",
              description: "Number of allowed attempts (-1 for unlimited)",
            },
            annotatable_attachment_id: {
              type: "number",
              description: "Attachment ID for student annotation",
            },
          },
          required: ["course_id", "name"],
        },
      },
      {
        name: "update_assignment",
        description: "Update an existing assignment",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID",
            },
            name: {
              type: "string",
              description: "Assignment name",
            },
            description: {
              type: "string",
              description: "Assignment description (HTML supported)",
            },
            points_possible: {
              type: "number",
              description: "Maximum points possible",
            },
            grading_type: {
              type: "string",
              enum: [
                "pass_fail",
                "percent",
                "letter_grade",
                "gpa_scale",
                "points",
                "not_graded",
              ],
              description: "Grading strategy",
            },
            submission_types: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "online_quiz",
                  "none",
                  "on_paper",
                  "discussion_topic",
                  "external_tool",
                  "online_upload",
                  "online_text_entry",
                  "online_url",
                  "media_recording",
                  "student_annotation",
                ],
              },
              description: "Allowed submission types",
            },
            allowed_extensions: {
              type: "array",
              items: { type: "string" },
              description: "Allowed file extensions for uploads",
            },
            due_at: {
              type: "string",
              description: "Due date (ISO 8601 format)",
            },
            unlock_at: {
              type: "string",
              description: "Unlock date (ISO 8601 format)",
            },
            lock_at: {
              type: "string",
              description: "Lock date (ISO 8601 format)",
            },
            assignment_group_id: {
              type: "number",
              description: "Assignment group ID",
            },
            position: {
              type: "number",
              description: "Position in assignment group",
            },
            peer_reviews: {
              type: "boolean",
              description: "Enable peer reviews",
            },
            automatic_peer_reviews: {
              type: "boolean",
              description: "Automatically assign peer reviews",
            },
            group_category_id: {
              type: "number",
              description: "Group category ID for group assignments",
            },
            grade_group_students_individually: {
              type: "boolean",
              description: "Grade group members individually",
            },
            turnitin_enabled: {
              type: "boolean",
              description: "Enable Turnitin",
            },
            vericite_enabled: {
              type: "boolean",
              description: "Enable VeriCite",
            },
            published: {
              type: "boolean",
              description: "Publish assignment",
            },
            only_visible_to_overrides: {
              type: "boolean",
              description: "Only visible to overrides",
            },
            omit_from_final_grade: {
              type: "boolean",
              description: "Omit from final grade",
            },
            hide_in_gradebook: {
              type: "boolean",
              description: "Hide in gradebook",
            },
            moderated_grading: {
              type: "boolean",
              description: "Enable moderated grading",
            },
            grader_count: {
              type: "number",
              description: "Number of graders for moderated grading",
            },
            final_grader_id: {
              type: "number",
              description: "Final grader user ID",
            },
            anonymous_grading: {
              type: "boolean",
              description: "Enable anonymous grading",
            },
            allowed_attempts: {
              type: "number",
              description: "Number of allowed attempts (-1 for unlimited)",
            },
            annotatable_attachment_id: {
              type: "number",
              description: "Attachment ID for student annotation",
            },
            force_updated_at: {
              type: "boolean",
              description: "Force update timestamp even if no changes",
            },
          },
          required: ["course_id", "assignment_id"],
        },
      },
      {
        name: "delete_assignment",
        description: "Delete an assignment",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID",
            },
          },
          required: ["course_id", "assignment_id"],
        },
      },
      {
        name: "duplicate_assignment",
        description: "Duplicate an assignment",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID to duplicate",
            },
            result_type: {
              type: "string",
              enum: ["Quiz"],
              description: "Return format (Quiz for quiz format)",
            },
          },
          required: ["course_id", "assignment_id"],
        },
      },
      {
        name: "bulk_update_assignment_dates",
        description: "Bulk update assignment dates",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                    description: "Assignment ID",
                  },
                  all_dates: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        base: { type: "boolean" },
                        title: { type: "string" },
                        due_at: { type: "string" },
                        unlock_at: { type: "string" },
                        lock_at: { type: "string" },
                      },
                    },
                    description: "Assignment dates and overrides",
                  },
                },
                required: ["id", "all_dates"],
              },
              description: "Array of assignments with date updates",
            },
          },
          required: ["course_id", "assignments"],
        },
      },
      // Assignment Overrides
      {
        name: "list_assignment_overrides",
        description: "List assignment overrides",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID",
            },
          },
          required: ["course_id", "assignment_id"],
        },
      },
      {
        name: "get_assignment_override",
        description: "Get a specific assignment override",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID",
            },
            override_id: {
              type: "string",
              description: "Override ID",
            },
          },
          required: ["course_id", "assignment_id", "override_id"],
        },
      },
      {
        name: "create_assignment_override",
        description: "Create an assignment override",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID",
            },
            student_ids: {
              type: "array",
              items: { type: "number" },
              description: "Student IDs for adhoc override",
            },
            group_id: {
              type: "number",
              description: "Group ID for group override",
            },
            course_section_id: {
              type: "number",
              description: "Section ID for section override",
            },
            title: {
              type: "string",
              description: "Override title (required for adhoc overrides)",
            },
            due_at: {
              type: "string",
              description: "Override due date (ISO 8601 format)",
            },
            unlock_at: {
              type: "string",
              description: "Override unlock date (ISO 8601 format)",
            },
            lock_at: {
              type: "string",
              description: "Override lock date (ISO 8601 format)",
            },
          },
          required: ["course_id", "assignment_id"],
        },
      },
      {
        name: "update_assignment_override",
        description: "Update an assignment override",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID",
            },
            override_id: {
              type: "string",
              description: "Override ID",
            },
            student_ids: {
              type: "array",
              items: { type: "number" },
              description: "Student IDs for adhoc override",
            },
            title: {
              type: "string",
              description: "Override title",
            },
            due_at: {
              type: "string",
              description: "Override due date (ISO 8601 format)",
            },
            unlock_at: {
              type: "string",
              description: "Override unlock date (ISO 8601 format)",
            },
            lock_at: {
              type: "string",
              description: "Override lock date (ISO 8601 format)",
            },
          },
          required: ["course_id", "assignment_id", "override_id"],
        },
      },
      {
        name: "delete_assignment_override",
        description: "Delete an assignment override",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID",
            },
            override_id: {
              type: "string",
              description: "Override ID",
            },
          },
          required: ["course_id", "assignment_id", "override_id"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "list_assignments":
        const { course_id, ...listParams } = args;
        return await this.assignmentService.listAssignments(
          course_id,
          listParams
        );

      case "get_assignment":
        const { course_id: getCourseId, assignment_id, ...getParams } = args;
        return await this.assignmentService.getAssignment(
          getCourseId,
          assignment_id,
          getParams
        );

      case "create_assignment":
        const { course_id: createCourseId, ...createParams } = args;
        return await this.assignmentService.createAssignment(
          createCourseId,
          createParams
        );

      case "update_assignment":
        const {
          course_id: updateCourseId,
          assignment_id: updateAssignmentId,
          ...updateParams
        } = args;
        return await this.assignmentService.updateAssignment(
          updateCourseId,
          updateAssignmentId,
          updateParams
        );

      case "delete_assignment":
        return await this.assignmentService.deleteAssignment(
          args.course_id,
          args.assignment_id
        );

      case "duplicate_assignment":
        return await this.assignmentService.duplicateAssignment(
          args.course_id,
          args.assignment_id,
          args.result_type
        );

      case "bulk_update_assignment_dates":
        return await this.assignmentService.bulkUpdateAssignmentDates(
          args.course_id,
          args.assignments
        );

      case "list_assignment_overrides":
        return await this.assignmentService.listAssignmentOverrides(
          args.course_id,
          args.assignment_id
        );

      case "get_assignment_override":
        return await this.assignmentService.getAssignmentOverride(
          args.course_id,
          args.assignment_id,
          args.override_id
        );

      case "create_assignment_override":
        const {
          course_id: overrideCourseId,
          assignment_id: overrideAssignmentId,
          ...overrideData
        } = args;
        return await this.assignmentService.createAssignmentOverride(
          overrideCourseId,
          overrideAssignmentId,
          overrideData
        );

      case "update_assignment_override":
        const {
          course_id: updateOverrideCourseId,
          assignment_id: updateOverrideAssignmentId,
          override_id,
          ...updateOverrideData
        } = args;
        return await this.assignmentService.updateAssignmentOverride(
          updateOverrideCourseId,
          updateOverrideAssignmentId,
          override_id,
          updateOverrideData
        );

      case "delete_assignment_override":
        return await this.assignmentService.deleteAssignmentOverride(
          args.course_id,
          args.assignment_id,
          args.override_id
        );

      default:
        throw new Error(`Unknown assignment tool: ${name}`);
    }
  }
}
