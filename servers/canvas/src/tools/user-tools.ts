import { UserService } from "../services/user-service.js";

export class UserTools {
  constructor(private userService: UserService) {}

  getToolDefinitions() {
    return [
      {
        name: "list_account_users",
        description: "List users in an account",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            search_term: {
              type: "string",
              description:
                "The partial name or full ID of the users to match and return in the results list. Must be at least 3 characters.",
            },
            enrollment_type: {
              type: "string",
              description:
                "When set, only return users enrolled with the specified course-level base role",
              enum: ["student", "teacher", "ta", "observer", "designer"],
            },
            sort: {
              type: "string",
              description: "The column to sort results by",
              enum: [
                "username",
                "email",
                "sis_id",
                "integration_id",
                "last_login",
              ],
            },
            order: {
              type: "string",
              description: "The order to sort the given column by",
              enum: ["asc", "desc"],
            },
            include_deleted_users: {
              type: "boolean",
              description:
                "When set to true and used with an account context, returns users who have deleted pseudonyms for the context",
            },
          },
          required: ["account_id"],
        },
      },
      {
        name: "get_user",
        description: "Show user details",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["uuid", "last_login"],
              },
              description:
                "Array of additional information to include on the user record",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "create_user",
        description:
          "Create and return a new user and pseudonym for an account",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID where the user will be created",
            },
            user_name: {
              type: "string",
              description:
                "The full name of the user. This name will be used by teacher for grading.",
            },
            user_short_name: {
              type: "string",
              description:
                "User's name as it will be displayed in discussions, messages, and comments.",
            },
            user_sortable_name: {
              type: "string",
              description:
                "User's name as used to sort alphabetically in lists.",
            },
            user_time_zone: {
              type: "string",
              description:
                "The time zone for the user. Allowed time zones are IANA time zones or friendlier Ruby on Rails time zones.",
            },
            user_locale: {
              type: "string",
              description:
                "The user's preferred language, from the list of languages Canvas supports. This is in RFC-5646 format.",
            },
            user_terms_of_use: {
              type: "boolean",
              description:
                "Whether the user accepts the terms of use. Required if this is a self-registration and this canvas instance requires users to accept the terms.",
            },
            user_skip_registration: {
              type: "boolean",
              description: "Automatically mark the user as registered.",
            },
            pseudonym_unique_id: {
              type: "string",
              description:
                "User's login ID. If this is a self-registration, it must be a valid email address.",
            },
            pseudonym_password: {
              type: "string",
              description:
                "User's password. Cannot be set during self-registration.",
            },
            pseudonym_sis_user_id: {
              type: "string",
              description:
                "SIS ID for the user's account. To set this parameter, the caller must be able to manage SIS permissions.",
            },
            pseudonym_integration_id: {
              type: "string",
              description:
                "Integration ID for the login. To set this parameter, the caller must be able to manage SIS permissions.",
            },
            pseudonym_send_confirmation: {
              type: "boolean",
              description:
                "Send user notification of account creation if true. Automatically set to true during self-registration.",
            },
            pseudonym_force_self_registration: {
              type: "boolean",
              description: "Send user a self-registration style email if true.",
            },
            pseudonym_authentication_provider_id: {
              type: "string",
              description:
                "The authentication provider this login is associated with.",
            },
            communication_channel_type: {
              type: "string",
              description:
                "The communication channel type, e.g. 'email' or 'sms'.",
            },
            communication_channel_address: {
              type: "string",
              description:
                "The communication channel address, e.g. the user's email address.",
            },
            communication_channel_confirmation_url: {
              type: "boolean",
              description:
                "Only valid for account admins. If true, returns the new user account confirmation URL in the response.",
            },
            communication_channel_skip_confirmation: {
              type: "boolean",
              description:
                "Only valid for site admins and account admins making requests; If true, the channel is automatically validated and no confirmation email or SMS is sent.",
            },
            force_validations: {
              type: "boolean",
              description:
                "If true, validations are performed on the newly created user even if the request is made by a privileged user like an admin.",
            },
            enable_sis_reactivation: {
              type: "boolean",
              description:
                "When true, will first try to re-activate a deleted user with matching sis_user_id if possible.",
            },
            destination: {
              type: "string",
              description:
                "If you're setting the password for the newly created user, you can provide this param with a valid URL pointing into this Canvas installation.",
            },
            initial_enrollment_type: {
              type: "string",
              description:
                "'observer' if doing a self-registration with a pairing code. This allows setting the password during user creation.",
            },
            pairing_code: {
              type: "string",
              description:
                "If provided and valid, will link the new user as an observer to the student's whose pairing code is given.",
            },
          },
          required: ["account_id", "pseudonym_unique_id"],
        },
      },
      {
        name: "update_user",
        description: "Modify an existing user",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID",
            },
            user_name: {
              type: "string",
              description:
                "The full name of the user. This name will be used by teacher for grading.",
            },
            user_short_name: {
              type: "string",
              description:
                "User's name as it will be displayed in discussions, messages, and comments.",
            },
            user_sortable_name: {
              type: "string",
              description:
                "User's name as used to sort alphabetically in lists.",
            },
            user_time_zone: {
              type: "string",
              description: "The time zone for the user.",
            },
            user_email: {
              type: "string",
              description: "The default email address of the user.",
            },
            user_locale: {
              type: "string",
              description:
                "The user's preferred language, from the list of languages Canvas supports.",
            },
            user_avatar_token: {
              type: "string",
              description:
                "A unique representation of the avatar record to assign as the user's current avatar.",
            },
            user_avatar_url: {
              type: "string",
              description:
                "To set the user's avatar to point to an external url.",
            },
            user_avatar_state: {
              type: "string",
              description:
                "To set the state of user's avatar. Only valid for account administrator.",
              enum: [
                "none",
                "submitted",
                "approved",
                "locked",
                "reported",
                "re_reported",
              ],
            },
            user_title: {
              type: "string",
              description: "Sets a title on the user profile.",
            },
            user_bio: {
              type: "string",
              description: "Sets a bio on the user profile.",
            },
            user_pronunciation: {
              type: "string",
              description: "Sets name pronunciation on the user profile.",
            },
            user_pronouns: {
              type: "string",
              description: "Sets pronouns on the user profile.",
            },
            user_event: {
              type: "string",
              description:
                "Suspends or unsuspends all logins for this user that the calling user has permission to",
              enum: ["suspend", "unsuspend"],
            },
            override_sis_stickiness: {
              type: "boolean",
              description:
                "Default is true. If false, any fields containing 'sticky' changes will not be updated.",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "get_user_profile",
        description:
          "Returns user profile data, including user id, name, and profile pic",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "list_avatar_options",
        description:
          "A paginated list of the possible user avatar options that can be set with the user update endpoint",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "list_page_views",
        description:
          "Return a paginated list of the user's page view history in json format",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID",
            },
            start_time: {
              type: "string",
              description:
                "The beginning of the time range from which you want page views.",
            },
            end_time: {
              type: "string",
              description:
                "The end of the time range from which you want page views.",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "get_activity_stream",
        description:
          "Returns the current user's global activity stream, paginated",
        inputSchema: {
          type: "object",
          properties: {
            only_active_courses: {
              type: "boolean",
              description:
                "If true, will only return objects for courses the user is actively participating in",
            },
          },
        },
      },
      {
        name: "get_activity_stream_summary",
        description:
          "Returns a summary of the current user's global activity stream",
        inputSchema: {
          type: "object",
          properties: {
            only_active_courses: {
              type: "boolean",
              description:
                "If true, will only return objects for courses the user is actively participating in",
            },
          },
        },
      },
      {
        name: "get_todo_items",
        description:
          "A paginated list of the current user's list of todo items",
        inputSchema: {
          type: "object",
          properties: {
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["ungraded_quizzes"],
              },
              description:
                "Optionally include ungraded quizzes (such as practice quizzes and surveys) in the list",
            },
          },
        },
      },
      {
        name: "get_todo_item_count",
        description:
          "Counts of different todo items such as the number of assignments needing grading as well as the number of assignments needing submitting",
        inputSchema: {
          type: "object",
          properties: {
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["ungraded_quizzes"],
              },
              description: "Optionally include ungraded quizzes in the count",
            },
          },
        },
      },
      {
        name: "get_upcoming_events",
        description: "A paginated list of the current user's upcoming events",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_missing_submissions",
        description:
          "A paginated list of past-due assignments for which the student does not have a submission",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "The student's ID",
            },
            observed_user_id: {
              type: "string",
              description:
                "Return missing submissions for the given observed user. Must be accompanied by course_ids[].",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["planner_overrides", "course"],
              },
              description:
                "Optionally include the assignment's associated planner override or courses",
            },
            filter: {
              type: "array",
              items: {
                type: "string",
                enum: ["submittable", "current_grading_period"],
              },
              description:
                "Only return assignments that the current user can submit or are in the current grading period",
            },
            course_ids: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "Optionally restricts the list of past-due assignments to only those associated with the specified course IDs",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "hide_stream_item",
        description: "Hide the given stream item",
        inputSchema: {
          type: "object",
          properties: {
            stream_item_id: {
              type: "string",
              description: "Stream item ID",
            },
          },
          required: ["stream_item_id"],
        },
      },
      {
        name: "hide_all_stream_items",
        description: "Hide all stream items for the user",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_user_settings",
        description: "Get user settings",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "update_user_settings",
        description: "Update an existing user's settings",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            manual_mark_as_read: {
              type: "boolean",
              description:
                "If true, require user to manually mark discussion posts as read (don't auto-mark as read)",
            },
            release_notes_badge_disabled: {
              type: "boolean",
              description: "If true, hide the badge for new release notes",
            },
            collapse_global_nav: {
              type: "boolean",
              description:
                "If true, the user's page loads with the global navigation collapsed",
            },
            collapse_course_nav: {
              type: "boolean",
              description:
                "If true, the user's course pages will load with the course navigation collapsed",
            },
            hide_dashcard_color_overlays: {
              type: "boolean",
              description:
                "If true, images on course cards will be presented without being tinted to match the course color",
            },
            comment_library_suggestions_enabled: {
              type: "boolean",
              description:
                "If true, suggestions within the comment library will be shown",
            },
            elementary_dashboard_disabled: {
              type: "boolean",
              description:
                "If true, will display the user's preferred class Canvas dashboard view instead of the canvas for elementary view",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "get_custom_colors",
        description:
          "Returns all custom colors that have been saved for a user",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "get_custom_color",
        description:
          "Returns the custom colors that have been saved for a user for a given context",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            asset_string: {
              type: "string",
              description:
                "The asset string parameter should be in the format 'context_id', for example 'course_42'",
            },
          },
          required: ["user_id", "asset_string"],
        },
      },
      {
        name: "update_custom_color",
        description: "Updates a custom color for a user for a given context",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            asset_string: {
              type: "string",
              description:
                "The asset string parameter should be in the format 'context_id', for example 'course_42'",
            },
            hexcode: {
              type: "string",
              description: "The hexcode of the color to set for the context",
            },
          },
          required: ["user_id", "asset_string", "hexcode"],
        },
      },
      {
        name: "update_text_editor_preference",
        description: "Updates a user's default choice for text editor",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            text_editor_preference: {
              type: "string",
              description: "The identifier for the editor",
              enum: ["block_editor", "rce", ""],
            },
          },
          required: ["user_id", "text_editor_preference"],
        },
      },
      {
        name: "update_files_ui_version_preference",
        description: "Updates a user's default choice for files UI version",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            files_ui_version: {
              type: "string",
              description: "The identifier for the files UI version",
              enum: ["v1", "v2"],
            },
          },
          required: ["user_id", "files_ui_version"],
        },
      },
      {
        name: "get_dashboard_positions",
        description:
          "Returns all dashboard positions that have been saved for a user",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "update_dashboard_positions",
        description:
          "Updates the dashboard positions for a user for a given context",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            dashboard_positions: {
              type: "object",
              description:
                "Dashboard positions as key-value pairs where keys are context IDs and values are position numbers",
              additionalProperties: {
                type: "number",
              },
            },
          },
          required: ["user_id", "dashboard_positions"],
        },
      },
      {
        name: "terminate_all_sessions",
        description: "Terminates all sessions for a user",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "expire_mobile_sessions",
        description:
          "Permanently expires any active mobile sessions, forcing them to re-authorize",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description:
                "User ID (optional - if not provided, expires mobile sessions for all users in the institution)",
            },
          },
        },
      },
      {
        name: "merge_user",
        description: "Merge a user into another user",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID to merge (this user will be deleted)",
            },
            destination_user_id: {
              type: "string",
              description: "Destination user ID (this user will remain)",
            },
            destination_account_id: {
              type: "string",
              description:
                "Destination account ID (required when finding users by SIS ids in different accounts)",
            },
          },
          required: ["user_id", "destination_user_id"],
        },
      },
      {
        name: "split_user",
        description: "Split merged users into separate users",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID to split",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "get_graded_submissions",
        description: "Get a users most recently graded submissions",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID",
            },
          },
          required: ["user_id"],
        },
      },
      {
        name: "store_custom_data",
        description: "Store arbitrary user data as JSON",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            scope: {
              type: "string",
              description:
                "The scope of the request, defines the structure of the JSON data to be stored",
            },
            ns: {
              type: "string",
              description:
                "The namespace under which to store the data. This should be something other Canvas API apps aren't likely to use.",
            },
            data: {
              type: "object",
              description:
                "The data you want to store for the user, at the specified scope",
            },
          },
          required: ["user_id", "ns", "data"],
        },
      },
      {
        name: "load_custom_data",
        description: "Load custom user data",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            scope: {
              type: "string",
              description: "The scope of the request to retrieve data from",
            },
            ns: {
              type: "string",
              description: "The namespace from which to retrieve the data",
            },
          },
          required: ["user_id", "ns"],
        },
      },
      {
        name: "delete_custom_data",
        description: "Delete custom user data",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            scope: {
              type: "string",
              description: "The scope of the request to delete data from",
            },
            ns: {
              type: "string",
              description: "The namespace from which to delete the data",
            },
          },
          required: ["user_id", "ns"],
        },
      },
      {
        name: "list_course_nicknames",
        description: "Returns all course nicknames you have set",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_course_nickname",
        description: "Returns the nickname for a specific course",
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
        name: "set_course_nickname",
        description: "Set a nickname for the given course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            nickname: {
              type: "string",
              description:
                "The nickname to set. It must be non-empty and shorter than 60 characters.",
            },
          },
          required: ["course_id", "nickname"],
        },
      },
      {
        name: "remove_course_nickname",
        description: "Remove the nickname for the given course",
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
        name: "clear_course_nicknames",
        description: "Remove all stored course nicknames",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "upload_user_file",
        description: "Upload a file to the user's personal files section",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID (use 'self' for current user)",
            },
            file_data: {
              type: "object",
              description:
                "File data for upload (see Canvas File Upload Documentation for details)",
            },
          },
          required: ["user_id", "file_data"],
        },
      },
      {
        name: "get_pandata_events_token",
        description:
          "Returns a jwt auth and props token that can be used to send events to Pandata (mobile apps only)",
        inputSchema: {
          type: "object",
          properties: {
            app_key: {
              type: "string",
              description: "The pandata events appKey for this mobile app",
            },
          },
          required: ["app_key"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "list_account_users":
        return await this.userService.listAccountUsers({
          account_id: args.account_id,
          search_term: args.search_term,
          enrollment_type: args.enrollment_type,
          sort: args.sort,
          order: args.order,
          include_deleted_users: args.include_deleted_users,
        });

      case "get_user":
        return await this.userService.getUser(args.user_id, args.include);

      case "create_user":
        return await this.userService.createUser({
          account_id: args.account_id,
          user: {
            name: args.user_name,
            short_name: args.user_short_name,
            sortable_name: args.user_sortable_name,
            time_zone: args.user_time_zone,
            locale: args.user_locale,
            terms_of_use: args.user_terms_of_use,
            skip_registration: args.user_skip_registration,
          },
          pseudonym: {
            unique_id: args.pseudonym_unique_id,
            password: args.pseudonym_password,
            sis_user_id: args.pseudonym_sis_user_id,
            integration_id: args.pseudonym_integration_id,
            send_confirmation: args.pseudonym_send_confirmation,
            force_self_registration: args.pseudonym_force_self_registration,
            authentication_provider_id:
              args.pseudonym_authentication_provider_id,
          },
          communication_channel: args.communication_channel_type
            ? {
                type: args.communication_channel_type,
                address: args.communication_channel_address,
                confirmation_url: args.communication_channel_confirmation_url,
                skip_confirmation: args.communication_channel_skip_confirmation,
              }
            : undefined,
          force_validations: args.force_validations,
          enable_sis_reactivation: args.enable_sis_reactivation,
          destination: args.destination,
          initial_enrollment_type: args.initial_enrollment_type,
          pairing_code: args.pairing_code
            ? { code: args.pairing_code }
            : undefined,
        });

      case "update_user":
        return await this.userService.updateUser({
          user_id: args.user_id,
          user: {
            name: args.user_name,
            short_name: args.user_short_name,
            sortable_name: args.user_sortable_name,
            time_zone: args.user_time_zone,
            email: args.user_email,
            locale: args.user_locale,
            avatar: {
              token: args.user_avatar_token,
              url: args.user_avatar_url,
              state: args.user_avatar_state,
            },
            title: args.user_title,
            bio: args.user_bio,
            pronunciation: args.user_pronunciation,
            pronouns: args.user_pronouns,
            event: args.user_event,
          },
          override_sis_stickiness: args.override_sis_stickiness,
        });

      case "get_user_profile":
        return await this.userService.getUserProfile(args.user_id);

      case "list_avatar_options":
        return await this.userService.listAvatarOptions(args.user_id);

      case "list_page_views":
        return await this.userService.listPageViews({
          user_id: args.user_id,
          start_time: args.start_time,
          end_time: args.end_time,
        });

      case "get_activity_stream":
        return await this.userService.getActivityStream({
          only_active_courses: args.only_active_courses,
        });

      case "get_activity_stream_summary":
        return await this.userService.getActivityStreamSummary({
          only_active_courses: args.only_active_courses,
        });

      case "get_todo_items":
        return await this.userService.getTodoItems({
          include: args.include,
        });

      case "get_todo_item_count":
        return await this.userService.getTodoItemCount({
          include: args.include,
        });

      case "get_upcoming_events":
        return await this.userService.getUpcomingEvents();

      case "get_missing_submissions":
        return await this.userService.getMissingSubmissions({
          user_id: args.user_id,
          observed_user_id: args.observed_user_id,
          include: args.include,
          filter: args.filter,
          course_ids: args.course_ids,
        });

      case "hide_stream_item":
        return await this.userService.hideStreamItem(args.stream_item_id);

      case "hide_all_stream_items":
        return await this.userService.hideAllStreamItems();

      case "get_user_settings":
        return await this.userService.getUserSettings(args.user_id);

      case "update_user_settings":
        const settings: any = {};
        if (args.manual_mark_as_read !== undefined)
          settings.manual_mark_as_read = args.manual_mark_as_read;
        if (args.release_notes_badge_disabled !== undefined)
          settings.release_notes_badge_disabled =
            args.release_notes_badge_disabled;
        if (args.collapse_global_nav !== undefined)
          settings.collapse_global_nav = args.collapse_global_nav;
        if (args.collapse_course_nav !== undefined)
          settings.collapse_course_nav = args.collapse_course_nav;
        if (args.hide_dashcard_color_overlays !== undefined)
          settings.hide_dashcard_color_overlays =
            args.hide_dashcard_color_overlays;
        if (args.comment_library_suggestions_enabled !== undefined)
          settings.comment_library_suggestions_enabled =
            args.comment_library_suggestions_enabled;
        if (args.elementary_dashboard_disabled !== undefined)
          settings.elementary_dashboard_disabled =
            args.elementary_dashboard_disabled;
        return await this.userService.updateUserSettings(
          args.user_id,
          settings
        );

      case "get_custom_colors":
        return await this.userService.getCustomColors(args.user_id);

      case "get_custom_color":
        return await this.userService.getCustomColor(
          args.user_id,
          args.asset_string
        );

      case "update_custom_color":
        return await this.userService.updateCustomColor(
          args.user_id,
          args.asset_string,
          args.hexcode
        );

      case "update_text_editor_preference":
        return await this.userService.updateTextEditorPreference(
          args.user_id,
          args.text_editor_preference
        );

      case "update_files_ui_version_preference":
        return await this.userService.updateFilesUIVersionPreference(
          args.user_id,
          args.files_ui_version
        );

      case "get_dashboard_positions":
        return await this.userService.getDashboardPositions(args.user_id);

      case "update_dashboard_positions":
        return await this.userService.updateDashboardPositions(
          args.user_id,
          args.dashboard_positions
        );

      case "terminate_all_sessions":
        return await this.userService.terminateAllSessions(args.user_id);

      case "expire_mobile_sessions":
        return await this.userService.expireMobileSessions(args.user_id);

      case "merge_user":
        return await this.userService.mergeUser(
          args.user_id,
          args.destination_user_id,
          args.destination_account_id
        );

      case "split_user":
        return await this.userService.splitUser(args.user_id);

      case "get_graded_submissions":
        return await this.userService.getGradedSubmissions(args.user_id);

      case "store_custom_data":
        return await this.userService.storeCustomData({
          user_id: args.user_id,
          scope: args.scope,
          ns: args.ns,
          data: args.data,
        });

      case "load_custom_data":
        return await this.userService.loadCustomData({
          user_id: args.user_id,
          scope: args.scope,
          ns: args.ns,
        });

      case "delete_custom_data":
        return await this.userService.deleteCustomData({
          user_id: args.user_id,
          scope: args.scope,
          ns: args.ns,
        });

      case "list_course_nicknames":
        return await this.userService.listCourseNicknames();

      case "get_course_nickname":
        return await this.userService.getCourseNickname(args.course_id);

      case "set_course_nickname":
        return await this.userService.setCourseNickname(
          args.course_id,
          args.nickname
        );

      case "remove_course_nickname":
        return await this.userService.removeCourseNickname(args.course_id);

      case "clear_course_nicknames":
        return await this.userService.clearCourseNicknames();

      case "upload_user_file":
        return await this.userService.uploadFile(args.user_id, args.file_data);

      case "get_pandata_events_token":
        return await this.userService.getPandataEventsToken(args.app_key);

      default:
        throw new Error(`Unknown user tool: ${name}`);
    }
  }
}
