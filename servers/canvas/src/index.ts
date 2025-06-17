#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosInstance } from "axios";

// Import services
import { CourseService } from "./services/course-service.js";
import { EnrollmentService } from "./services/enrollment-service.js";
import { UserService } from "./services/user-service.js";
import { AssignmentService } from "./services/assignment-service.js";
import { SubmissionService } from "./services/submission-service.js";
import { ModuleService } from "./services/module-service.js";
import { ExternalToolService } from "./services/external-tool-service.js";
import { QuizService } from "./services/quiz-service.js";
import { AdminService } from "./services/admin-service.js";
import { GradeChangeLogService } from "./services/grade-change-log-service.js";
import { LoginService } from "./services/login-service.js";
import { AuthenticationProviderService } from "./services/authentication-provider-service.js";
import { LtiLaunchDefinitionService } from "./services/lti-launch-definition-service.js";
import { PageService } from "./services/page-service.js";
import { GradingStandardService } from "./services/grading-standard-service.js";

// Import tools
import { CourseTools } from "./tools/course-tools.js";
import { EnrollmentTools } from "./tools/enrollment-tools.js";
import { UserTools } from "./tools/user-tools.js";
import { AssignmentTools } from "./tools/assignment-tools.js";
import { SubmissionTools } from "./tools/submission-tools.js";
import { ModuleTools } from "./tools/module-tools.js";
import { ExternalToolTools } from "./tools/external-tool-tools.js";
import { QuizTools } from "./tools/quiz-tools.js";
import { AdminTools } from "./tools/admin-tools.js";
import { GradeChangeLogTools } from "./tools/grade-change-log-tools.js";
import { LoginTools } from "./tools/login-tools.js";
import { AuthenticationProviderTools } from "./tools/authentication-provider-tools.js";
import { LtiLaunchDefinitionTools } from "./tools/lti-launch-definition-tools.js";
import { PageTools } from "./tools/page-tools.js";
import { GradingStandardTools } from "./tools/grading-standard-tools.js";

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL;
const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;

if (!CANVAS_BASE_URL || !CANVAS_API_TOKEN) {
  throw new Error(
    "CANVAS_BASE_URL and CANVAS_API_TOKEN environment variables are required"
  );
}

class CanvasServer {
  private server: Server;
  private canvasClient: AxiosInstance;
  private courseService: CourseService;
  private enrollmentService: EnrollmentService;
  private userService: UserService;
  private assignmentService: AssignmentService;
  private submissionService: SubmissionService;
  private moduleService: ModuleService;
  private externalToolService: ExternalToolService;
  private quizService: QuizService;
  private adminService: AdminService;
  private gradeChangeLogService: GradeChangeLogService;
  private loginService: LoginService;
  private authenticationProviderService: AuthenticationProviderService;
  private ltiLaunchDefinitionService: LtiLaunchDefinitionService;
  private pageService: PageService;
  private gradingStandardService: GradingStandardService;
  private courseTools: CourseTools;
  private enrollmentTools: EnrollmentTools;
  private userTools: UserTools;
  private assignmentTools: AssignmentTools;
  private submissionTools: SubmissionTools;
  private moduleTools: ModuleTools;
  private externalToolTools: ExternalToolTools;
  private quizTools: QuizTools;
  private adminTools: AdminTools;
  private gradeChangeLogTools: GradeChangeLogTools;
  private loginTools: LoginTools;
  private authenticationProviderTools: AuthenticationProviderTools;
  private ltiLaunchDefinitionTools: LtiLaunchDefinitionTools;
  private pageTools: PageTools;
  private gradingStandardTools: GradingStandardTools;

  constructor() {
    this.server = new Server(
      {
        name: "canvas-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Create Canvas API client with bearer token auth
    this.canvasClient = axios.create({
      baseURL: `${CANVAS_BASE_URL}/api/v1`,
      headers: {
        Authorization: `Bearer ${CANVAS_API_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Initialize services
    this.courseService = new CourseService(this.canvasClient);
    this.enrollmentService = new EnrollmentService(this.canvasClient);
    this.userService = new UserService(this.canvasClient);
    this.assignmentService = new AssignmentService(this.canvasClient);
    this.submissionService = new SubmissionService(this.canvasClient);
    this.moduleService = new ModuleService(this.canvasClient);
    this.externalToolService = new ExternalToolService(this.canvasClient);
    this.quizService = new QuizService(this.canvasClient);
    this.adminService = new AdminService(this.canvasClient);
    this.gradeChangeLogService = new GradeChangeLogService(this.canvasClient);
    this.loginService = new LoginService(this.canvasClient);
    this.authenticationProviderService = new AuthenticationProviderService(
      this.canvasClient
    );
    this.ltiLaunchDefinitionService = new LtiLaunchDefinitionService(
      this.canvasClient
    );
    this.pageService = new PageService(this.canvasClient);
    this.gradingStandardService = new GradingStandardService(this.canvasClient);

    // Initialize tools
    this.courseTools = new CourseTools(this.courseService);
    this.enrollmentTools = new EnrollmentTools(this.enrollmentService);
    this.userTools = new UserTools(this.userService);
    this.assignmentTools = new AssignmentTools(this.assignmentService);
    this.submissionTools = new SubmissionTools(this.submissionService);
    this.moduleTools = new ModuleTools(this.moduleService);
    this.externalToolTools = new ExternalToolTools(this.externalToolService);
    this.quizTools = new QuizTools(this.quizService);
    this.adminTools = new AdminTools(this.adminService);
    this.gradeChangeLogTools = new GradeChangeLogTools(
      this.gradeChangeLogService
    );
    this.loginTools = new LoginTools(this.loginService);
    this.authenticationProviderTools = new AuthenticationProviderTools(
      this.authenticationProviderService
    );
    this.ltiLaunchDefinitionTools = new LtiLaunchDefinitionTools(
      this.ltiLaunchDefinitionService
    );
    this.pageTools = new PageTools(this.pageService);
    this.gradingStandardTools = new GradingStandardTools(
      this.gradingStandardService
    );

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const courseToolDefinitions = this.courseTools.getToolDefinitions();
      const enrollmentToolDefinitions =
        this.enrollmentTools.getToolDefinitions();
      const userToolDefinitions = this.userTools.getToolDefinitions();
      const assignmentToolDefinitions =
        this.assignmentTools.getToolDefinitions();
      const submissionToolDefinitions =
        this.submissionTools.getToolDefinitions();
      const moduleToolDefinitions = this.moduleTools.getToolDefinitions();
      const externalToolDefinitions =
        this.externalToolTools.getToolDefinitions();
      const quizToolDefinitions = this.quizTools.getToolDefinitions();
      const adminToolDefinitions = this.adminTools.getToolDefinitions();
      const gradeChangeLogToolDefinitions =
        this.gradeChangeLogTools.getToolDefinitions();
      const loginToolDefinitions = this.loginTools.getToolDefinitions();
      const authenticationProviderToolDefinitions =
        this.authenticationProviderTools.getToolDefinitions();
      const ltiLaunchDefinitionToolDefinitions =
        this.ltiLaunchDefinitionTools.getToolDefinitions();
      const pageToolDefinitions = this.pageTools.getToolDefinitions();
      const gradingStandardToolDefinitions =
        this.gradingStandardTools.getToolDefinitions();

      return {
        tools: [
          ...courseToolDefinitions,
          ...enrollmentToolDefinitions,
          ...userToolDefinitions,
          ...assignmentToolDefinitions,
          ...submissionToolDefinitions,
          ...moduleToolDefinitions,
          ...externalToolDefinitions,
          ...quizToolDefinitions,
          ...adminToolDefinitions,
          ...gradeChangeLogToolDefinitions,
          ...loginToolDefinitions,
          ...authenticationProviderToolDefinitions,
          ...ltiLaunchDefinitionToolDefinitions,
          ...pageToolDefinitions,
          ...gradingStandardToolDefinitions,
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        let result;

        // Determine which tool category this belongs to
        const courseToolNames = this.courseTools
          .getToolDefinitions()
          .map((t) => t.name);
        const enrollmentToolNames = this.enrollmentTools
          .getToolDefinitions()
          .map((t) => t.name);
        const userToolNames = this.userTools
          .getToolDefinitions()
          .map((t) => t.name);
        const assignmentToolNames = this.assignmentTools
          .getToolDefinitions()
          .map((t) => t.name);
        const submissionToolNames = this.submissionTools
          .getToolDefinitions()
          .map((t) => t.name);
        const moduleToolNames = this.moduleTools
          .getToolDefinitions()
          .map((t) => t.name);
        const externalToolNames = this.externalToolTools
          .getToolDefinitions()
          .map((t) => t.name);
        const quizToolNames = this.quizTools
          .getToolDefinitions()
          .map((t) => t.name);
        const adminToolNames = this.adminTools
          .getToolDefinitions()
          .map((t) => t.name);
        const gradeChangeLogToolNames = this.gradeChangeLogTools
          .getToolDefinitions()
          .map((t) => t.name);
        const loginToolNames = this.loginTools
          .getToolDefinitions()
          .map((t) => t.name);
        const authenticationProviderToolNames = this.authenticationProviderTools
          .getToolDefinitions()
          .map((t) => t.name);
        const ltiLaunchDefinitionToolNames = this.ltiLaunchDefinitionTools
          .getToolDefinitions()
          .map((t) => t.name);
        const pageToolNames = this.pageTools
          .getToolDefinitions()
          .map((t) => t.name);
        const gradingStandardToolNames = this.gradingStandardTools
          .getToolDefinitions()
          .map((t) => t.name);

        if (courseToolNames.includes(name)) {
          result = await this.courseTools.handleToolCall(name, args);
        } else if (enrollmentToolNames.includes(name)) {
          result = await this.enrollmentTools.handleToolCall(name, args);
        } else if (userToolNames.includes(name)) {
          result = await this.userTools.handleToolCall(name, args);
        } else if (assignmentToolNames.includes(name)) {
          result = await this.assignmentTools.handleToolCall(name, args);
        } else if (submissionToolNames.includes(name)) {
          result = await this.submissionTools.handleToolCall(name, args);
        } else if (moduleToolNames.includes(name)) {
          result = await this.moduleTools.handleToolCall(name, args);
        } else if (externalToolNames.includes(name)) {
          result = await this.externalToolTools.handleToolCall(name, args);
        } else if (quizToolNames.includes(name)) {
          result = await this.quizTools.handleToolCall(name, args);
        } else if (adminToolNames.includes(name)) {
          result = await this.adminTools.handleToolCall(name, args);
        } else if (gradeChangeLogToolNames.includes(name)) {
          result = await this.gradeChangeLogTools.handleToolCall(name, args);
        } else if (loginToolNames.includes(name)) {
          result = await this.loginTools.handleToolCall(name, args);
        } else if (authenticationProviderToolNames.includes(name)) {
          result = await this.authenticationProviderTools.handleToolCall(
            name,
            args
          );
        } else if (ltiLaunchDefinitionToolNames.includes(name)) {
          result = await this.ltiLaunchDefinitionTools.handleToolCall(
            name,
            args
          );
        } else if (pageToolNames.includes(name)) {
          result = await this.pageTools.handleToolCall(name, args);
        } else if (gradingStandardToolNames.includes(name)) {
          result = await this.gradingStandardTools.handleToolCall(name, args);
        } else {
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            content: [
              {
                type: "text",
                text: `Canvas API error: ${
                  error.response?.data?.errors?.[0]?.message ||
                  error.response?.data?.message ||
                  error.message
                }`,
              },
            ],
            isError: true,
          };
        }

        if (error instanceof McpError) {
          throw error;
        }

        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Canvas MCP server running on stdio");
  }
}

const server = new CanvasServer();
server.run().catch(console.error);
