import { EnrollmentService } from "../services/enrollment-service.js";

export class EnrollmentTools {
  constructor(private enrollmentService: EnrollmentService) {}

  getToolDefinitions() {
    return [
      {
        name: "list_enrollments",
        description: "List enrollments for a course, section, or user",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              description: "Context type: course, section, or user",
              enum: ["course", "section", "user"],
            },
            context_id: {
              type: "string",
              description: "ID of the course, section, or user",
            },
            type: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "StudentEnrollment",
                  "TeacherEnrollment",
                  "TaEnrollment",
                  "DesignerEnrollment",
                  "ObserverEnrollment",
                ],
              },
              description: "Filter by enrollment types",
            },
            role: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter by enrollment roles",
            },
            state: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "active",
                  "invited",
                  "creation_pending",
                  "deleted",
                  "rejected",
                  "completed",
                  "inactive",
                  "current_and_invited",
                  "current_and_future",
                  "current_future_and_restricted",
                  "current_and_concluded",
                ],
              },
              description: "Filter by enrollment states",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "avatar_url",
                  "group_ids",
                  "locked",
                  "observed_users",
                  "can_be_removed",
                  "uuid",
                  "current_points",
                  "user",
                ],
              },
              description: "Additional information to include",
            },
            user_id: {
              type: "string",
              description: "Filter by specific user ID",
            },
            grading_period_id: {
              type: "number",
              description: "Filter by grading period ID",
            },
            enrollment_term_id: {
              type: "number",
              description: "Filter by enrollment term ID",
            },
            sis_account_id: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter by SIS account IDs",
            },
            sis_course_id: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter by SIS course IDs",
            },
            sis_section_id: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter by SIS section IDs",
            },
            sis_user_id: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter by SIS user IDs",
            },
            created_for_sis_id: {
              type: "boolean",
              description: "Filter enrollments created for specific SIS IDs",
            },
          },
          required: ["context", "context_id"],
        },
      },
      {
        name: "get_enrollment",
        description: "Get a specific enrollment by ID",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            enrollment_id: {
              type: "string",
              description: "Enrollment ID",
            },
          },
          required: ["account_id", "enrollment_id"],
        },
      },
      {
        name: "create_enrollment",
        description: "Create a new enrollment in a course or section",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              description: "Context type: course or section",
              enum: ["course", "section"],
            },
            context_id: {
              type: "string",
              description: "ID of the course or section",
            },
            user_id: {
              type: "string",
              description: "ID of the user to enroll",
            },
            type: {
              type: "string",
              description: "Type of enrollment",
              enum: [
                "StudentEnrollment",
                "TeacherEnrollment",
                "TaEnrollment",
                "ObserverEnrollment",
                "DesignerEnrollment",
              ],
            },
            role_id: {
              type: "number",
              description: "Custom role ID",
            },
            enrollment_state: {
              type: "string",
              description: "Initial enrollment state",
              enum: ["active", "invited", "inactive"],
              default: "invited",
            },
            course_section_id: {
              type: "number",
              description: "Section ID for the enrollment",
            },
            limit_privileges_to_course_section: {
              type: "boolean",
              description: "Limit user privileges to their section",
            },
            notify: {
              type: "boolean",
              description: "Send notification to the user",
              default: false,
            },
            self_enrollment_code: {
              type: "string",
              description: "Self-enrollment code",
            },
            self_enrolled: {
              type: "boolean",
              description: "Mark as self-enrolled",
            },
            associated_user_id: {
              type: "number",
              description: "Associated user ID for observer enrollments",
            },
            start_at: {
              type: "string",
              description: "Enrollment start date (ISO8601)",
            },
            end_at: {
              type: "string",
              description: "Enrollment end date (ISO8601)",
            },
            sis_user_id: {
              type: "string",
              description: "SIS user ID",
            },
            integration_id: {
              type: "string",
              description: "Integration ID",
            },
            root_account: {
              type: "string",
              description: "Root account domain",
            },
          },
          required: ["context", "context_id", "user_id", "type"],
        },
      },
      {
        name: "update_enrollment",
        description: "Conclude, deactivate, or delete an enrollment",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            enrollment_id: {
              type: "string",
              description: "Enrollment ID",
            },
            task: {
              type: "string",
              description: "Action to perform",
              enum: ["conclude", "delete", "inactivate", "deactivate"],
              default: "conclude",
            },
          },
          required: ["course_id", "enrollment_id"],
        },
      },
      {
        name: "accept_enrollment",
        description: "Accept a course invitation",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            enrollment_id: {
              type: "string",
              description: "Enrollment ID",
            },
          },
          required: ["course_id", "enrollment_id"],
        },
      },
      {
        name: "reject_enrollment",
        description: "Reject a course invitation",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            enrollment_id: {
              type: "string",
              description: "Enrollment ID",
            },
          },
          required: ["course_id", "enrollment_id"],
        },
      },
      {
        name: "reactivate_enrollment",
        description: "Reactivate an inactive enrollment",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            enrollment_id: {
              type: "string",
              description: "Enrollment ID",
            },
          },
          required: ["course_id", "enrollment_id"],
        },
      },
      {
        name: "add_last_attended_date",
        description: "Add last attended date to student enrollment",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            user_id: {
              type: "string",
              description: "User ID",
            },
            date: {
              type: "string",
              description: "Last attended date",
            },
          },
          required: ["course_id", "user_id"],
        },
      },
      {
        name: "get_temporary_enrollment_status",
        description: "Get temporary enrollment status for a user",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID",
            },
            account_id: {
              type: "string",
              description: "Account ID (optional)",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "bulk_create_enrollments",
        description: "Create multiple enrollments at once",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "string",
              description: "Context type: course or section",
              enum: ["course", "section"],
            },
            context_id: {
              type: "string",
              description: "ID of the course or section",
            },
            enrollments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user_id: {
                    type: "string",
                    description: "ID of the user to enroll",
                  },
                  type: {
                    type: "string",
                    description: "Type of enrollment",
                    enum: [
                      "StudentEnrollment",
                      "TeacherEnrollment",
                      "TaEnrollment",
                      "ObserverEnrollment",
                      "DesignerEnrollment",
                    ],
                  },
                  enrollment_state: {
                    type: "string",
                    enum: ["active", "invited", "inactive"],
                  },
                  notify: {
                    type: "boolean",
                  },
                },
                required: ["user_id", "type"],
              },
              description: "Array of enrollment objects",
            },
          },
          required: ["context", "context_id", "enrollments"],
        },
      },
      {
        name: "get_active_students",
        description: "Get active student enrollments for a course",
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
        name: "get_course_teachers",
        description: "Get teacher enrollments for a course",
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
        name: "get_pending_enrollments",
        description: "Get pending enrollments (invitations) for a course",
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
        name: "enroll_students",
        description: "Enroll multiple users as students in a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            user_ids: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of user IDs to enroll",
            },
            enrollment_state: {
              type: "string",
              description: "Enrollment state for all students",
              enum: ["active", "invited", "inactive"],
              default: "active",
            },
            notify: {
              type: "boolean",
              description: "Send notifications to users",
              default: false,
            },
            course_section_id: {
              type: "number",
              description: "Section ID for all enrollments",
            },
          },
          required: ["course_id", "user_ids"],
        },
      },
      {
        name: "remove_enrollments",
        description: "Remove multiple enrollments from a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            enrollment_ids: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of enrollment IDs to remove",
            },
            task: {
              type: "string",
              description: "Removal method",
              enum: ["conclude", "delete", "inactivate", "deactivate"],
              default: "conclude",
            },
          },
          required: ["course_id", "enrollment_ids"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "list_enrollments":
        return await this.enrollmentService.listEnrollments(
          args.context,
          args.context_id,
          args
        );

      case "get_enrollment":
        return await this.enrollmentService.getEnrollment(
          args.account_id,
          args.enrollment_id
        );

      case "create_enrollment":
        return await this.enrollmentService.createEnrollment(
          args.context,
          args.context_id,
          args
        );

      case "update_enrollment":
        return await this.enrollmentService.updateEnrollment(
          args.course_id,
          args.enrollment_id,
          args
        );

      case "accept_enrollment":
        return await this.enrollmentService.acceptEnrollment(args);

      case "reject_enrollment":
        return await this.enrollmentService.rejectEnrollment(args);

      case "reactivate_enrollment":
        return await this.enrollmentService.reactivateEnrollment(args);

      case "add_last_attended_date":
        return await this.enrollmentService.addLastAttendedDate(args);

      case "get_temporary_enrollment_status":
        return await this.enrollmentService.getTemporaryEnrollmentStatus(args);

      case "bulk_create_enrollments":
        return await this.enrollmentService.bulkCreateEnrollments(
          args.context,
          args.context_id,
          args.enrollments
        );

      case "get_active_students":
        return await this.enrollmentService.getActiveStudents(args.course_id);

      case "get_course_teachers":
        return await this.enrollmentService.getCourseTeachers(args.course_id);

      case "get_pending_enrollments":
        return await this.enrollmentService.getPendingEnrollments(
          args.course_id
        );

      case "enroll_students":
        return await this.enrollmentService.enrollStudents(
          args.course_id,
          args.user_ids,
          {
            enrollment_state: args.enrollment_state,
            notify: args.notify,
            course_section_id: args.course_section_id,
          }
        );

      case "remove_enrollments":
        return await this.enrollmentService.removeEnrollments(
          args.course_id,
          args.enrollment_ids,
          args.task
        );

      default:
        throw new Error(`Unknown enrollment tool: ${name}`);
    }
  }
}
