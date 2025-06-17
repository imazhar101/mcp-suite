import { PageService } from "../services/page-service.js";

export class PageTools {
  constructor(private pageService: PageService) {}

  getToolDefinitions() {
    return [
      {
        name: "list_course_pages",
        description: "List pages in a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            sort: {
              type: "string",
              description: "Sort results by this field",
              enum: ["title", "created_at", "updated_at"],
            },
            order: {
              type: "string",
              description: "The sorting order. Defaults to 'asc'",
              enum: ["asc", "desc"],
            },
            search_term: {
              type: "string",
              description: "The partial title of the pages to match and return",
            },
            published: {
              type: "boolean",
              description:
                "If true, include only published pages. If false, exclude published pages",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["body"],
              },
              description: "Include page body with each Page",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "get_course_page",
        description: "Get details of a specific page in a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
          },
          required: ["course_id", "url_or_id"],
        },
      },
      {
        name: "create_course_page",
        description: "Create a new page in a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            title: {
              type: "string",
              description: "The title for the new page",
            },
            body: {
              type: "string",
              description: "The content for the new page",
            },
            editing_roles: {
              type: "string",
              description: "Which user roles are allowed to edit this page",
              enum: ["teachers", "students", "members", "public"],
            },
            notify_of_update: {
              type: "boolean",
              description:
                "Whether participants should be notified when this page changes",
            },
            published: {
              type: "boolean",
              description:
                "Whether the page is published (true) or draft state (false)",
            },
            front_page: {
              type: "boolean",
              description: "Set an unhidden page as the front page (if true)",
            },
            publish_at: {
              type: "string",
              description:
                "Schedule a future date/time to publish the page (ISO8601 format)",
            },
          },
          required: ["course_id", "title"],
        },
      },
      {
        name: "update_course_page",
        description: "Update an existing page in a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
            title: {
              type: "string",
              description: "The title for the page",
            },
            body: {
              type: "string",
              description: "The content for the page",
            },
            editing_roles: {
              type: "string",
              description: "Which user roles are allowed to edit this page",
              enum: ["teachers", "students", "members", "public"],
            },
            notify_of_update: {
              type: "boolean",
              description:
                "Whether participants should be notified when this page changes",
            },
            published: {
              type: "boolean",
              description:
                "Whether the page is published (true) or draft state (false)",
            },
            front_page: {
              type: "boolean",
              description: "Set an unhidden page as the front page (if true)",
            },
            publish_at: {
              type: "string",
              description:
                "Schedule a future date/time to publish the page (ISO8601 format)",
            },
          },
          required: ["course_id", "url_or_id"],
        },
      },
      {
        name: "delete_course_page",
        description: "Delete a page from a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
          },
          required: ["course_id", "url_or_id"],
        },
      },
      {
        name: "duplicate_course_page",
        description: "Duplicate a page in a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID to duplicate",
            },
          },
          required: ["course_id", "url_or_id"],
        },
      },
      {
        name: "get_course_front_page",
        description: "Get the front page of a course",
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
        name: "update_course_front_page",
        description: "Update the front page of a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            title: {
              type: "string",
              description: "The title for the front page",
            },
            body: {
              type: "string",
              description: "The content for the front page",
            },
            editing_roles: {
              type: "string",
              description: "Which user roles are allowed to edit this page",
              enum: ["teachers", "students", "members", "public"],
            },
            notify_of_update: {
              type: "boolean",
              description:
                "Whether participants should be notified when this page changes",
            },
            published: {
              type: "boolean",
              description:
                "Whether the page is published (true) or draft state (false)",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "list_course_page_revisions",
        description: "List revisions of a course page",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
          },
          required: ["course_id", "url_or_id"],
        },
      },
      {
        name: "get_course_page_revision",
        description: "Get a specific revision of a course page",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
            revision_id: {
              type: "string",
              description: "Revision ID (use 'latest' for the latest revision)",
            },
            summary: {
              type: "boolean",
              description: "If set, exclude page content from results",
            },
          },
          required: ["course_id", "url_or_id", "revision_id"],
        },
      },
      {
        name: "revert_course_page_to_revision",
        description: "Revert a course page to a prior revision",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
            revision_id: {
              type: "number",
              description: "The revision to revert to",
            },
          },
          required: ["course_id", "url_or_id", "revision_id"],
        },
      },
      {
        name: "list_group_pages",
        description: "List pages in a group",
        inputSchema: {
          type: "object",
          properties: {
            group_id: {
              type: "string",
              description: "Group ID",
            },
            sort: {
              type: "string",
              description: "Sort results by this field",
              enum: ["title", "created_at", "updated_at"],
            },
            order: {
              type: "string",
              description: "The sorting order. Defaults to 'asc'",
              enum: ["asc", "desc"],
            },
            search_term: {
              type: "string",
              description: "The partial title of the pages to match and return",
            },
            published: {
              type: "boolean",
              description:
                "If true, include only published pages. If false, exclude published pages",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["body"],
              },
              description: "Include page body with each Page",
            },
          },
          required: ["group_id"],
        },
      },
      {
        name: "get_group_page",
        description: "Get details of a specific page in a group",
        inputSchema: {
          type: "object",
          properties: {
            group_id: {
              type: "string",
              description: "Group ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
          },
          required: ["group_id", "url_or_id"],
        },
      },
      {
        name: "create_group_page",
        description: "Create a new page in a group",
        inputSchema: {
          type: "object",
          properties: {
            group_id: {
              type: "string",
              description: "Group ID",
            },
            title: {
              type: "string",
              description: "The title for the new page",
            },
            body: {
              type: "string",
              description: "The content for the new page",
            },
            editing_roles: {
              type: "string",
              description: "Which user roles are allowed to edit this page",
              enum: ["teachers", "students", "members", "public"],
            },
            notify_of_update: {
              type: "boolean",
              description:
                "Whether participants should be notified when this page changes",
            },
            published: {
              type: "boolean",
              description:
                "Whether the page is published (true) or draft state (false)",
            },
            front_page: {
              type: "boolean",
              description: "Set an unhidden page as the front page (if true)",
            },
            publish_at: {
              type: "string",
              description:
                "Schedule a future date/time to publish the page (ISO8601 format)",
            },
          },
          required: ["group_id", "title"],
        },
      },
      {
        name: "update_group_page",
        description: "Update an existing page in a group",
        inputSchema: {
          type: "object",
          properties: {
            group_id: {
              type: "string",
              description: "Group ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
            title: {
              type: "string",
              description: "The title for the page",
            },
            body: {
              type: "string",
              description: "The content for the page",
            },
            editing_roles: {
              type: "string",
              description: "Which user roles are allowed to edit this page",
              enum: ["teachers", "students", "members", "public"],
            },
            notify_of_update: {
              type: "boolean",
              description:
                "Whether participants should be notified when this page changes",
            },
            published: {
              type: "boolean",
              description:
                "Whether the page is published (true) or draft state (false)",
            },
            front_page: {
              type: "boolean",
              description: "Set an unhidden page as the front page (if true)",
            },
            publish_at: {
              type: "string",
              description:
                "Schedule a future date/time to publish the page (ISO8601 format)",
            },
          },
          required: ["group_id", "url_or_id"],
        },
      },
      {
        name: "delete_group_page",
        description: "Delete a page from a group",
        inputSchema: {
          type: "object",
          properties: {
            group_id: {
              type: "string",
              description: "Group ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
          },
          required: ["group_id", "url_or_id"],
        },
      },
      {
        name: "get_group_front_page",
        description: "Get the front page of a group",
        inputSchema: {
          type: "object",
          properties: {
            group_id: {
              type: "string",
              description: "Group ID",
            },
          },
          required: ["group_id"],
        },
      },
      {
        name: "update_group_front_page",
        description: "Update the front page of a group",
        inputSchema: {
          type: "object",
          properties: {
            group_id: {
              type: "string",
              description: "Group ID",
            },
            title: {
              type: "string",
              description: "The title for the front page",
            },
            body: {
              type: "string",
              description: "The content for the front page",
            },
            editing_roles: {
              type: "string",
              description: "Which user roles are allowed to edit this page",
              enum: ["teachers", "students", "members", "public"],
            },
            notify_of_update: {
              type: "boolean",
              description:
                "Whether participants should be notified when this page changes",
            },
            published: {
              type: "boolean",
              description:
                "Whether the page is published (true) or draft state (false)",
            },
          },
          required: ["group_id"],
        },
      },
      {
        name: "list_group_page_revisions",
        description: "List revisions of a group page",
        inputSchema: {
          type: "object",
          properties: {
            group_id: {
              type: "string",
              description: "Group ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
          },
          required: ["group_id", "url_or_id"],
        },
      },
      {
        name: "get_group_page_revision",
        description: "Get a specific revision of a group page",
        inputSchema: {
          type: "object",
          properties: {
            group_id: {
              type: "string",
              description: "Group ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
            revision_id: {
              type: "string",
              description: "Revision ID (use 'latest' for the latest revision)",
            },
            summary: {
              type: "boolean",
              description: "If set, exclude page content from results",
            },
          },
          required: ["group_id", "url_or_id", "revision_id"],
        },
      },
      {
        name: "revert_group_page_to_revision",
        description: "Revert a group page to a prior revision",
        inputSchema: {
          type: "object",
          properties: {
            group_id: {
              type: "string",
              description: "Group ID",
            },
            url_or_id: {
              type: "string",
              description: "Page URL or ID",
            },
            revision_id: {
              type: "number",
              description: "The revision to revert to",
            },
          },
          required: ["group_id", "url_or_id", "revision_id"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      // Course page tools
      case "list_course_pages":
        return await this.pageService.listCoursePages(args.course_id, {
          sort: args.sort,
          order: args.order,
          search_term: args.search_term,
          published: args.published,
          include: args.include,
        });

      case "get_course_page":
        return await this.pageService.getCoursePage(
          args.course_id,
          args.url_or_id
        );

      case "create_course_page":
        const { course_id: createCourseId, ...createCourseParams } = args;
        return await this.pageService.createCoursePage(
          createCourseId,
          createCourseParams
        );

      case "update_course_page":
        const {
          course_id: updateCourseId,
          url_or_id: updateCourseUrlOrId,
          ...updateCourseParams
        } = args;
        return await this.pageService.updateCoursePage(
          updateCourseId,
          updateCourseUrlOrId,
          updateCourseParams
        );

      case "delete_course_page":
        return await this.pageService.deleteCoursePage(
          args.course_id,
          args.url_or_id
        );

      case "duplicate_course_page":
        return await this.pageService.duplicateCoursePage(
          args.course_id,
          args.url_or_id
        );

      case "get_course_front_page":
        return await this.pageService.getCourseFrontPage(args.course_id);

      case "update_course_front_page":
        const { course_id: frontPageCourseId, ...frontPageParams } = args;
        return await this.pageService.updateCourseFrontPage(
          frontPageCourseId,
          frontPageParams
        );

      case "list_course_page_revisions":
        return await this.pageService.getCoursePageRevisions(
          args.course_id,
          args.url_or_id
        );

      case "get_course_page_revision":
        return await this.pageService.getCoursePageRevision(
          args.course_id,
          args.url_or_id,
          args.revision_id,
          { summary: args.summary }
        );

      case "revert_course_page_to_revision":
        return await this.pageService.revertCoursePageToRevision(
          args.course_id,
          args.url_or_id,
          { revision_id: args.revision_id }
        );

      // Group page tools
      case "list_group_pages":
        return await this.pageService.listGroupPages(args.group_id, {
          sort: args.sort,
          order: args.order,
          search_term: args.search_term,
          published: args.published,
          include: args.include,
        });

      case "get_group_page":
        return await this.pageService.getGroupPage(
          args.group_id,
          args.url_or_id
        );

      case "create_group_page":
        const { group_id: createGroupId, ...createGroupParams } = args;
        return await this.pageService.createGroupPage(
          createGroupId,
          createGroupParams
        );

      case "update_group_page":
        const {
          group_id: updateGroupId,
          url_or_id: updateGroupUrlOrId,
          ...updateGroupParams
        } = args;
        return await this.pageService.updateGroupPage(
          updateGroupId,
          updateGroupUrlOrId,
          updateGroupParams
        );

      case "delete_group_page":
        return await this.pageService.deleteGroupPage(
          args.group_id,
          args.url_or_id
        );

      case "get_group_front_page":
        return await this.pageService.getGroupFrontPage(args.group_id);

      case "update_group_front_page":
        const { group_id: frontPageGroupId, ...groupFrontPageParams } = args;
        return await this.pageService.updateGroupFrontPage(
          frontPageGroupId,
          groupFrontPageParams
        );

      case "list_group_page_revisions":
        return await this.pageService.getGroupPageRevisions(
          args.group_id,
          args.url_or_id
        );

      case "get_group_page_revision":
        return await this.pageService.getGroupPageRevision(
          args.group_id,
          args.url_or_id,
          args.revision_id,
          { summary: args.summary }
        );

      case "revert_group_page_to_revision":
        return await this.pageService.revertGroupPageToRevision(
          args.group_id,
          args.url_or_id,
          { revision_id: args.revision_id }
        );

      default:
        throw new Error(`Unknown page tool: ${name}`);
    }
  }
}
