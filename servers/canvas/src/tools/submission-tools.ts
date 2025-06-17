import { SubmissionService } from "../services/submission-service.js";

export class SubmissionTools {
  constructor(private submissionService: SubmissionService) {}

  getToolDefinitions() {
    return [
      {
        name: "submit_assignment",
        description: "Submit an assignment",
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
            submission_type: {
              type: "string",
              enum: [
                "online_text_entry",
                "online_url",
                "online_upload",
                "media_recording",
                "basic_lti_launch",
                "student_annotation",
              ],
              description: "Type of submission",
            },
            body: {
              type: "string",
              description: "HTML content for text submissions",
            },
            url: {
              type: "string",
              description: "URL for online URL submissions",
            },
            file_ids: {
              type: "array",
              items: { type: "number" },
              description: "File IDs for upload submissions",
            },
            media_comment_id: {
              type: "string",
              description: "Media comment ID for media submissions",
            },
            media_comment_type: {
              type: "string",
              enum: ["audio", "video"],
              description: "Type of media comment",
            },
            user_id: {
              type: "number",
              description:
                "Submit on behalf of user (requires grading permission)",
            },
            annotatable_attachment_id: {
              type: "number",
              description: "Attachment ID for student annotation",
            },
            submitted_at: {
              type: "string",
              description: "Submission timestamp (ISO 8601 format)",
            },
            comment_text: {
              type: "string",
              description: "Text comment to include with submission",
            },
            group_comment: {
              type: "boolean",
              description: "Send comment to entire group",
            },
          },
          required: ["course_id", "assignment_id", "submission_type"],
        },
      },
      {
        name: "list_assignment_submissions",
        description: "List submissions for an assignment",
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
                  "submission_history",
                  "submission_comments",
                  "submission_html_comments",
                  "rubric_assessment",
                  "assignment",
                  "visibility",
                  "course",
                  "user",
                  "group",
                  "read_status",
                  "student_entered_score",
                ],
              },
              description: "Additional information to include",
            },
            grouped: {
              type: "boolean",
              description: "Group submissions by student groups",
            },
          },
          required: ["course_id", "assignment_id"],
        },
      },
      {
        name: "list_submissions_for_multiple_assignments",
        description: "List submissions for multiple assignments",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            student_ids: {
              type: "array",
              items: { type: "string" },
              description: "Student IDs to get submissions for",
            },
            assignment_ids: {
              type: "array",
              items: { type: "string" },
              description: "Assignment IDs to get submissions for",
            },
            grouped: {
              type: "boolean",
              description: "Group submissions by student",
            },
            post_to_sis: {
              type: "boolean",
              description:
                "Only include SIS-enabled assignments and enrollments",
            },
            submitted_since: {
              type: "string",
              description: "Only submissions after this date (ISO 8601)",
            },
            graded_since: {
              type: "string",
              description: "Only submissions graded after this date (ISO 8601)",
            },
            grading_period_id: {
              type: "number",
              description: "Filter by grading period",
            },
            workflow_state: {
              type: "string",
              enum: ["submitted", "unsubmitted", "graded", "pending_review"],
              description: "Filter by submission state",
            },
            enrollment_state: {
              type: "string",
              enum: ["active", "concluded"],
              description: "Filter by enrollment state",
            },
            state_based_on_date: {
              type: "boolean",
              description: "Use effective enrollment state based on dates",
            },
            order: {
              type: "string",
              enum: ["id", "graded_at"],
              description: "Order submissions by field",
            },
            order_direction: {
              type: "string",
              enum: ["ascending", "descending"],
              description: "Order direction",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "submission_history",
                  "submission_comments",
                  "submission_html_comments",
                  "rubric_assessment",
                  "assignment",
                  "total_scores",
                  "visibility",
                  "course",
                  "user",
                  "sub_assignment_submissions",
                  "student_entered_score",
                ],
              },
              description: "Additional information to include",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "get_submission",
        description: "Get a single submission",
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
            user_id: {
              type: "string",
              description: "User ID",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "submission_history",
                  "submission_comments",
                  "submission_html_comments",
                  "rubric_assessment",
                  "full_rubric_assessment",
                  "visibility",
                  "course",
                  "user",
                  "read_status",
                  "student_entered_score",
                ],
              },
              description: "Additional information to include",
            },
          },
          required: ["course_id", "assignment_id", "user_id"],
        },
      },
      {
        name: "get_submission_by_anonymous_id",
        description: "Get a submission by anonymous ID",
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
            anonymous_id: {
              type: "string",
              description: "Anonymous submission ID",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "submission_history",
                  "submission_comments",
                  "rubric_assessment",
                  "full_rubric_assessment",
                  "visibility",
                  "course",
                  "user",
                  "read_status",
                ],
              },
              description: "Additional information to include",
            },
          },
          required: ["course_id", "assignment_id", "anonymous_id"],
        },
      },
      {
        name: "grade_submission",
        description: "Grade or comment on a submission",
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
            user_id: {
              type: "string",
              description: "User ID",
            },
            posted_grade: {
              type: "string",
              description:
                "Grade to assign (points, percentage, letter grade, or pass/fail)",
            },
            excuse: {
              type: "boolean",
              description: "Excuse the assignment",
            },
            late_policy_status: {
              type: "string",
              enum: ["late", "missing", "extended", "none"],
              description: "Late policy status",
            },
            sticker: {
              type: "string",
              enum: [
                "apple",
                "basketball",
                "bell",
                "book",
                "bookbag",
                "briefcase",
                "bus",
                "calendar",
                "chem",
                "design",
                "pencil",
                "beaker",
                "paintbrush",
                "computer",
                "column",
                "pen",
                "tablet",
                "telescope",
                "calculator",
                "paperclip",
                "composite_notebook",
                "scissors",
                "ruler",
                "clock",
                "globe",
                "grad",
                "gym",
                "mail",
                "microscope",
                "mouse",
                "music",
                "notebook",
                "page",
                "panda1",
                "panda2",
                "panda3",
                "panda4",
                "panda5",
                "panda6",
                "panda7",
                "panda8",
                "panda9",
                "presentation",
                "science",
                "science2",
                "star",
                "tag",
                "tape",
                "target",
                "trophy",
              ],
              description: "Sticker to assign",
            },
            seconds_late_override: {
              type: "number",
              description: "Override seconds late calculation",
            },
            text_comment: {
              type: "string",
              description: "Text comment to add",
            },
            attempt: {
              type: "number",
              description: "Attempt number for comment",
            },
            group_comment: {
              type: "boolean",
              description: "Send comment to entire group",
            },
            media_comment_id: {
              type: "string",
              description: "Media comment ID",
            },
            media_comment_type: {
              type: "string",
              enum: ["audio", "video"],
              description: "Media comment type",
            },
            file_ids: {
              type: "array",
              items: { type: "number" },
              description: "File IDs to attach to comment",
            },
            rubric_assessment: {
              type: "object",
              description: "Rubric assessment data",
            },
            include_visibility: {
              type: "string",
              description: "Include assignment visibility",
            },
            prefer_points_over_scheme: {
              type: "boolean",
              description:
                "Treat posted_grade as points if it matches grading scheme",
            },
          },
          required: ["course_id", "assignment_id", "user_id"],
        },
      },
      {
        name: "grade_submission_by_anonymous_id",
        description: "Grade or comment on a submission by anonymous ID",
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
            anonymous_id: {
              type: "string",
              description: "Anonymous submission ID",
            },
            posted_grade: {
              type: "string",
              description:
                "Grade to assign (points, percentage, letter grade, or pass/fail)",
            },
            excuse: {
              type: "boolean",
              description: "Excuse the assignment",
            },
            late_policy_status: {
              type: "string",
              enum: ["late", "missing", "extended", "none"],
              description: "Late policy status",
            },
            seconds_late_override: {
              type: "number",
              description: "Override seconds late calculation",
            },
            text_comment: {
              type: "string",
              description: "Text comment to add",
            },
            group_comment: {
              type: "boolean",
              description: "Send comment to entire group",
            },
            media_comment_id: {
              type: "string",
              description: "Media comment ID",
            },
            media_comment_type: {
              type: "string",
              enum: ["audio", "video"],
              description: "Media comment type",
            },
            file_ids: {
              type: "array",
              items: { type: "number" },
              description: "File IDs to attach to comment",
            },
            rubric_assessment: {
              type: "object",
              description: "Rubric assessment data",
            },
            include_visibility: {
              type: "string",
              description: "Include assignment visibility",
            },
          },
          required: ["course_id", "assignment_id", "anonymous_id"],
        },
      },
      {
        name: "list_gradeable_students",
        description: "List students eligible to submit an assignment",
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
        name: "list_multiple_assignments_gradeable_students",
        description: "List students eligible to submit multiple assignments",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_ids: {
              type: "array",
              items: { type: "string" },
              description: "Assignment IDs",
            },
          },
          required: ["course_id", "assignment_ids"],
        },
      },
      {
        name: "bulk_update_grades",
        description: "Update grades for multiple students on an assignment",
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
            grade_data: {
              type: "object",
              description: "Grade data keyed by student ID",
              additionalProperties: {
                type: "object",
                properties: {
                  posted_grade: { type: "string" },
                  excuse: { type: "boolean" },
                  rubric_assessment: { type: "object" },
                  text_comment: { type: "string" },
                  group_comment: { type: "boolean" },
                  media_comment_id: { type: "string" },
                  media_comment_type: { type: "string" },
                  file_ids: { type: "array", items: { type: "number" } },
                },
              },
            },
          },
          required: ["course_id", "assignment_id", "grade_data"],
        },
      },
      {
        name: "bulk_update_grades_for_course",
        description: "Update grades for multiple students across assignments",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            grade_data: {
              type: "object",
              description: "Grade data keyed by student ID",
              additionalProperties: {
                type: "object",
                properties: {
                  posted_grade: { type: "string" },
                  excuse: { type: "boolean" },
                  rubric_assessment: { type: "object" },
                  text_comment: { type: "string" },
                  group_comment: { type: "boolean" },
                  media_comment_id: { type: "string" },
                  media_comment_type: { type: "string" },
                  file_ids: { type: "array", items: { type: "number" } },
                },
              },
            },
          },
          required: ["course_id", "grade_data"],
        },
      },
      {
        name: "mark_submission_as_read",
        description: "Mark a submission as read",
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
            user_id: {
              type: "string",
              description: "User ID",
            },
          },
          required: ["course_id", "assignment_id", "user_id"],
        },
      },
      {
        name: "mark_submission_as_unread",
        description: "Mark a submission as unread",
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
            user_id: {
              type: "string",
              description: "User ID",
            },
          },
          required: ["course_id", "assignment_id", "user_id"],
        },
      },
      {
        name: "mark_bulk_submissions_as_read",
        description: "Mark multiple submissions as read",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            submission_ids: {
              type: "array",
              items: { type: "string" },
              description: "Submission IDs to mark as read",
            },
          },
          required: ["course_id", "submission_ids"],
        },
      },
      {
        name: "mark_submission_item_as_read",
        description: "Mark a specific submission item as read",
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
            user_id: {
              type: "string",
              description: "User ID",
            },
            item: {
              type: "string",
              enum: ["grade", "comment", "rubric"],
              description: "Item type to mark as read",
            },
          },
          required: ["course_id", "assignment_id", "user_id", "item"],
        },
      },
      {
        name: "get_submission_summary",
        description: "Get submission summary for an assignment",
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
            grouped: {
              type: "boolean",
              description: "Take student groups into account",
            },
          },
          required: ["course_id", "assignment_id"],
        },
      },
      // Gradebook History
      {
        name: "get_gradebook_history_days",
        description: "Get days with gradebook history",
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
      {
        name: "get_gradebook_history_day_details",
        description: "Get gradebook history details for a specific day",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            date: {
              type: "string",
              description: "Date (YYYY-MM-DD format)",
            },
          },
          required: ["course_id", "date"],
        },
      },
      {
        name: "get_gradebook_history_submissions",
        description:
          "Get gradebook history submissions for a specific grader and assignment",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            date: {
              type: "string",
              description: "Date (YYYY-MM-DD format)",
            },
            grader_id: {
              type: "string",
              description: "Grader ID",
            },
            assignment_id: {
              type: "string",
              description: "Assignment ID",
            },
          },
          required: ["course_id", "date", "grader_id", "assignment_id"],
        },
      },
      {
        name: "get_gradebook_history_feed",
        description: "Get uncollated gradebook history feed",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            assignment_id: {
              type: "number",
              description: "Filter by assignment ID",
            },
            user_id: {
              type: "number",
              description: "Filter by user ID",
            },
            ascending: {
              type: "boolean",
              description: "Return in ascending date order",
            },
          },
          required: ["course_id"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "submit_assignment":
        const {
          course_id,
          assignment_id,
          comment_text,
          group_comment,
          ...submissionParams
        } = args;
        const comment = comment_text
          ? { text_comment: comment_text, group_comment }
          : undefined;
        return await this.submissionService.submitAssignment(
          course_id,
          assignment_id,
          { ...submissionParams, comment }
        );

      case "list_assignment_submissions":
        const {
          course_id: listCourseId,
          assignment_id: listAssignmentId,
          ...listParams
        } = args;
        return await this.submissionService.listAssignmentSubmissions(
          listCourseId,
          listAssignmentId,
          listParams
        );

      case "list_submissions_for_multiple_assignments":
        const { course_id: multiCourseId, ...multiParams } = args;
        return await this.submissionService.listSubmissionsForMultipleAssignments(
          multiCourseId,
          multiParams
        );

      case "get_submission":
        const {
          course_id: getCourseId,
          assignment_id: getAssignmentId,
          user_id,
          ...getParams
        } = args;
        return await this.submissionService.getSubmission(
          getCourseId,
          getAssignmentId,
          user_id,
          getParams
        );

      case "get_submission_by_anonymous_id":
        const {
          course_id: getAnonCourseId,
          assignment_id: getAnonAssignmentId,
          anonymous_id,
          ...getAnonParams
        } = args;
        return await this.submissionService.getSubmissionByAnonymousId(
          getAnonCourseId,
          getAnonAssignmentId,
          anonymous_id,
          getAnonParams
        );

      case "grade_submission":
        const {
          course_id: gradeCourseId,
          assignment_id: gradeAssignmentId,
          user_id: gradeUserId,
          posted_grade,
          excuse,
          late_policy_status,
          sticker,
          seconds_late_override,
          text_comment: gradeTextComment,
          attempt,
          group_comment: gradeGroupComment,
          media_comment_id,
          media_comment_type,
          file_ids,
          rubric_assessment,
          include_visibility,
          prefer_points_over_scheme,
        } = args;

        const submission = {
          posted_grade,
          excuse,
          late_policy_status,
          sticker,
          seconds_late_override,
        };

        const gradeComment = {
          text_comment: gradeTextComment,
          attempt,
          group_comment: gradeGroupComment,
          media_comment_id,
          media_comment_type,
          file_ids,
        };

        return await this.submissionService.gradeSubmission(
          gradeCourseId,
          gradeAssignmentId,
          gradeUserId,
          {
            submission: Object.fromEntries(
              Object.entries(submission).filter(([_, v]) => v !== undefined)
            ),
            comment: Object.fromEntries(
              Object.entries(gradeComment).filter(([_, v]) => v !== undefined)
            ),
            rubric_assessment,
            include_visibility,
            prefer_points_over_scheme,
          }
        );

      case "grade_submission_by_anonymous_id":
        const {
          course_id: gradeAnonCourseId,
          assignment_id: gradeAnonAssignmentId,
          anonymous_id: gradeAnonId,
          posted_grade: anonPostedGrade,
          excuse: anonExcuse,
          late_policy_status: anonLatePolicy,
          seconds_late_override: anonSecondsLate,
          text_comment: anonTextComment,
          group_comment: anonGroupComment,
          media_comment_id: anonMediaId,
          media_comment_type: anonMediaType,
          file_ids: anonFileIds,
          rubric_assessment: anonRubric,
          include_visibility: anonIncludeVis,
        } = args;

        const anonSubmission = {
          posted_grade: anonPostedGrade,
          excuse: anonExcuse,
          late_policy_status: anonLatePolicy,
          seconds_late_override: anonSecondsLate,
        };

        const anonGradeComment = {
          text_comment: anonTextComment,
          group_comment: anonGroupComment,
          media_comment_id: anonMediaId,
          media_comment_type: anonMediaType,
          file_ids: anonFileIds,
        };

        return await this.submissionService.gradeSubmissionByAnonymousId(
          gradeAnonCourseId,
          gradeAnonAssignmentId,
          gradeAnonId,
          {
            submission: Object.fromEntries(
              Object.entries(anonSubmission).filter(([_, v]) => v !== undefined)
            ),
            comment: Object.fromEntries(
              Object.entries(anonGradeComment).filter(
                ([_, v]) => v !== undefined
              )
            ),
            rubric_assessment: anonRubric,
            include_visibility: anonIncludeVis,
          }
        );

      case "list_gradeable_students":
        return await this.submissionService.listGradeableStudents(
          args.course_id,
          args.assignment_id
        );

      case "list_multiple_assignments_gradeable_students":
        return await this.submissionService.listMultipleAssignmentsGradeableStudents(
          args.course_id,
          args.assignment_ids
        );

      case "bulk_update_grades":
        return await this.submissionService.bulkUpdateGrades(
          args.course_id,
          args.assignment_id,
          args.grade_data
        );

      case "bulk_update_grades_for_course":
        return await this.submissionService.bulkUpdateGradesForCourse(
          args.course_id,
          args.grade_data
        );

      case "mark_submission_as_read":
        return await this.submissionService.markSubmissionAsRead(
          args.course_id,
          args.assignment_id,
          args.user_id
        );

      case "mark_submission_as_unread":
        return await this.submissionService.markSubmissionAsUnread(
          args.course_id,
          args.assignment_id,
          args.user_id
        );

      case "mark_bulk_submissions_as_read":
        return await this.submissionService.markBulkSubmissionsAsRead(
          args.course_id,
          args.submission_ids
        );

      case "mark_submission_item_as_read":
        return await this.submissionService.markSubmissionItemAsRead(
          args.course_id,
          args.assignment_id,
          args.user_id,
          args.item
        );

      case "get_submission_summary":
        return await this.submissionService.getSubmissionSummary(
          args.course_id,
          args.assignment_id,
          args.grouped
        );

      case "get_gradebook_history_days":
        return await this.submissionService.getGradebookHistoryDays(
          args.course_id
        );

      case "get_gradebook_history_day_details":
        return await this.submissionService.getGradebookHistoryDayDetails(
          args.course_id,
          args.date
        );

      case "get_gradebook_history_submissions":
        return await this.submissionService.getGradebookHistorySubmissions(
          args.course_id,
          args.date,
          args.grader_id,
          args.assignment_id
        );

      case "get_gradebook_history_feed":
        const { course_id: feedCourseId, ...feedParams } = args;
        return await this.submissionService.getGradebookHistoryFeed(
          feedCourseId,
          feedParams
        );

      default:
        throw new Error(`Unknown submission tool: ${name}`);
    }
  }
}
