import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ripplingTools: Tool[] = [
  // Connection test
  {
    name: "rippling_test_connection",
    description:
      "Test the connection to Rippling API and retrieve basic information",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // Employment Roles
  {
    name: "rippling_get_employment_roles",
    description:
      "Get detailed employment roles and profile information for a specific user by user ID. Includes basic employment data plus detailed additional information and personal information field values.",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "The user ID to get employment roles for",
        },
      },
      required: ["userId"],
    },
  },

  // Employees
  {
    name: "rippling_list_employees",
    description:
      "List employees with optional search and pagination. Returns simplified employee data with id, fullName, email, title, and department",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
        },
        searchQuery: {
          type: "string",
          description: "Optional search query to filter employees by name",
        },
      },
      required: [],
    },
  },

  // Leave Policies
  {
    name: "rippling_get_eligible_leave_policies",
    description:
      "Get eligible leave policies for the current user. Returns available leave policies with their IDs, names, descriptions, and scheduling constraints. Use the 'id' field from this response when making time off requests with rippling_request_time_off.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // Terminated Employees
  {
    name: "rippling_list_terminated_employees",
    description:
      "List terminated employees with optional search and pagination. Returns terminated employee data including termination details",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
        },
        searchQuery: {
          type: "string",
          description:
            "Optional search query to filter terminated employees by name",
        },
      },
      required: [],
    },
  },

  // Signed Documents
  {
    name: "rippling_get_signed_documents",
    description:
      "Get signed documents from Rippling hub API. Returns document metadata including IDs, names, signatures, PDF URLs, and other document properties for the current user's role",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // Anniversary Information
  {
    name: "rippling_get_anniversary_information",
    description:
      "Get anniversary email settings and information from Rippling anniversary app",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // Action Request Filters
  {
    name: "rippling_get_action_request_filters",
    description:
      "Get filtered action requests that require YOUR APPROVAL or REVIEW (not your own submissions). This shows requests from others waiting for you to approve/review, such as leave requests from your team members, expense approvals, or other workflow items. Use 'pendingReviewerRoles' to see what's waiting for your approval. For your OWN time off requests, use rippling_time_off_requests instead.",
    inputSchema: {
      type: "object",
      properties: {
        pageSize: {
          type: "number",
          description: "Number of results per page (default: 30)",
          default: 30,
        },
        actionTypes: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by action types (e.g., LEAVE_REQUEST_APPROVAL)",
        },
        pendingReviewerRoles: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "Role IDs for actions awaiting review. Use this to see actions waiting for approval/review by specific users.",
        },
        requestedByRoles: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "Role IDs for actions that were submitted/requested. Use this with your user ID to see YOUR OWN submitted requests (e.g., leave requests you submitted).",
        },
        sortColumn: {
          type: "string",
          description: "Column to sort by (default: dateRequested)",
          default: "dateRequested",
        },
        sortOrder: {
          type: "string",
          enum: ["ASC", "DESC"],
          description: "Sort order (default: DESC)",
          default: "DESC",
        },
        includeRoleDetails: {
          type: "boolean",
          description: "Include role details in the response (default: true)",
          default: true,
        },
      },
      required: [],
    },
  },

  // Open Interviews and Feedbacks
  {
    name: "rippling_get_open_interviews_and_feedbacks",
    description:
      "Get open interviews and feedbacks for an employee from ATS. Returns today's interviews, pending interviews/feedbacks, and upcoming interviews.",
    inputSchema: {
      type: "object",
      properties: {
        searchQuery: {
          type: "string",
          description: "Optional search query to filter results",
          default: "",
        },
        timezone: {
          type: "string",
          description: "Timezone for the request (default: America/Phoenix)",
          default: "America/Phoenix",
        },
      },
      required: [],
    },
  },

  // Update Feedback Form Response
  {
    name: "rippling_update_feedback_form_response",
    description:
      'Update (submit) feedback form response for an interview. Used to submit interview feedback with ratings and comments. IMPORTANT: You must provide all required metadata fields (owner, milestone, applicant, interview, role) from the original feedback response. The \'overallRating\' should be at the TOP LEVEL of feedbackFormResponse object.\n\nMANDATORY ANSWER STRUCTURE - You MUST include these 3 specific answers in formResponse.answers:\n\n1. OVERALL RECOMMENDATION (always include):\n   {\n     "questionKey": "overall_recommendation",\n     "value": "[recommendation text like \'Recommend for SD2 role\']"\n   }\n\n2. NUMERIC RATING (always include - this is the overall rating as a number):\n   {\n     "questionKey": "ec66ae4f-7ae7-466d-9d47-9331cd745cab",\n     "value": [number 1-4, should match overallRating]\n   }\n\n3. RICH TEXT FEEDBACK (always include with sectionKey):\n   {\n     "questionKey": "c8c2b292-b8c2-4832-a181-4c9d934164b5",\n     "value": "[detailed HTML formatted feedback]",\n     "sectionKey": "2dde7f2c-0a7b-45a1-94e8-2e3870d9da21"\n   }\n\nExample payload structure:\n{\n  "feedbackFormResponse": {\n    "id": "689b468fb2cefb15adc4b39d",\n    "role": "67ad9f21f96760f55f766b31",\n    "submittedBy": "67ad9f21f96760f55f766b31",\n    "interview": "689446440e6617deecefc228",\n    "overallRating": 3,\n    "status": "SUBMITTED",\n    "owner": "67d1c3295040dbd5dda97cde",\n    "milestone": "689446440e6617deecefc235",\n    "applicant": "688836e564f21d9591cc9851",\n    "formResponse": {\n      "answers": [\n        {\n          "questionKey": "overall_recommendation",\n          "value": "Recommend for SD2 role"\n        },\n        {\n          "questionKey": "ec66ae4f-7ae7-466d-9d47-9331cd745cab",\n          "value": 3\n        },\n        {\n          "questionKey": "c8c2b292-b8c2-4832-a181-4c9d934164b5",\n          "value": "<meta name=\\"rteConfig\\" content=\\"{&quot;version&quot;:&quot;0.246.0&quot;}\\"><p>Detailed feedback text here...</p>",\n          "sectionKey": "2dde7f2c-0a7b-45a1-94e8-2e3870d9da21"\n        }\n      ],\n      "comments": [\n        {\n          "questionKey": "interview_notes",\n          "createdAt": "2025-08-13T13:56:13.290000-07:00",\n          "anonymous": false,\n          "text": "Comment text or null",\n          "author": "Author name or null"\n        }\n      ]\n    }\n  }\n}',
    inputSchema: {
      type: "object",
      properties: {
        feedbackFormResponse: {
          type: "object",
          description: "Complete feedback form response object to update",
          properties: {
            id: {
              type: "string",
              description: "ID of the feedback form response to update",
            },
            role: {
              type: "string",
              description: "Role ID of the person providing feedback",
            },
            submittedBy: {
              type: "string",
              description: "User ID of the person submitting the feedback",
            },
            interview: {
              type: "string",
              description: "Interview ID this feedback is for",
            },
            applicant: {
              type: "string",
              description: "Applicant ID this feedback is for",
            },
            overallRating: {
              type: "number",
              description:
                "Overall rating (1-4 scale) - THIS GOES AT TOP LEVEL, not inside formResponse.answers",
              minimum: 1,
              maximum: 4,
            },
            status: {
              type: "string",
              description: "Status of the feedback (e.g., SUBMITTED)",
            },
            formResponse: {
              type: "object",
              description: "Form response containing answers and comments",
              properties: {
                answers: {
                  type: "array",
                  description: "Array of question answers",
                  items: {
                    type: "object",
                    properties: {
                      questionKey: {
                        type: "string",
                        description: "Unique key for the question",
                      },
                      value: {
                        description:
                          "Answer value (number for ratings, string for text)",
                      },
                      sectionKey: {
                        type: "string",
                        description: "Optional section key for the question",
                      },
                    },
                    required: ["questionKey", "value"],
                  },
                },
                comments: {
                  type: "array",
                  description:
                    "Additional comments - each comment must have questionKey, createdAt, anonymous, text, and author fields",
                  items: {
                    type: "object",
                    properties: {
                      questionKey: {
                        type: "string",
                        description: "Question key for the comment (required)",
                      },
                      createdAt: {
                        type: "string",
                        description: "Comment creation timestamp",
                      },
                      anonymous: {
                        type: "boolean",
                        description: "Whether the comment is anonymous",
                      },
                      text: {
                        type: ["string", "null"],
                        description: "Comment text (can be null)",
                      },
                      author: {
                        type: ["string", "null"],
                        description: "Comment author (can be null)",
                      },
                    },
                    required: [
                      "questionKey",
                      "createdAt",
                      "anonymous",
                      "text",
                      "author",
                    ],
                  },
                },
              },
              required: ["answers", "comments"],
            },
            owner: {
              type: "string",
              description: "Owner ID (usually from original feedback response)",
            },
            milestone: {
              type: "string",
              description:
                "Milestone ID (usually from original feedback response)",
            },
          },
          required: [
            "id",
            "role",
            "owner",
            "applicant",
            "interview",
            "overallRating",
            "formResponse",
          ],
        },
      },
      required: ["feedbackFormResponse"],
    },
  },

  // Get Alerts
  {
    name: "rippling_get_alerts",
    description:
      "Get alerts from Rippling automation system. Returns paginated list of alerts with filtering options for read status.",
    inputSchema: {
      type: "object",
      properties: {
        readStatus: {
          type: "string",
          enum: ["READ_STATUS_ALL", "READ_STATUS_READ", "READ_STATUS_UNREAD"],
          description:
            "Filter alerts by read status (default: READ_STATUS_ALL)",
          default: "READ_STATUS_ALL",
        },
        pageSize: {
          type: "number",
          description: "Number of alerts per page (default: 30)",
          default: 30,
          minimum: 1,
          maximum: 100,
        },
        pageToken: {
          type: "string",
          description: "Page token for pagination (empty for first page)",
          default: "",
        },
      },
      required: [],
    },
  },

  // Time Off Requests
  {
    name: "rippling_time_off_requests",
    description:
      "Get YOUR OWN time off requests (leave requests) that you have submitted. This shows only the leave requests you personally submitted, with their status, dates, duration, and leave type information. For requests that need your approval from others, use rippling_get_action_request_filters instead.",
    inputSchema: {
      type: "object",
      properties: {
        pageSize: {
          type: "number",
          description: "Number of results per page (default: 30)",
          default: 30,
          minimum: 1,
          maximum: 100,
        },
      },
      required: [],
    },
  },

  // Holiday Calendar
  {
    name: "rippling_get_holiday_calendar",
    description:
      "Get holiday calendar information from Rippling. Returns holidays and calendar events for the specified role, with options to filter by time admin permissions and payable holidays only.",
    inputSchema: {
      type: "object",
      properties: {
        roleId: {
          type: "string",
          description:
            "Role ID to get holiday calendar for. If not provided, defaults to your own role ID.",
        },
        allowTimeAdmin: {
          type: "boolean",
          description: "Whether to allow time admin access (default: false)",
          default: false,
        },
        onlyPayable: {
          type: "boolean",
          description:
            "Whether to return only payable holidays (default: false)",
          default: false,
        },
      },
      required: [],
    },
  },

  // Request Time Off
  {
    name: "rippling_request_time_off",
    description:
      "Submit a new time off request (leave request) to Rippling. Creates a leave request with specified dates, leave policy, and reason. The request will go through the normal approval workflow using your role ID automatically.",
    inputSchema: {
      type: "object",
      properties: {
        leavePolicy: {
          type: "string",
          description:
            "Leave policy ID for the type of leave being requested. IMPORTANT: Use the exact 'id' field returned from rippling_get_eligible_leave_policies, not the customName or any other field. This should be the actual policy ID from the get_eligible_policies endpoint (e.g., '679a38907ef7dda5d37625a0').",
        },
        startDate: {
          type: "string",
          description:
            "Start date of the leave in YYYY-MM-DD format (e.g., '2025-08-26')",
        },
        endDate: {
          type: "string",
          description:
            "End date of the leave in YYYY-MM-DD format (e.g., '2025-08-26'). Can be the same as startDate for single-day leave.",
        },
        reasonForLeave: {
          type: "string",
          description: "Reason or description for the leave request",
        },
        isOpenEnded: {
          type: "boolean",
          description:
            "Whether this is an open-ended leave request. This field is required (true or false).",
        },
      },
      required: [
        "leavePolicy",
        "startDate",
        "endDate",
        "reasonForLeave",
        "isOpenEnded",
      ],
    },
  },

  // Cancel Time Off
  {
    name: "rippling_cancel_time_off",
    description:
      "Cancel a pending time off request in Rippling. This can be used to cancel time off requests that are still pending approval or in progress.",
    inputSchema: {
      type: "object",
      properties: {
        actionRequestId: {
          type: "string",
          description:
            "The ID of the action request to cancel. This can be obtained from the 'actionRequestId' field in the response of rippling_request_time_off or from rippling_time_off_requests.",
        },
        channel: {
          type: "string",
          description:
            "The channel from which the cancellation is being performed (default: 'DASHBOARD')",
          default: "DASHBOARD",
        },
      },
      required: ["actionRequestId"],
    },
  },
];
