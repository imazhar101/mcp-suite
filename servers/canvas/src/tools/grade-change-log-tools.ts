import { GradeChangeLogService } from "../services/grade-change-log-service.js";

export class GradeChangeLogTools {
  constructor(private gradeChangeLogService: GradeChangeLogService) {}

  getToolDefinitions() {
    return [
      {
        name: "query_grade_changes_by_assignment",
        description: "Query grade change events by assignment",
        inputSchema: {
          type: "object",
          properties: {
            assignment_id: {
              type: "string",
              description: "Assignment ID",
            },
            start_time: {
              type: "string",
              description:
                "The beginning of the time range from which you want events (DateTime)",
            },
            end_time: {
              type: "string",
              description:
                "The end of the time range from which you want events (DateTime)",
            },
          },
          required: ["assignment_id"],
        },
      },
      {
        name: "query_grade_changes_by_course",
        description: "Query grade change events by course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            start_time: {
              type: "string",
              description:
                "The beginning of the time range from which you want events (DateTime)",
            },
            end_time: {
              type: "string",
              description:
                "The end of the time range from which you want events (DateTime)",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "query_grade_changes_by_student",
        description: "Query grade change events by student",
        inputSchema: {
          type: "object",
          properties: {
            student_id: {
              type: "string",
              description: "Student ID",
            },
            start_time: {
              type: "string",
              description:
                "The beginning of the time range from which you want events (DateTime)",
            },
            end_time: {
              type: "string",
              description:
                "The end of the time range from which you want events (DateTime)",
            },
          },
          required: ["student_id"],
        },
      },
      {
        name: "query_grade_changes_by_grader",
        description: "Query grade change events by grader",
        inputSchema: {
          type: "object",
          properties: {
            grader_id: {
              type: "string",
              description: "Grader ID",
            },
            start_time: {
              type: "string",
              description:
                "The beginning of the time range from which you want events (DateTime)",
            },
            end_time: {
              type: "string",
              description:
                "The end of the time range from which you want events (DateTime)",
            },
          },
          required: ["grader_id"],
        },
      },
      {
        name: "query_grade_changes_advanced",
        description:
          "Advanced query for grade change events satisfying all given parameters. At least one of course_id, assignment_id, student_id, or grader_id must be specified.",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "number",
              description: "Restrict query to events in the specified course",
            },
            assignment_id: {
              type: "number",
              description:
                "Restrict query to the given assignment. If 'override' is given, query the course final grade override instead.",
            },
            student_id: {
              type: "number",
              description: "User id of a student to search grading events for",
            },
            grader_id: {
              type: "number",
              description: "User id of a grader to search grading events for",
            },
            start_time: {
              type: "string",
              description:
                "The beginning of the time range from which you want events (DateTime)",
            },
            end_time: {
              type: "string",
              description:
                "The end of the time range from which you want events (DateTime)",
            },
          },
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "query_grade_changes_by_assignment":
        return await this.gradeChangeLogService.queryByAssignment(args);

      case "query_grade_changes_by_course":
        return await this.gradeChangeLogService.queryByCourse(args);

      case "query_grade_changes_by_student":
        return await this.gradeChangeLogService.queryByStudent(args);

      case "query_grade_changes_by_grader":
        return await this.gradeChangeLogService.queryByGrader(args);

      case "query_grade_changes_advanced":
        return await this.gradeChangeLogService.advancedQuery(args);

      default:
        throw new Error(`Unknown grade change log tool: ${name}`);
    }
  }
}
