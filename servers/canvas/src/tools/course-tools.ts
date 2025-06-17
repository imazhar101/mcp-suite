import { CourseService } from "../services/course-service.js";

export class CourseTools {
  constructor(private courseService: CourseService) {}

  getToolDefinitions() {
    return [
      {
        name: "list_courses",
        description: "List courses for the current user",
        inputSchema: {
          type: "object",
          properties: {
            enrollment_type: {
              type: "string",
              description: "Filter by enrollment type",
              enum: ["teacher", "student", "ta", "observer", "designer"],
            },
            enrollment_state: {
              type: "string",
              description: "Filter by enrollment state",
              enum: ["active", "invited_or_pending", "completed"],
            },
            state: {
              type: "array",
              items: {
                type: "string",
                enum: ["unpublished", "available", "completed", "deleted"],
              },
              description: "Filter by course state",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "needs_grading_count",
                  "syllabus_body",
                  "public_description",
                  "total_scores",
                  "term",
                  "course_progress",
                  "sections",
                  "total_students",
                  "teachers",
                  "concluded",
                ],
              },
              description: "Additional information to include",
            },
          },
        },
      },
      {
        name: "get_course",
        description: "Get details of a specific course",
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
                  "needs_grading_count",
                  "syllabus_body",
                  "public_description",
                  "total_scores",
                  "term",
                  "course_progress",
                  "sections",
                  "total_students",
                  "teachers",
                  "permissions",
                  "concluded",
                ],
              },
              description: "Additional information to include",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "create_course",
        description: "Create a new course in an account",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID where the course will be created",
            },
            name: {
              type: "string",
              description: "Course name",
            },
            course_code: {
              type: "string",
              description: "Course code",
            },
            start_at: {
              type: "string",
              description: "Course start date in ISO8601 format",
            },
            end_at: {
              type: "string",
              description: "Course end date in ISO8601 format",
            },
            license: {
              type: "string",
              description: "Course license",
              enum: [
                "private",
                "cc_by_nc_nd",
                "cc_by_nc_sa",
                "cc_by_nc",
                "cc_by_nd",
                "cc_by_sa",
                "cc_by",
                "public_domain",
              ],
            },
            is_public: {
              type: "boolean",
              description: "Make course public to all users",
            },
            is_public_to_auth_users: {
              type: "boolean",
              description: "Make course public to authenticated users",
            },
            public_syllabus: {
              type: "boolean",
              description: "Make syllabus public",
            },
            public_description: {
              type: "string",
              description: "Public description of the course",
            },
            allow_student_wiki_edits: {
              type: "boolean",
              description: "Allow students to edit wiki",
            },
            allow_wiki_comments: {
              type: "boolean",
              description: "Allow wiki comments",
            },
            allow_student_forum_attachments: {
              type: "boolean",
              description: "Allow student forum attachments",
            },
            open_enrollment: {
              type: "boolean",
              description: "Enable open enrollment",
            },
            self_enrollment: {
              type: "boolean",
              description: "Enable self enrollment",
            },
            restrict_enrollments_to_course_dates: {
              type: "boolean",
              description: "Restrict enrollments to course dates",
            },
            term_id: {
              type: "string",
              description: "Enrollment term ID",
            },
            sis_course_id: {
              type: "string",
              description: "SIS course ID",
            },
            integration_id: {
              type: "string",
              description: "Integration ID",
            },
            hide_final_grades: {
              type: "boolean",
              description: "Hide final grades",
            },
            apply_assignment_group_weights: {
              type: "boolean",
              description: "Apply assignment group weights",
            },
            time_zone: {
              type: "string",
              description: "Course time zone",
            },
            offer: {
              type: "boolean",
              description: "Make course available to students immediately",
            },
            enroll_me: {
              type: "boolean",
              description: "Enroll current user as teacher",
            },
            default_view: {
              type: "string",
              description: "Default course view",
              enum: ["feed", "wiki", "modules", "syllabus", "assignments"],
            },
            syllabus_body: {
              type: "string",
              description: "Course syllabus content",
            },
            grading_standard_id: {
              type: "number",
              description:
                "The grading standard id to set for the course. If no value is provided for this argument the current grading_standard will be un-set from this course.",
            },
            course_format: {
              type: "string",
              description: "Course format",
              enum: ["on_campus", "online", "blended"],
            },
          },
          required: ["account_id"],
        },
      },
      {
        name: "update_course",
        description: "Update an existing course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID to update",
            },
            name: {
              type: "string",
              description: "Course name",
            },
            course_code: {
              type: "string",
              description: "Course code",
            },
            start_at: {
              type: "string",
              description: "Course start date in ISO8601 format",
            },
            end_at: {
              type: "string",
              description: "Course end date in ISO8601 format",
            },
            license: {
              type: "string",
              description: "Course license",
            },
            is_public: {
              type: "boolean",
              description: "Make course public to all users",
            },
            is_public_to_auth_users: {
              type: "boolean",
              description: "Make course public to authenticated users",
            },
            public_syllabus: {
              type: "boolean",
              description: "Make syllabus public",
            },
            public_description: {
              type: "string",
              description: "Public description of the course",
            },
            allow_student_wiki_edits: {
              type: "boolean",
              description: "Allow students to edit wiki",
            },
            allow_wiki_comments: {
              type: "boolean",
              description: "Allow wiki comments",
            },
            allow_student_forum_attachments: {
              type: "boolean",
              description: "Allow student forum attachments",
            },
            open_enrollment: {
              type: "boolean",
              description: "Enable open enrollment",
            },
            self_enrollment: {
              type: "boolean",
              description: "Enable self enrollment",
            },
            restrict_enrollments_to_course_dates: {
              type: "boolean",
              description: "Restrict enrollments to course dates",
            },
            hide_final_grades: {
              type: "boolean",
              description: "Hide final grades",
            },
            apply_assignment_group_weights: {
              type: "boolean",
              description: "Apply assignment group weights",
            },
            time_zone: {
              type: "string",
              description: "Course time zone",
            },
            offer: {
              type: "boolean",
              description: "Make course available to students",
            },
            event: {
              type: "string",
              description: "Course action to take",
              enum: ["claim", "offer", "conclude", "delete", "undelete"],
            },
            default_view: {
              type: "string",
              description: "Default course view",
              enum: ["feed", "wiki", "modules", "syllabus", "assignments"],
            },
            syllabus_body: {
              type: "string",
              description: "Course syllabus content",
            },
            grading_standard_id: {
              type: "number",
              description:
                "The grading standard id to set for the course. If no value is provided for this argument the current grading_standard will be un-set from this course.",
            },
            course_format: {
              type: "string",
              description: "Course format",
              enum: ["on_campus", "online", "blended"],
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "delete_course",
        description: "Delete or conclude a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID to delete/conclude",
            },
            event: {
              type: "string",
              description: "Action to take",
              enum: ["delete", "conclude"],
            },
          },
          required: ["course_id", "event"],
        },
      },
      {
        name: "list_course_users",
        description: "List users enrolled in a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            search_term: {
              type: "string",
              description: "Search term for user names or IDs",
            },
            sort: {
              type: "string",
              description: "Sort field",
              enum: ["username", "last_login", "email", "sis_id"],
            },
            enrollment_type: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "teacher",
                  "student",
                  "student_view",
                  "ta",
                  "observer",
                  "designer",
                ],
              },
              description: "Filter by enrollment type",
            },
            enrollment_state: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "active",
                  "invited",
                  "rejected",
                  "completed",
                  "inactive",
                ],
              },
              description: "Filter by enrollment state",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "enrollments",
                  "locked",
                  "avatar_url",
                  "test_student",
                  "bio",
                  "custom_links",
                  "current_grading_period_scores",
                  "uuid",
                ],
              },
              description: "Additional information to include",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "get_course_user",
        description: "Get details of a specific user in a course",
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
            include: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "enrollments",
                  "locked",
                  "avatar_url",
                  "bio",
                  "custom_links",
                  "current_grading_period_scores",
                  "uuid",
                ],
              },
              description: "Additional information to include",
            },
          },
          required: ["course_id", "user_id"],
        },
      },
      {
        name: "get_user_progress",
        description: "Get user progress in a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
          },
          required: ["course_id", "user_id"],
        },
      },
      {
        name: "get_course_settings",
        description: "Get course settings",
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
        name: "update_course_settings",
        description: "Update course settings",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            allow_student_discussion_topics: {
              type: "boolean",
              description: "Allow students to create discussion topics",
            },
            allow_student_forum_attachments: {
              type: "boolean",
              description: "Allow students to attach files to discussions",
            },
            allow_student_discussion_editing: {
              type: "boolean",
              description: "Allow students to edit discussion replies",
            },
            allow_student_organized_groups: {
              type: "boolean",
              description: "Allow students to organize groups",
            },
            hide_final_grades: {
              type: "boolean",
              description: "Hide final grades in student summary",
            },
            hide_distribution_graphs: {
              type: "boolean",
              description: "Hide grade distribution graphs",
            },
            lock_all_announcements: {
              type: "boolean",
              description: "Disable comments on announcements",
            },
            usage_rights_required: {
              type: "boolean",
              description: "Require copyright info for files",
            },
            restrict_student_past_view: {
              type: "boolean",
              description: "Restrict student access after end date",
            },
            restrict_student_future_view: {
              type: "boolean",
              description: "Restrict student access before start date",
            },
            show_announcements_on_home_page: {
              type: "boolean",
              description: "Show announcements on home page",
            },
            home_page_announcement_limit: {
              type: "number",
              description: "Number of announcements to show on home page",
            },
            syllabus_course_summary: {
              type: "boolean",
              description: "Show course summary on syllabus page",
            },
            default_due_time: {
              type: "string",
              description: "Default due time for assignments (HH:MM:SS)",
            },
          },
          required: ["course_id"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "list_courses":
        return await this.courseService.listCourses(args);

      case "get_course":
        return await this.courseService.getCourse(args.course_id, args.include);

      case "create_course":
        return await this.courseService.createCourse(args);

      case "update_course":
        return await this.courseService.updateCourse(args);

      case "delete_course":
        return await this.courseService.deleteCourse(
          args.course_id,
          args.event
        );

      case "list_course_users":
        return await this.courseService.listCourseUsers(args);

      case "get_course_user":
        return await this.courseService.getCourseUser(
          args.course_id,
          args.user_id,
          args.include
        );

      case "get_user_progress":
        return await this.courseService.getUserProgress(args);

      case "get_course_settings":
        return await this.courseService.getCourseSettings(args.course_id);

      case "update_course_settings":
        const { course_id, ...settings } = args;
        return await this.courseService.updateCourseSettings(
          course_id,
          settings
        );

      default:
        throw new Error(`Unknown course tool: ${name}`);
    }
  }
}
